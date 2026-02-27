import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cancel-booking-reason-dialog',
  standalone: true,
  templateUrl: './cancel-booking-reason-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class CancelBookingReasonDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CancelBookingReasonDialogComponent>);

  readonly form = this.fb.group({
    reason: ['', [Validators.required, Validators.minLength(3)]],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const reason = this.form.controls.reason.value?.trim() ?? '';
    this.dialogRef.close(reason);
  }
}
