import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { ProductCardComponent } from '../shared/product-card';

@Component({
  standalone: true, imports: [RouterLink, ProductCardComponent],
  template: `
  <div class="page-head"><div class="container"><div class="crumb"><a routerLink="/">Home</a> / All Products</div>
    <h1>All Products</h1><p>Explore our complete product collection</p></div></div>
  <div class="container">
    @if (keyword) { <p>Results for "<b>{{ keyword }}</b>"</p> }
    @if (loading) { <div class="center">Loading products...</div> }
    @else if (!products.length) { <div class="center">No products found</div> }
    <div class="grid">@for (p of products; track p.id) { <app-product-card [p]="p" /> }</div>
    @if (pages > 1) { <div class="pager">@for (n of pageList; track n) { <button [class.on]="n === page" (click)="go(n)">{{ n }}</button> }</div> }
  </div>`,
})
export class ProductsComponent implements OnInit {
  api = inject(ApiService); route = inject(ActivatedRoute); router = inject(Router);
  products: any[] = []; loading = true; page = 1; pages = 1; keyword = ''; category = ''; brand = '';
  get pageList() { return Array.from({ length: this.pages }, (_, i) => i + 1); }
  ngOnInit() {
    this.route.queryParams.subscribe(q => {
      this.keyword = q['keyword'] || ''; this.category = q['category'] || ''; this.brand = q['brand'] || '';
      this.page = +q['page'] || 1; this.load();
    });
  }
  load() {
    this.loading = true;
    this.api.products({ limit: 12, page: this.page, 'category[in]': this.category, brand: this.brand }).subscribe({
      next: (r: any) => {
        let d = r.data as any[];
        if (this.keyword) d = d.filter(p => p.title.toLowerCase().includes(this.keyword.toLowerCase()));
        this.products = d; this.pages = r.metadata?.numberOfPages || 1; this.loading = false;
      },
      error: () => this.loading = false,
    });
  }
  go(n: number) { this.router.navigate([], { queryParams: { page: n }, queryParamsHandling: 'merge' }); }
}
