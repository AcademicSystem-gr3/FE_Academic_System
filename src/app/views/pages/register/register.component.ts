import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzOptionComponent, NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzImageModule } from 'ng-zorro-antd/image';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { PhoneFill } from '@ant-design/icons-angular/icons';
import { removeVietNameseTones } from '../../../core/utils/util.removeVietNameseTones';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { error } from '@ant-design/icons-angular';
interface IAddress {
  id: string
  name: string,

}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NzFormModule, NzGridModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzIconModule,
    NzTypographyModule, NzSelectModule, NzSpinModule, NzSelectModule, FormsModule, CommonModule, NzImageModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnChanges {
  isLoadingBtn: boolean = false
  constructor(private fb: NonNullableFormBuilder, private http: HttpClient, private router: Router, private authenService: AuthenticationService) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      province: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      nickname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      district: ['', [Validators.required]],
      commune: ['', [Validators.required]],
      agree: [false]
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser']) {
      const userProvince: IAddress | undefined = this.provinceList.find(o => o.id === this.selectedUser)
      if (userProvince) {
        console.log('Selected Province:', userProvince.name);
      }
    }
    console.log(changes['selectedUser'])
  }
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    nickname: FormControl<string>;
    phone: FormControl<string>;
    agree: FormControl<boolean>;
    province: FormControl<string>;
    district: FormControl<string>;
    commune: FormControl<string>;
  }>;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.getRawValue());
      this.isLoadingBtn = true
      this.authenService.sendOTP({
        fullname: this.validateForm.getRawValue().nickname,
        email: this.validateForm.getRawValue().email,
        address: `-${this.validateForm.getRawValue().province}-${this.validateForm.getRawValue().district}-${this.validateForm.getRawValue().commune}`,
        phone: this.validateForm.getRawValue().phone,
        password: this.validateForm.getRawValue().password
      }).pipe(
        finalize(() => this.isLoadingBtn = false)
      ).subscribe({
        next: (res) => {
          console.log('>>>res', res)
          this.router.navigate(['/verify-otp'], { state: { user: this.validateForm.getRawValue() } });
        },
        error: (error) => {
          console.log('>>>error', error)
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

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  provinceUrl = 'https://esgoo.net/api-tinhthanh/1/0.htm';

  provinceList: IAddress[] = [];
  districtList: IAddress[] = [];
  communeList: IAddress[] = [];
  @Input() selectedUser: string | undefined;
  isLoading = false;
  getRandomNameList!: Observable<string[]>; // Khởi tạo sau
  isLoadingProvince = false;
  isLoadingDistrict = false;
  isLoadingCommune = false;

  provinceSelected = false;
  districtSelected = false;
  filterOption(input: string, option: NzSelectItemInterface): boolean {
    const label = option.nzLabel as string;
    const labelRaw = removeVietNameseTones(label);
    const inputRaw = removeVietNameseTones(input)
    return labelRaw.toLowerCase().includes(inputRaw.toLowerCase());
  }
  ngOnInit(): void {
    this.loadProvinces();

    this.validateForm.get('province')?.valueChanges.subscribe(value => {
      if (value) {
        this.provinceSelected = true;
        this.loadDistricts(value);
        this.validateForm.get('district')?.reset();
        this.districtList = [];
        this.validateForm.get('commune')?.reset();
        this.communeList = [];
      } else {
        this.provinceSelected = false;
        this.districtSelected = false;
      }
    });
    this.validateForm.get('district')?.valueChanges.subscribe(value => {
      if (value) {
        this.districtSelected = true;
        this.loadWards(value);
        this.validateForm.get('commune')?.reset();
      } else {
        this.districtSelected = false;
      }
    });
  }

  loadProvinces(): void {
    this.isLoadingProvince = true;
    this.http.get<any>(this.provinceUrl).pipe(
      catchError(() => of({ data: [] })),
      map((res: any) => res.data.map((item: any) => ({ id: item.id, name: item.name })))
    ).subscribe(data => {
      this.provinceList = data;
      this.isLoadingProvince = false;
    });
  }

  loadDistricts(provinceId: string): void {
    this.isLoadingDistrict = true;
    this.http.get<any>(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`).pipe(
      catchError(() => of({ data: [] })),
      map((res: any) => res.data.map((item: any) => ({ id: item.id, name: item.name })))
    ).subscribe(data => {
      this.districtList = data;
      this.isLoadingDistrict = false;
    });
  }

  loadWards(districtId: string): void {
    this.isLoadingCommune = true;
    this.http.get<any>(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`).pipe(
      catchError(() => of({ data: [] })),
      map((res: any) => res.data.map((item: any) => ({ id: item.id, name: item.name })))
    ).subscribe(data => {
      this.communeList = data;
      this.isLoadingCommune = false;
    });
  }


}

