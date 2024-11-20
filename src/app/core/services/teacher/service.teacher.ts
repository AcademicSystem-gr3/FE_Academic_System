import { Injectable } from "@angular/core";
import { ServiceBaseService } from "../service.base";
import { Option } from "../../../views/components/folder/folder.component";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    constructor(
        private serviceBase: ServiceBaseService
    ) { }

    getCategory(ownerId: string) {
        const params = new HttpParams({ fromString: `ownerId=${ownerId}` });
        return this.serviceBase.get<Option>('/api/teacher/folder/category', params);
    }
    CreateFolder(data: ICreateFolder) {
        return this.serviceBase.post<ICreateFolder>('/api/teacher/folder', { ...data });
    }

    loadAllFolder(folderId: string) {
        const params = new HttpParams({ fromString: `id=${folderId}` });
        return this.serviceBase.get<IFolderContent[]>('/api/teacher/folder', params);
    }
    handleRenameFolder(folderId: string, folderName: string) {
        return this.serviceBase.put<IFolderContent[]>(`/api/teacher/folder/${folderId}`, { folderName });
    }
    handleDeleteFolder(folderId: string) {
        return this.serviceBase.delete<IFolderContent[]>(`/api/teacher/folder/${folderId}`);
    }
    handleCreateClass(data: ICreateClass) {
        return this.serviceBase.post<IClass>(`/api/teacher/class`, { ...data })
    }
    getAdllClassInBlock(blockName: string) {
        const params = new HttpParams({ fromString: `name=${blockName}` });
        return this.serviceBase.get<IClass[]>('/api/teacher/class', params);
    }
    getAllClassByTeacher() {
        return this.serviceBase.get<IClass[]>('/api/teacher/all-class');
    }
    getClassByName(name: string) {
        const params = new HttpParams({ fromString: `classId=${name}` });
        return this.serviceBase.get<IClass>('/api/teacher/get-class', params);
    }
    createBlog(content: string, classId: string) {
        return this.serviceBase.post<IBlog>('/api/teacher/blog', { content, classId })
    }
    getAllBlogInClass(classId: string) {
        const params = new HttpParams({ fromString: `classId=${classId}` });
        return this.serviceBase.get<IBlog[]>('/api/teacher/blog', params);
    }
    updateBlog(blogId: string, content: string) {
        return this.serviceBase.put<IBlog>(`/api/teacher/blog/${blogId}`, { content })
    }
    deleteBlog(blogId: string) {
        return this.serviceBase.delete<IBlog>(`/api/teacher/blog/${blogId}`)
    }
    resetClassCode(classId: string) {
        return this.serviceBase.put<IClass>(`/api/teacher/reset-class-code/${classId}`, {})
    }
    CreateHomework(data: ICreateHomework) {
        return this.serviceBase.post<IHomework>('/api/teacher/homework', { ...data });
    }
    getAllHomeworkInClass(classId: string) {
        const params = new HttpParams({ fromString: `classId=${classId}` });
        return this.serviceBase.get<IHomework[]>('/api/teacher/homework-class', params);
    }

    createLesson(data: ICreateLesson) {
        return this.serviceBase.post<ILesson>('/api/teacher/lesson', { ...data });
    }
    getAllLessonInClass(classId: string) {
        const params = new HttpParams({ fromString: `classId=${classId}` });
        return this.serviceBase.get<ILesson[]>('/api/teacher/lesson', params);
    }
    createQuiz(data: ICreateQuiz) {
        return this.serviceBase.post<IQuiz>('/api/teacher/quiz', { ...data });
    }
    getAllQuizInLesson(lessonId: string) {
        const params = new HttpParams({ fromString: `lessonId=${lessonId}` });
        return this.serviceBase.get<IQuiz[]>('/api/teacher/quiz-lesson', params);
    }
}
