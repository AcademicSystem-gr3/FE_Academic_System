import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { delay, finalize } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-verify-register',
  standalone: true,
  imports: [NzFormModule, NzGridModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzIconModule,
    NzTypographyModule, RouterLink, NzIconModule, NzInputDirective, FormsModule, NzStatisticModule, NzSpinModule],
  templateUrl: './verify-register.component.html',
  styleUrl: './verify-register.component.scss'
})
export class VerifyRegisterComponent {
  value?: string;
  deadline = Date.now() + 1 * 60 * 1000;
  isDisabled: boolean = true
  isLoading: boolean = false
  user: any | undefined
  constructor(private router: Router, private authenService: AuthenticationService, private message: NzMessageService) {
    this.user = this.router.getCurrentNavigation()?.extras?.state?.['user'];
    console.log(this.router.getCurrentNavigation()?.extras?.state?.['user']);
  }
  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
  onCountdownFinish() {
    this.isDisabled = false;
  }
  resetCountdown() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.authenService.resendOTP(this.user?.email!)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (value) => {
          console.log(this.user?.email);
          console.log('>>>value', value.message);
          this.createMessage('success', 'Mã OTP đã gửi về mail của bạn');
          this.deadline = Date.now() + 1 * 60 * 1000;
          this.isDisabled = true;
        },
        error: (err) => {
          console.log('>>>error', err);
          let errorMessage = 'Không thể gửi mã OTP';
          if (err.status === 0) {
            errorMessage += ': Lỗi kết nối hoặc CORS';
          } else if (err.error && err.error.message) {
            errorMessage += ': ' + err.error.message;
          }
          this.createMessage('error', errorMessage);
        }
      });
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }
  sendOtp() {
    const otp = this.value || '';

    this.authenService.verify({
      fullname: this.user?.nickname!,
      email: this.user?.email!,
      password: this.user?.password!,
      phone: this.user?.phone!,
      otp: otp + '',
      address: `${this.user?.province!}-${this.user?.commune!}-${this.user?.district!}`

    }).subscribe({
      next: (value) => {
        console.log('>>>value', value)

        this.createMessage('success', 'Đăng kí thành công');
        this.redirectTo('/login');
      },
      error: (err) => {
        console.log('>>>error', err)
      }
    })
  }
}
