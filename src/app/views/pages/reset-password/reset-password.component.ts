import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NzGridModule, NzFormModule, ReactiveFormsModule, NzButtonModule, NzInputModule, NzIconModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  passwordVisible = false;
  password?: string;
  passwordOld?: string;
  passwordVisibleOld = false;
  isLoading: boolean = false
  isDisableBtn: boolean = false
  validateForm: FormGroup<{
    password: FormControl<string>,
    checkPassword: FormControl<string>
  }>;
  token: string = '';
  email: string = '';
  constructor(private fb: NonNullableFormBuilder, private authenService: AuthenticationService, private route: ActivatedRoute,
    private message: NzMessageService, private notification: NzNotificationService
  ) {
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const token = params['token'];
      const email = params['email'];

      if (token && email) {
        this.token = this.encodeToken(token);
        this.email = email;
        console.log('Token:', this.token);
        console.log('Email:', this.email);
      } else {
        console.error('Token hoặc email bị thiếu');
      }
    });
  }

  submitForm() {
    this.isLoading = true
    if (this.validateForm.valid) {
      this.authenService.resetPassword(this.email, this.token, this.validateForm.getRawValue().password)
        .pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: (res) => {
            this.isLoading = false
            this.isDisableBtn = true
            this.message.create('success', 'Đặt lại mật khẩu thành công!')
          },
          error: (err) => {
            this.isLoading = false
            this.notification.error('Đặt lại mật khẩu thất bại', err.error.message)
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
  encodeToken(token: string) {
    return encodeURIComponent(token).replace(/\+/g, '%2B');
  };
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity());
  }
  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}


