import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  template: `
  <div class="page-head"><div class="container"><h1>Checkout</h1><p>Complete your order</p></div></div>
  <div class="container">
    @if (!cart) { <div class="center">Your cart is empty. <a routerLink="/products" class="btn">Shop</a></div> } @else {
    <div class="layout">
      <form class="panel" [formGroup]="f" (ngSubmit)="submit()">
        <h3>Shipping Address</h3>
        <div class="form" style="margin:0;max-width:none">
          <label>Details</label><input formControlName="details" placeholder="Street, building, apartment">
          @if (f.get('details')?.touched && f.get('details')?.invalid) { <div class="err">Address details are required</div> }
          <label>Phone</label><input formControlName="phone" placeholder="01xxxxxxxxx">
          @if (f.get('phone')?.touched && f.get('phone')?.invalid) { <div class="err">Enter a valid Egyptian phone number</div> }
          <label>City</label><input formControlName="city" placeholder="Cairo">
          @if (f.get('city')?.touched && f.get('city')?.invalid) { <div class="err">City is required</div> }
          <label>Payment Method</label>
          <label style="font-weight:400"><input type="radio" formControlName="method" value="cash" style="width:auto"> Cash on Delivery</label>
          <label style="font-weight:400"><input type="radio" formControlName="method" value="online" style="width:auto"> Pay Online (Card)</label>
          <button class="btn" [disabled]="f.invalid || busy">{{ busy ? 'Processing...' : (f.value.method === 'cash' ? 'Place Order' : 'Pay Online') }}</button>
        </div>
      </form>
      <div class="panel" style="height:fit-content"><h3>Order Summary</h3>
        @for (i of cart.data.products; track i._id) { <div class="row"><span>{{ i.product.title.slice(0, 28) }} × {{ i.count }}</span><span>{{ i.price * i.count | currency:'EGP ':'symbol':'1.0-0' }}</span></div> }
        <hr><div class="row"><b>Total</b><b>{{ cart.data.totalCartPrice | currency:'EGP ':'symbol':'1.0-0' }}</b></div></div>
    </div>}
  </div>`,
})
export class CheckoutComponent implements OnInit {
  api = inject(ApiService); router = inject(Router); fb = inject(FormBuilder); cart: any; busy = false;
  f = this.fb.group({
    details: ['', Validators.required], phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', Validators.required], method: ['cash'],
  });
  ngOnInit() { this.api.getCart().subscribe({ next: (r: any) => this.cart = r.data?.products?.length ? r : null, error: () => this.cart = null }); }
  submit() {
    const { details, phone, city, method } = this.f.value; const addr = { details, phone, city };
    const id = this.cart.cartId || this.cart.data._id; this.busy = true;
    if (method === 'cash') {
      this.api.cashOrder(id, addr).subscribe({
        next: () => { this.api.cartCount.set(0); this.api.toast('Order placed successfully'); this.router.navigate(['/allorders']); },
        error: () => { this.busy = false; this.api.toast('Could not place order'); },
      });
    } else {
      this.api.onlineOrder(id, addr).subscribe({
        next: (r: any) => { location.href = r.session.url; },
        error: () => { this.busy = false; this.api.toast('Could not start payment'); },
      });
    }
  }
}
