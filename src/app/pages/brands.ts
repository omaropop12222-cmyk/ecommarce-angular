import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [RouterLink],
  template: `
  <div class="page-head"><div class="container"><div class="crumb"><a routerLink="/">Home</a> / Brands</div><h1>Top Brands</h1><p>Shop from your favorite brands</p></div></div>
  <div class="container">
    @if (!brands.length) { <div class="center">Loading brands...</div> }
    <div class="grid sm">@for (b of brands; track b._id) { <a class="tile" [routerLink]="['/brands', b._id]"><img [src]="b.image" [alt]="b.name"><b>{{ b.name }}</b></a> }</div>
  </div>`,
})
export class BrandsComponent implements OnInit {
  api = inject(ApiService); brands: any[] = [];
  ngOnInit() { this.api.brands().subscribe((r: any) => this.brands = r.data); }
}
