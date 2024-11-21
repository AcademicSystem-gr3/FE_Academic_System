import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher/service.teacher';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
import { NzMessageService } from 'ng-zorro-antd/message';
interface BreadcrumbItem {
  label: string;
  url: string;
}
export interface Option {
  label: string;
  value: string;
}
@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [NzBreadCrumbModule, NzDividerModule, RouterLink, NzDropDownModule, NzDrawerModule, NzDescriptionsModule, NzModalModule,
    FormsModule, NzInputModule, NzUploadModule, NzButtonModule, NzIconModule, NzAutocompleteModule, CommonModule
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent implements OnInit {
  @ViewChild('menu') menu!: NzDropdownMenuComponent;
  @ViewChild('menuItem') menuItem!: NzDropdownMenuComponent;
  isVisibleModalCreateFolder = false;
  valueFolderName?: string;
  isVisibleModalUploadFolder = false;
  visible = false;
  currentPath: string[] = [];
  breadcrumbs: BreadcrumbItem[] = [];
  options: Option[] = [];
  inputValue: Option = { label: 'zz', value: 'zzz' };
  user: IUser | null = null;
  user$: Observable<IUser | null>;
  editingIndex: number | null = null;
  selectedIndex: number | null = null;
  listFolder: IFolderContent[] = [];
  originalFolderName: string = '';
  public isEditing: boolean = false;
  public fileName: string = 'Downloads';
  public newFileName: string = this.fileName;
  constructor(
    private nzContextMenuService: NzContextMenuService,
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private store: Store,
    private msg: NzMessageService
  ) {
    this.user$ = this.store.select(selectUser);
  }


  saveFileName(item: number): void {
    if (this.listFolder[item].folderName.trim() !== '') {
      this.teacherService.handleRenameFolder(this.listFolder[item].folderId, this.listFolder[item].folderName).subscribe({
        next: (res) => {
          this.teacherService.loadAllFolder(this.user!.data.id).subscribe(folder => {
            this.listFolder = folder;
            console.log('>>>folder', res);
            this.msg.success('Thay đổi tên folder thành công')
            this.editingIndex = null;
          })
        },
        error: () => {
          this.listFolder[item].folderName = this.originalFolderName
          this.msg.error('Tên folder đã tồn tại')
        }
      })
    } else {
      this.listFolder[item].folderName = this.originalFolderName;
      this.msg.error('Tên folder không được để trống')
    }
  }


  cancelEditing(index: number): void {
    if (this.listFolder[index].folderName === '') {
      this.listFolder[index].folderName = this.originalFolderName;

    }
    this.editingIndex = null;
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.nzContextMenuService.create(event, this.menu);
  }
  onRightClickItem(event: MouseEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedIndex = index;
    this.nzContextMenuService.create(event, this.menuItem);
  }

  ngOnInit() {

    this.user$.pipe(
      filter(user => !!user),
      tap(user => this.user = user),
      switchMap(user => this.teacherService.getCategory(user!.data.id).pipe(
        map((res: any) => res.map((item: string) => ({ label: item, value: item })))
      )),
      tap((data) => {
        this.options = data;
        this.inputValue = this.options[0];
      }),
      switchMap(() => this.teacherService.loadAllFolder(this.user!.data.id))
    ).subscribe(folder => {
      this.listFolder = folder
      console.log('>>>folder', folder);
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePathAndBreadcrumbs();
      const folderId = this.route.snapshot.params['folderId'];
      if (folderId) {
        this.loadFolderContents(folderId);
      }
    });

  }
  loadFolderContents(folderId: string) {

  }
  compareFun = (o1: Option | string, o2: Option): boolean => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.label : o1.value === o2.value;
    } else {
      return false;
    }
  };
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  showModalCreateFolder(): void {
    this.isVisibleModalCreateFolder = true;
  }

  handleOkCreateFolder(): void {
    const folderCreate: ICreateFolder = {
      folderName: this.valueFolderName!,
      ownerId: this.user!.data.id,
      category: this.inputValue.label,
    }
    this.teacherService.CreateFolder(folderCreate).subscribe({
      next: () => {
        this.msg.success('Tạo folder thành công!');
        this.teacherService.loadAllFolder(this.user!.data.id).subscribe(folder => {
          this.listFolder = folder
          console.log('>>>folder', folder);
        })
        this.isVisibleModalCreateFolder = false;
      },
      error: () => {
        this.msg.error('Tạo folder thất bại!');
        this.isVisibleModalCreateFolder = false;
      }
    });
  }

  handleCancelCreateFolder(): void {
    console.log('Button cancel clicked!');

    this.isVisibleModalCreateFolder = false;
  }

  handleCancelUploadFolder(): void {
    this.isVisibleModalUploadFolder = false;
  }
  handleOkUploadFolder(): void {
    const dataFolder: ICreateFolder = {
      category: this.inputValue.label,
      folderName: this.valueFolderName!,
      ownerId: this.user!.data.id,
      parentId: this.inputValue.value
    }
    this.teacherService.CreateFolder
  }
  private updatePathAndBreadcrumbs() {
    let route = this.route.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data['isDynamicPath']) {
      this.currentPath = this.router.url.split('/').filter(segment => segment !== '' && segment !== 'teacher' && segment !== 'folder');
      this.breadcrumbs = this.currentPath.map((segment, index) => ({
        label: segment,
        url: '/teacher/folder/' + this.currentPath.slice(0, index + 1).join('/')
      }));
    }
  }

  onFolderClick(folderId: string) {
    this.router.navigate([...this.currentPath, folderId], { relativeTo: this.route });
  }
  onRename(): void {
    if (this.selectedIndex !== null) {
      this.editingIndex = this.selectedIndex;
      this.originalFolderName = this.listFolder[this.selectedIndex].folderName;
      console.log('>>>originalFolderName', this.originalFolderName);
    }
  }

  onDelete(): void {
    if (this.selectedIndex !== null) {
      this.teacherService.handleDeleteFolder(this.listFolder[this.selectedIndex].folderId).subscribe({
        next: () => {
          this.msg.success('Xóa folder thành công');
          this.teacherService.loadAllFolder(this.user!.data.id).subscribe(folder => {
            this.listFolder = folder
            console.log('>>>folder', folder);
          })
        },
        error: () => {
          this.msg.error('Xóa folder thất bị');
        }
      })

    }
  }

  onDownload(): void {
    console.log('Download clicked');
  }

  onViewDetail(): void {
    this.open();
  }
  onCreateFolder(): void {
    this.showModalCreateFolder();
  }

  onUpload(): void {
    this.isVisibleModalUploadFolder = true;
  }

  onShare(): void {

  }
  handleChange(info: any) {

  }
  openOverlay() {
    document.getElementById('overlay')!.classList.remove('hidden');
  }

  closeOverlay() {
    document.getElementById('overlay')!.classList.add('hidden');
  }
}