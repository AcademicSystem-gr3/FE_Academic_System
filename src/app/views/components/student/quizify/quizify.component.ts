import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { HeaderComponent } from '../../header/header.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LeftSideQuizifyComponent } from "../do-quizify/left-side-quizify/left-side-quizify.component";
import { RightSideQuizifyComponent } from "../do-quizify/right-side-quizify/right-side-quizify.component";
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../core/services/student/service.student';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-quizify',
  standalone: true,
  imports: [NzTypographyModule, NzDividerModule, NzRadioModule, FormsModule,
    HeaderComponent, NzDividerModule, NzProgressModule, NzStatisticModule,
    NzButtonModule, LeftSideQuizifyComponent, RightSideQuizifyComponent, NzModalModule

  ],
  templateUrl: './quizify.component.html',
  styleUrl: './quizify.component.scss'
})
export class QuizifyComponent {
  questionNumber: number = 0
  listQuestion: IQuestion[] = [];
  quiz: IQuiz | null = null
  question: IQuestion | null = null
  answer: number = 0
  confirmSubmit = false
  quizRecord: IQuizRecord | null = null
  viewResult: boolean = false
  constructor(private route: ActivatedRoute, private studentService: StudentService, private modal: NzModalService,
    private store: Store, private router: Router
  ) {

    this.route.paramMap.subscribe(params => {
      const id = params.get('quizId');
      this.fetchQuestionInQuiz(id!)
      this.fetchQuizInformation(id!)
      console.log('>>>id', id);
    });
  }
  fetchQuestionInQuiz(quizId: string) {
    this.studentService.getAllQuestionInQuiz(quizId).subscribe(res => {
      this.listQuestion = res
    })
  }
  fetchQuizInformation(quizId: string) {
    this.studentService.getQuiz(quizId).subscribe(res => {
      this.quiz = res
    })
  }
  selectQuestion(question: IQuestion) {
    this.question = question
    console.log('>>>question', question);
  }
  numberQuestion(value: number) {
    this.questionNumber = value
  }
  answerLength(value: number) {
    this.answer = value
  }
  onClickBackToList(): void {
    this.router.navigateByUrl(localStorage.getItem('backToList') as string);
    localStorage.removeItem('viewResult')
  }
  showConfirm(): void {
    const unansweredCount = this.listQuestion.length - this.answer;
    console.log('>>>listQuestion.length:', this.listQuestion.length);
    console.log('>>>answer:', this.answer);
    this.modal.confirm({
      nzTitle: this.answer === this.listQuestion.length ? '<i>Bạn chắc chắn muốn nộp bài trắc ngiệm?</i>' : `Còn ${unansweredCount} câu chưa làm bạn có muốn nộp?`,
      nzContent: '<b>Some descriptions</b>',
      nzOkText: 'Nộp',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        console.log('Click ok');
        this.handleClickOk()
      }
    });
  }
  handleClickOk(): void {
    this.confirmSubmit = true
    console.log('>>>isConfirm', this.confirmSubmit);
  }
  onSubmitComplete(): void {
    this.confirmSubmit = false
  }
  quizResult(data: IQuizRecord) {
    this.quizRecord = data
  }
  onClickViewResult() {
    this.viewResult = true
    localStorage.setItem('viewResult', JSON.stringify(this.viewResult))
    this.quizRecord = null
  }
}
