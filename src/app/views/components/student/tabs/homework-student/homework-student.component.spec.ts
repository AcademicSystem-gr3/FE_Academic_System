import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkStudentComponent } from './homework-student.component';

describe('HomeworkStudentComponent', () => {
  let component: HomeworkStudentComponent;
  let fixture: ComponentFixture<HomeworkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeworkStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
