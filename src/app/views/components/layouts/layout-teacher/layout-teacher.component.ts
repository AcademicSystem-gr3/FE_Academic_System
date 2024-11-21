import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutMainComponent } from "../layout-main/layout-main.component";
import { MenuComponent } from "../../menu/menu.component";
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
@Component({
  selector: 'app-layout-teacher',
  standalone: true,
  imports: [RouterOutlet, LayoutMainComponent, MenuComponent, NzBackTopModule],
  templateUrl: './layout-teacher.component.html',
  styleUrl: './layout-teacher.component.scss'
})
export class LayoutTeacherComponent {

}
