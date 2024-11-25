import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideQuizifyComponent } from './right-side-quizify.component';

describe('RightSideQuizifyComponent', () => {
  let component: RightSideQuizifyComponent;
  let fixture: ComponentFixture<RightSideQuizifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSideQuizifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightSideQuizifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
