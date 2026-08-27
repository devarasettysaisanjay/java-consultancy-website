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
//     private router: Router,  private paymentService :RazorPaymentServiceService
//   ) {}

//   ngOnInit(): void {

//     console.log("hello i am their");
//     const slug =
//       this.route.snapshot.paramMap.get('slug');

//     this.course = COURSES.find(
//       c => c.slug === slug
//     )!;

//   }
// proceedToPayment(): void {
// var Razorpay: any;
//     const amount = 5000; // Example: ₹5,000

//     this.paymentService.createOrder(amount)
//       .subscribe(
//         (order: any) => {

//           this.openRazorpay(order);

//         },
//         (error) => {

//           console.error(error);

//           alert('Unable to start payment');

//         }
//       );
//   }


//   openRazorpay(order: any): void {
//     var Razorpay: any;

//     const options = {

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


//         // Send payment details to Spring Boot
//         this.verifyPayment(response);
//       },


//       prefill: {

//         name: 'Student Name',

//         email: 'student@gmail.com',

//         contact: '9876543210'

//       },


//       theme: {

//         color: '#2563eb'

//       }

//     };

//     const razorpay = new Razorpay(options);

//     razorpay.open();
//   }


//   verifyPayment(response: any): void {

//     this.paymentService.verifyPayment(response)
//       .subscribe(
//         (result: any) => {

//           alert('Payment successful!');

//           console.log(result);

//         },
//         (error) => {

//           console.error(error);

//           alert('Payment verification failed');

//         }
//       );
//   }



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
  }


  proceedToPayment(): void {

    var amount = 5000;

    console.log('Creating Razorpay order...');

    this.paymentService.createOrder(amount)
      .subscribe(
        (order: any) => {

          console.log('Order created:', order);

          this.openRazorpay(order);

        },
        (error) => {

          console.error('Create order error:', error);

          alert('Unable to start payment');

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

      currency: 'INR',

      name: 'JavaBridge Consultancy',

      description: 'Course Payment',

      order_id: order.id,


      handler: (response: any) => {

        console.log('Payment successful');

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


        this.verifyPayment(response);

      },


      prefill: {

        name: this.student.fullName,

        email: this.student.email,

        contact: this.student.mobile

      },


      notes: {

        course: this.course ? this.course.title : '',

        studentName: this.student.fullName

      },


      theme: {

        color: '#2563eb'

      },


      modal: {

        ondismiss: () => {

          console.log(
            'Razorpay payment window closed'
          );

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
      'Sending payment details to backend...'
    );

    this.paymentService.verifyPayment(response)
      .subscribe(

        (result: any) => {

          console.log(
            'Payment verification response:',
            result
          );

          alert(
            'Payment successful!'
          );

        },

        (error) => {

          console.error(
            'Payment verification failed:',
            error
          );

          alert(
            'Payment verification failed'
          );

        }

      );

  }

  
}
