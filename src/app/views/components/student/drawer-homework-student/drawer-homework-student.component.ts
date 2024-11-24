import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject, Subscription, switchMap } from 'rxjs';
import { FileServiceService } from '../../../../core/services/service.file.ts/file-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environments } from '../../../../../environments/environment.development';
import dayjs from 'dayjs';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { StudentService } from '../../../../core/services/student/service.student';
import { NzUploadChangeParam, NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzNotificationService } from 'ng-zorro-antd/notification';
dayjs.extend(customParseFormat);
@Component({
  selector: 'app-drawer-homework-student',
  standalone: true,
  imports: [
    NzDrawerModule, NzCardModule, NzIconModule, NzButtonModule, NzModalModule, NzUploadModule, NzTypographyModule
  ],
  templateUrl: './drawer-homework-student.component.html',
  styleUrl: './drawer-homework-student.component.scss'
})
export class DrawerHomeworkStudentComponent {
  @Input() visibleDrawer = false;
  @Input() homework: IHomework | null = null
  @Output() closeDrawer = new EventEmitter<void>();
  deadLine: string | undefined = undefined
  isVisibleModalAssignment = false
  private destroy$ = new Subject<boolean>();
  isVisibleUpload = false
  uploadSuccess = false
  isExpired = false
  homeworkSubmission: IHomeworkSubmission | null = null
  submissionFileName: string = ''
  fileUpload: File | null = null
  constructor(private fileTeacherService: FileServiceService,
    private nzMessage: NzMessageService,
    private studentService: StudentService,
    private messageService: NzMessageService,
    private notification: NzNotificationService,
    private fileService: FileServiceService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['homework']) {
      this.checkExpired(this.homework?.dueDate!)
      this.deadLine = dayjs(this.homework?.dueDate).format('DD/MM/YYYY HH:mm:ss');

      this.fetchHomeworkSubmission(this.homework?.homeworkId!);
    }
  }
  fetchHomeworkSubmission(homeworkId: string) {
    this.studentService.getStudentSubmissions(homeworkId).subscribe(res => {
      this.homeworkSubmission = res
      this.submissionFileName = res.submissionName
      console.log('>>>listHomeworkSubmission', this.homeworkSubmission);
    })
  }
  handleSubmitHomework() {
    const statusSubmission = this.isExpired === false ? 0 : 1
    this.fileService.uploadFile(this.fileUpload!, 'submission').pipe(
      switchMap((res: any) => {
        return this.studentService.createHomeworkSubmission({
          homeworkId: this.homework?.homeworkId!,
          status: statusSubmission,
          submissionName: res.fileName
        })
      })
    ).subscribe({
      next: (res) => {
        this.isVisibleModalAssignment = false
        this.isVisibleUpload = false
        this.isExpired = false
        this.homeworkSubmission = null
        this.fetchHomeworkSubmission(this.homework?.homeworkId!)
        this.notification.success('Thành công', 'Nộp bài tập thành công');
      },
      error: (error) => {
        this.notification.error('Thất bại', 'Có lỗi xảy ra khi tạo bài tập');
        console.error(error);
      }
    })
  }
  downloadFile(fileName: string) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = `${environments.apiUrl}/assignment/${fileName}`;
    link.click();
    link.remove();
  }
  downloadSubmissionFile(fileName: string | undefined) {
    if (!fileName) return;

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = `${environments.apiUrl}/submission/${fileName}`;
    link.click();
    link.remove();
  }
  handleCancelModalAssignment() {
    this.isVisibleModalAssignment = false;
  }
  handleOkModalAssignment() {
    this.isVisibleModalAssignment = false;
  }
  handleCloseDrawer() {
    this.closeDrawer.emit();
    this.isVisibleUpload = false
  }
  getHomeworkStatus(dueDate: string): string {
    const now = dayjs();
    const due = dayjs(dueDate);

    if (due.isBefore(now)) {
      return 'Hết hạn';
    } else if (due.diff(now, 'hour') <= 24) {
      return 'Sắp hết hạn';
    } else {
      return 'Làm ngay';
    }
  }
  checkExpired(dueDate: string): void {
    const now = dayjs();
    const due = dayjs(dueDate);
    if (due.isBefore(now)) {
      this.isExpired = true;
    } else {
      this.isExpired = false;
    }
  }
  handleOpenUpload() {
    this.isVisibleUpload = !this.isVisibleUpload
  }
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.checkExpired(this.homework?.dueDate!)
      const readFile = info.fileList[0].originFileObj as File;
      this.fileUpload = readFile;
      console.log('>>>isExpired', this.isExpired);
      this.messageService.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    } else if (info.file.status === 'removed') {
      this.fileUpload = null
    }
  }
  dummyRequest = (args: NzUploadXHRArgs): Subscription => {
    const { file, onSuccess, onError } = args;

    console.log('>>>file', file.name);
    const realFile = file.originFileObj as File;
    if (file.originFileObj instanceof File) {
    }
    const observable = new Observable(subscriber => {
      setTimeout(() => {
        try {
          onSuccess && onSuccess({}, file, null);
          subscriber.complete();
        } catch (error) {
          onError && onError(new Error('Custom error message'), file);
          subscriber.error(error);
        }
      }, 1000);
    });

    // Trả về subscription từ observable
    return observable.subscribe();
  }

}
