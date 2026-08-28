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

  paymentProcessing = false;
  paymentVerified = false;
  paymentSucceeded = false; // NEW: guards against ondismiss racing with a successful handler

  paymentDetails: PaymentDetails | null = null;
  razorpayInstance: any = null;

  // NEW: remembers the body's overflow style before we touch it, so we restore it correctly
  private previousBodyOverflow: string | null = null;

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

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const foundCourse = COURSES.find(c => c.slug === slug);

    if (!foundCourse) {
      alert('Course not found');
      this.router.navigate(['/courses']);
      return;
    }

    this.course = foundCourse;
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }

  getCourseFee(): number {
    return this.course?.fee || 0;
  }

  getGst(): number {
    return Math.round(this.getCourseFee() * 0.18 * 100) / 100;
  }

  getTotalAmount(): number {
    return Math.round((this.getCourseFee() + this.getGst()) * 100) / 100;
  }

  getTotalAmountInPaise(): number {
    // Compute directly from fee + GST in whole paise to avoid double-rounding drift
    const feePaise = Math.round(this.getCourseFee() * 100);
    const gstPaise = Math.round(this.getGst() * 100);
    return feePaise + gstPaise;
  }

  proceedToPayment(): void {
    if (!this.course) {
      alert('Course details not found');
      return;
    }

    if (!this.student.fullName || !this.student.email || !this.student.mobile) {
      alert('Please fill all required student details');
      return;
    }

    if (this.paymentProcessing) return;

    // Reset state for a fresh attempt
    this.paymentSucceeded = false;
    this.paymentVerified = false;

    const razorpayAmount = this.getTotalAmountInPaise();
    this.paymentProcessing = true;

    this.paymentService.createOrder(razorpayAmount).subscribe({
      next: (order: any) => {
        if (!order || !order.id || !order.amount) {
          this.paymentProcessing = false;
          alert('Invalid order response from server');
          return;
        }

        this.paymentProcessing = false;
        this.openRazorpay(order);
      },
      error: (error) => {
        console.error('Create order error:', error);
        this.paymentProcessing = false;
        alert('Unable to create payment order. Please try again.');
      }
    });
  }

  openRazorpay(order: any): void {
    const Razorpay = (window as any).Razorpay;

    if (!Razorpay) {
      alert('Razorpay SDK is not loaded. Please check index.html.');
      return;
    }

    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'JavaBridge Consultancy',
      description: `${this.course.title} Course Payment`,
      order_id: order.id,
      prefill: {
        name: this.student.fullName,
        email: this.student.email,
        contact: this.student.mobile
      },
      notes: {
        course: this.course.title,
        studentName: this.student.fullName,
        studentEmail: this.student.email,
        studentMobile: this.student.mobile
      },
      theme: {
        color: '#2563eb'
      },
      handler: (response: any) => {
          console.log('RAZORPAY SUCCESS HANDLER CALLED');
          console.log('Payment response:', response);
        // Mark success FIRST so a late-firing ondismiss doesn't reset paymentProcessing
        this.paymentSucceeded = true;

        // 1. Force cleanup of Razorpay elements from the DOM immediately
        this.forceCloseRazorpayDOM();

        // 2. Trigger Angular Zone change detection for state updates
        this.ngZone.run(() => {
          if (!response?.razorpay_payment_id || !response?.razorpay_order_id || !response?.razorpay_signature) {
            this.paymentProcessing = false;
            this.paymentSucceeded = false;
            alert('Invalid payment response received.');
            return;
          }

          const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          };

          this.paymentProcessing = true;
          this.verifyPayment(paymentData);
        });
      },
      modal: {
        ondismiss: () => {
          this.ngZone.run(() => {
            // Only reset processing state if this dismiss was NOT triggered
            // by a successful payment already being verified
            if (!this.paymentSucceeded) {
              this.paymentProcessing = false;
            }
            this.razorpayInstance = null;
          });
        }
      }
    };

    try {
      this.razorpayInstance = new Razorpay(options);

      this.razorpayInstance.on('payment.failed', (error: any) => {
        console.error('Payment failed:', error);
        this.forceCloseRazorpayDOM();
        this.ngZone.run(() => {
          this.paymentProcessing = false;
          this.paymentVerified = false;
          this.paymentSucceeded = false;
          this.razorpayInstance = null;
          alert('Payment failed. Please try again.');
        });
      });

      // Capture current overflow before Razorpay potentially changes it
      this.previousBodyOverflow = document.body.style.overflow || '';

      this.razorpayInstance.open();
    } catch (error) {
      console.error('Razorpay open error:', error);
      this.paymentProcessing = false;
      this.razorpayInstance = null;
      alert('Unable to open Razorpay payment window.');
    }
  }

  // Fail-safe helper to close SDK and clean lingering DOM nodes
  private forceCloseRazorpayDOM(): void {
    try {
      if (this.razorpayInstance) {
        this.razorpayInstance.close();
      }
    } catch (e) {
      // Ignore native close errors
    } finally {
      this.razorpayInstance = null;
    }

    // Force purge stuck Razorpay nodes and restore scrolling
    setTimeout(() => {
      const razorpayElements = document.querySelectorAll(
        '.razorpay-container, .razorpay-backdrop, iframe[src*="razorpay"]'
      );
      razorpayElements.forEach(el => el.remove());

      // Restore whatever overflow value was present before we opened the modal
      document.body.style.overflow = this.previousBodyOverflow ?? '';
    }, 150); // bumped from 50ms -> 150ms for slower devices/animations
  }

  verifyPayment(paymentData: any): void {
    this.paymentService.verifyPayment(paymentData).subscribe({
      next: (result: any) => {
        const isSuccess =
          result?.status?.toString().toUpperCase() === 'SUCCESS' ||
          result?.status === true ||
          result?.success === true;

        if (isSuccess) {
          this.paymentDetails = {
            paymentId: paymentData.razorpayPaymentId,
            orderId: paymentData.razorpayOrderId,
            amount: this.getTotalAmount(),
            course: this.course.title,
            studentName: this.student.fullName,
            studentEmail: this.student.email,
            studentMobile: this.student.mobile
          };

          this.paymentProcessing = false;
          this.paymentVerified = true;
        } else {
          console.error('Verification failed payload:', result);
          this.paymentProcessing = false;
          this.paymentVerified = false;
          this.paymentSucceeded = false;
          alert('Payment could not be verified. Please contact support.');
        }
      },
      error: (error) => {
        console.error('Payment verification API error:', error);
        this.paymentProcessing = false;
        this.paymentVerified = false;
        this.paymentSucceeded = false;
        alert('Payment verification failed. Please contact support.');
      }
    });
  }
}