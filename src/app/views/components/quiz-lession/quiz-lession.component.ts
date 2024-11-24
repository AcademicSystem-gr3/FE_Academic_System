import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadChangeParam, NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Validators } from 'ngx-editor';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { Observable, Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TeacherService } from '../../../core/services/teacher/service.teacher';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { QuizQueryService } from '../../../core/useQuery/useQuiz';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
@Component({
  selector: 'app-quiz-lession',
  standalone: true,
  imports: [NzEmptyModule, NzButtonModule, NzModalModule, NzUploadModule, NzTableModule, NzSelectModule, NzInputModule,
    NzFormModule, FormsModule, ReactiveFormsModule, NzGridModule, NzCollapseModule, NzIconModule, NzDropDownModule, NzSliderModule,
    CommonModule, NzSpinModule, NzBadgeModule
  ],
  templateUrl: './quiz-lession.component.html',
  styleUrl: './quiz-lession.component.scss'
})
export class QuizLessionComponent {
  quizQuestionList: IQuizQuestion[] = []
  isVisibleModalUploadFolder = false
  isVisibleLesion = false
  validateForm: FormGroup
  validateFormQuiz: FormGroup
  classId: string = ''
  listLesson: ILesson[] = []
  singleValue = 30;
  user: IUser | null = null
  user$: Observable<IUser | null> | null = null
  lessonId: string = ''
  listQuiz: IQuiz[] = []
  currentLessonId: string | null = null;
  constructor(private messageService: NzMessageService, private fb: FormBuilder, private teacherService: TeacherService,
    private route: ActivatedRoute, private notification: NzNotificationService, private store: Store, private quizQuery: QuizQueryService
  ) {
    this.user$ = this.store.select(selectUser)
    this.user$.subscribe(res => {
      if (res) {
        this.user = res
      }
    })
    this.validateForm = this.fb.group({
      class: ['', [Validators.required]],
    })
    this.validateFormQuiz = this.fb.group({
      quiz: ['', [Validators.required]],
    })
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('classId')!;
      return this.teacherService.getAllLessonInClass(this.classId).subscribe(res => {
        this.listLesson = res
        console.log('>>>listLesson', this.listLesson)
      })
    })

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

  onChange(value: number): void {
    console.log(`onChange: ${value}`);
  }

  onAfterChange(value: number[] | number): void {
    console.log(`onAfterChange: ${value}`);
  }
  handleChangeQuiz(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.messageService.success(`${info.file.name} file uploaded successfully`);
      const readFile = info.fileList[0].originFileObj as File;
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
          this.quizQuestionList = jsonData.map((item: any) => {
            return {
              Question: item.Question,
              ListAnswers: [item.Answer1, item.Answer2, item.Answer3, item.Answer4],
              IsCorrect: item.IsCorrect
            }
          })
        }
        console.log('>>>quizQuestionList', this.quizQuestionList)
      };

      reader.readAsArrayBuffer(readFile);


    }
    if (info.file.status === 'removed') {
      this.quizQuestionList = [];
    }
    else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }
  handleCancelUploadExcel() {
    this.isVisibleModalUploadFolder = false;
  }

  handleOkUploadExcel() {
    this.submitFormQuiz()
  }
  handleDownloadExcelSample(event: MouseEvent): void {
    event.stopPropagation();
  }
  handleCancelLesion() {
    this.isVisibleLesion = false;
  }
  handleOkLesion() {

    this.submitForm();
  }
  fetLessonInClass(classId: string) {
    this.teacherService.getAllLessonInClass(classId).subscribe({
      next: (res) => {
        this.listLesson = res
      },
      error: (error) => {
        console.log('>>>error', error)
      }
    })
  }
  fetchQuizInLesson(lessonId: string) {
    this.teacherService.getAllQuizInLesson(lessonId).subscribe({
      next: (res) => {
        this.listQuiz = res
        console.log('>>>listQuiz', this.listQuiz)
      },
      error: (error) => {
        console.log('>>>error', error)
      }
    })
  }
  handleOpenCollapse(isActive: boolean, lessonId: string): void {
    if (isActive) {
      this.currentLessonId = lessonId;
      // Xóa dữ liệu cũ để đảm bảo không bị hiển thị sai
      this.listQuiz = [];

      // Gọi API lấy dữ liệu mới
      this.teacherService.getAllQuizInLesson(lessonId).subscribe((quizList) => {
        // Cập nhật danh sách quiz cho bài học được mở
        this.listQuiz = quizList;
      });
    }
  }

  // getQuizzesByLession(lessionId: string): any[] {
  //   console.log('vao day')
  //   return this.listQuiz.filter(quiz => quiz.lessonId === lessionId);
  // }

  submitForm() {
    if (this.validateForm.valid) {
      this.teacherService.createLesson({
        classId: this.classId,
        lessionName: this.validateForm.getRawValue().class,

      }).subscribe({
        next: (res) => {
          this.fetLessonInClass(this.classId)
          this.isVisibleLesion = false
          this.notification.success('Thành công', 'Tạo phần học thành công');
        },
        error: (error) => {
          this.notification.error('Thất bại', 'Có lỗi xảy ra khi tạo phần học');
        }
      })
    }
  }
  setLession(id: string) {
    this.lessonId = id
    this.isVisibleModalUploadFolder = true
    console.log('>>>id', id);
  }
  submitFormQuiz() {
    if (this.validateFormQuiz.valid) {
      this.teacherService.createQuiz({
        CreatorId: this.user?.data.id!,
        LessonId: this.lessonId,
        Duration: this.singleValue.toString()!,
        listQuestionAndAnswers: this.quizQuestionList,
        QuizName: this.validateFormQuiz.value.quiz

      }).subscribe({
        next: (res) => {
          this.isVisibleLesion = false
          this.notification.success('Thành công', 'Tạo phần học thông minh thông bài');
        },
        error: (error) => {
          this.notification.error('Thất bại', error.error.message);
        }
      })
    }
  }
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 3'
    }
  ];
}
