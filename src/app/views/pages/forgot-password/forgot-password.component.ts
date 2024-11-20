import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NzFormModule, NzGridModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzIconModule,
    NzTypographyModule, RouterLink, NzIconModule,],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  isLoading = false
  validateForm: FormGroup;
  constructor(private fb: FormBuilder, private authenService: AuthenticationService, private message: NzMessageService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoading = true
      console.log(this.validateForm.getRawValue().email)
      this.authenService.verifyEmailResetPassword(this.validateForm.getRawValue().email).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (value) => {
          this.router.navigate(['/send-success'])
        },
        error: (err) => {
          this.message.create('error', err.error.message)
          this.isLoading = true
          console.log(err)
        }
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
