import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSES } from 'src/app/data/courses';
import { Course } from 'src/app/models/course.model';
import { RazorPaymentServiceService } from 'src/app/razor-payment-service.service';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent {

  course!: Course;

  paymentProcessing = false;
  paymentVerified = false;

  student = {
    fullName: '',
    email: '',
    mobile: '',
    experience: '',
    currentStatus: '',
    howFoundUs: '',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: RazorPaymentServiceService
  ) {}

  ngOnInit(): void {

    console.log('Enroll page loaded');

    var slug = this.route.snapshot.paramMap.get('slug');

    this.course = COURSES.find(
      c => c.slug === slug
    )!;

    console.log('Course:', this.course);

    if (!this.course) {

      alert('Course not found');

      this.router.navigate(['/courses']);

      return;
    }

    console.log(
      'Course fee in paise:',
      this.course.fee
    );
  }


  /* ================================
     COURSE FEE CALCULATIONS
  ================================= */

  getCourseFee(): number {

    return this.course && this.course.fee
      ? this.course.fee / 100
      : 0;
  }


  getGst(): number {

    return this.getCourseFee() * 0.18;
  }


  getTotalAmount(): number {

    return this.getCourseFee() + this.getGst();
  }


  /* ================================
     PROCEED TO PAYMENT
  ================================= */

  proceedToPayment(): void {

    if (!this.course) {

      alert('Course details not found');

      return;
    }


    if (
      !this.student.fullName ||
      !this.student.email ||
      !this.student.mobile
    ) {

      alert(
        'Please fill all required student details'
      );

      return;
    }


    if (this.paymentProcessing) {

      return;
    }


    /*
     * course.fee is already in PAISE.
     *
     * Example:
     * ₹1000 = 100000 paise
     */

    var fee = this.course.fee *100;

    var gst = fee * 0.18;

    var totalAmount =
      Math.round(fee + gst);


    console.log(
      'Course fee in paise:',
      fee
    );

    console.log(
      'GST in paise:',
      gst
    );

    console.log(
      'Total amount in paise:',
      totalAmount
    );


    // Show spinner
    this.paymentProcessing = true;


    this.paymentService
      .createOrder(totalAmount)
      .subscribe(

        (order: any) => {

          console.log(
            'Order created successfully:',
            order
          );


          if (!order) {

            this.paymentProcessing = false;

            alert(
              'Invalid order response from server'
            );

            return;
          }


          if (!order.id) {

            this.paymentProcessing = false;

            console.error(
              'Order ID missing:',
              order
            );

            alert(
              'Razorpay order ID is missing'
            );

            return;
          }


          if (!order.amount) {

            this.paymentProcessing = false;

            console.error(
              'Order amount missing:',
              order
            );

            alert(
              'Razorpay order amount is missing'
            );

            return;
          }


          /*
           * Razorpay window will now open.
           *
           * The spinner is hidden before opening
           * Razorpay because Razorpay has its own
           * payment UI.
           */

          this.paymentProcessing = false;

          this.openRazorpay(order);

        },


        (error) => {

          this.paymentProcessing = false;

          console.error(
            'Create order error:',
            error
          );

          alert(
            'Unable to create payment order. Please try again.'
          );

        }
      );
  }


  /* ================================
     OPEN RAZORPAY
  ================================= */

  openRazorpay(order: any): void {

    console.log(
      'Opening Razorpay...'
    );

    console.log(
      'Order:',
      order
    );


    var Razorpay =
      (window as any).Razorpay;


    if (!Razorpay) {

      alert(
        'Razorpay SDK is not loaded. Please check index.html.'
      );

      console.error(
        'Razorpay SDK not found'
      );

      return;
    }


    var options = {

      key: order.key,

      amount: order.amount,

      currency:
        order.currency || 'INR',

      name:
        'JavaBridge Consultancy',

      description:
        this.course.title +
        ' Course Payment',

      order_id:
        order.id,


      prefill: {

        name:
          this.student.fullName,

        email:
          this.student.email,

        contact:
          this.student.mobile

      },


      notes: {

        course:
          this.course
            ? this.course.title
            : '',

        studentName:
          this.student.fullName,

        studentEmail:
          this.student.email,

        studentMobile:
          this.student.mobile

      },


      theme: {

        color: '#2563eb'

      },


      /* ================================
         PAYMENT SUCCESS
      ================================= */

      handler: (response: any) => {

        console.log(
          'Razorpay payment completed'
        );


        console.log(
          'Payment ID:',
          response.razorpay_payment_id
        );


        console.log(
          'Order ID:',
          response.razorpay_order_id
        );


        console.log(
          'Signature:',
          response.razorpay_signature
        );


        /*
         * IMPORTANT:
         *
         * razorpay_order_id  -> Order ID
         * razorpay_payment_id -> Payment ID
         */

        var paymentData = {

          razorpayOrderId:
            response.razorpay_order_id,

          razorpayPaymentId:
            response.razorpay_payment_id,

          razorpaySignature:
            response.razorpay_signature

        };


        /*
         * Show spinner while backend
         * verifies the payment.
         */

        this.paymentProcessing = true;


        this.verifyPayment(
          paymentData
        );

      },


      /* ================================
         PAYMENT WINDOW CLOSED
      ================================= */

      modal: {

        ondismiss: () => {

          console.log(
            'Razorpay payment window closed'
          );

          this.paymentProcessing = false;

        }

      }

    };


    try {

      var razorpay =
        new Razorpay(options);


      razorpay.open();

    }

    catch (error) {

      console.error(
        'Razorpay open error:',
        error
      );


      this.paymentProcessing = false;


      alert(
        'Unable to open Razorpay payment window'
      );

    }

  }


  /* ================================
     VERIFY PAYMENT
  ================================= */

  verifyPayment(response: any): void {

    console.log(
      'Verifying payment with backend...'
    );


    /*
     * Show full-screen spinner while
     * backend verifies Razorpay signature.
     */

    this.paymentProcessing = true;


    this.paymentService
      .verifyPayment(response)
      .subscribe(

        (result: any) => {

          console.log(
            'Payment verification response:',
            result
          );


          this.paymentVerified = true;


          /*
           * Keep spinner visible while
           * navigating to Courses page.
           */

          this.router.navigate([
            '/courses'
          ]);

        },


        (error) => {

          this.paymentProcessing = false;

          this.paymentVerified = false;


          console.error(
            'Payment verification failed:',
            error
          );


          alert(
            'Payment verification failed. Please contact support.'
          );

        }

      );

  }

}