import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HeaderComponent } from '../../../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { QuizState } from '../../../../../core/states/quiz.student.data.ts/quiz.student.reducer';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../../../core/services/student/service.student';
import { resetQuizState } from '../../../../../core/states/quiz.student.data.ts/quiz.student.action';
@Component({
  selector: 'app-left-side-quizify',
  standalone: true,
  imports: [NzTypographyModule, HeaderComponent, NzDividerModule, NzProgressModule, NzStatisticModule,
    NzButtonModule, RouterLink, CommonModule
  ],
  templateUrl: './left-side-quizify.component.html',
  styleUrl: './left-side-quizify.component.scss'
})
export class LeftSideQuizifyComponent implements OnChanges, OnInit {
  @Input() quiz: IQuiz | null = null;
  @Input() listQuestion: IQuestion[] = [];
  @Output() selectQuestion = new EventEmitter<IQuestion>();
  @Output() numberQuestion = new EventEmitter<number>();
  @Output() answerLength = new EventEmitter<number>();
  @Output() submit = new EventEmitter<void>();
  @Output() onSubmitComplete = new EventEmitter<void>();
  @Input() confirmSubmit = false
  @Output() quizResult = new EventEmitter<IQuizRecord>();
  @Input() viewResult = false
  deadline: number | null = null;
  progress$: Observable<number>;
  listUserAnswer$: Observable<[string, { answerId: string; isCorrect: boolean; }][]>;
  selectedQuestion: IQuestion | null = null;
  listQuizAnswer: IUserAnswer[] = []
  constructor(private store: Store<{ quiz: QuizState }>, private studentService: StudentService, private cdr: ChangeDetectorRef, private router: Router) {
    this.progress$ = new Observable();
    this.listUserAnswer$ = new Observable();
  }
  ngOnInit(): void {
    const storedValue = localStorage.getItem('viewResult');
    this.viewResult = storedValue ? JSON.parse(storedValue) : false;

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('>>>quiz', this.quiz);
    this.deadline = Date.now() + Number(this.quiz?.duration!) * 60 * 1000
    localStorage.setItem('deadline', JSON.stringify(this.deadline))
    console.log('>>>listQuestion', this.listQuestion);
    this.progress$ = this.store.select(state => {
      const totalQuestions = this.listQuestion.length;
      const answeredQuestions = Object.keys(state.quiz.userAnswers).length;
      return Math.round((answeredQuestions / totalQuestions) * 100);
    });
    if (this.listQuestion && this.listQuestion.length > 0) {
      this.selectedQuestion = this.listQuestion[0];
      this.numberQuestion.emit(1);
      this.selectQuestion.emit(this.listQuestion[0]);
    }
    if (changes['confirmSubmit'] && changes['confirmSubmit'].currentValue === true && changes['confirmSubmit'].previousValue === false) {
      this.handleConfirmSubmit();
    }
    if (changes['viewResult'] && changes['viewResult'].currentValue === true) {
      console.log('>>>viewResult left', this.viewResult);
      this.studentService.getAnswerQuiz(this.quiz?.quizId!).pipe(take(1)).subscribe(res => {
        this.listQuizAnswer = res
        console.log('>>>listQuizAnswer left', res);
        this.cdr.detectChanges();
      })
    }
  }
  onCountdownFinish() {
    this.handleConfirmSubmit();
  }
  onSelectQuestion(question: IQuestion, questionNumber: number) {
    this.selectedQuestion = question;
    this.selectQuestion.emit(question);
    this.numberQuestion.emit(questionNumber);
  }
  isAnswerSelected(question: IQuestion): Observable<boolean> {
    return this.store.select(state => !!state.quiz.userAnswers[question.questionId]).pipe(
      map(isAnswered => isAnswered || this.selectedQuestion?.questionId === question.questionId)
    );
  }
  handleSubmitQuiz(): void {
    this.listUserAnswer$ = this.store.select(state => Object.entries(state.quiz.userAnswers));
    let payload: { quizRecordId: string; recordAnswers: IRecordAnswer[] } | null = null;
    let lengthAnswers = 0;
    this.listUserAnswer$.subscribe(userAnswers => {
      const recordAnswers = Object.entries(userAnswers).map(([questionId, selectedAnswerId]) => ({
        questionId: selectedAnswerId[0],
        selectedAnswerId: selectedAnswerId[1].answerId,
        isCorrect: selectedAnswerId[1].isCorrect
      }))
      payload = {
        quizRecordId: this.quiz?.quizId!,
        recordAnswers
      };
      lengthAnswers = recordAnswers.length;
      console.log('>>>lengthAnswers', lengthAnswers);
      this.answerLength.emit(lengthAnswers);
    });
    this.submit.emit();
  }
  handleConfirmSubmit(): void {
    this.listUserAnswer$ = this.store.select(state => Object.entries(state.quiz.userAnswers));
    let payload: { quizRecordId: string; recordAnswers: IRecordAnswer[], timeSpent: number, score: number } | null = null;
    let lengthAnswers = 0;
    this.listUserAnswer$.pipe(take(1)).subscribe(userAnswers => {
      const recordAnswers = Object.entries(userAnswers).map(([questionId, selectedAnswerId]) => ({
        questionId: selectedAnswerId[0],
        selectedAnswerId: selectedAnswerId[1].answerId,
        isCorrect: selectedAnswerId[1].isCorrect
      }))
      const scorePerQuestion = (1 / this.listQuestion.length) * 10;
      const score = recordAnswers.reduce((total, answer) => answer.isCorrect ? total + scorePerQuestion : total, 0);
      payload = {
        quizRecordId: this.quiz?.quizId!,
        recordAnswers,
        timeSpent: this.deadline! - Date.now(),
        score: score
      };
      lengthAnswers = recordAnswers.length;
      console.log('>>>payload', payload);
    });
    this.studentService.submitQuiz(payload!).subscribe(res => {
      this.store.dispatch(resetQuizState())
      this.quizResult.emit(res);
      this.onSubmitComplete.emit();
    });
    console.log('>>>confirmSubmit', this.confirmSubmit);
  }
  onClickBackToList(): void {
    this.router.navigateByUrl(localStorage.getItem('backToList') as string);
    localStorage.removeItem('viewResult')
  }
  isWrongAnswer(question: IQuestion): boolean {
    const answer = this.listQuizAnswer.find(item => item.questionId === question.questionId);
    return answer?.isCorrect === false || answer?.isCorrect === undefined;
  }

  isCorrectAnswer(question: IQuestion): boolean {
    const answer = this.listQuizAnswer.find(item => item.questionId === question.questionId);
    return answer?.isCorrect === true;
  }

}
