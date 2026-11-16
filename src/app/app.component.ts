import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from './shared/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="topbar"><div class="container row">
    <span>🚚 Free Shipping on Orders 500 EGP &nbsp;•&nbsp; New Arrivals Daily</span>
    <span class="hide-sm">+1 (800) 123-4567 &nbsp;•&nbsp; support&#64;freshcart.com</span>
    <span>
      @if (!api.token()) { <a routerLink="/login">Sign In</a> &nbsp;|&nbsp; <a routerLink="/register">Sign Up</a> }
      @else { <a routerLink="/allorders">My Orders</a> &nbsp;|&nbsp; <a routerLink="/change-password">Change Password</a> &nbsp;|&nbsp; <a (click)="api.logout()" class="link">Sign Out</a> }
    </span>
  </div></div>

  <header class="nav"><div class="container row">
    <a routerLink="/" class="logo">🛒 Fresh<span>Cart</span></a>
    <form class="search" (submit)="search($event, q.value)"><input #q placeholder="Search products..."><button>🔍</button></form>
    <button class="burger" (click)="menu = !menu">☰</button>
    <nav class="links" [class.open]="menu" (click)="menu = false">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
      <a routerLink="/products" routerLinkActive="active">Shop</a>
      <a routerLink="/categories" routerLinkActive="active">Categories</a>
      <a routerLink="/brands" routerLinkActive="active">Brands</a>
    </nav>
    <div class="icons">
      <a routerLink="/wishlist" title="Wishlist">♥ <em>{{ api.wishIds().length }}</em></a>
      <a routerLink="/cart" title="Cart">🛍 <em>{{ api.cartCount() }}</em></a>
      @if (!api.token()) { <a routerLink="/login" class="btn sm">Sign In</a> }
    </div>
  </div></header>

  <main><router-outlet /></main>

  <section class="features container">
    <div><b>Free Shipping</b><small>On orders over 500 EGP</small></div>
    <div><b>Easy Returns</b><small>14-day return policy</small></div>
    <div><b>Secure Payment</b><small>100% secure checkout</small></div>
    <div><b>24/7 Support</b><small>Contact us anytime</small></div>
  </section>

  <footer><div class="container foot">
    <div><div class="logo light">🛒 Fresh<span>Cart</span></div>
      <p>FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.</p>
      <p>+1 (800) 123-4567<br>support&#64;freshcart.com<br>123 Commerce Street, New York, NY 10001</p></div>
    <div><h4>Shop</h4><a routerLink="/products">All Products</a><a routerLink="/categories">Categories</a><a routerLink="/brands">Brands</a></div>
    <div><h4>Account</h4><a routerLink="/allorders">Order History</a><a routerLink="/wishlist">Wishlist</a><a routerLink="/cart">Shopping Cart</a><a routerLink="/login">Sign In</a><a routerLink="/register">Create Account</a></div>
  </div>
  <div class="container copy">© 2026 FreshCart. All rights reserved. &nbsp; Visa • Mastercard • PayPal</div></footer>

  @if (api.toastMsg()) { <div class="toast">{{ api.toastMsg() }}</div> }`,
})
export class AppComponent {
  menu = false;
  api = inject(ApiService);
  router = inject(Router);
  search(e: Event, kw: string) { e.preventDefault(); this.router.navigate(['/products'], { queryParams: { keyword: kw || null } }); }
}
