import { AppComponent } from './app.component';
import { AuthGuard } from './core/auth/auth.route';
import { RoleGuard } from './core/auth/auth.role';
import { Routes } from '@angular/router';
import { Role } from './core/constant/constant.role';
import { PageNotFoundComponent } from './views/pages/errors/page.not-found/page.not-found.component';
import { LoginComponent } from './views/pages/login/login.component';
import { LayoutMainComponent } from './views/components/layouts/layout-main/layout-main.component';
import { LoginGuard } from './core/auth/auth.login';
import { RegisterComponent } from './views/pages/register/register.component';
import { VerifyRegisterComponent } from './views/pages/verify-register/verify-register.component';
import { ForgotPasswordComponent } from './views/pages/forgot-password/forgot-password.component';
import { SendSuccessComponent } from './views/pages/send-success/send-success.component';
import { ResetPasswordComponent } from './views/pages/reset-password/reset-password.component';
import { FolderComponent } from './views/components/folder/folder.component';
import { LayoutTeacherComponent } from './views/components/layouts/layout-teacher/layout-teacher.component';
import { LayoutStudentComponent } from './views/components/layouts/layout-student/layout-student.component';
import { DoQuizComponent } from './views/pages/do-quiz/do-quiz.component';
import { ArticleComponentComponent } from './article-component/article-component.component';
import { ClassComponent } from './views/components/class/class.component';
import { DefaultRedirectGuard } from './core/auth/DefaultRedirectGuard';
import { WorksComponent } from './views/components/works/works.component';
import { HomeTeacherComponent } from './views/components/home-teacher/home-teacher.component';
import { BlockComponent } from './views/components/block/block.component';
import { ClassStudentComponent } from './views/components/student/class-student/class-student.component';
import { ClassSubjectComponent } from './views/components/student/class-subject/class-subject.component';


export const routes: Routes = [

    { path: 'login', title: 'A3S Đăng nhập', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'verify-otp', title: 'A3S Xác thực Otp', component: VerifyRegisterComponent, canActivate: [LoginGuard] },
    { path: 'register', title: 'A3S Đăng kí', component: RegisterComponent, canActivate: [LoginGuard] },
    { path: 'forgot-password', title: 'A3S Quên mật khẩu', component: ForgotPasswordComponent, canActivate: [LoginGuard] },
    { path: 'send-success', title: 'A3S Gửi thành công', component: SendSuccessComponent, canActivate: [LoginGuard] },
    { path: 'reset-password/:token/:email', title: 'A3S Đặt lại mật khẩu', component: ResetPasswordComponent, canActivate: [LoginGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'teacher',
        component: LayoutMainComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: [Role.TEACHER] },

        children: [
            {

                path: '',
                component: LayoutTeacherComponent,
                data: { breadcrumb: 'Trang chủ' },
                children: [
                    {
                        path: 'home',
                        title: 'A3S Trang chủ',
                        component: HomeTeacherComponent,
                        data: { breadcrumb: '' },
                    },
                    {
                        path: 'folder',
                        title: 'A3S Thư mục',
                        component: FolderComponent,
                        data: { breadcrumb: 'Thư mục' },
                        // canActivate: [DefaultRedirectGuard]
                    },
                    {
                        path: 'block/:blockId',
                        component: BlockComponent,
                        data: { breadcrumb: 'Khối' },
                        // canActivate: [DefaultRedirectGuard]
                    },
                    {
                        path: 'block/:blockId/class/:classId',
                        component: ClassComponent,
                        data: { breadcrumb: 'Lớp' },
                        // canActivate: [DefaultRedirectGuard]
                    },
                    {
                        path: 'works',
                        component: WorksComponent,
                        data: { breadcrumb: 'Công việc' },
                        // canActivate: [DefaultRedirectGuard]
                    }
                ]
            }
        ]
    },
    {
        path: 'student',
        component: LayoutMainComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: [Role.STUDENT] },
        children: [
            {
                path: '',
                component: LayoutStudentComponent,
                children: [
                    { path: 'quiz', title: 'A3S Trắc Nghiệm', component: DoQuizComponent },
                    { path: 'class/:className', title: 'A3S Lớp', component: ClassStudentComponent },
                    { path: 'subject/:slug/:classId', title: 'A3S Môn học', component: ClassSubjectComponent },
                ]
            }
        ]

    },

    { path: '**', component: PageNotFoundComponent },
];


