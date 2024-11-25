import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizifyComponent } from './quizify.component';

describe('QuizifyComponent', () => {
  let component: QuizifyComponent;
  let fixture: ComponentFixture<QuizifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
