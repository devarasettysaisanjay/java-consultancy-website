import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  COURSES
} from 'src/app/data/courses';

import {
  Course
} from 'src/app/models/course.model';

import {
  RazorPaymentServiceService
} from 'src/app/razor-payment-service.service';

import {
  Subscription,
  timer
} from 'rxjs';

import {
  switchMap,
  take
} from 'rxjs/operators';


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
export class EnrollComponent
  implements OnInit, OnDestroy {


  course!: Course;


  paymentProcessing = false;

  paymentVerified = false;

  paymentSucceeded = false;


  paymentDetails:
    PaymentDetails | null = null;


  razorpayInstance: any = null;


  /*
   * Razorpay order ID
   */
  currentOrderId: string | null = null;


  /*
   * Polling subscription
   */
  paymentPollingSubscription:
    Subscription | null = null;


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
      this.route.snapshot
        .paramMap
        .get('slug');


    const foundCourse =
      COURSES.find(
        c => c.slug === slug
      );


    if (!foundCourse) {

      alert('Course not found');

      this.router.navigate(
        ['/courses']
      );

      return;

    }


    this.course =
      foundCourse;


    console.log(
      'Course loaded:',
      this.course
    );

  }


  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {

    this.stopPaymentPolling();

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


  /*
   * Razorpay requires paise.
   *
   * Example:
   *
   * ₹118 = 11800 paise
   */

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
      '===================================='
    );

    console.log(
      'PROCEED TO PAYMENT'
    );

    console.log(
      '===================================='
    );


    // ----------------------------------------------------------
    // COURSE
    // ----------------------------------------------------------

    if (!this.course) {

      alert(
        'Course details not found'
      );

      return;

    }


    // ----------------------------------------------------------
    // STUDENT
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
    // RESET
    // ----------------------------------------------------------

    this.paymentVerified =
      false;

    this.paymentSucceeded =
      false;

    this.paymentDetails =
      null;

    this.currentOrderId =
      null;


    this.stopPaymentPolling();


    // ----------------------------------------------------------
    // AMOUNT
    // ----------------------------------------------------------

    const amountInPaise =
      this.getTotalAmountInPaise();


    console.log(
      'Course fee:',
      this.getCourseFee()
    );

    console.log(
      'GST:',
      this.getGst()
    );

    console.log(
      'Total amount:',
      this.getTotalAmount()
    );

    console.log(
      'Amount in paise:',
      amountInPaise
    );


    if (amountInPaise <= 0) {

      alert(
        'Invalid payment amount'
      );

      return;

    }


    this.paymentProcessing =
      true;


    // ==========================================================
    // CREATE ORDER
    // ==========================================================

    this.paymentService
      .createOrder(amountInPaise)
      .subscribe({

        next: (order: any) => {

          console.log(
            '===================================='
          );

          console.log(
            'CREATE ORDER SUCCESS'
          );

          console.log(
            '===================================='
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
              'Invalid order:',
              order
            );

            this.paymentProcessing =
              false;

            alert(
              'Invalid order response from server'
            );

            return;

          }


          /*
           * VERY IMPORTANT
           *
           * Save order ID.
           */

          this.currentOrderId =
            order.id;


          console.log(
            'RAZORPAY ORDER ID:',
            this.currentOrderId
          );


          /*
           * Open Razorpay.
           */

          this.openRazorpay(
            order
          );

        },


        error: (error) => {

          console.error(
            'Create order error:',
            error
          );

          this.paymentProcessing =
            false;

          alert(
            'Unable to create payment order'
          );

        }

      });

  }


  // ============================================================
  // OPEN RAZORPAY
  // ============================================================

  openRazorpay(
    order: any
  ): void {

    console.log(
      '===================================='
    );

    console.log(
      'OPENING RAZORPAY'
    );

    console.log(
      '===================================='
    );


    const Razorpay =
      (window as any).Razorpay;


    // ----------------------------------------------------------
    // CHECK SDK
    // ----------------------------------------------------------

    if (!Razorpay) {

      console.error(
        'Razorpay SDK NOT FOUND'
      );

      this.paymentProcessing =
        false;

      alert(
        'Razorpay SDK is not loaded'
      );

      return;

    }


    console.log(
      'Razorpay SDK found'
    );


    // ==========================================================
    // RAZORPAY OPTIONS
    // ==========================================================

    const options: any = {

      key:
        'rzp_live_TPDar9HoNLuaOX',

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
      // HANDLER
      // ========================================================

      handler: (response: any) => {

        console.log(
          '****************************************'
        );

        console.log(
          '🔥 RAZORPAY HANDLER CALLED'
        );

        console.log(
          '****************************************'
        );

        console.log(
          'Response:',
          response
        );


        /*
         * Handler is only a backup.
         *
         * We still verify using backend.
         */

        if (
          response &&
          response.razorpay_order_id
        ) {

          this.currentOrderId =
            response.razorpay_order_id;

        }


        /*
         * Start backend status checking.
         */

        this.startPaymentPolling();

      },


      // ========================================================
      // MODAL
      // ========================================================

      modal: {

        backdropclose:
          false,

        escape:
          false,

        confirm_close:
          true,


        ondismiss: () => {

          console.log(
            'Razorpay modal dismissed'
          );


          /*
           * IMPORTANT
           *
           * Don't immediately say payment failed.
           *
           * UPI payment may have completed even though
           * the checkout modal disappeared.
           */

          if (
            !this.paymentSucceeded &&
            this.currentOrderId
          ) {

            console.log(
              'Checking payment after modal dismissal...'
            );


            this.startPaymentPolling();

          }

        }

      }

    };


    console.log(
      'Razorpay options:',
      options
    );


    // ==========================================================
    // CREATE RAZORPAY INSTANCE
    // ==========================================================

    try {

      this.razorpayInstance =
        new Razorpay(options);


      console.log(
        'Razorpay instance created'
      );


      // ========================================================
      // PAYMENT FAILED EVENT
      // ========================================================

      this.razorpayInstance.on(
        'payment.failed',
        (error: any) => {

          console.error(
            '===================================='
          );

          console.error(
            'RAZORPAY PAYMENT FAILED'
          );

          console.error(
            error
          );

          console.error(
            '===================================='
          );


          /*
           * Don't poll forever after an actual failure.
           */

          this.stopPaymentPolling();


          this.paymentProcessing =
            false;

          this.paymentSucceeded =
            false;

          this.paymentVerified =
            false;


          alert(
            'Payment failed. Please try again.'
          );

        }
      );


      // ========================================================
      // OPEN
      // ========================================================

      console.log(
        'Calling Razorpay.open()'
      );


      this.razorpayInstance.open();


      console.log(
        'Razorpay.open() called'
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
        'Unable to open Razorpay checkout'
      );

    }

  }


  // ============================================================
  // START PAYMENT POLLING
  // ============================================================

  startPaymentPolling(): void {

    if (!this.currentOrderId) {

      console.error(
        'Order ID missing'
      );

      return;

    }


    /*
     * Don't start multiple polling processes.
     */

    this.stopPaymentPolling();


    console.log(
      '===================================='
    );

    console.log(
      'START PAYMENT STATUS CHECK'
    );

    console.log(
      'ORDER ID:',
      this.currentOrderId
    );

    console.log(
      '===================================='
    );


    this.paymentProcessing =
      true;


    /*
     * Immediately check.
     *
     * Then every 3 seconds.
     *
     * Maximum 40 checks.
     *
     * 40 × 3 = 120 seconds.
     */

    this.paymentPollingSubscription =
      timer(0, 3000)

        .pipe(

          take(40),

          switchMap(() => {

            console.log(
              'Checking backend payment status...'
            );

            return this.paymentService
              .checkPaymentStatus(
                this.currentOrderId!
              );

          })

        )

        .subscribe({

          next: (result: any) => {

            console.log(
              'Backend payment status:',
              result
            );


            // ==================================================
            // SUCCESS
            // ==================================================

            if (
              result &&
              result.success === true
            ) {

              console.log(
                '===================================='
              );

              console.log(
                '🎉 PAYMENT SUCCESS'
              );

              console.log(
                '===================================='
              );


              this.handlePaymentSuccess(
                result
              );


              this.stopPaymentPolling();

            }

          },


          error: (error) => {

            console.error(
              'Payment status API error:',
              error
            );

            /*
             * Don't immediately close the checkout.
             *
             * Keep trying.
             */

          },


          complete: () => {

            if (
              !this.paymentSucceeded
            ) {

              console.log(
                'Payment status checking finished'
              );

              this.paymentProcessing =
                false;

            }

          }

        });

  }


  // ============================================================
  // SUCCESS
  // ============================================================

  handlePaymentSuccess(
    result: any
  ): void {

    console.log(
      '===================================='
    );

    console.log(
      'HANDLE PAYMENT SUCCESS'
    );

    console.log(
      '===================================='
    );


    this.paymentVerified =
      true;

    this.paymentSucceeded =
      true;

    this.paymentProcessing =
      false;


    // ==========================================================
    // PAYMENT DETAILS
    // ==========================================================

    this.paymentDetails = {

      paymentId:
        result.paymentId,

      orderId:
        result.orderId,

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
      'Payment details:',
      this.paymentDetails
    );


    // ==========================================================
    // CLOSE RAZORPAY
    // ==========================================================

    console.log(
      'Closing Razorpay...'
    );


    try {

      if (
        this.razorpayInstance
      ) {

        this.razorpayInstance.close();

        console.log(
          'Razorpay close() called'
        );

      }

    }
    catch (error) {

      console.error(
        'Error closing Razorpay:',
        error
      );

    }


    this.razorpayInstance =
      null;


    this.stopPaymentPolling();


    console.log(
      '===================================='
    );

    console.log(
      '✅ PAYMENT VERIFIED'
    );

    console.log(
      '✅ RAZORPAY CLOSED'
    );

    console.log(
      '===================================='
    );


    alert(
      'Payment successful!'
    );

  }


  // ============================================================
  // STOP POLLING
  // ============================================================

  stopPaymentPolling(): void {

    if (
      this.paymentPollingSubscription
    ) {

      this.paymentPollingSubscription
        .unsubscribe();

      this.paymentPollingSubscription =
        null;

    }

  }

}