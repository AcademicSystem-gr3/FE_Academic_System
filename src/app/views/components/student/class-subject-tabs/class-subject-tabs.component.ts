import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { StreamStudentComponent } from "../tabs/stream-student/stream-student.component";
import { HomeworkStudentComponent } from "../tabs/homework-student/homework-student.component";

import { PeopleStudentComponent } from "../tabs/people-student/people-student.component";
import { DoQuizComponent } from "../tabs/do-quiz/do-quiz.component";
import { PeopleComponent } from "../../people/people.component";


@Component({
  selector: 'app-class-subject-tabs',
  standalone: true,
  imports: [NzTabsModule, NzDividerModule, StreamStudentComponent, HomeworkStudentComponent, DoQuizComponent, PeopleComponent],
  templateUrl: './class-subject-tabs.component.html',
  styleUrl: './class-subject-tabs.component.scss'
})
export class ClassSubjectTabsComponent {

}
