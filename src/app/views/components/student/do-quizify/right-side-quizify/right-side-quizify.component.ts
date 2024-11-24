import { ChangeDetectorRef, Component, input, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { StudentService } from '../../../../../core/services/student/service.student';
import { Store } from '@ngrx/store';
import { saveOrUpdateUserAnswer } from '../../../../../core/states/quiz.student.data.ts/quiz.student.action';
import { Observable } from 'rxjs';
import { QuizState } from '../../../../../core/states/quiz.student.data.ts/quiz.student.reducer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-side-quizify',
  standalone: true,
  imports: [NzTypographyModule, NzDividerModule, NzRadioModule, FormsModule, CommonModule],
  templateUrl: './right-side-quizify.component.html',
  styleUrl: './right-side-quizify.component.scss'
})
export class RightSideQuizifyComponent implements OnInit {
  @Input() questionNumber: number = 0;
  @Input() quiz: IQuiz | null = null;

  _question: IQuestion | null = null;
  _viewResult: boolean = false;
  listAnswer: IAnswer[] = [];
  radioValue: string = '';
  listUserAnswer: IUserAnswer[] | null = null;
  userAnswer$: Observable<{ answerId: string; isCorrect: boolean; } | null>;

  constructor(
    private studentService: StudentService,
    private store: Store<{ quiz: QuizState }>,
    private cdr: ChangeDetectorRef
  ) {
    this.userAnswer$ = new Observable();
    const storedValue = localStorage.getItem('viewResult');
    this.viewResult = storedValue ? JSON.parse(storedValue) : false;
  }
  ngOnInit(): void {
    const storedValue = localStorage.getItem('viewResult');
    this.viewResult = storedValue ? JSON.parse(storedValue) : false;
  }

  @Input() set question(question: IQuestion) {
    if (question) {
      console.log('Question changed:', question);
      this._question = question;
      this.radioValue = '';

      // Fetch answers cho câu hỏi hiện tại
      this.studentService.getAllAnswerInQuestion(question.questionId).subscribe(answers => {
        this.listAnswer = answers;

        // Nếu ở chế độ xem lại, cập nhật radioValue dựa vào câu trả lời trước đó
        if (this.viewResult) {
          const selectedAnswer = this.listUserAnswer?.find(
            item => item.questionId === question.questionId
          );
          if (selectedAnswer) {
            this.radioValue = selectedAnswer.selectedAnswerId;
          }
        } else {
          this.userAnswer$ = this.store.select(state => {
            return state.quiz.userAnswers[question.questionId] || null;
          });

          this.userAnswer$.subscribe((answerId) => {
            if (answerId) {
              this.radioValue = answerId.answerId;
              this.cdr.detectChanges();
              console.log('Radio value updated:', this.radioValue);
            }
          });
        }
      });
    }
  }


  get question(): IQuestion | null {
    return this._question;
  }
  @Input() set viewResult(value: boolean) {
    this._viewResult = value;
    if (value && this._question) {
      this.studentService.getAnswerQuiz(this._question.quizId!).subscribe(answers => {
        this.listUserAnswer = answers;
        // Tìm và set giá trị radio khi xem lại
        const selectedAnswer = this.listUserAnswer?.find(
          item => item.questionId === this.question?.questionId
        );

        if (selectedAnswer) {
          this.radioValue = selectedAnswer.selectedAnswerId;
        }
      });
    }
  }
  get viewResult(): boolean {
    return this._viewResult;
  }
  onAnswerSelect(questionId: string, answerId: string) {
    const answerItem = this.listAnswer.find(answer => answer.answerId === answerId);
    this.store.dispatch(saveOrUpdateUserAnswer({ questionId, answer: answerId, isCorrect: answerItem?.isCorrect! }));
  }
  checkUserAnswerCorrect(answer: IAnswer): boolean {
    return !!this.listUserAnswer?.find(
      item => item.selectedAnswerId === answer.answerId && item.isCorrect
    );
  }

  checkUserAnswerIncorrect(answer: IAnswer): boolean {
    return !!this.listUserAnswer?.find(
      item => item.selectedAnswerId === answer.answerId && !item.isCorrect
    );
  }

  checkCorrectAnswer(answer: IAnswer): boolean {
    return !!this.listAnswer.find(item => item.answerId === answer.answerId && item.isCorrect);
  }

}