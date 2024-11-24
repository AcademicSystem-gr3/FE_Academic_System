import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { NzCalendarHeaderComponent, NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { FormControl, FormRecord, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
@Component({
  selector: 'app-works',
  standalone: true,
  imports: [NzCalendarModule, NzBadgeModule, FormsModule, NzDropDownModule, CommonModule, NzCalendarHeaderComponent,
    NzModalModule, NzFormModule, NzInputModule, NzGridModule, ReactiveFormsModule, NzIconModule, NzButtonModule, NzCheckboxModule
  ],
  templateUrl: './works.component.html',
  styleUrl: './works.component.scss'
})
export class WorksComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedEvents: any[] = [];  // Thêm biến này
  contextMenuDate: Date | null = null;
  mode: 'month' | 'year' = 'month';
  isVisible = false;
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  @ViewChild('menu') menu!: NzDropdownMenuComponent;
  constructor(
    private nzContextMenuService: NzContextMenuService,
    private fb: NonNullableFormBuilder
  ) { }
  ngOnInit(): void {
    this.addField();
  }
  listDataMap: Record<string, { type: string; content: string }[]> = {
    '2024-11-8': [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
    ],
    '2024-11-9': [
      { type: 'warning', content: 'This is a warning event.' },
      { type: 'success', content: 'This is a usual event.' },
      { type: 'error', content: 'This is an error event.' },
    ],
    '2024-11-10': [
      { type: 'warning', content: 'This is a warning event' },
      { type: 'success', content: 'This is a very long usual event........' },
      { type: 'error', content: 'This is an error event 1.' },
      { type: 'error', content: 'This is an error event 2.' },
      { type: 'error', content: 'This is an error event 3.' },
      { type: 'error', content: 'This is an error event 4.' },
    ],
  };
  log(value: string[]): void {
    console.log(value);
  }
  addField(e?: MouseEvent): void {
    e?.preventDefault();

    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.fb.control('', Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onRightClick(event: MouseEvent, date: Date, menu: any): void {
    event.preventDefault();
    this.contextMenuDate = date;
    this.nzContextMenuService.create(event, menu);
  }

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }
  getMonthDayKey(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change);
  }
  selectChange(date: Date): void {
    console.log(date);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
