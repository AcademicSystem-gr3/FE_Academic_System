import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../../core/services/teacher/service.teacher';
import { BehaviorSubject, delay, finalize, map, Observable, of, Subscription, switchMap, take } from 'rxjs';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { environments } from '../../../../environments/environment.development';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BlogDropdownComponent } from '../blog-dropdown/blog-dropdown.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import dayjs from 'dayjs';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NzSpinModule } from 'ng-zorro-antd/spin';
dayjs.extend(relativeTime)
import 'dayjs/locale/vi'
import { FormEditorComponent } from "../form-editor/form-editor.component";
import { StudentService } from '../../../core/services/student/service.student';
import { GeneralService } from '../../../core/services/general/service.general';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/states/user.login.data.ts/user.data.selector';
dayjs.locale('vi');
@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [
    CommonModule, NzIconModule, NzTypographyModule, NzAvatarModule, NgxEditorModule, FormsModule, ReactiveFormsModule,
    NzButtonModule, NzDropDownModule, NzAvatarModule, NzDividerModule, BlogDropdownComponent, NgTemplateOutlet, NzCommentModule,
    NzPopconfirmModule, FormEditorComponent, NzSpinModule
  ],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss'
})
export class StreamComponent implements OnInit, AfterViewInit {
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
  listCommentBlogInClass: ICommentBlog[] = [];
  replyContent = '';
  commentRoot: string = ''
  user: IUser | null = null
  user$: Observable<IUser | null>
  replyId: string | null = null;
  commentMap: { [blogId: string]: string } = {};

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
    private teacherService: TeacherService,
    private nzMessageService: NzMessageService,
    private studentService: StudentService,
    private generalService: GeneralService,
    private store: Store
  ) {
    this.editor = new Editor();
    this.editorUpdate = new Editor();
    this.classStudent$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.openEditor = false
        this.classId = params.get('classId')
        this.fetchBlogInClass(params.get('classId')!)
        return this.teacherService.getClassByName(params.get('classId')!)
      })
    );
    this.user$ = this.store.select(selectUser)
    console.log('>>>classListhere', this.classStudent$);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const contentHeight = this.contentElement.nativeElement.scrollHeight;
      this.shouldShowButton = contentHeight > 96;
    }, 500); // Increase timeout if necessary
  }
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
    this.user$.subscribe(user => {
      this.user = user
    })
  }
  fetchBlogInClass(classId: string) {
    this.studentService.getBlogs(classId).subscribe(updatedRes => {
      this.listBlogInClass = updatedRes
      console.log('>>>listBlogInClass', this.listBlogInClass);
    });
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
  handleUpdateBlog(blog: IBlogWithUser) {
    if (this.formEdit.valid) {
      this.teacherService.updateBlog(blog.blog.blogId, this.contentBlog).subscribe({
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
  handleResetClassCode() {
    this.loadingSpinner = true
    this.teacherService.resetClassCode(this.classId!).pipe(
      delay(2000),
      finalize(
        () => this.loadingSpinner = false
      ),
    ).subscribe(res => {
      if (res) {
        this.teacherService.getClassByName(this.classId!).subscribe(res => {
          this.classStudent$ = of(res)
          this.nzMessageService.success('Reset code class successfully');
        })
      }
    })
  }
  confirm(): void {
    this.nzMessageService.info('click confirm');
  }
  data = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    children: [
      {
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources' +
          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        children: [
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
          },
          {
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
    const comment = this.commentMap[blog.blog.blogId] || '';
    // Send comment for specific blog item
    // Then clear the specific comment


    if (comment) {
      console.log('>>>commentRoot inside', this.commentRoot);
      this.generalService.createCommentBlog({
        blogID: blog.blog.blogId,
        content: comment,
        creatorId: this.user?.data.id!
      }).pipe(take(1)).subscribe(res => {
        if (res) {
          this.nzMessageService.success('Comment successfully');
          this.commentMap[blog.blog.blogId] = '';
          this.fetchBlogInClass(this.classId!)
        }
      })
    }
  }
}
