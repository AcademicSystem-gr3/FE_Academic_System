import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectComponent } from './class-subject.component';

describe('ClassSubjectComponent', () => {
  let component: ClassSubjectComponent;
  let fixture: ComponentFixture<ClassSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSubjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
