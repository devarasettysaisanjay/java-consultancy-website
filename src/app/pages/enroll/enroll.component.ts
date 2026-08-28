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
// course!: Course;
 



//   student = {
//     fullName: '',
//     email: '',
//     mobile: '',
//     experience: '',
//     currentStatus: '',
//     howFoundUs: '',
//     message: ''
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private paymentService: RazorPaymentServiceService
//   ) {}

//   ngOnInit(): void {

//     console.log('Enroll page loaded');

//     var slug = this.route.snapshot.paramMap.get('slug');

//        this.course = COURSES.find(
//       c => c.slug === slug
//      )!;

//     console.log('Course:', this.course);
//   }


//   proceedToPayment(): void {

   

//     console.log('Creating Razorpay order...');

//     this.paymentService.createOrder(this.course.fee)
//       .subscribe(
//         (order: any) => {

//           console.log('Order created:', order);

//           this.openRazorpay(order);

//         },
//         (error) => {

//           console.error('Create order error:', error);

//           alert('Unable to start payment');

//         }
//       );
//   }


//   openRazorpay(order: any): void {

//     console.log('Opening Razorpay...');
//     console.log('Order:', order);

//     var Razorpay = (window as any).Razorpay;

//     if (!Razorpay) {

//       alert(
//         'Razorpay SDK is not loaded. Please check index.html.'
//       );

//       console.error(
//         'Razorpay SDK not found'
//       );

//       return;
//     }


//     var options = {

//       key: order.key,

//       amount: order.amount,

//       currency: 'INR',

//       name: 'JavaBridge Consultancy',

//       description: 'Course Payment',

//       order_id: order.id,


//       handler: (response: any) => {

//         console.log('Payment successful');

//         console.log(
//           'Payment ID:',
//           response.razorpay_payment_id
//         );

//         console.log(
//           'Order ID:',
//           response.razorpay_order_id
//         );

//         console.log(
//           'Signature:',
//           response.razorpay_signature
//         );


//         this.verifyPayment(response);

//       },


//       prefill: {

//         name: this.student.fullName,

//         email: this.student.email,

//         contact: this.student.mobile

//       },


//       notes: {

//         course: this.course ? this.course.title : '',

//         studentName: this.student.fullName

//       },


//       theme: {

//         color: '#2563eb'

//       },


//       modal: {

//         ondismiss: () => {

//           console.log(
//             'Razorpay payment window closed'
//           );

//         }

//       }

//     };


//     try {

//       var razorpay = new Razorpay(options);

      

//       razorpay.open();

//     } catch (error) {

//       console.error(
//         'Razorpay open error:',
//         error
//       );

//       alert(
//         'Unable to open Razorpay payment window'
//       );

//     }

//   }


//   verifyPayment(response: any): void {

//     console.log(
//       'Sending payment details to backend...'
//     );

//     this.paymentService.verifyPayment(response)
//       .subscribe(

//         (result: any) => {

//           console.log(
//             'Payment verification response:',
//             result
//           );

//           alert(
//             'Payment successful!'
//           );

//         },

//         (error) => {

//           console.error(
//             'Payment verification failed:',
//             error
//           );

//           alert(
//             'Payment verification failed'
//           );

//         }

//       );

//   }


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

    console.log('Course fee:', this.course.fee);
  }


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


  proceedToPayment(): void {

    if (!this.course) {
      alert('Course details not found');
      return;
    }

    if (!this.student.fullName ||
        !this.student.email ||
        !this.student.mobile) {

      alert('Please fill all required student details');
      return;
    }

    if (this.paymentProcessing) {
      return;
    }

    console.log('Course fee in rupees:', this.course.fee);

    this.paymentProcessing = true;

    this.paymentService
      .createOrder(this.course.fee)
      .subscribe(

        (order: any) => {

          console.log('Order created successfully:', order);

          this.paymentProcessing = false;

          if (!order) {
            alert('Invalid order response from server');
            return;
          }

          if (!order.id) {
            console.error('Order ID missing:', order);
            alert('Razorpay order ID is missing');
            return;
          }

          if (!order.amount) {
            console.error('Order amount missing:', order);
            alert('Razorpay order amount is missing');
            return;
          }

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


  openRazorpay(order: any): void {

    console.log('Opening Razorpay...');
    console.log('Order:', order);

    var Razorpay = (window as any).Razorpay;

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

      currency: order.currency || 'INR',

      name: 'JavaBridge Consultancy',

      description:
        this.course.title + ' Course Payment',

      order_id: order.id,

      prefill: {

        name: this.student.fullName,

        email: this.student.email,

        contact: this.student.mobile

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

         var paymentData = {

    razorpayOrderId:
      response.razorpay_payment_id,

    razorpayPaymentId:
      response.razorpay_order_id,

    razorpaySignature:
      response.razorpay_signature

  };

        this.verifyPayment(paymentData);
      },

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

      var razorpay = new Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.error(
        'Razorpay open error:',
        error
      );

      alert(
        'Unable to open Razorpay payment window'
      );

    }
  }


  verifyPayment(response: any): void {

    console.log(
      'Verifying payment with backend...'
    );

    this.paymentProcessing = true;

    this.paymentService
      .verifyPayment(response)
      .subscribe(

        (result: any) => {

          console.log(
            'Payment verification response:',
            result
          );

          this.paymentProcessing = false;

          this.paymentVerified = true;

          alert(
            'Payment successful! Your enrollment is confirmed.'
          );

          /*
           * Navigate to success page.
           *
           * Change this route if your project
           * uses a different success page.
           */

          this.router.navigate([
            '/'
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
