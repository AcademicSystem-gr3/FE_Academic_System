import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectTabsComponent } from './class-subject-tabs.component';

describe('ClassSubjectTabsComponent', () => {
  let component: ClassSubjectTabsComponent;
  let fixture: ComponentFixture<ClassSubjectTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSubjectTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSubjectTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
