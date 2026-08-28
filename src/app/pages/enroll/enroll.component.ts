```typescript
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

  // Razorpay instance
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


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    var slug =
      this.route.snapshot.paramMap.get('slug');

    this.course = COURSES.find(
      c => c.slug === slug
    )!;

    if (!this.course) {

      alert('Course not found');

      this.router.navigate([
        '/courses'
      ]);

      return;
    }

    console.log(
      'Course:',
      this.course
    );

    console.log(
      'Course fee in rupees:',
      this.course.fee
    );
  }


  // =========================================================
  // GO TO COURSES
  // =========================================================

  goToCourses(): void {

    this.router.navigate([
      '/courses'
    ]);

  }


  // =========================================================
  // COURSE FEE
  // =========================================================

  getCourseFee(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;
    }

    // course.fee is in RUPEES

    return this.course.fee;
  }


  // =========================================================
  // GST
  // =========================================================

  getGst(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;
    }

    return this.course.fee * 0.18;
  }


  // =========================================================
  // TOTAL IN RUPEES
  // =========================================================

  getTotalAmount(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;
    }

    var fee =
      this.course.fee;

    var gst =
      fee * 0.18;

    return fee + gst;
  }


  // =========================================================
  // TOTAL IN PAISE
  // =========================================================

  getTotalAmountInPaise(): number {

    var total =
      this.getTotalAmount();

    return Math.round(
      total * 100
    );
  }


  // =========================================================
  // PROCEED TO PAYMENT
  // =========================================================

  proceedToPayment(): void {

    // -----------------------------------------------
    // Check course
    // -----------------------------------------------

    if (!this.course) {

      alert(
        'Course details not found'
      );

      return;
    }


    // -----------------------------------------------
    // Validate student
    // -----------------------------------------------

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


    // -----------------------------------------------
    // Prevent duplicate payment
    // -----------------------------------------------

    if (this.paymentProcessing) {

      return;
    }


    // -----------------------------------------------
    // Calculate amount
    // -----------------------------------------------

    var fee =
      this.course.fee;

    var gst =
      fee * 0.18;

    var totalAmountInRupees =
      fee + gst;

    var totalAmountInPaise =
      Math.round(
        totalAmountInRupees * 100
      );


    console.log(
      '================================'
    );

    console.log(
      'PAYMENT DETAILS'
    );

    console.log(
      '================================'
    );

    console.log(
      'Course:',
      this.course.title
    );

    console.log(
      'Course fee:',
      fee,
      'rupees'
    );

    console.log(
      'GST:',
      gst,
      'rupees'
    );

    console.log(
      'Total:',
      totalAmountInRupees,
      'rupees'
    );

    console.log(
      'Razorpay amount:',
      totalAmountInPaise,
      'paise'
    );


    // -----------------------------------------------
    // Start processing
    // -----------------------------------------------

    this.paymentProcessing = true;


    // -----------------------------------------------
    // Create Razorpay order
    // -----------------------------------------------

    this.paymentService
      .createOrder(
        totalAmountInPaise
      )
      .subscribe(

        (order: any) => {

          console.log(
            'Razorpay order:',
            order
          );


          if (!order) {

            this.paymentProcessing = false;

            alert(
              'Invalid order response'
            );

            return;
          }


          if (!order.id) {

            this.paymentProcessing = false;

            alert(
              'Razorpay order ID is missing'
            );

            return;
          }


          if (!order.amount) {

            this.paymentProcessing = false;

            alert(
              'Razorpay order amount is missing'
            );

            return;
          }


          // Stop Angular loader
          this.paymentProcessing = false;


          // Open Razorpay
          this.openRazorpay(
            order
          );

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


  // =========================================================
  // OPEN RAZORPAY
  // =========================================================

  openRazorpay(order: any): void {

    var Razorpay =
      (window as any).Razorpay;


    if (!Razorpay) {

      alert(
        'Razorpay SDK is not loaded.'
      );

      return;
    }


    var options = {

      key:
        order.key,

      amount:
        order.amount,

      currency:
        order.currency || 'INR',

      name:
        'JavaBridge Consultancy',

      description:
        this.course.title +
        ' Course Payment',

      order_id:
        order.id,


      // =====================================================
      // PREFILL
      // =====================================================

      prefill: {

        name:
          this.student.fullName,

        email:
          this.student.email,

        contact:
          this.student.mobile

      },


      // =====================================================
      // NOTES
      // =====================================================

      notes: {

        course:
          this.course.title,

        studentName:
          this.student.fullName,

        studentEmail:
          this.student.email,

        studentMobile:
          this.student.mobile

      },


      // =====================================================
      // THEME
      // =====================================================

      theme: {

        color:
          '#2563eb'

      },


      // =====================================================
      // PAYMENT SUCCESS
      // =====================================================

      handler: (response: any) => {

        console.log(
          '======================================'
        );

        console.log(
          'RAZORPAY PAYMENT SUCCESS'
        );

        console.log(
          '======================================'
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


        // -----------------------------------------------
        // Validate response
        // -----------------------------------------------

        if (
          !response ||
          !response.razorpay_payment_id ||
          !response.razorpay_order_id ||
          !response.razorpay_signature
        ) {

          alert(
            'Invalid payment response received.'
          );

          return;
        }


        // -----------------------------------------------
        // CLOSE RAZORPAY IMMEDIATELY
        // -----------------------------------------------

        this.closeRazorpay();


        // -----------------------------------------------
        // Prepare backend verification
        // -----------------------------------------------

        var paymentData = {

          razorpayOrderId:
            response.razorpay_order_id,

          razorpayPaymentId:
            response.razorpay_payment_id,

          razorpaySignature:
            response.razorpay_signature

        };


        // -----------------------------------------------
        // Show verification loader
        // -----------------------------------------------

        this.paymentProcessing = true;


        // -----------------------------------------------
        // Verify with backend
        // -----------------------------------------------

        this.verifyPayment(
          paymentData
        );

      },


      // =====================================================
      // MODAL DISMISSED
      // =====================================================

      modal: {

        ondismiss: () => {

          console.log(
            'Razorpay window dismissed'
          );

          /*
           * Do not mark payment as successful here.
           *
           * Success is decided only by:
           *
           * Razorpay handler()
           *
           * AND
           *
           * Backend verification.
           */

          if (!this.paymentVerified) {

            this.paymentProcessing =
              false;
          }

          this.razorpayInstance =
            null;
        }

      }

    };


    // =====================================================
    // CREATE RAZORPAY INSTANCE
    // =====================================================

    try {

      this.razorpayInstance =
        new Razorpay(
          options
        );


      // -----------------------------------------------
      // Payment failed event
      // -----------------------------------------------

      this.razorpayInstance.on(
        'payment.failed',
        (error: any) => {

          console.error(
            'Payment failed:',
            error
          );

          this.paymentProcessing =
            false;

          this.paymentVerified =
            false;

          this.razorpayInstance =
            null;

          alert(
            'Payment failed. Please try again.'
          );

        }
      );


      // -----------------------------------------------
      // Open Razorpay
      // -----------------------------------------------

      this.razorpayInstance.open();

    }

    catch (error) {

      console.error(
        'Razorpay error:',
        error
      );

      this.paymentProcessing =
        false;

      this.razorpayInstance =
        null;

      alert(
        'Unable to open Razorpay payment window.'
      );

    }

  }


  // =========================================================
  // CLOSE RAZORPAY
  // =========================================================

  closeRazorpay(): void {

    console.log(
      'Closing Razorpay...'
    );


    if (
      this.razorpayInstance
    ) {

      try {

        this.razorpayInstance.close();

        console.log(
          'Razorpay close() called'
        );

      }

      catch (error) {

        console.error(
          'Unable to close Razorpay:',
          error
        );

      }

    }

  }


  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  verifyPayment(
    response: any
  ): void {

    console.log(
      '======================================'
    );

    console.log(
      'VERIFYING PAYMENT'
    );

    console.log(
      '======================================'
    );


    this.paymentService
      .verifyPayment(
        response
      )
      .subscribe(

        (result: any) => {

          console.log(
            'Backend verification response:',
            result
          );


          // =================================================
          // SUCCESS
          // =================================================

          if (
            result &&
            result.status === 'SUCCESS'
          ) {

            console.log(
              'PAYMENT VERIFIED SUCCESSFULLY'
            );


            // -----------------------------------------------
            // Make sure Razorpay is closed
            // -----------------------------------------------

            this.closeRazorpay();


            this.razorpayInstance =
              null;


            // -----------------------------------------------
            // Stop loader
            // -----------------------------------------------

            this.paymentProcessing =
              false;


            // -----------------------------------------------
            // Show success page/section
            // -----------------------------------------------

            this.paymentVerified =
              true;


            // -----------------------------------------------
            // Store payment details
            // -----------------------------------------------

            this.paymentDetails = {

              paymentId:
                response.razorpayPaymentId,

              orderId:
                response.razorpayOrderId,

              amount:
                this.getTotalAmount(),

              course:
                this.course.title,

              studentName:
                this.student.fullName,

              studentEmail:
                this.student.email,

              studentMobile:
                this.student.mobile

            };


            console.log(
              '======================================'
            );

            console.log(
              'SUCCESS PAGE DATA'
            );

            console.log(
              '======================================'
            );

            console.log(
              this.paymentDetails
            );


            /*
             * If you want to automatically navigate
             * to a separate success page:
             *
             * this.router.navigate([
             *   '/payment-success'
             * ]);
             *
             * But if you want to print the order
             * details on the SAME enroll page,
             * keep paymentVerified = true.
             */

          }


          // =================================================
          // VERIFICATION FAILED
          // =================================================

          else {

            console.error(
              'Payment verification failed:',
              result
            );


            this.paymentProcessing =
              false;


            this.paymentVerified =
              false;


            alert(
              'Payment could not be verified. Please contact support.'
            );

          }

        },


        // ===================================================
        // BACKEND ERROR
        // ===================================================

        (error) => {

          console.error(
            'Payment verification API error:',
            error
          );


          this.paymentProcessing =
            false;


          this.paymentVerified =
            false;


          alert(
            'Payment verification failed. Please contact support.'
          );

        }

      );

  }

}
```
