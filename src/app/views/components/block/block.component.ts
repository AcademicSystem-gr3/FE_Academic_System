import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher/service.teacher';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { environments } from '../../../../environments/environment.development';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { selectClass } from '../../../core/states/teacher.class.data.ts/teacher.class.selector';
import { addClass, loadClass } from '../../../core/states/teacher.class.data.ts/teacher.class.action';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@Component({
  selector: 'app-block',
  standalone: true,
  imports: [NzEmptyModule, NzButtonModule, CommonModule, NzModalModule, NzInputModule, NzFormModule, ReactiveFormsModule,
    NzGridModule, NzAvatarModule, NzDividerModule, NzAffixModule, NzIconModule, NzToolTipModule, RouterLink
  ],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss'
})
export class BlockComponent implements OnInit {

  blockName: string | null = null
  listClass: any[] | null = null
  isVisible = false;
  user$: Observable<IUser | null>
  classList$: Observable<IClass[]> | null = null
  avatarUrl: string = ''
  validateForm: FormGroup;
  offsetTop = 10;
  nzOffsetBottom = 10;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: TeacherService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private store: Store
  ) {
    this.route.params.subscribe(params => this.blockName = params['blockId']);
    this.user$ = this.store.select(selectUser)
    this.classList$ = this.store.select(selectClass)
    this.validateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z][1-9]$/)]]
    });
  }
  fetchAllClass() {
    this.route.paramMap.subscribe(params => {
      const blockId = params.get('blockId');
      this.store.dispatch(loadClass({ blockName: blockId! }));
    });
    if (this.classList$ == null) return
    this.classList$.pipe(
      map(res => {
        return res.map((item: IClass) => ({
          id: item.classId,
          userName: item.user.fullname,
          avatar: `${environments.apiUrl}/img/${item.user.avatar}`,
          className: item.name,
          imageThemes: item.imageThemes
        }))
      })
    ).subscribe(data => {
      this.listClass = data
      console.log("🚀 ~ BlockComponent ~ fetchAllClass ~ this.listClass:", this.listClass)
    })
  }
  ngOnInit(): void {
    this.fetchAllClass()
  }

  onClick(): void {
    this.showModal();
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      const dataCreateClass = { blockName: this.blockName!, className: this.validateForm.getRawValue().name }
      this.store.dispatch(addClass({ class: dataCreateClass }))
      this.fetchAllClass()
      // this.service.handleCreateClass({ blockName: this.blockName!, className: this.validateForm.getRawValue().name }).subscribe({
      //   next: (value) => {
      //     this.fetchAllClass()
      //     this.message.create('success', 'Tạo lớp thành công');
      //     console.log("🚀 ~ BlockComponent ~ this.service.handleCreateClass ~ value:", value)
      //   },
      //   error: (err) => {
      //     this.message.create('error', err.error.message)
      //   }
      // })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.submitForm();
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
