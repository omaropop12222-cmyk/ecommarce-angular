import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [ReactiveFormsModule, RouterLink],
  template: `
  <form class="form panel" [formGroup]="f" (ngSubmit)="submit()">
    <h1>Create Account</h1><p class="muted">Join FreshCart today</p>
    @if (error) { <div class="alert">{{ error }}</div> }
    <label>Name</label><input formControlName="name" placeholder="Your name">
    @if (f.get('name')?.touched && f.get('name')?.invalid) { <div class="err">Name must be at least 3 characters</div> }
    <label>Email</label><input type="email" formControlName="email">
    @if (f.get('email')?.touched && f.get('email')?.invalid) { <div class="err">Enter a valid email</div> }
    <label>Phone</label><input formControlName="phone" placeholder="01xxxxxxxxx">
    @if (f.get('phone')?.touched && f.get('phone')?.invalid) { <div class="err">Enter a valid Egyptian phone number</div> }
    <label>Password</label><input type="password" formControlName="password">
    @if (f.get('password')?.touched && f.get('password')?.invalid) { <div class="err">Min 6 chars, starting with a capital letter</div> }
    <label>Confirm Password</label><input type="password" formControlName="rePassword">
    @if (f.get('rePassword')?.touched && f.hasError('mismatch')) { <div class="err">Passwords do not match</div> }
    <button class="btn" [disabled]="f.invalid || busy">{{ busy ? 'Creating...' : 'Create Account' }}</button>
    <p class="muted" style="text-align:center">Already a member? <a routerLink="/login" style="color:var(--g)">Sign in</a></p>
  </form>`,
})
export class RegisterComponent {
  api = inject(ApiService); router = inject(Router); fb = inject(FormBuilder); error = ''; busy = false;
  f = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9@#$%!_-]{5,}$/)]],
    rePassword: ['', Validators.required],
  }, { validators: (g: AbstractControl) => g.get('password')?.value === g.get('rePassword')?.value ? null : { mismatch: true } });
  submit() {
    this.busy = true; this.error = '';
    this.api.signup(this.f.value).subscribe({
      next: () => { this.api.toast('Account created, please sign in'); this.router.navigate(['/login']); },
      error: e => { this.busy = false; this.error = e.error?.message || 'Registration failed'; },
    });
  }
}
