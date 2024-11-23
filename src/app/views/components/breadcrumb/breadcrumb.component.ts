import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { filter, map } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [NzBreadCrumbModule, RouterLink, CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.route.root))
      )
      .subscribe(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      const newUrl = routeURL ? `${url}/${routeURL}` : url;

      let label = child.snapshot.data['breadcrumb'];

      // Kiểm tra và tạo breadcrumb động cho `blockId` và `classId`
      if (child.snapshot.paramMap.has('blockId')) {
        const blockId = child.snapshot.paramMap.get('blockId');
        label = `Khối ${blockId}`;
      }
      if (child.snapshot.paramMap.has('classId')) {
        const classId = child.snapshot.paramMap.get('classId');
        label = `Lớp ${classId}`;
      }

      // Kiểm tra nếu `label` đã tồn tại để tránh ghi đè
      if (label && !breadcrumbs.some(breadcrumb => breadcrumb.url === newUrl)) {
        breadcrumbs.push({ label, url: newUrl });
      }

      // Tiếp tục đệ quy với các cấp con
      this.buildBreadcrumbs(child, newUrl, breadcrumbs);
    }

    return breadcrumbs;
  }


}