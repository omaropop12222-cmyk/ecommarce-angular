import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [RouterLink, CurrencyPipe],
  template: `
  <div class="page-head"><div class="container"><h1>Shopping Cart</h1><p>{{ cart?.numOfCartItems || 0 }} items</p></div></div>
  <div class="container">
    @if (loading) { <div class="center">Loading cart...</div> }
    @else if (!items.length) { <div class="center"><h2>Your cart is empty</h2><a routerLink="/products" class="btn">Continue Shopping</a></div> }
    @else {
    <div class="layout">
      <div class="panel">
        @for (i of items; track i._id) {
        <div class="cartrow">
          <img [src]="i.product.imageCover" [alt]="i.product.title">
          <div style="flex:1"><a [routerLink]="['/products', i.product.id]"><b>{{ i.product.title }}</b></a>
            <div class="muted">{{ i.price | currency:'EGP ':'symbol':'1.0-0' }}</div>
            <a class="link" style="color:#ef4444;font-size:13px" (click)="remove(i.product.id)">🗑 Remove</a></div>
          <div class="qty"><button (click)="update(i.product.id, i.count - 1)" [disabled]="i.count <= 1">−</button><b>{{ i.count }}</b><button (click)="update(i.product.id, i.count + 1)">+</button></div>
          <b>{{ i.price * i.count | currency:'EGP ':'symbol':'1.0-0' }}</b>
        </div>}
        <button class="btn red sm" style="margin-top:16px" (click)="clear()">Clear Cart</button>
      </div>
      <div class="panel" style="height:fit-content"><h3>Order Summary</h3>
        <div class="row"><span>Subtotal</span><b>{{ cart.data.totalCartPrice | currency:'EGP ':'symbol':'1.0-0' }}</b></div>
        <div class="row"><span>Shipping</span><span style="color:var(--g)">Free</span></div><hr>
        <div class="row"><b>Total</b><b>{{ cart.data.totalCartPrice | currency:'EGP ':'symbol':'1.0-0' }}</b></div>
        <a routerLink="/checkout" class="btn" style="display:block;margin-top:16px">Proceed to Checkout</a></div>
    </div>}
  </div>`,
})
export class CartComponent implements OnInit {
  api = inject(ApiService); cart: any; loading = true;
  get items() { return this.cart?.data?.products || []; }
  ngOnInit() { this.load(); }
  load() { this.api.getCart().subscribe({ next: (r: any) => { this.cart = r; this.api.cartCount.set(r.numOfCartItems); this.loading = false; }, error: () => { this.cart = null; this.api.cartCount.set(0); this.loading = false; } }); }
  update(id: string, count: number) { this.api.updateCart(id, count).subscribe((r: any) => { this.cart = r; }); }
  remove(id: string) { this.api.removeFromCart(id).subscribe((r: any) => { this.cart = r; this.api.cartCount.set(r.numOfCartItems); this.api.toast('Item removed'); }); }
  clear() { this.api.clearCart().subscribe(() => { this.cart = null; this.api.cartCount.set(0); this.api.toast('Cart cleared'); }); }
}
