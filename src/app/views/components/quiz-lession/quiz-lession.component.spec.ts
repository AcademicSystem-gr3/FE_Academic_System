import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizLessionComponent } from './quiz-lession.component';

describe('QuizLessionComponent', () => {
  let component: QuizLessionComponent;
  let fixture: ComponentFixture<QuizLessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizLessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizLessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
