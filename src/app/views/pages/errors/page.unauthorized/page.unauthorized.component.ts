import { Component } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-page.unauthorized',
  standalone: true,
  imports: [NzButtonModule, NzResultModule],
  templateUrl: './page.unauthorized.component.html',
  styleUrl: './page.unauthorized.component.scss'
})
export class PageUnauthorizedComponent {

}
