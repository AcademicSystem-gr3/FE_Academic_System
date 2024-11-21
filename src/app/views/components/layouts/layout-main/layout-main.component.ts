import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../footer/footer.component";
import { MenuComponent } from '../../menu/menu.component';
import { FolderComponent } from '../../folder/folder.component';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, MenuComponent],
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.scss'
})
export class LayoutMainComponent {

}
