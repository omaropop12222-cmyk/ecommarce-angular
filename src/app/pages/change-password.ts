import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [ReactiveFormsModule],
  template: `
  <form class="form panel" [formGroup]="f" (ngSubmit)="submit()">
    <h1>Change Password</h1>
    @if (error) { <div class="alert">{{ error }}</div> }
    <label>Current Password</label><input type="password" formControlName="currentPassword">
    <label>New Password</label><input type="password" formControlName="password">
    @if (f.get('password')?.touched && f.get('password')?.invalid) { <div class="err">At least 6 characters</div> }
    <label>Confirm New Password</label><input type="password" formControlName="rePassword">
    @if (f.get('rePassword')?.touched && f.value.password !== f.value.rePassword) { <div class="err">Passwords do not match</div> }
    <button class="btn" [disabled]="f.invalid || f.value.password !== f.value.rePassword || busy">{{ busy ? 'Updating...' : 'Update Password' }}</button>
  </form>`,
})
export class ChangePasswordComponent {
  api = inject(ApiService); fb = inject(FormBuilder); error = ''; busy = false;
  f = this.fb.group({ currentPassword: ['', Validators.required], password: ['', [Validators.required, Validators.minLength(6)]], rePassword: ['', Validators.required] });
  submit() {
    this.busy = true; this.error = '';
    this.api.changePassword(this.f.value).subscribe({
      next: (r: any) => { if (r.token) this.api.setToken(r.token); this.busy = false; this.f.reset(); this.api.toast('Password changed successfully'); },
      error: e => { this.busy = false; this.error = e.error?.errors?.msg || e.error?.message || 'Failed to change password'; },
    });
  }
}
