import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FileServiceService } from '../../../core/services/service.file.ts/file-service.service';
import { environments } from '../../../../environments/environment.development';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
dayjs.extend(customParseFormat);
interface ItemData {
  gender: string;
  name: Name;
  email: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}
@Component({
  selector: 'app-drawer-homework',
  standalone: true,
  imports: [NzDrawerModule, NzCardModule, NzIconModule, NzButtonModule, NzModalModule,
    NzListModule, NzSkeletonModule, CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport
  ],
  templateUrl: './drawer-homework.component.html',
  styleUrl: './drawer-homework.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerHomeworkComponent implements OnChanges, OnInit, OnDestroy {
  @Input() visibleDrawer = false;
  @Input() homework: IHomework | null = null
  @Output() closeDrawer = new EventEmitter<void>();
  deadLine: string | undefined = undefined
  isVisibleModalAssignment = false
  ds = new MyDataSource(this.http);
  private destroy$ = new Subject<boolean>();
  constructor(private fileTeacherService: FileServiceService,
    private http: HttpClient,
    private nzMessage: NzMessageService
  ) {
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.ds
      .completed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nzMessage.warning('Infinite List loaded all');
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['homework']) {
      this.deadLine = dayjs(this.homework?.dueDate).format('DD/MM/YYYY HH:mm:ss');
    }
  }
  downloadFile(fileName: string) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = `${environments.apiUrl}/assignment/${fileName}`;
    link.click();
    link.remove();
  }
  handleCancelModalAssignment() {
    this.isVisibleModalAssignment = false;
  }
  handleOkModalAssignment() {
    this.isVisibleModalAssignment = false;
  }
}
class MyDataSource extends DataSource<ItemData> {
  private pageSize = 10;
  private cachedData: ItemData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(private http: HttpClient) {
    super();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
      if (this.cachedData.length >= 50) {
        this.complete$.next();
        this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchPage(endPage + 1);
      }
    });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.http
      .get<{ results: ItemData[] }>(
        `https://randomuser.me/api/?results=${this.pageSize}&inc=name,gender,email,nat&noinfo`
      )
      .pipe(catchError(() => of({ results: [] })))
      .subscribe(res => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.results);
        this.dataStream.next(this.cachedData);
      });
  }
}
