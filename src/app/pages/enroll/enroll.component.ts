import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSES } from 'src/app/data/courses';
import { Course } from 'src/app/models/course.model';
import { RazorPaymentServiceService } from 'src/app/razor-payment-service.service';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent implements OnInit {

  course!: Course;

  paymentProcessing = false;
  paymentVerified = false;

  paymentDetails: any = null;

  // Store Razorpay instance
  razorpayInstance: any = null;

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


  // ============================================
  // GO TO COURSES
  // ============================================

  goToCourses(): void {

    this.router.navigate(['/courses']);

  }


  // ============================================
  // COURSE FEE IN RUPEES
  // ============================================

 


  // ============================================
  // GST 18%
  // ============================================

  getGst(): number {

    return this.course.fee * 0.18;

  }
 

  
  getTotalAmount(){
  var fee = this.course.fee;

    var gst = fee * 0.18;

    var totalAmount = Math.round(fee + gst);
   return totalAmount;
}



  proceedToPayment(): void {

    if (!this.course) {

      alert('Course details not found');

      return;
    }


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!this.student.fullName ||
        !this.student.email ||
        !this.student.mobile) {

      alert(
        'Please fill all required student details'
      );

      return;
    }


    // ==========================================
    // PREVENT DOUBLE PAYMENT
    // ==========================================

    if (this.paymentProcessing) {

      return;
    }


    /*
     * IMPORTANT
     *
     * course.fee is already in PAISE.
     *
     * Example:
     *
     * ₹1000 = 100000 paise
     *
     * Therefore:
     *
     * DO NOT do:
     *
     * this.course.fee * 100
     */


    var fee = this.course.fee*100;

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


    // ==========================================
    // SHOW LOADING
    // ==========================================

    this.paymentProcessing = true;


    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    this.paymentService
      .createOrder(totalAmount)
      .subscribe(

        (order: any) => {

          console.log(
            'Order created successfully:',
            order
          );


          // ======================================
          // CHECK ORDER RESPONSE
          // ======================================

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


          // ======================================
          // STOP ANGULAR LOADER
          // ======================================

          this.paymentProcessing = false;


          // ======================================
          // OPEN RAZORPAY
          // ======================================

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


  // ============================================
  // OPEN RAZORPAY
  // ============================================

  openRazorpay(order: any): void {

    console.log(
      'Opening Razorpay...'
    );

    console.log(
      'Order:',
      order
    );


    // ==========================================
    // GET RAZORPAY SDK
    // ==========================================

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


    // ==========================================
    // RAZORPAY OPTIONS
    // ==========================================

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


      // ========================================
      // PREFILL
      // ========================================

      prefill: {

        name:
          this.student.fullName,

        email:
          this.student.email,

        contact:
          this.student.mobile

      },


      // ========================================
      // NOTES
      // ========================================

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


      // ========================================
      // THEME
      // ========================================

      theme: {

        color:
          '#2563eb'

      },


      // ========================================
      // PAYMENT SUCCESS
      // ========================================

      handler: (response: any) => {

        console.log(
          '================================'
        );

        console.log(
          'RAZORPAY PAYMENT SUCCESS'
        );

        console.log(
          '================================'
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


        // ======================================
        // PAYMENT DATA
        // ======================================

        var paymentData = {

          razorpayOrderId:
            response.razorpay_order_id,

          razorpayPaymentId:
            response.razorpay_payment_id,

          razorpaySignature:
            response.razorpay_signature

        };


        // ======================================
        // CLOSE RAZORPAY
        // ======================================

        /*
         * IMPORTANT:
         *
         * Razorpay does not automatically
         * close in every integration.
         *
         * Close it manually after payment.
         */

        if (this.razorpayInstance) {

          console.log(
            'Closing Razorpay window...'
          );

          this.razorpayInstance.close();

        }


        // ======================================
        // VERIFY PAYMENT
        // ======================================

        this.verifyPayment(
          paymentData
        );

      },


      // ========================================
      // PAYMENT WINDOW CLOSED
      // ========================================

      modal: {

        ondismiss: () => {

          console.log(
            'Razorpay payment window closed'
          );

          this.paymentProcessing = false;

        }

      }

    };


    // ==========================================
    // CREATE RAZORPAY INSTANCE
    // ==========================================

    try {

      this.razorpayInstance =
        new Razorpay(options);


      console.log(
        'Razorpay instance created'
      );


      // ========================================
      // OPEN RAZORPAY
      // ========================================

      this.razorpayInstance.open();


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


  // ============================================
  // VERIFY PAYMENT
  // ============================================

  verifyPayment(response: any): void {

    console.log(
      'Verifying payment with backend...'
    );


    // ==========================================
    // SHOW LOADER
    // ==========================================

    this.paymentProcessing = true;


    this.paymentService
      .verifyPayment(response)
      .subscribe(

        (result: any) => {

          console.log(
            'Payment verification response:',
            result
          );


          // ====================================
          // PAYMENT SUCCESS
          // ====================================

          if (
            result &&
            result.status === 'SUCCESS'
          ) {

            console.log(
              'Payment verified successfully'
            );


            // ==================================
            // CLOSE RAZORPAY AGAIN
            // ==================================

            if (this.razorpayInstance) {

              this.razorpayInstance.close();

              this.razorpayInstance = null;

            }


            // ==================================
            // HIDE LOADER
            // ==================================

            this.paymentProcessing = false;


            // ==================================
            // PAYMENT SUCCESS
            // ==================================

            this.paymentVerified = true;


            // ==================================
            // STORE PAYMENT DETAILS
            // ==================================

            this.paymentDetails = {

              paymentId:
                response.razorpayPaymentId,

              orderId:
                response.razorpayOrderId,

              amount:
                this.getTotalAmount(),

              course:
                this.course.title

            };


            console.log(
              'Payment Details:',
              this.paymentDetails
            );


            // ==================================
            // OPTIONAL REDIRECT
            // ==================================

            /*
             * If you want to stay on the page
             * and show success message,
             * DON'T navigate.
             *
             * If you want to automatically
             * navigate to courses, uncomment
             * the following code.
             */


            /*
            setTimeout(() => {

              this.router.navigate(['/courses']);

            }, 3000);
            */


          }


          // ====================================
          // PAYMENT NOT SUCCESSFUL
          // ====================================

          else {

            console.error(
              'Payment verification was not successful:',
              result
            );


            this.paymentProcessing = false;

            this.paymentVerified = false;


            alert(
              'Payment could not be verified. Please contact support.'
            );

          }

        },


        // ======================================
        // API ERROR
        // ======================================

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