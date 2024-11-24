
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environments } from '../../../../../../environments/environment.development';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { delay, finalize, map, Observable, switchMap, take } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentService } from '../../../../../core/services/student/service.student';
import { TeacherService } from '../../../../../core/services/teacher/service.teacher';
import dayjs from 'dayjs';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { BlogDropdownComponent } from '../../../blog-dropdown/blog-dropdown.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { FormEditorComponent } from '../../../form-editor/form-editor.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../../../core/states/user.login.data.ts/user.data.selector';
dayjs.extend(relativeTime)
import 'dayjs/locale/vi'
dayjs.locale('vi');
import relativeTime from 'dayjs/plugin/relativeTime';
import { GeneralService } from '../../../../../core/services/general/service.general';
@Component({
  selector: 'app-stream-student',
  standalone: true,
  imports: [
    CommonModule, NzIconModule, NzTypographyModule, NzAvatarModule, NgxEditorModule, FormsModule, ReactiveFormsModule,
    NzButtonModule, NzDropDownModule, NzAvatarModule, NzDividerModule, BlogDropdownComponent, NgTemplateOutlet, NzCommentModule,
    NzPopconfirmModule, FormEditorComponent, NzSpinModule

  ],
  templateUrl: './stream-student.component.html',
  styleUrl: './stream-student.component.scss'
})
export class StreamStudentComponent {
  classStudent$: Observable<IClass>;
  @ViewChild('content') contentElement!: ElementRef;
  classStudentz: IClass | null = null;
  backendUrl: string = `${environments.apiUrl}/img/`;
  html = 'Hello world!';
  editor: Editor;
  editorUpdate: Editor;
  openEditForm = false
  isExpanded = false;
  shouldShowButton = false;
  classId: string | null = '';
  listBlogInClass: IBlogWithUser[] = [];
  currentEditId: string | null = null;
  formIsValid: boolean = false;
  contentBlog: string = '';
  loadingSpinner: boolean = false
  user: IUser | null = null
  user$: Observable<IUser | null>
  commentRoot: string = ''
  replyId: string | null = null; // để track comment nào đang được reply
  replyContent = ''; // để lưu nội dung reply
  listCommentBlogInClass: ICommentBlog[] = [];
  listCommentInBlog: ICommentBlog[] = [];
  commentData: ICommentBlog[] | null = null;
  toggleContent() {
    this.isExpanded = !this.isExpanded;
  }
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  openEditor = false;
  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });
  formEdit = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private nzMessageService: NzMessageService,
    private store: Store,
    private generalService: GeneralService
  ) {
    this.editor = new Editor();
    this.editorUpdate = new Editor();
    this.classStudent$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.openEditor = false
        this.classId = params.get('classId')
        this.fetchBlogInClass(params.get('classId')!)
        this.fetchCommentBlogInClass(params.get('classId')!)

        console.log('>>>classId', params.get('classId'));
        return this.studentService.getClass(params.get('classId')!)
      })
    );
    this.user$ = this.store.select(selectUser)
    console.log(this.classStudent$);
    localStorage.setItem('backToList', this.router.url)
  }
  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     const contentHeight = this.contentElement.nativeElement.scrollHeight;
  //     this.shouldShowButton = contentHeight > 96;
  //   }, 500); // Increase timeout if necessary
  // }
  getTimeAgo(date: string | Date) {
    return dayjs(date).fromNow();
  }
  handleOpenEditor() {
    this.openEditor = !this.openEditor
  }
  handleOpenEditForm() {
    this.openEditForm = !this.openEditForm
  }
  ngOnInit(): void {
    console.log('>>>classList', this.classStudent$);
    this.user$.subscribe(user => {
      this.user = user
    })
    if (this.listBlogInClass.length > 0) {
      console.log('>>>commentdtos', this.listBlogInClass[0]?.commentDtos);
    } else {
      console.log('list blog in class is empty');
    }
  }
  fetchBlogInClass(classId: string) {
    this.studentService.getBlogs(classId).subscribe(updatedRes => {
      this.listBlogInClass = updatedRes
      console.log('>>>commentdtos', this.listBlogInClass[0]?.commentDtos);
      console.log('>>>listBlogInClass', this.listBlogInClass);
    });
  }

  fetchCommentBlogInClass(classId: string) {
    this.generalService.getCommentBlogsInClass(classId).pipe(take(1)).subscribe(res => {
      this.listCommentInBlog = res

    })
  }
  fetchCommentBlog(blogId: string) {
    this.generalService.getCommentBlogsInBlog(blogId).pipe(take(1)).subscribe(res => {
      this.listCommentBlogInClass = res
    })
  }
  submitForm() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.teacherService.createBlog(this.form.getRawValue().editorContent as string, this.classId!).subscribe({
        next: () => {
          this.fetchBlogInClass(this.classId!)
          this.handleOpenEditor()
          this.form.reset()
          this.nzMessageService.success('Blog created successfully');
        },
        error: () => {
          this.nzMessageService.error('Error creating blog');
        }
      })
    }
  }

  submitUpdateForm(blogId: string) {
    if (this.formEdit.valid) {
      this.teacherService.updateBlog(blogId, this.formEdit.getRawValue().editorContent as string).subscribe({
        next: () => {
          this.fetchBlogInClass(this.classId!)
          this.handleOpenEditForm()
          this.form.reset()
          this.nzMessageService.success('Blog updated successfully');
        },
        error: () => {
          this.nzMessageService.error('Error updating blog');
        }
      })
    }
  }
  handleEditBlog(blog: IBlogWithUser) {
    this.currentEditId = blog.blog.blogId
    this.handleOpenEditForm()
    this.formEdit.setValue({
      editorContent: blog.blog.content
    })
  }
  handleDeleteBlog(blog: IBlogWithUser) {
    console.log('>>>Blog delete', blog);
    this.teacherService.deleteBlog(blog.blog.blogId).subscribe(res => {
      if (res) {
        this.nzMessageService.success('Xóa blog thành công');
        this.formEdit.reset()
        this.fetchBlogInClass(this.classId!)

      } else {
        this.nzMessageService.error('Xóa blog thất bị');
      }
    });
  }
  handleFormValidityChange(valid: boolean) {
    this.formIsValid = valid;
  }
  handleContentBlog(content: string) {
    this.contentBlog = content
  }
  handleUpdateBlog(blogUpdate: IBlogWithUser) {
    if (this.formEdit.valid) {
      this.teacherService.updateBlog(blogUpdate.blog.blogId, this.contentBlog).subscribe({
        next: () => {
          this.fetchBlogInClass(this.classId!)
          this.handleOpenEditForm()
          this.form.reset()
          this.currentEditId = null
          this.nzMessageService.success('Blog updated successfully');
        },
        error: () => {
          this.nzMessageService.error('Error updating blog');
        }
      })
    }
  }

  handleCloseEditForm() {
    this.currentEditId = null
  }

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }
  data = {
    id: 1,
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    children: [
      {
        id: 2,
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources' +
          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        children: [
          {
            id: 3,
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
          },
          {
            id: 4,
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
          }
        ]
      }
    ]
  };
  toggleReply(commentId: string): void {
    this.replyId = this.replyId === commentId ? null : commentId;
    this.replyContent = '';
  }

  handleReply(parentComment: any, blog: IBlogWithUser): void {
    // console.log('Reply content:', this.replyContent);
    if (this.replyContent.trim()) {
      // console.log('>>>replyContent', this.replyContent);
      const newReply = {
        id: Date.now(),
        author: 'Current User',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: this.replyContent,
        children: []
      };
      parentComment.children = parentComment.children || [];
      parentComment.children.push(newReply);

      this.generalService.createCommentBlog({
        blogID: blog.blog.blogId,
        content: this.replyContent,
        creatorId: this.user?.data.id!,
        repCommentID: parentComment.id
      }).pipe(take(1)).subscribe(res => {
        if (res) {
          this.nzMessageService.success('Reply successfully');
          this.replyContent = ''
          this.fetchBlogInClass(this.classId!)
        }
      })
      // Reset sau khi reply
      this.replyContent = '';
      this.replyId = null;
    }
  }
  handleSendCommentRoot(blog: IBlogWithUser) {
    console.log('>>>commentRoot', this.commentRoot);
    if (this.commentRoot.trim() !== '') {
      console.log('>>>commentRoot inside', this.commentRoot);
      this.generalService.createCommentBlog({
        blogID: blog.blog.blogId,
        content: this.commentRoot,
        creatorId: this.user?.data.id!
      }).pipe(take(1)).subscribe(res => {
        if (res) {
          this.nzMessageService.success('Comment successfully');
          this.commentRoot = ''
          this.fetchBlogInClass(this.classId!)
        }
      })
    }
  }
}
