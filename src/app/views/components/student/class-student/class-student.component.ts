import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { StudentService } from '../../../../core/services/student/service.student';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { CommonService } from '../../../../core/services/common/service.common';
import { environments } from '../../../../../environments/environment.development';
import slugify from 'slugify';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Validators } from 'ngx-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
@Component({
  selector: 'app-class-student',
  standalone: true,
  imports: [NzDividerModule, RouterLink, NzAvatarModule, NzAffixModule, NzModalModule, NzFormModule, ReactiveFormsModule,
    NzIconModule, NzToolTipModule, NzInputModule
  ],
  templateUrl: './class-student.component.html',
  styleUrl: './class-student.component.scss'
})
export class ClassStudentComponent {
  nzOffsetBottom = 10;
  listSubject: any[] | null = []
  listSubject$: Observable<ISubjectClass[]>
  teacher: IUser | null = null
  isModalVisible = false
  validateForm: FormGroup;
  listClass: IClassStudent[] = [];
  constructor(private router: Router, private route: ActivatedRoute, private studentService: StudentService, private commonService: CommonService,
    private fb: FormBuilder, private message: NzMessageService
  ) {
    this.listSubject$ = this.route.params.pipe(
      switchMap(params => {
        return this.studentService.fetchSubject(params['className']);
      })
    )
    this.listSubject$.pipe(
      map(res => {
        return res.map((item: ISubjectClass) => ({
          ...item,
          teacherAvatar: `${environments.apiUrl}/img/${item.teacherAvatar}`,
        }))
      })
    ).subscribe(data => {
      this.listSubject = data
    })
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
    })
  }
  createSlug(text: string): string {
    return slugify(text, {
      replacement: '-',  // Thay thế khoảng trắng bằng ký tự `-`
      remove: undefined, // Loại bỏ các ký tự phù hợp regex, mặc định là `undefined`
      lower: true,      // Không chuyển thành chữ thường
      strict: false,     // Không loại bỏ ký tự đặc biệt
      locale: 'vi',      // Sử dụng locale tiếng Việt
      trim: true         // Xóa khoảng trắng ở đầu và cuối
    });
  }
  onClickAffix() {
    this.showModal()
  }
  showModal(): void {
    this.isModalVisible = true;
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      this.studentService.joinClass(this.validateForm.value.name).subscribe({
        next: (value) => {
          this.message.create('success', 'Tham gia lớp học thành công');
          console.log("🚀 ~ submitForm ~ value:", value)
          this.fetAllClass()
        },
        error: (err) => {
          this.message.create('error', err.error.message)
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
  fetAllClass() {
    this.studentService.fetchAllClass().subscribe({
      next: (value) => {
        this.listClass = value
        console.log("🚀 ~ fetAllClass ~ value:", value)
      }
    })
  }
  closeModal(): void {
    this.isModalVisible = false;
    this.submitForm();
  }
}
