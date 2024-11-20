import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TeacherService } from '../services/teacher/service.teacher';

@Injectable({
  providedIn: 'root'
})
export class QuizQueryService {
  private injector = inject(Injector);

  constructor(private teacherService: TeacherService) { }

  getAllQuizInLesson(lessonId: string) {
    return runInInjectionContext(this.injector, () => {
      return injectQuery(() => ({
        queryKey: ['getAllQuizInLesson', lessonId],
        queryFn: () => this.teacherService.getAllQuizInLesson(lessonId),
      }));
    });
  }
}