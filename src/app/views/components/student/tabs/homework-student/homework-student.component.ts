import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { DrawerHomeworkComponent } from '../../../drawer-homework/drawer-homework.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, switchMap } from 'rxjs';
import * as XLSX from 'xlsx';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileServiceService } from '../../../../../core/services/service.file.ts/file-service.service';
import { TeacherService } from '../../../../../core/services/teacher/service.teacher';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Validators } from 'ngx-editor';
import { v4 as uuidv4 } from 'uuid';
import { selectUser } from '../../../../../core/states/user.login.data.ts/user.data.selector';
import { environments } from '../../../../../../environments/environment.development';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import dayjs from 'dayjs';
import { DrawerHomeworkStudentComponent } from "../../drawer-homework-student/drawer-homework-student.component";
@Component({
  selector: 'app-homework-student',
  standalone: true,
  imports: [NzEmptyModule, NzButtonModule, NzDropDownModule, NzIconModule, NzModalModule, NzUploadModule, NzDatePickerModule,
    FormsModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzDrawerModule, NzCardModule, DrawerHomeworkComponent,
    NzTableModule, NzDividerModule, CommonModule, NzBadgeModule, NzSelectModule, DrawerHomeworkStudentComponent],
  templateUrl: './homework-student.component.html',
  styleUrl: './homework-student.component.scss'
})
export class HomeworkStudentComponent {
  isVisible = false;
  endValue: Date | null = null;
  validateForm: FormGroup
  fileUpload: File | null = null;
  classStudent$: Observable<IClass>;
  user$: Observable<IUser | null>
  user: IUser | null = null
  classId: string = '';
  listHomework$: Observable<IHomework[]>
  listHomework: IHomework[] = [];
  fileList: NzUploadFile[] = [];
  currentHomework: IHomework | null = null
  visibleDrawer = false
  isVisibleModalUploadFolder = false
  quizQuestionList: IQuizQuestion[] = []
  selectedValue = null;
  HomeworkFlag = false
  filteredHomework: IHomework[] = [];
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  constructor(private messageService: NzMessageService, private fb: FormBuilder, private fileService: FileServiceService,
    private notification: NzNotificationService, private teacherService: TeacherService, private route: ActivatedRoute,
    private store: Store
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['']

    })
    this.classId = this.route.snapshot.params['classId'];
    this.classStudent$ = this.route.paramMap.pipe(
      switchMap(params => {
        return this.teacherService.getClassByName(params.get('classId')!)
      })
    );
    this.listHomework$ = this.route.paramMap.pipe(
      switchMap(params => {
        return this.teacherService.getAllHomeworkInClass(params.get('classId')!)
      })
    )
    this.user$ = this.store.select(selectUser)
  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {
    this.fetchUser();
    this.fetchHomeworkInClass(this.route.snapshot.params['classId']);
  }
  onClick(): void { }
  fetchUser() {
    this.user$.subscribe(user => {
      if (user) {
        this.user = user
      }
    })
  }
  fetchHomeworkInClass(classId: string) {
    this.classId = classId;
    this.listHomework$.subscribe(homework => {
      if (homework.length > 0) {
        this.listHomework = homework
        this.filteredHomework = this.listHomework
        console.log('>>>listHomework', this.listHomework);
      } else {
        this.HomeworkFlag = true
      }
    })
  }

  handleCancelUploadFolder() {
    this.isVisibleModalUploadFolder = false;
  }

  handleOkUploadFolder() {
    this.isVisibleModalUploadFolder = false;
  }

  handleCancelModalAssignment() {
    this.isVisible = false;
  }
  onFilterChange(value: string): void {
    if (!value) {
      this.filteredHomework = this.listHomework;
    }
    else {
      this.filteredHomework = this.listHomework.filter(homework => this.getHomeworkStatus(homework.dueDate) === value);
      console.log('>>>listHomework', this.listHomework);
    }
  }

  getStatusClass(dueDate: string): 'success' | 'warning' | 'error' {
    const status = this.getHomeworkStatus(dueDate);
    if (status === 'Làm ngay') {
      return 'success';
    } else if (status === 'Sắp hết hạn') {
      return 'warning';
    } else if (status === 'Hết hạn') {
      return 'error';
    }
    return 'success'; // Giá trị mặc định
  }

  getHomeworkStatus(dueDate: string): string {
    const now = dayjs();
    const due = dayjs(dueDate);

    if (due.isBefore(now)) {
      return 'Hết hạn';
    } else if (due.diff(now, 'hour') <= 24) {
      return 'Sắp hết hạn';
    } else {
      return 'Làm ngay';
    }
  }

  openDrawer(homework: IHomework): void {
    this.visibleDrawer = true;
    this.currentHomework = homework
  }
  closeDrawer(): void {
    this.visibleDrawer = false;
  }
  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }
  handleDownloadExcelSample(event: MouseEvent): void {
    event.stopPropagation();
  }
  removeFileQuiz(file: NzUploadFile): boolean | Observable<boolean> {

    this.quizQuestionList = [];
    console.log('questionList', this.quizQuestionList);
    return true;
  }
}
