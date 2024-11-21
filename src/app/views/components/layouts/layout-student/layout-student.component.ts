import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "../../menu/menu.component";
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { MenuStudentComponent } from "../../student/menu-student/menu.student.component";
import { ClassSubjectTabsComponent } from "../../student/class-subject-tabs/class-subject-tabs.component";

@Component({
  selector: 'app-layout-student',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, NzBackTopModule, MenuStudentComponent, ClassSubjectTabsComponent],
  templateUrl: './layout-student.component.html',
  styleUrl: './layout-student.component.scss'
})
export class LayoutStudentComponent {

}
