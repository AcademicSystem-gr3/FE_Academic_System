import { Component } from '@angular/core';
import { LeftSideQuizifyComponent } from "../../components/do-quizify/left-side-quizify/left-side-quizify.component";
import { RightSideQuizifyComponent } from "../../components/do-quizify/right-side-quizify/right-side-quizify.component";
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-do-quiz',
  standalone: true,
  imports: [LeftSideQuizifyComponent, RightSideQuizifyComponent, NzTypographyModule],
  templateUrl: './do-quiz.component.html',
  styleUrl: './do-quiz.component.scss'
})
export class DoQuizComponent {

}
