import { Component, OnInit } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectClass } from '../../../core/states/teacher.class.data.ts/teacher.class.selector';
import { loadClass } from '../../../core/states/teacher.class.data.ts/teacher.class.action';
import { Observable } from 'rxjs';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NzMenuModule, NzIconModule, CommonModule, NzLayoutModule,
    NzBreadCrumbModule, RouterOutlet, RouterLink, RouterLinkActive,
    NzEmptyModule,
    BreadcrumbComponent
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isCollapsed = false;
  classList$: Observable<IClass[]>; // Observable holding the class data

  constructor(private router: Router, private route: ActivatedRoute, private store: Store) {
    this.classList$ = this.store.select(selectClass);
    console.log(this.classList$)
    this.route.paramMap.subscribe(params => {
      console.log('>>>route', params.get('blockId'));
    });
  }

  ngOnInit(): void {


  }

  // Check if a route is active
  isRouteActive(routePath: string): boolean {
    return this.router.url.includes(routePath);
  }

  // Navigate to a specific route
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
