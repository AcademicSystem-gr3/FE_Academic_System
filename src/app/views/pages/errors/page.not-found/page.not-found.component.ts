import { Component } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-page.not-found',
  standalone: true,
  imports: [NzResultModule, NzButtonModule],
  templateUrl: './page.not-found.component.html',
  styleUrl: './page.not-found.component.scss'
})
export class PageNotFoundComponent {

}
