import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleStudentComponent } from './people-student.component';

describe('PeopleStudentComponent', () => {
  let component: PeopleStudentComponent;
  let fixture: ComponentFixture<PeopleStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
