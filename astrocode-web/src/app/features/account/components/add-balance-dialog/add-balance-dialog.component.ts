import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export type PaymentMethod = 'credit' | 'debit' | 'pix';

export interface AddBalanceDialogResult {
  amount: number;
  paymentMethod: PaymentMethod;
}

@Component({
  selector: 'app-add-balance-dialog',
  standalone: true,
  templateUrl: './add-balance-dialog.component.html',
  styleUrl: './add-balance-dialog.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AddBalanceDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddBalanceDialogComponent>);

  readonly minAmount = 10;
  readonly maxAmount = 10000;

  readonly form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(this.minAmount), Validators.max(this.maxAmount)]],
    paymentMethod: ['credit' as PaymentMethod, [Validators.required]],
    cardNumber: [''],
    cardHolder: [''],
    cardExpiry: [''],
    cardCvv: [''],
  });

  constructor() {
    this.applyCardValidators('credit');
  }

  isMethodSelected(method: PaymentMethod): boolean {
    return this.form.controls.paymentMethod.value === method;
  }

  setPaymentMethod(method: PaymentMethod): void {
    this.form.controls.paymentMethod.setValue(method);
    this.applyCardValidators(method);
  }

  get requiresCardData(): boolean {
    const method = this.form.controls.paymentMethod.value;
    return method === 'credit' || method === 'debit';
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const amount = Number(this.form.controls.amount.value ?? 0);
    const paymentMethod = this.form.controls.paymentMethod.value as PaymentMethod;
    this.dialogRef.close({ amount, paymentMethod });
  }

  private applyCardValidators(method: PaymentMethod): void {
    const cardValidators =
      method === 'credit' || method === 'debit'
        ? [Validators.required, Validators.minLength(3)]
        : [];

    this.form.controls.cardNumber.setValidators(cardValidators);
    this.form.controls.cardHolder.setValidators(cardValidators);
    this.form.controls.cardExpiry.setValidators(cardValidators);
    this.form.controls.cardCvv.setValidators(cardValidators);

    this.form.controls.cardNumber.updateValueAndValidity();
    this.form.controls.cardHolder.updateValueAndValidity();
    this.form.controls.cardExpiry.updateValueAndValidity();
    this.form.controls.cardCvv.updateValueAndValidity();
  }
}
