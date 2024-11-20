import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-article-component',
  standalone: true,
  imports: [RouterOutlet],
  template: '<p>To the crazy ones.</p><router-outlet></router-outlet>',
  styleUrl: './article-component.component.scss'
})
export class ArticleComponentComponent {

}
