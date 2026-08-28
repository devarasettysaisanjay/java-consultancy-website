import { Component, NgZone, OnInit } from '@angular/core';
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

  // Payment states
  paymentProcessing = false;
  paymentVerified = false;
  paymentSucceeded = false;

  paymentDetails: PaymentDetails | null = null;

  // Razorpay object
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
    private paymentService: RazorPaymentServiceService,
    private ngZone: NgZone
  ) {}

  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('slug');

    const foundCourse = COURSES.find(
      c => c.slug === slug
    );

    if (!foundCourse) {

      alert('Course not found');

      this.router.navigate(['/courses']);

      return;
    }

    this.course = foundCourse;

    console.log('Course loaded:', this.course);
  }


  // =========================================================
  // NAVIGATION
  // =========================================================

  goToCourses(): void {

    this.router.navigate(['/courses']);

  }


  // =========================================================
  // AMOUNT CALCULATIONS
  // =========================================================

  getCourseFee(): number {

    return this.course?.fee || 0;

  }


  getGst(): number {

    const fee = this.getCourseFee();

    return Math.round(
      fee * 0.18 * 100
    ) / 100;

  }


  getTotalAmount(): number {

    const fee = this.getCourseFee();

    const gst = this.getGst();

    return Math.round(
      (fee + gst) * 100
    ) / 100;

  }


  getTotalAmountInPaise(): number {

    const feePaise = Math.round(
      this.getCourseFee() * 100
    );

    const gstPaise = Math.round(
      this.getGst() * 100
    );

    return feePaise + gstPaise;

  }


  // =========================================================
  // START PAYMENT
  // =========================================================

  proceedToPayment(): void {

    console.log('Proceed to payment clicked');

    // Course validation
    if (!this.course) {

      alert(
        'Course details not found'
      );

      return;
    }


    // Student validation
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


    // Prevent duplicate clicks
    if (this.paymentProcessing) {

      return;
    }


    // Reset previous payment state
    this.paymentSucceeded = false;
    this.paymentVerified = false;
    this.paymentDetails = null;


    // Calculate amount
    const razorpayAmount =
      this.getTotalAmountInPaise();


    console.log(
      'Amount in paise:',
      razorpayAmount
    );

    console.log(
      'Amount in rupees:',
      this.getTotalAmount()
    );


    this.paymentProcessing = true;


    // =======================================================
    // CREATE RAZORPAY ORDER
    // =======================================================

    this.paymentService
      .createOrder(razorpayAmount)
      .subscribe({

        next: (order: any) => {

          console.log(
            'Razorpay order response:',
            order
          );


          // Validate order
          if (
            !order ||
            !order.id ||
            !order.amount
          ) {

            console.error(
              'Invalid Razorpay order:',
              order
            );

            this.paymentProcessing = false;

            alert(
              'Invalid order response from server'
            );

            return;
          }


          this.paymentProcessing = false;


          // Open Razorpay
          this.openRazorpay(order);

        },


        error: (error) => {

          console.error(
            'Create order error:',
            error
          );

          this.paymentProcessing = false;

          alert(
            'Unable to create payment order. Please try again.'
          );

        }

      });

  }


  // =========================================================
  // OPEN RAZORPAY
  // =========================================================

  openRazorpay(order: any): void {

    console.log(
      'Opening Razorpay...'
    );


    const Razorpay =
      (window as any).Razorpay;


    // Check SDK
    if (!Razorpay) {

      console.error(
        'Razorpay SDK not found'
      );

      alert(
        'Razorpay SDK is not loaded. Please check index.html.'
      );

      return;
    }


    console.log(
      'Razorpay SDK loaded:',
      Razorpay
    );


    // =======================================================
    // RAZORPAY OPTIONS
    // =======================================================

    const options: any = {

      // Razorpay key returned from backend
      key: order.key,

      // Amount in paise
      amount: order.amount,

      currency:
        order.currency || 'INR',

      name:
        'JavaBridge Consultancy',

      description:
        `${this.course.title} Course Payment`,

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
      // SUCCESS HANDLER
      // =====================================================

      handler: (response: any) => {

        console.log(
          '========================================'
        );

        console.log(
          'RAZORPAY SUCCESS HANDLER CALLED'
        );

        console.log(
          '========================================'
        );

        console.log(
          'Complete Razorpay response:',
          response
        );


        this.ngZone.run(() => {

          // Mark successful callback
          this.paymentSucceeded = true;


          // =================================================
          // VALIDATE RESPONSE
          // =================================================

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

            this.paymentProcessing = false;

            this.paymentSucceeded = false;

            alert(
              'Invalid payment response received.'
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


          // =================================================
          // CLOSE RAZORPAY
          // =================================================

          try {

            if (this.razorpayInstance) {

              console.log(
                'Closing Razorpay checkout...'
              );

              this.razorpayInstance.close();

            }

          } catch (error) {

            console.warn(
              'Razorpay close error:',
              error
            );

          }


          this.razorpayInstance = null;


          // =================================================
          // PAYMENT DATA
          // =================================================

          const paymentData = {

            razorpayOrderId:
              response.razorpay_order_id,

            razorpayPaymentId:
              response.razorpay_payment_id,

            razorpaySignature:
              response.razorpay_signature

          };


          console.log(
            'Sending payment for verification:',
            paymentData
          );


          // Show processing screen
          this.paymentProcessing = true;


          // =================================================
          // VERIFY PAYMENT
          // =================================================

          this.verifyPayment(
            paymentData
          );

        });

      },


      // =====================================================
      // MODAL
      // =====================================================

      modal: {

        // Do not allow backdrop click to accidentally
        // close the checkout
        backdropclose: false,

        // User must confirm before closing
        confirm_close: true,

        // Escape key should not close during payment
        escape: false,


        ondismiss: () => {

          console.log(
            '========================================'
          );

          console.log(
            'RAZORPAY MODAL DISMISSED'
          );

          console.log(
            '========================================'
          );


          this.ngZone.run(() => {

            /*
             * If payment was already successful,
             * don't reset the payment state.
             */

            if (!this.paymentSucceeded) {

              this.paymentProcessing = false;

            }


            this.razorpayInstance = null;

          });

        }

      }

    };


    // =======================================================
    // CREATE RAZORPAY INSTANCE
    // =======================================================

    try {

      console.log(
        'Creating Razorpay instance...'
      );


      this.razorpayInstance =
        new Razorpay(options);


      console.log(
        'Razorpay instance created:',
        this.razorpayInstance
      );


      // =====================================================
      // PAYMENT FAILED EVENT
      // =====================================================

      this.razorpayInstance.on(
        'payment.failed',
        (error: any) => {

          console.log(
            '========================================'
          );

          console.log(
            'RAZORPAY PAYMENT FAILED'
          );

          console.log(
            '========================================'
          );

          console.error(
            'Payment failure response:',
            error
          );


          this.ngZone.run(() => {

            this.paymentProcessing = false;

            this.paymentVerified = false;

            this.paymentSucceeded = false;


            try {

              if (this.razorpayInstance) {

                this.razorpayInstance.close();

              }

            } catch (e) {

              console.warn(
                'Unable to close Razorpay:',
                e
              );

            }


            this.razorpayInstance = null;


            alert(
              'Payment failed. Please try again.'
            );

          });

        }

      );


      // =====================================================
      // OPEN CHECKOUT
      // =====================================================

      console.log(
        'Calling Razorpay.open()'
      );


      this.razorpayInstance.open();


      console.log(
        'Razorpay checkout opened'
      );

    } catch (error) {

      console.error(
        'Razorpay open error:',
        error
      );

      this.paymentProcessing = false;

      this.razorpayInstance = null;

      alert(
        'Unable to open Razorpay payment window.'
      );

    }

  }


  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  verifyPayment(
    paymentData: any
  ): void {

    console.log(
      '========================================'
    );

    console.log(
      'VERIFYING PAYMENT'
    );

    console.log(
      '========================================'
    );


    console.log(
      'Payment data:',
      paymentData
    );


    this.paymentService
      .verifyPayment(paymentData)
      .subscribe({

        // ===================================================
        // SUCCESS
        // ===================================================

        next: (result: any) => {

          console.log(
            'Verification API response:',
            result
          );


          const status =
            result?.status
              ?.toString()
              .toUpperCase();


          const isSuccess =
            status === 'SUCCESS' ||
            result?.status === true ||
            result?.success === true;


          // =================================================
          // VERIFIED
          // =================================================

          if (isSuccess) {

            console.log(
              '========================================'
            );

            console.log(
              'PAYMENT VERIFIED SUCCESSFULLY'
            );

            console.log(
              '========================================'
            );


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


            // Hide processing
            this.paymentProcessing = false;


            // Show success screen
            this.paymentVerified = true;


            // Keep successful state
            this.paymentSucceeded = true;


            console.log(
              'Payment success screen displayed'
            );

          }


          // =================================================
          // VERIFICATION FAILED
          // =================================================

          else {

            console.error(
              'Payment verification failed:',
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


        // ===================================================
        // API ERROR
        // ===================================================

        error: (error) => {

          console.error(
            'Payment verification API error:',
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