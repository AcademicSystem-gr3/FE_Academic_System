import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerHomeworkComponent } from './drawer-homework.component';

describe('DrawerHomeworkComponent', () => {
  let component: DrawerHomeworkComponent;
  let fixture: ComponentFixture<DrawerHomeworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerHomeworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
