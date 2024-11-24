import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectItemInterface, NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { removeVietNameseTones } from '../../../core/utils/util.removeVietNameseTones';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileServiceService } from '../../../core/services/service.file.ts/file-service.service';
import { environments } from '../../../../environments/environment.development';
import { CommonService } from '../../../core/services/common/service.common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { loadUser, updateUser } from '../../../core/states/user.login.data.ts/user.data.action';
import { AppState } from '../../../core/states/user.login.data.ts/user.data.reducer';
interface IAddress {
  id: string
  name: string,

}
@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [NzModalModule, NzFormModule, NzGridModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzIconModule,
    NzTypographyModule, NzSelectModule, NzSpinModule, NzSelectModule, FormsModule, CommonModule, NzImageModule, NzTabsModule, NzModalModule,
    NzUploadModule
  ],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent implements OnInit {
  @Input() isOpen: boolean = false
  @Output() closeModal = new EventEmitter<void>();
  isVisible: boolean = false
  isLoadingBtn: boolean = false
  imgAvatarName: string = ''
  user: IUser | null = null
  provinceList: IAddress[] = [];
  districtList: IAddress[] = [];
  communeList: IAddress[] = [];
  provinceFetch: IProvince[] | null = null;
  districtFetch: IDistrict[] | null = null;
  communeFetch: ICommune[] | null = null;
  @Input() selectedUser: string | undefined;
  isLoading = false;
  getRandomNameList!: Observable<string[]>;
  isLoadingProvince = false;
  isLoadingDistrict = false;
  isLoadingCommune = false;

  provinceSelected = false;
  districtSelected = false;
  cityId: string | null = null
  districtId: string | null = null
  communeId: string | null = null
  citySelectedFetch: IProvince | null = null
  districtSelectedFetch: IDistrict | null = null
  communeSelectedFetch: ICommune | null = null

  user$: Observable<IUser | null>;

  imgAvatarUrl: string = ''
  selectTabIndex: number = 0
  constructor(private fb: NonNullableFormBuilder,
    private http: HttpClient,
    private router: Router,
    private authenService: AuthenticationService,
    private msg: NzMessageService,
    private fileService: FileServiceService,
    private commonService: CommonService,
    private store: Store
  ) {
    this.validateForm = this.fb.group({
      email: [{ value: '', disabled: true }, '', [Validators.email, Validators.required]],
      province: ['', [Validators.required]],
      nickname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      district: ['', [Validators.required]],
      commune: ['', [Validators.required]],
      agree: [false]
    });

    this.validateFormPassword = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
    });
    console.log('>>>is open', this.isOpen)

    this.user$ = this.store.select(selectUser);
  }
  onTabChange(index: number): void {
    this.selectTabIndex = index
  }
  submitCurrentTabForm(): void {
    switch (this.selectTabIndex) {
      case 0:
        this.submitForm();
        break;
      case 1:
        this.submitFormPassword();
        break;
    }
  }
  // ngAfterViewInit(): void {
  //   this.fetchUser()
  // }
  validateForm: FormGroup<{
    email: FormControl<string>;
    nickname: FormControl<string>;
    phone: FormControl<string>;
    agree: FormControl<boolean>;
    province: FormControl<string>;
    district: FormControl<string>;
    commune: FormControl<string>;
  }>;
  validateFormPassword: FormGroup<{
    oldPassword: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
  }>;

  fetchUser() {

    this.store.dispatch(loadUser());
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.user = user;
        this.imgAvatarUrl = `${environments.apiUrl}/img/${this.user?.data?.avatar}`
        this.setDefaultValue();
      }
    });
  }

  setDefaultValue() {
    if (!this.user || !this.user.data || !this.user.data.address) {
      console.error('User data or address is missing');
      return;
    }

    const address: string[] = this.user.data.address.split('-');
    if (address.length !== 3) {
      console.error('Invalid address format');
      return;
    }

    this.cityId = address[0];
    this.districtId = address[1];
    this.communeId = address[2];

    // Set initial form values
    this.validateForm.patchValue({
      email: this.user.data.email || '',
      nickname: this.user.data.fullname || '',
      phone: this.user.data.phoneNumber || '',
    });

    this.loadProvinces().pipe(
      switchMap(() => {
        this.validateForm.patchValue({ province: this.cityId! });
        this.provinceSelected = true;
        return this.loadDistricts(this.cityId!);
      }),
      switchMap(() => {
        // this.validateForm.get('district')?.setValue(this.districtId!);
        this.validateForm.patchValue({ district: this.districtId! });
        this.districtSelected = true;
        return this.loadWards(this.districtId!);
      })
    ).subscribe({
      next: () => {
        this.validateForm.patchValue({ commune: this.communeId! });
        console.log('Address data loaded successfully');
      },
      error: (error) => console.error('Error loading address data:', error)
    });
  }
  submitForm() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.getRawValue());
      const province = this.validateForm.getRawValue().province
      const district = this.validateForm.getRawValue().district
      const commune = this.validateForm.getRawValue().commune
      const address = `${province}-${district}-${commune}`
      console.log('>>>address')
      const updateUserData: IUpdateProfile = {
        address: address,
        fullname: this.validateForm.getRawValue().nickname,
        phone: this.validateForm.getRawValue().phone,
        avatar: this.imgAvatarName
      }
      this.store.dispatch(updateUser({ user: updateUserData }))

      this.fetchUser()
      this.closeModal.emit();
      console.log('>>> new user', this.user)

    } else {
      console.log('Form không hợp lệ');
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }
  submitFormPassword() {
    if (this.validateFormPassword.valid) {
      console.log('submit', this.validateFormPassword.getRawValue());
      this.commonService.changePassword({
        oldPassword: this.validateFormPassword.getRawValue().oldPassword,
        newPassword: this.validateFormPassword.getRawValue().password
      }).subscribe({
        next: (res) => {
          console.log('>>>res', res)
          this.msg.success('Đổi mật khẩu thành công')
        },
        error: (error) => {
          console.log('>>>error', error)
          this.msg.error('Đổi mật khẩu thất bại')
        }
      })
    } else {
      console.log('Form không hợp lệ');
      Object.values(this.validateFormPassword.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
      const readFile = info.file.originFileObj as File;
      this.fileService.uploadFile(readFile, 'img').subscribe(
        data => {
          console.log('>>>data', data.fileName);
          this.imgAvatarName = data.fileName;
          this.imgAvatarUrl = `${environments.apiUrl}/img/${this.imgAvatarName}`;
        }
      )
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
  provinceUrl = 'https://esgoo.net/api-tinhthanh/1/0.htm';

  fetchProvince() {
    this.http.get<any>(this.provinceUrl).pipe(
      map((res: any) => {

        return res.data.map((item: any) => ({ id: item.id, name: item.name }));
      }),
      catchError(() => of({ data: [] }))
    ).subscribe(data => {
      this.provinceFetch = data;
      this.isLoadingProvince = false;
    });

  }

  filterOption(input: string, option: NzSelectItemInterface): boolean {
    const label = option.nzLabel as string;
    const labelRaw = removeVietNameseTones(label);
    const inputRaw = removeVietNameseTones(input)
    return labelRaw.toLowerCase().includes(inputRaw.toLowerCase());
  }
  ngOnInit(): void {
    // this.fetchProvince();
    this.fetchUser();
    // this.loadProvinces();
    // this.store.dispatch(loadUser());
    this.imgAvatarName = this.user?.data?.avatar!
    this.imgAvatarUrl = this.imgAvatarName
      ? `${environments.apiUrl}/img/${this.imgAvatarName}`
      : `${environments.apiUrl}/img/${this.user?.data?.avatar}`;
    this.validateForm.get('province')?.valueChanges.subscribe(value => {
      if (value) {
        this.provinceSelected = true;
        this.loadDistricts(value).subscribe();
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
        this.loadWards(value).subscribe();
        this.validateForm.get('commune')?.reset();
      } else {
        this.districtSelected = false;
      }
    });
  }

  loadProvinces(): Observable<any> {
    this.isLoadingProvince = true;
    return this.http.get<any>(this.provinceUrl).pipe(
      map((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          return res.data.map((item: any) => ({ id: item.id, name: item.name }));
        }
        return [];
      }),
      catchError(() => of([])),
      switchMap((data) => {
        this.provinceList = data;
        this.provinceFetch = data;
        this.isLoadingProvince = false;
        // console.log('>>>data province', this.provinceList);
        return of(data);
      })
    );
  }

  loadDistricts(provinceId: string): Observable<any> {
    this.isLoadingDistrict = true;
    return this.http.get<any>(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`).pipe(
      map((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          return res.data.map((item: any) => ({ id: item.id, name: item.name }));
        }
        return [];
      }),
      catchError(() => of([])),
      switchMap((data) => {
        this.districtList = data;
        this.districtFetch = data;
        this.isLoadingDistrict = false;
        // console.log('>>>data district', this.districtList);
        return of(data);
      })
    );
  }

  loadWards(districtId: string): Observable<any> {
    this.isLoadingCommune = true;
    return this.http.get<any>(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`).pipe(
      map((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          return res.data.map((item: any) => ({ id: item.id, name: item.name }));
        }
        return [];
      }),
      catchError(() => of([])),
      switchMap((data) => {
        this.communeList = data;
        this.communeFetch = data;
        this.isLoadingCommune = false;
        // console.log('>>>data commune', this.communeList);
        return of(data);
      })
    );
  }

  dummyRequest = (args: NzUploadXHRArgs): Subscription => {
    const { file, onSuccess, onError } = args;

    console.log('>>>file', file.name);
    const realFile = file.originFileObj as File;
    if (file.originFileObj instanceof File) {
      this.fileService.uploadFile(file.originFileObj, 'img').subscribe(
        data => {
          console.log('>>>data', data);

        }
      );
    }
    // Tạo một observable đơn giản để giả lập quá trình upload thành công
    const observable = new Observable(subscriber => {
      setTimeout(() => {
        try {
          onSuccess && onSuccess({}, file, null);
          subscriber.complete();
        } catch (error) {
          onError && onError(new Error('Custom error message'), file);
          subscriber.error(error);
        }
      }, 1000);
    });

    // Trả về subscription từ observable
    return observable.subscribe();
  }
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateFormPassword.controls.checkPassword.updateValueAndValidity());
  }
  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateFormPassword.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  handleCancel(): void {
    this.closeModal.emit();
    this.validateFormPassword.reset();
  }
}
