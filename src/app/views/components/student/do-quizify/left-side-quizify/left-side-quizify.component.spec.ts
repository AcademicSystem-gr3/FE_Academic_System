import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideQuizifyComponent } from './left-side-quizify.component';

describe('LeftSideQuizifyComponent', () => {
  let component: LeftSideQuizifyComponent;
  let fixture: ComponentFixture<LeftSideQuizifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSideQuizifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSideQuizifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
