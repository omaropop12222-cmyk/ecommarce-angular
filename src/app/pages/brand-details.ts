import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { ProductCardComponent } from '../shared/product-card';

@Component({
  standalone: true, imports: [RouterLink, ProductCardComponent],
  template: `
  <div class="page-head"><div class="container"><div class="crumb"><a routerLink="/">Home</a> / <a routerLink="/brands">Brands</a> / {{ brand?.name }}</div><h1>{{ brand?.name }}</h1></div></div>
  <div class="container">
    @if (brand) { <div class="panel row" style="justify-content:flex-start;margin-bottom:20px"><img [src]="brand.image" width="110" [alt]="brand.name"><h2>{{ brand.name }}</h2></div> }
    @if (loading) { <div class="center">Loading...</div> } @else if (!products.length) { <div class="center">No products for this brand</div> }
    <div class="grid">@for (p of products; track p.id) { <app-product-card [p]="p" /> }</div>
  </div>`,
})
export class BrandDetailsComponent implements OnInit {
  api = inject(ApiService); route = inject(ActivatedRoute); brand: any; products: any[] = []; loading = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.brand(id).subscribe((r: any) => this.brand = r.data);
    this.api.products({ brand: id, limit: 40 }).subscribe((r: any) => { this.products = r.data; this.loading = false; });
  }
}
