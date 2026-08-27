import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RazorPaymentServiceService {

  private baseUrl =
    'https://razor-pay-payment-application.onrender.com/razor-pay';


  constructor(private http: HttpClient) {
  }

  // createOrder(amount: number): Observable<any> {

  //   var mockOrder = {
  //     id: 'order_mock_' + new Date().getTime(),

  //     entity: 'order',

  //     amount: amount * 100,

  //     amount_paid: 0,

  //     amount_due: amount * 100,

  //     currency: 'INR',

  //     receipt: 'receipt_' + new Date().getTime(),

  //     status: 'created',

  //     key: 'rzp_test_YOUR_KEY'
  //   };

  //   console.log('Mock Razorpay Order:', mockOrder);

  //   return of(mockOrder);
  // }


   createOrder(
    amount: number
  ): Observable<any> {

 console.log("Hi i am in");
    const request = {

      amount: amount,

      currency: 'INR'

    };


    return this.http.post(

      this.baseUrl +
      '/create-order',

      request

    );

  }


  verifyPayment(
    paymentData: any
  ): Observable<any> {


    return this.http.post(

      this.baseUrl +
      '/verify',

      paymentData

    );

  }

  // verifyPayment(response: any): Observable<any> {

  //   console.log('Mock payment verification:', response);

  //   var result = {
  //     success: true,
  //     message: 'Payment verification successful',
  //     paymentId: response.razorpay_payment_id,
  //     orderId: response.razorpay_order_id,
  //     signature: response.razorpay_signature
  //   };

  //   return of(result);
  // }

}