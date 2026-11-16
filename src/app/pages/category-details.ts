import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { ProductCardComponent } from '../shared/product-card';

@Component({
  standalone: true, imports: [RouterLink, ProductCardComponent],
  template: `
  <div class="page-head"><div class="container"><div class="crumb"><a routerLink="/">Home</a> / <a routerLink="/categories">Categories</a> / {{ cat?.name }}</div><h1>{{ cat?.name }}</h1></div></div>
  <div class="container">
    @if (subs.length) { <p><b>Subcategories:</b> @for (s of subs; track s._id) { <span class="chip">{{ s.name }}</span> }</p> }
    @if (loading) { <div class="center">Loading...</div> } @else if (!products.length) { <div class="center">No products in this category</div> }
    <div class="grid">@for (p of products; track p.id) { <app-product-card [p]="p" /> }</div>
  </div>`,
})
export class CategoryDetailsComponent implements OnInit {
  api = inject(ApiService); route = inject(ActivatedRoute); cat: any; subs: any[] = []; products: any[] = []; loading = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.category(id).subscribe((r: any) => this.cat = r.data);
    this.api.subcategories(id).subscribe((r: any) => this.subs = r.data);
    this.api.products({ 'category[in]': id, limit: 40 }).subscribe((r: any) => { this.products = r.data; this.loading = false; });
  }
}
