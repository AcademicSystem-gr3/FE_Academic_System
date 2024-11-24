import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerHomeworkStudentComponent } from './drawer-homework-student.component';

describe('DrawerHomeworkStudentComponent', () => {
  let component: DrawerHomeworkStudentComponent;
  let fixture: ComponentFixture<DrawerHomeworkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerHomeworkStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerHomeworkStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
