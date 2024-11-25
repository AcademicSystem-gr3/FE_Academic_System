import { Component, ElementRef, ViewChild } from '@angular/core';
import { delay, finalize, map, Observable, switchMap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeacherService } from '../../../../../core/services/teacher/service.teacher';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { selectUser } from '../../../../../core/states/user.login.data.ts/user.data.selector';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Store } from '@ngrx/store';
import { QuizQueryService } from '../../../../../core/useQuery/useQuiz';

@Component({
  selector: 'app-do-quiz-student',
  standalone: true,
  imports: [
    NzEmptyModule, NzButtonModule,
    NzFormModule, FormsModule, ReactiveFormsModule, NzGridModule, NzCollapseModule, NzIconModule,
    CommonModule, NzSpinModule, NzBadgeModule, RouterLink
  ],
  templateUrl: './do-quiz.component.html',
  styleUrl: './do-quiz.component.scss'
})
export class DoQuizComponent {
  quizQuestionList: IQuizQuestion[] = []
  isVisibleModalUploadFolder = false
  isVisibleLesion = false
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
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('classId')!;
      return this.teacherService.getAllLessonInClass(this.classId).subscribe(res => {
        this.listLesson = res
        console.log('>>>listLesson', this.listLesson)
      })
    })

  }
  onclickPlayNow() {

  }
  onChange(value: number): void {
    console.log(`onChange: ${value}`);
  }

  onAfterChange(value: number[] | number): void {
    console.log(`onAfterChange: ${value}`);
  }

  handleCancelLesion() {
    this.isVisibleLesion = false;
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


  setLession(id: string) {
    this.lessonId = id
    this.isVisibleModalUploadFolder = true
    console.log('>>>id', id);
  }

}
