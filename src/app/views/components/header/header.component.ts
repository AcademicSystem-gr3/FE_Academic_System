import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthenticationService } from '../../../core/services/service.authentication';
import { ProfileUserComponent } from "../profile-user/profile-user.component";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { environments } from '../../../../environments/environment.development';
import { NzAffixModule } from 'ng-zorro-antd/affix';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzLayoutModule, NzIconModule, NzButtonModule, NzDropDownModule, NzAvatarModule, NzTypographyModule, ProfileUserComponent
    , NzAffixModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user: IUser | null = null
  openModal: boolean = false
  user$: Observable<IUser | null>
  imgAvatarUrl: string = ''
  constructor(private authService: AuthenticationService, private store: Store) {
    this.user$ = this.store.select(selectUser)

  }
  ngOnInit(): void {
    this.fetchUser()
    console.log(this.user)
  }
  handleClickOpenModal(): void {
    this.openModal = true;
  }

  handleClickCloseModal(): void {
    this.openModal = false;
    console.log('close modal', this.openModal)
  }
  fetchUser() {
    this.user$.subscribe(user => {
      if (user) {
        this.user = user
        this.imgAvatarUrl = `${environments.apiUrl}/img/${this.user?.data?.avatar}`
      }
    })
  }
  handleClickLogout() {
    this.authService.logout()
  }
}