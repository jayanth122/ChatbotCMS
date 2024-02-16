import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  constructor(private location: Location, private authService: AuthService) {}
  private setPaymentUrl:  URL | undefined ;
  ngOnInit() {
    this.authService.createCheckoutSession().subscribe(
      (response: any) => {
        this.setPaymentUrl = response.url;
      },
      (error: any) => {
        console.error('Error creating checkout:', error);
      }
    );
  }

  checkoutSession() {
    if(this.setPaymentUrl) {
    window.open(this.setPaymentUrl, '_blank');
  }
  } 
  goBack() {
    this.location.back();
  }
}

