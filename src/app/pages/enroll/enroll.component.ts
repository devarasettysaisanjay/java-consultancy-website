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
    return this.getCourseFee() * 0.18;
  }

  getTotalAmount(): number {
    return Math.round((this.getCourseFee() + this.getGst()) * 100) / 100;
  }

  getTotalAmountInPaise(): number {
    return Math.round(this.getTotalAmount() * 100);
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
        // 1. Force close the modal immediately on success before verification starts
        this.closeRazorpay();

        // 2. Wrap state transitions in NgZone to trigger UI change detection
        this.ngZone.run(() => {
          if (!response?.razorpay_payment_id || !response?.razorpay_order_id || !response?.razorpay_signature) {
            this.paymentProcessing = false;
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
            if (!this.paymentVerified) {
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
        this.ngZone.run(() => {
          this.paymentProcessing = false;
          this.paymentVerified = false;
          this.razorpayInstance = null;
          alert('Payment failed. Please try again.');
        });
      });

      this.razorpayInstance.open();
    } catch (error) {
      console.error('Razorpay open error:', error);
      this.paymentProcessing = false;
      this.razorpayInstance = null;
      alert('Unable to open Razorpay payment window.');
    }
  }

  closeRazorpay(): void {
    if (this.razorpayInstance) {
      try {
        this.razorpayInstance.close();
      } catch (error) {
        console.warn('Razorpay popup close handling:', error);
      } finally {
        this.razorpayInstance = null;
      }
    }
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
          alert('Payment could not be verified. Please contact support.');
        }
      },
      error: (error) => {
        console.error('Payment verification API error:', error);
        this.paymentProcessing = false;
        this.paymentVerified = false;
        alert('Payment verification failed. Please contact support.');
      }
    });
  }
}