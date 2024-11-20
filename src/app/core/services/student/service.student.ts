import { Injectable } from "@angular/core";
import { ServiceBaseService } from "../service.base";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    constructor(private serviceBase: ServiceBaseService) { }
    joinClass(classCode: string) {
        const params = new HttpParams({ fromString: `classCode=${classCode}` });
        return this.serviceBase.get<any>('/api/student/join-class', params);
    }
    fetchSubject(className: string) {
        const params = new HttpParams({ fromString: `className=${className}` });
        return this.serviceBase.get<ISubjectClass[]>('/api/student/get-subjects', params);
    }
    fetchAllClass() {
        return this.serviceBase.get<IClassStudent[]>('/api/student/get-classes');
    }
    createBlog(content: string, classId: string) {
        return this.serviceBase.post<IBlog>('/api/student/blog', { content, classId })
    }
    getClass(classId: string) {
        const params = new HttpParams({ fromString: `classId=${classId}` });
        return this.serviceBase.get<IClass>('/api/student/class', params);
    }
    getBlogs(classId: string) {
        const params = new HttpParams({ fromString: `classId=${classId}` });
        return this.serviceBase.get<IBlogWithUser[]>('/api/student/all-blog', params);
    }
    getStudentSubmissions(homeworkId: string) {
        const params = new HttpParams({ fromString: `homeworkId=${homeworkId}` });
        return this.serviceBase.get<IHomeworkSubmission>('/api/student/homework-submission', params);
    }
}