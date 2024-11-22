import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDropdownComponent } from './blog-dropdown.component';

describe('BlogDropdownComponent', () => {
  let component: BlogDropdownComponent;
  let fixture: ComponentFixture<BlogDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
