import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveHomeworkComponent } from './give-homework.component';

describe('GiveHomeworkComponent', () => {
  let component: GiveHomeworkComponent;
  let fixture: ComponentFixture<GiveHomeworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveHomeworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
