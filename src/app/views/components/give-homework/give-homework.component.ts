import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Validators } from 'ngx-editor';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { FileServiceService } from '../../../core/services/service.file.ts/file-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TeacherService } from '../../../core/services/teacher/service.teacher';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { environments } from '../../../../environments/environment.development';
import { v4 as uuidv4 } from 'uuid';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { DrawerHomeworkComponent } from "../drawer-homework/drawer-homework.component";
import { NzTableModule } from 'ng-zorro-antd/table';
import * as XLSX from 'xlsx';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-give-homework',
  standalone: true,
  imports: [
    NzEmptyModule, NzButtonModule, NzDropDownModule, NzIconModule, NzModalModule, NzUploadModule, NzDatePickerModule,
    FormsModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzDrawerModule, NzCardModule, DrawerHomeworkComponent,
    NzTableModule, NzDividerModule, CommonModule
  ],
  templateUrl: './give-homework.component.html',
  styleUrl: './give-homework.component.scss'
})
export class GiveHomeworkComponent implements OnInit, OnChanges {
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
      if (homework) {
        this.listHomework = homework
        console.log('>>>listHomework', this.listHomework);
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
  handleOkModalAssignment() {
    this.submitForm();
  }
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.messageService.success(`${info.file.name} file uploaded successfully`);
      const readFile = info.file.originFileObj as File;
      this.fileUpload = readFile;
      console.log('>>>fileUpload', this.fileUpload);
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }

  handleChangeQuiz(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.messageService.success(`${info.file.name} file uploaded successfully`);
      const readFile = info.fileList[0].originFileObj as File;
      this.fileUpload = readFile;
      let reader = new FileReader();

      reader.onload = (e) => {
        let data = new Uint8Array(reader.result as ArrayBuffer);
        let workbook = XLSX.read(data, { type: 'array' });
        // find the name of your sheet in the workbook first
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // convert to json format
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: ["Question", "Answer1", "Answer2", "Answer3", "Answer4", "IsCorrect"],
          range: 1 //skip header row
        });

        console.log('>>>jsonData', jsonData)
        if (jsonData && jsonData.length > 0) {
          this.quizQuestionList = jsonData as IQuizQuestion[]
        }
      };

      reader.readAsArrayBuffer(readFile);

      console.log('>>>fileUpload', this.fileUpload);
    }
    if (info.file.status === 'removed') {
      this.quizQuestionList = [];
    }
    else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }
  dummyRequest = (args: NzUploadXHRArgs): Subscription => {
    const { file, onSuccess, onError } = args;

    console.log('>>>file', file.name);
    const realFile = file.originFileObj as File;
    if (file.originFileObj instanceof File) {
    }
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

  dowloadFile(file: NzUploadFile): void {
    console.log('>>>file', file);
    const link = document.createElement('a');
    link.href = file.url as string;
    link.click();
  }
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endValue);
    endDate.setHours(0, 0, 0, 0);

    return endDate.getTime() < today.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
    console.log('handleStartOpenChange', open);
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      if (!this.fileUpload || !this.endValue) {
        this.notification.warning('Vui lòng điền đủ thông tin', 'Chưa cập nhật file bài tập với thời gian hành chính xây dựng bài tập')
      } else {
        this.fileService.uploadFile(this.fileUpload, 'assignment').pipe(
          switchMap((res: any) => {
            return this.teacherService.CreateHomework({
              title: this.validateForm.value.title,
              description: this.validateForm.getRawValue().content,
              fileName: res.fileName,
              dueDate: this.endValue as Date,
              classId: this.classId,
              CreateBy: this.user?.data.id!
            });
          })
        ).subscribe(
          (result) => {
            this.notification.success('Thành công', 'Tạo bài tập thành công');
            this.fetchHomeworkInClass(this.route.snapshot.params['classId']);
            this.isVisible = false;
          },
          (error) => {
            this.notification.error('Thất bại', 'Có lỗi xảy ra khi tạo bài tập');
            console.error(error);
          }
        );

      }

    } else {
      this.isVisible = true;
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  openEditHomeworkModal(homework: IHomework) {
    this.isVisible = true;
    console.log('>>>homework', homework);
    this.validateForm.patchValue({
      title: homework.title,
      content: homework.description
    });
    this.endValue = new Date(homework.dueDate);

    this.fileList = [
      {
        uid: uuidv4(),
        name: homework.fileName,
        status: 'done',
        url: `${environments.apiUrl}/assignment/${homework.fileName}`,
      }
    ];
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
