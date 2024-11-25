import { Component, OnInit } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentService } from '../../../../core/services/student/service.student';

@Component({
  selector: 'app-menu-student',
  standalone: true,
  imports: [
    NzMenuModule, NzIconModule, CommonModule, NzLayoutModule,
    NzBreadCrumbModule, RouterOutlet, RouterLink, RouterLinkActive,
    NzEmptyModule, NzModalModule, NzInputModule, NzFormModule, ReactiveFormsModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuStudentComponent implements OnInit {
  isCollapsed = false;
  isModalVisible = false;
  validateForm: FormGroup;
  listClass: IClassStudent[] = [];
  // classList$: Observable<IClass[]>; // Observable holding the class data

  constructor(private router: Router, private route: ActivatedRoute, private store: Store, private fb: FormBuilder,
    private message: NzMessageService, private studentService: StudentService
  ) {
    // this.classList$ = this.store.select(selectClass);
    // console.log(this.classList$)
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
    })
    this.route.paramMap.subscribe(params => {
      console.log('>>>route', params.get('blockId'));
    });
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      this.studentService.joinClass(this.validateForm.value.name).subscribe({
        next: (value) => {
          this.message.create('success', 'Tham gia lớp học thành công');
          console.log("🚀 ~ submitForm ~ value:", value)
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

  ngOnInit(): void {

    this.fetAllClass()

  }
  showModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.submitForm();
  }
  handleOpenBlock(event: MouseEvent): void {
    event.stopPropagation();

    const currentLi = event.currentTarget as HTMLElement;
    const hasNestedUl = !!currentLi.querySelector('ul');

    if (!hasNestedUl) {
      this.showModal();
    }
  }

  // Check if a route is active
  isRouteActive(routePath: string): boolean {
    return this.router.url.includes(routePath);
  }

  // Navigate to a specific route
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
