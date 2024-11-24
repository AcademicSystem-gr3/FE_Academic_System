import { Component } from '@angular/core';
import { ClassSubjectTabsComponent } from "../class-subject-tabs/class-subject-tabs.component";

@Component({
  selector: 'app-class-subject',
  standalone: true,
  imports: [ClassSubjectTabsComponent],
  templateUrl: './class-subject.component.html',
  styleUrl: './class-subject.component.scss'
})
export class ClassSubjectComponent {

}
