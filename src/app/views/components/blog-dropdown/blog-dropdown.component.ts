import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TeacherService } from '../../../core/services/teacher/service.teacher';

@Component({
  selector: 'app-blog-dropdown',
  standalone: true,
  imports: [NzDropDownModule, NzIconModule, NgTemplateOutlet, NzCommentModule,
    NzPopconfirmModule],
  templateUrl: './blog-dropdown.component.html',
  styleUrl: './blog-dropdown.component.scss'
})
export class BlogDropdownComponent {
  @Input() blog: IBlogWithUser | undefined
  @Output() deleteBlog = new EventEmitter<IBlogWithUser>();
  @Output() editBlog = new EventEmitter<IBlogWithUser>();

  constructor(private nzMessageService: NzMessageService,
    private teacherService: TeacherService

  ) { }
  onDeleteBlog() {
    this.deleteBlog.emit(this.blog);
  }
  onEditBlog() {
    this.editBlog.emit(this.blog);
  }
  cancel(): void {
    this.nzMessageService.info('Hủy thao tác');
  }

  confirm(): void {
    this.nzMessageService.info('Xóa bài viết');
  }
}
