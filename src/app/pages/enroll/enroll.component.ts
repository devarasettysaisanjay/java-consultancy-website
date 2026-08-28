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
  // NG ON INIT
  // =========================================================

  ngOnInit(): void {

    console.log('Enroll page loaded');

    var slug =
      this.route.snapshot.paramMap.get('slug');


    // Find course
    this.course = COURSES.find(
      c => c.slug === slug
    )!;


    console.log(
      'Course:',
      this.course
    );


    // Course not found
    if (!this.course) {

      alert('Course not found');

      this.router.navigate([
        '/courses'
      ]);

      return;
    }


    console.log(
      'Course fee in paise:',
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
  // COURSE FEE IN RUPEES
  // =========================================================

  getCourseFee(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;

    }


    /*
     * course.fee is stored in paise.
     *
     * Example:
     *
     * 100000 paise = ₹1000
     */

    return this.course.fee / 100;

  }


  // =========================================================
  // GST 18%
  // =========================================================

  getGst(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;

    }


    return (
      this.course.fee / 100
    ) * 0.18;

  }


  // =========================================================
  // TOTAL AMOUNT IN RUPEES
  // =========================================================

  getTotalAmount(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;

    }


    var fee =
      this.course.fee / 100;


    var gst =
      fee * 0.18;


    return fee + gst;

  }


  // =========================================================
  // TOTAL AMOUNT IN PAISE
  // =========================================================

  getTotalAmountInPaise(): number {

    if (
      !this.course ||
      !this.course.fee
    ) {

      return 0;

    }


    /*
     * course.fee is already in paise.
     */

    var fee =
      this.course.fee;


    var gst =
      fee * 0.18;


    var totalAmount =
      Math.round(
        fee + gst
      );


    return totalAmount;

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

    if (
      this.paymentProcessing
    ) {

      console.log(
        'Payment already processing'
      );

      return;

    }


    // -----------------------------------------------
    // Calculate amount
    // -----------------------------------------------

    /*
     * IMPORTANT
     *
     * course.fee is already in PAISE.
     *
     * Example:
     *
     * ₹1000
     *
     * course.fee = 100000
     *
     * DO NOT multiply by 100 again.
     */

    var fee =
      this.course.fee;


    var gst =
      fee * 0.18;


    var totalAmount =
      Math.round(
        fee + gst
      );


    console.log(
      '--------------------------------'
    );

    console.log(
      'COURSE PAYMENT'
    );

    console.log(
      '--------------------------------'
    );

    console.log(
      'Course:',
      this.course.title
    );

    console.log(
      'Course fee in paise:',
      fee
    );

    console.log(
      'Course fee in rupees:',
      fee / 100
    );

    console.log(
      'GST 18% in paise:',
      gst
    );

    console.log(
      'GST in rupees:',
      gst / 100
    );

    console.log(
      'Total amount in paise:',
      totalAmount
    );

    console.log(
      'Total amount in rupees:',
      totalAmount / 100
    );


    // -----------------------------------------------
    // Show processing
    // -----------------------------------------------

    this.paymentProcessing =
      true;


    // -----------------------------------------------
    // Create Razorpay order
    // -----------------------------------------------

    this.paymentService
      .createOrder(totalAmount)
      .subscribe(

        (order: any) => {

          console.log(
            'Order created successfully:',
            order
          );


          // -----------------------------------------
          // Validate response
          // -----------------------------------------

          if (!order) {

            this.paymentProcessing =
              false;

            alert(
              'Invalid order response from server'
            );

            return;

          }


          // -----------------------------------------
          // Check order ID
          // -----------------------------------------

          if (!order.id) {

            this.paymentProcessing =
              false;

            console.error(
              'Order ID missing:',
              order
            );

            alert(
              'Razorpay order ID is missing'
            );

            return;

          }


          // -----------------------------------------
          // Check amount
          // -----------------------------------------

          if (!order.amount) {

            this.paymentProcessing =
              false;

            console.error(
              'Order amount missing:',
              order
            );

            alert(
              'Razorpay order amount is missing'
            );

            return;

          }


          console.log(
            'Razorpay Order ID:',
            order.id
          );

          console.log(
            'Razorpay Amount:',
            order.amount
          );


          // -----------------------------------------
          // Stop Angular loader
          // -----------------------------------------

          this.paymentProcessing =
            false;


          // -----------------------------------------
          // Open Razorpay
          // -----------------------------------------

          this.openRazorpay(
            order
          );

        },


        // -------------------------------------------
        // Create order error
        // -------------------------------------------

        (error) => {

          this.paymentProcessing =
            false;

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

    console.log(
      'Opening Razorpay...'
    );


    console.log(
      'Order:',
      order
    );


    // -----------------------------------------------
    // Get Razorpay SDK
    // -----------------------------------------------

    var Razorpay =
      (window as any).Razorpay;


    if (!Razorpay) {

      console.error(
        'Razorpay SDK not found'
      );

      alert(
        'Razorpay SDK is not loaded. Please check index.html.'
      );

      return;

    }


    // -----------------------------------------------
    // Razorpay options
    // -----------------------------------------------

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


      // ---------------------------------------------
      // Prefill
      // ---------------------------------------------

      prefill: {

        name:
          this.student.fullName,

        email:
          this.student.email,

        contact:
          this.student.mobile

      },


      // ---------------------------------------------
      // Notes
      // ---------------------------------------------

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


      // ---------------------------------------------
      // Theme
      // ---------------------------------------------

      theme: {

        color:
          '#2563eb'

      },


      // ---------------------------------------------
      // Payment success
      // ---------------------------------------------

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


        // -----------------------------------------
        // Check Razorpay response
        // -----------------------------------------

        if (
          !response ||
          !response.razorpay_payment_id ||
          !response.razorpay_order_id ||
          !response.razorpay_signature
        ) {

          console.error(
            'Invalid Razorpay payment response:',
            response
          );

          alert(
            'Invalid payment response received.'
          );

          return;

        }


        // -----------------------------------------
        // Prepare verification data
        // -----------------------------------------

        var paymentData = {

          razorpayOrderId:
            response.razorpay_order_id,

          razorpayPaymentId:
            response.razorpay_payment_id,

          razorpaySignature:
            response.razorpay_signature

        };


        console.log(
          'Payment verification data:',
          paymentData
        );


        // -----------------------------------------
        // Show processing
        // -----------------------------------------

        this.paymentProcessing =
          true;


        /*
         * IMPORTANT
         *
         * Close Razorpay after successful payment.
         *
         * A small delay allows Razorpay to finish
         * its success transition.
         */

        setTimeout(() => {

          this.closeRazorpay();

        }, 500);


        // -----------------------------------------
        // Verify payment with backend
        // -----------------------------------------

        this.verifyPayment(
          paymentData
        );

      },


      // ---------------------------------------------
      // Razorpay dismissed
      // ---------------------------------------------

      modal: {

        ondismiss: () => {

          console.log(
            'Razorpay window closed'
          );


          this.paymentProcessing =
            false;


          this.razorpayInstance =
            null;

        }

      }

    };


    // -----------------------------------------------
    // Create Razorpay instance
    // -----------------------------------------------

    try {

      console.log(
        'Creating Razorpay instance...'
      );


      this.razorpayInstance =
        new Razorpay(
          options
        );


      console.log(
        'Razorpay instance created'
      );


      // ---------------------------------------------
      // Open Razorpay
      // ---------------------------------------------

      this.razorpayInstance.open();


      console.log(
        'Razorpay opened'
      );

    }

    catch (error) {

      console.error(
        'Razorpay open error:',
        error
      );


      this.paymentProcessing =
        false;


      this.razorpayInstance =
        null;


      alert(
        'Unable to open Razorpay payment window'
      );

    }

  }


  // =========================================================
  // CLOSE RAZORPAY
  // =========================================================

  closeRazorpay(): void {

    console.log(
      'Attempting to close Razorpay...'
    );


    if (
      this.razorpayInstance
    ) {

      try {

        this.razorpayInstance.close();


        console.log(
          'Razorpay close() called successfully'
        );

      }

      catch (error) {

        console.error(
          'Error while closing Razorpay:',
          error
        );

      }

    }

    else {

      console.log(
        'Razorpay instance is already null'
      );

    }

  }


  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  verifyPayment(response: any): void {

    console.log(
      '======================================'
    );

    console.log(
      'VERIFYING PAYMENT'
    );

    console.log(
      '======================================'
    );


    this.paymentProcessing =
      true;


    // -----------------------------------------------
    // Call backend
    // -----------------------------------------------

    this.paymentService
      .verifyPayment(response)
      .subscribe(

        (result: any) => {

          console.log(
            'Payment verification response:',
            result
          );


          // -----------------------------------------
          // SUCCESS
          // -----------------------------------------

          if (
            result &&
            result.status === 'SUCCESS'
          ) {

            console.log(
              'Payment verified successfully'
            );


            // ---------------------------------------
            // Close Razorpay again as backup
            // ---------------------------------------

            this.closeRazorpay();


            // Clear instance
            this.razorpayInstance =
              null;


            // ---------------------------------------
            // Stop processing
            // ---------------------------------------

            this.paymentProcessing =
              false;


            // ---------------------------------------
            // Payment verified
            // ---------------------------------------

            this.paymentVerified =
              true;


            // ---------------------------------------
            // Store payment details
            // ---------------------------------------

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
              '======================================'
            );

            console.log(
              'PAYMENT VERIFIED SUCCESSFULLY'
            );

            console.log(
              '======================================'
            );

            console.log(
              'Payment Details:',
              this.paymentDetails
            );


            /*
             * DO NOT navigate here if you want
             * to show the success message on
             * this page.
             *
             * If you want to navigate to courses
             * after 3 seconds, use:
             *
             * setTimeout(() => {
             *   this.router.navigate(['/courses']);
             * }, 3000);
             */

          }


          // -----------------------------------------
          // VERIFICATION FAILED
          // -----------------------------------------

          else {

            console.error(
              'Payment verification unsuccessful:',
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


        // -------------------------------------------
        // Backend/API error
        // -------------------------------------------

        (error) => {

          console.error(
            'Payment verification failed:',
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