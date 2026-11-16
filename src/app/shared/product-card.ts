import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
  <div class="card">
    <a [routerLink]="['/products', p.id]" class="imgwrap"><img [src]="p.imageCover" [alt]="p.title" loading="lazy"></a>
    <button class="heart" [class.on]="api.wishIds().includes(p.id)" (click)="api.toggleWish(p.id)" title="Wishlist">♥</button>
    <button class="heart h2" title="Compare">⇄</button>
    <a class="heart h3" [routerLink]="['/products', p.id]" title="Quick view">👁</a>
    <div class="body">
      <small class="muted">{{ p.category?.name }}</small>
      <a [routerLink]="['/products', p.id]"><h3>{{ p.title }}</h3></a>
      <div class="rate">★ {{ p.ratingsAverage }} <span class="muted">({{ p.ratingsQuantity }})</span></div>
      <div class="row">
        <b>{{ p.price | currency:'EGP ':'symbol':'1.0-0' }}</b>
        <button class="btn sm" (click)="api.addToCart(p.id)">+ Add</button>
      </div>
    </div>
  </div>`,
})
export class ProductCardComponent {
  @Input() p: any;
  constructor(public api: ApiService) {}
}
