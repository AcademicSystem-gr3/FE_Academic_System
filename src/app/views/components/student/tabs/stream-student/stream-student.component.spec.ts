import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamStudentComponent } from './stream-student.component';

describe('StreamStudentComponent', () => {
  let component: StreamStudentComponent;
  let fixture: ComponentFixture<StreamStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
