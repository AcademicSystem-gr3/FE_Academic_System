import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NzFormModule, NzGridModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzIconModule,
    NzTypographyModule, RouterLink, NzIconModule, GoogleSigninButtonModule,

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  passwordVisible = false;
  password?: string;
  socialUser!: SocialUser;
  returnUrl: string = '';
  constructor(private fb: FormBuilder, private message: NzMessageService, private authenticationService: AuthenticationService, private socialAuthService: SocialAuthService,
    private route: ActivatedRoute, private router: Router
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],

    });
  }
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('>>>returnUrl', this.returnUrl);
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.socialUser = user;
        console.log('>>>Google User:', this.socialUser);
        this.authenticationService.login('google', this.socialUser.email, '', this.socialUser.name, this.socialUser.photoUrl, "ha noi", this.socialUser.idToken).subscribe({
          next: (value) => {
            console.log('>>>res', value);
            this.router.navigateByUrl(this.returnUrl);
            this.createMessage('success');
          },
          error: (err) => {
            console.log('Error logging in with Google:', err);
            this.createMessage('error');
          }
        });
      } else {
        console.log('User authentication failed or user is null');
      }
    });
  }

  handleLoginGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      console.log('>>>user', user)
    }).catch(error => {
      console.log('error')
    })
  }
  createMessage(type: string): void {
    if (type === 'success') {

      this.message.create(type, `Đăng nhập thành công`);

    } else {
      this.message.create(type, `Đăng nhập thất bại`);
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.getRawValue());
      this.authenticationService.login(
        'credential',
        this.validateForm.getRawValue().userName,
        this.validateForm.getRawValue().password
      ).subscribe({
        next: (res: IUser) => {
          console.log('>>>res', res);
          this.createMessage('success');
          const check = res.data.roles.includes('Teacher');
          console.log("🚀 ~ LoginComponent ~ submitForm ~ check:", check)

          if (res.data.roles.includes('Teacher')) {
            console.log('>>>Teacher here');
            this.router.navigate(['/teacher']);
          } else if (res.data.roles.includes('Student')) {
            console.log('>>>Student here');
            this.router.navigate(['/student']);
          }

          // this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.createMessage('danger');
        }
      });
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
