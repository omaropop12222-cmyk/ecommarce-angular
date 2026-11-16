import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../shared/api.service';
import { ProductCardComponent } from '../shared/product-card';

@Component({
  standalone: true, imports: [RouterLink, CurrencyPipe, ProductCardComponent],
  template: `
  <div class="container" style="padding-top:24px">
    @if (!p) { <div class="center">Loading...</div> } @else {
    <div class="crumb muted"><a routerLink="/">Home</a> / <a routerLink="/products">Shop</a> / {{ p.category?.name }}</div>
    <div class="two">
      <div><img class="main" [src]="img" [alt]="p.title">
        <div class="thumbs">@for (i of p.images; track i) { <img [src]="i" [class.on]="i === img" (click)="img = i"> }</div></div>
      <div>
        <a [routerLink]="['/categories', p.category?._id]" class="chip">{{ p.category?.name }}</a>
        @if (p.brand) { <a [routerLink]="['/brands', p.brand._id]" class="chip">{{ p.brand.name }}</a> }
        <h1>{{ p.title }}</h1>
        <div class="rate">★ {{ p.ratingsAverage }} <span class="muted">({{ p.ratingsQuantity }} reviews)</span></div>
        <h2 style="color:var(--g)">{{ p.price | currency:'EGP ':'symbol':'1.0-0' }}</h2>
        <p class="muted">{{ p.description }}</p>
        <p><b>Sold:</b> {{ p.sold }} &nbsp; <b>In stock:</b> {{ p.quantity }}</p>
        <div class="row" style="justify-content:flex-start">
          <button class="btn" (click)="api.addToCart(p.id)">Add to Cart</button>
          <button class="btn out" (click)="api.toggleWish(p.id)">{{ api.wishIds().includes(p.id) ? '♥ In Wishlist' : '♡ Wishlist' }}</button>
        </div>
      </div>
    </div>
    <h2 class="sec">Related Products</h2>
    <div class="grid">@for (r of related; track r.id) { <app-product-card [p]="r" /> }</div> }
  </div>`,
})
export class ProductDetailsComponent implements OnInit {
  api = inject(ApiService); route = inject(ActivatedRoute); p: any; img = ''; related: any[] = [];
  ngOnInit() {
    this.route.paramMap.subscribe(m => {
      this.p = null;
      this.api.product(m.get('id')!).subscribe((r: any) => {
        this.p = r.data; this.img = this.p.imageCover;
        this.api.products({ limit: 5, 'category[in]': this.p.category?._id }).subscribe((x: any) => this.related = x.data.filter((i: any) => i.id !== this.p.id).slice(0, 4));
      });
    });
  }
}
