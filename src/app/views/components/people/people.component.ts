import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Observable, of, switchMap, take } from 'rxjs';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { GeneralService } from '../../../core/services/general/service.general';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { environments } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [NzDividerModule, NzAvatarModule, NzIconModule, NzToolTipModule, CommonModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements OnInit {
  user$: Observable<IUser | null>
  user: IUser | null = null
  listStudentInClass$: Observable<IClassMember[]>
  listStudentInClass: IClassMember[] = []
  teacher: IClassMember | null = null
  apiUrl = `${environments.apiUrl}/img/`
  constructor(private store: Store, private generalService: GeneralService,
    private route: ActivatedRoute
  ) {
    this.user$ = this.store.select(selectUser)
    this.listStudentInClass$ = this.route.paramMap.pipe(
      switchMap(params => {
        const classId = params.get('classId')
        if (classId) {
          this.fetchTeacherInClass(classId)
        }
        return classId ? this.generalService.getAllStudentInClass(classId) : of([])
      })
    )
  }
  ngOnInit(): void {
    this.user$.subscribe(res => {
      if (res) {
        this.user = res
      }
    })
    this.listStudentInClass$.subscribe(res => {
      if (res) {
        this.listStudentInClass = res
        console.log('>>>listStudentInClass', this.listStudentInClass)
      }
    })
  }
  // fetchListStudentInClass(classId: string) {
  //   this.generalService.getAllStudentInClass(classId).pipe(take(1)).subscribe(res => {
  //     this.listStudentInClass = res
  //   })
  // }
  fetchTeacherInClass(classId: string) {
    this.generalService.getTeacherInClass(classId).pipe(take(1)).subscribe(res => {
      this.teacher = res
    })
  }
}
