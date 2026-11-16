import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { ProductCardComponent } from '../shared/product-card';

@Component({
  standalone: true, imports: [RouterLink, ProductCardComponent],
  template: `
  <div class="container">
    <section class="hero"><h1>Fresh Products Delivered to your Door</h1><p>Get 20% off your first order. Shop the best brands at competitive prices.</p>
      <a routerLink="/products" class="btn">Shop Now</a></section>
    <div class="row"><h2 class="sec">Shop By Category</h2><a routerLink="/categories" class="muted">View All →</a></div>
    <div class="grid sm">@for (c of cats; track c._id) { <a class="tile" [routerLink]="['/categories', c._id]"><img [src]="c.image" [alt]="c.name"><b>{{ c.name }}</b></a> }</div>
    <div class="row"><h2 class="sec">Featured Products</h2><a routerLink="/products" class="muted">View All →</a></div>
    @if (loading) { <div class="center">Loading products...</div> }
    <div class="grid">@for (p of products; track p.id) { <app-product-card [p]="p" /> }</div>
    <div class="row"><h2 class="sec">Top Brands</h2><a routerLink="/brands" class="muted">View All →</a></div>
    <div class="grid sm">@for (b of brands; track b._id) { <a class="tile" [routerLink]="['/brands', b._id]"><img [src]="b.image" [alt]="b.name"></a> }</div>
  </div>`,
})
export class HomeComponent implements OnInit {
  api = inject(ApiService); cats: any[] = []; brands: any[] = []; products: any[] = []; loading = true;
  ngOnInit() {
    this.api.categories().subscribe((r: any) => this.cats = r.data);
    this.api.brands().subscribe((r: any) => this.brands = r.data.slice(0, 6));
    this.api.products({ limit: 10 }).subscribe((r: any) => { this.products = r.data; this.loading = false; });
  }
}
