import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoQuizComponent } from './do-quiz.component';

describe('DoQuizComponent', () => {
  let component: DoQuizComponent;
  let fixture: ComponentFixture<DoQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
