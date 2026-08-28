import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { COURSES } from 'src/app/data/courses';
import { Course } from 'src/app/models/course.model';
import { RazorPaymentServiceService } from 'src/app/razor-payment-service.service';

interface StudentForm {

  fullName: string;
  email: string;
  mobile: string;
  experience: string;
  currentStatus: string;
  howFoundUs: string;
  message: string;

}

interface PaymentDetails {

  paymentId: string;
  orderId: string;
  amount: number;
  course: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;

}

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent implements OnInit {

  course!: Course;

  paymentProcessing = false;

  paymentVerified = false;

  paymentSucceeded = false;

  paymentDetails: PaymentDetails | null = null;

  razorpayInstance: any = null;


  student: StudentForm = {

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

    private paymentService:
      RazorPaymentServiceService

  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    const slug =
      this.route.snapshot.paramMap.get('slug');

    const foundCourse =
      COURSES.find(
        c => c.slug === slug
      );

    if (!foundCourse) {

      alert('Course not found');

      this.router.navigate(['/courses']);

      return;

    }

    this.course = foundCourse;

    console.log(
      'Course loaded:',
      this.course
    );

  }


  // ============================================================
  // NAVIGATION
  // ============================================================

  goToCourses(): void {

    this.router.navigate(['/courses']);

  }


  // ============================================================
  // AMOUNT
  // ============================================================

  getCourseFee(): number {

    if (!this.course) {
      return 0;
    }

    return this.course.fee || 0;

  }


  getGst(): number {

    const fee =
      this.getCourseFee();

    return Math.round(
      fee * 0.18 * 100
    ) / 100;

  }


  getTotalAmount(): number {

    const fee =
      this.getCourseFee();

    const gst =
      this.getGst();

    return Math.round(
      (fee + gst) * 100
    ) / 100;

  }


  getTotalAmountInPaise(): number {

    return Math.round(
      this.getTotalAmount() * 100
    );

  }


  // ============================================================
  // START PAYMENT
  // ============================================================

  proceedToPayment(): void {

    console.log(
      '================================'
    );

    console.log(
      'PROCEED TO PAYMENT'
    );

    console.log(
      '================================'
    );


    // ----------------------------------------------------------
    // COURSE VALIDATION
    // ----------------------------------------------------------

    if (!this.course) {

      alert(
        'Course details not found'
      );

      return;

    }


    // ----------------------------------------------------------
    // STUDENT VALIDATION
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // PREVENT DOUBLE CLICK
    // ----------------------------------------------------------

    if (this.paymentProcessing) {

      console.log(
        'Payment already processing'
      );

      return;

    }


    // ----------------------------------------------------------
    // RESET STATE
    // ----------------------------------------------------------

    this.paymentVerified = false;

    this.paymentSucceeded = false;

    this.paymentDetails = null;


    // ----------------------------------------------------------
    // AMOUNT
    // ----------------------------------------------------------

    const amountInPaise =
      this.getTotalAmountInPaise();


    console.log(
      'Amount:',
      this.getTotalAmount()
    );

    console.log(
      'Amount in paise:',
      amountInPaise
    );


    this.paymentProcessing = true;


    // ----------------------------------------------------------
    // CREATE ORDER
    // ----------------------------------------------------------

    this.paymentService
      .createOrder(amountInPaise)
      .subscribe({

        next: (order: any) => {

          console.log(
            '================================'
          );

          console.log(
            'CREATE ORDER SUCCESS'
          );

          console.log(
            '================================'
          );

          console.log(
            'Order response:',
            order
          );


          if (
            !order ||
            !order.id ||
            !order.amount
          ) {

            console.error(
              'Invalid order response:',
              order
            );

            this.paymentProcessing = false;

            alert(
              'Invalid order response from server'
            );

            return;

          }


          this.paymentProcessing = false;


          // ----------------------------------------------------
          // OPEN RAZORPAY
          // ----------------------------------------------------

          this.openRazorpay(order);

        },


        error: (error) => {

          console.error(
            'Create order API error:',
            error
          );

          this.paymentProcessing = false;

          alert(
            'Unable to create payment order'
          );

        }

      });

  }


  // ============================================================
  // OPEN RAZORPAY
  // ============================================================

  openRazorpay(order: any): void {

    console.log(
      '================================'
    );

    console.log(
      'OPENING RAZORPAY'
    );

    console.log(
      '================================'
    );


    const Razorpay =
      (window as any).Razorpay;


    // ----------------------------------------------------------
    // CHECK SDK
    // ----------------------------------------------------------

    if (!Razorpay) {

      console.error(
        'Razorpay SDK not found'
      );

      alert(
        'Razorpay SDK is not loaded'
      );

      return;

    }


    console.log(
      'Razorpay SDK found'
    );


    // ----------------------------------------------------------
    // OPTIONS
    // ----------------------------------------------------------

    const options: any = {

      key: 'rzp_live_TPDar9HoNLuaOX',

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


      // --------------------------------------------------------
      // PREFILL
      // --------------------------------------------------------

      prefill: {

        name:
          this.student.fullName,

        email:
          this.student.email,

        contact:
          this.student.mobile

      },


      // --------------------------------------------------------
      // NOTES
      // --------------------------------------------------------

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


      // --------------------------------------------------------
      // THEME
      // --------------------------------------------------------

      theme: {

        color:
          '#2563eb'

      },


      // ========================================================
      // SUCCESS HANDLER
      // ========================================================

      handler: (response: any) => {

        console.log(
          '========================================'
        );

        console.log(
          '🔥🔥 RAZORPAY SUCCESS HANDLER CALLED 🔥🔥'
        );

        console.log(
          '========================================'
        );


        console.log(
          'Razorpay response:',
          response
        );


        // ------------------------------------------------------
        // VALIDATE RESPONSE
        // ------------------------------------------------------

        if (
          !response ||
          !response.razorpay_payment_id ||
          !response.razorpay_order_id ||
          !response.razorpay_signature
        ) {

          console.error(
            'Invalid Razorpay response:',
            response
          );

          alert(
            'Invalid payment response received'
          );

          return;

        }


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


        // ------------------------------------------------------
        // CREATE VERIFY REQUEST
        // ------------------------------------------------------

        const paymentData = {

          razorpayOrderId:
            response.razorpay_order_id,

          razorpayPaymentId:
            response.razorpay_payment_id,

          razorpaySignature:
            response.razorpay_signature

        };


        console.log(
          'Sending payment to verification API:',
          paymentData
        );


        // ------------------------------------------------------
        // SHOW PROCESSING
        // ------------------------------------------------------

        this.paymentProcessing = true;


        // ------------------------------------------------------
        // VERIFY PAYMENT
        // ------------------------------------------------------

        this.verifyPayment(
          paymentData
        );

      },


      // ========================================================
      // MODAL
      // ========================================================

      modal: {

        backdropclose: false,

        escape: false,

        confirm_close: true,


        ondismiss: () => {

          console.log(
            'Razorpay modal dismissed'
          );


          if (
            !this.paymentSucceeded
          ) {

            this.paymentProcessing = false;

          }


          this.razorpayInstance = null;

        }

      }

    };


    console.log(
      'Razorpay options:',
      options
    );


    // ----------------------------------------------------------
    // CREATE INSTANCE
    // ----------------------------------------------------------

    try {

      this.razorpayInstance =
        new Razorpay(options);


      console.log(
        'Razorpay instance created'
      );


      // --------------------------------------------------------
      // PAYMENT FAILED
      // --------------------------------------------------------

      this.razorpayInstance.on(
        'payment.failed',
        (error: any) => {

          console.error(
            '================================'
          );

          console.error(
            'RAZORPAY PAYMENT FAILED'
          );

          console.error(
            '================================'
          );

          console.error(
            error
          );


          this.paymentProcessing = false;

          this.paymentSucceeded = false;

          this.paymentVerified = false;


          try {

            if (
              this.razorpayInstance
            ) {

              this.razorpayInstance.close();

            }

          } catch (e) {

            console.warn(
              'Close error:',
              e
            );

          }


          this.razorpayInstance = null;


          alert(
            'Payment failed. Please try again.'
          );

        }
      );


      // --------------------------------------------------------
      // OPEN
      // --------------------------------------------------------

      console.log(
        'Calling Razorpay.open()'
      );


      this.razorpayInstance.open();


      console.log(
        'Razorpay.open() completed'
      );

    }
    catch (error) {

      console.error(
        'Razorpay open error:',
        error
      );

      this.paymentProcessing = false;

      this.razorpayInstance = null;

      alert(
        'Unable to open Razorpay checkout'
      );

    }

  }


  // ============================================================
  // VERIFY PAYMENT
  // ============================================================

  verifyPayment(
    paymentData: any
  ): void {

    console.log(
      '================================'
    );

    console.log(
      'VERIFY PAYMENT'
    );

    console.log(
      '================================'
    );


    console.log(
      'Sending:',
      paymentData
    );


    this.paymentService
      .verifyPayment(paymentData)
      .subscribe({

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        next: (result: any) => {

          console.log(
            'Verification response:',
            result
          );


          const success =
            result?.success === true ||
            result?.status === true ||
            result?.status === 'SUCCESS';


          if (success) {

            console.log(
              '================================'
            );

            console.log(
              '✅ PAYMENT VERIFIED SUCCESSFULLY'
            );

            console.log(
              '================================'
            );


            // --------------------------------------------------
            // PAYMENT DETAILS
            // --------------------------------------------------

            this.paymentDetails = {

              paymentId:
                paymentData.razorpayPaymentId,

              orderId:
                paymentData.razorpayOrderId,

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


            // --------------------------------------------------
            // PAYMENT STATES
            // --------------------------------------------------

            this.paymentProcessing = false;

            this.paymentVerified = true;

            this.paymentSucceeded = true;


            // --------------------------------------------------
            // CLOSE RAZORPAY
            // --------------------------------------------------

            console.log(
              'Closing Razorpay checkout...'
            );


            try {

              if (
                this.razorpayInstance
              ) {

                this.razorpayInstance.close();

              }

            }
            catch (error) {

              console.warn(
                'Razorpay close error:',
                error
              );

            }


            this.razorpayInstance = null;


            console.log(
              'Razorpay checkout closed'
            );

          }


          // ------------------------------------------------------
          // FAILED VERIFICATION
          // ------------------------------------------------------

          else {

            console.error(
              '❌ PAYMENT VERIFICATION FAILED'
            );

            console.error(
              result
            );


            this.paymentProcessing = false;

            this.paymentVerified = false;

            this.paymentSucceeded = false;


            alert(
              'Payment could not be verified. Please contact support.'
            );

          }

        },


        // ------------------------------------------------------
        // API ERROR
        // ------------------------------------------------------

        error: (error) => {

          console.error(
            'Verification API error:',
            error
          );


          this.paymentProcessing = false;

          this.paymentVerified = false;

          this.paymentSucceeded = false;


          alert(
            'Payment verification failed. Please contact support.'
          );

        }

      });

  }

}