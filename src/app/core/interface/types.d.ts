export { }
declare global {
    interface IUser {
        data: {
            id: string,
            fullname: string,
            email: string,
            address: string,
            avatar: string,
            phoneNumber: string,
            status: 1,
            roles: string[],
            provider: string,
            refreshToken: string,
            refreshTokenExpiryTime: string,
            accessToken: string

        }
    }
    interface IToken {
        access_Token: string
    }
    interface IMessageOtp {
        message: string
    }
    interface IRegisterUser {
        fullname: string,
        email: string,
        address: string,
        phone: string,
        password: string,
        otp: string
    }
    interface IProvince {

        id: string,
        name: string,
    }

    interface IDistrict {

        id: string,
        name: string,
    }
    interface ICommune {

        id: string,
        name: string,
    }
    interface IUpdateProfile {
        fullname: string,
        address: string,
        phone: string
        avatar: string
    }
    interface IChangePassword {
        oldPassword: string,
        newPassword: string
    }
    interface ICreateFolder {
        folderName: string,
        ownerId: string,
        category: string,
        parentId?: string
    }
    interface IFolderContent {
        folderId: string,
        folderName: string,
        parent: string,
        ownerId: string,
        category: string,
        status: string,
        files: [
            fileId: string,
            fileName: string,
            folderId: string,
            fileUrl: string,
            creatorId: string,
            tag: string,
            createdAt: string,
            updatedAt: string
        ] | null,
        createdAt: string,
        updatedAt: string
    }
    interface ICreateClass {
        className: string,
        blockName: string
    }
    interface IClass {
        classId: string,
        name: string,
        creatorId: string,
        classCode: string,
        imageThemes: string,
        createdAt: string,
        updatedAt: string,
        blockId: string,
        block: {
            id: string,
            name: string
        },
        user: {
            id: string,
            fullname: string,
            email: string,
            address: string,
            avatar: string,
            phoneNumber: string,
            status: 1,
            roles: string[],
            provider: string,
            refreshToken: string,
            refreshTokenExpiryTime: string,
            accessToken: string
        }
    }

    interface IBlog {
        blogId: string,
        creatorId: string,
        view: number,
        status: number,
        content: string,
        numLike: number,
        createdAt: string,
        updatedAt: string
    }
    interface IHomework {
        homeworkId: string,
        classId: string,
        CreateBy: string,
        fileName: string,
        title: string,
        description: string,
        dueDate: string,
        createdAt: string,
    }
    interface ICreateHomework {
        classId: string,
        CreateBy: string,
        fileName: string,
        title: string,
        description?: string,
        dueDate: Date,
    }
    interface IQuizQuestion {
        Question: string,
        ListAnswers: string[],
        IsCorrect: string
    }
    // interface IAnswer {
    //     Answer1: string,
    //     Answer2: string,
    //     Answer3: string,
    //     Answer4: string,
    // }
    interface ILesson {
        lessionId: string,
        lessionName: string,
        status: boolean,
        createdAt: string
        updatedAt: string
    }
    interface ICreateLesson {
        lessionName: string,
        classId: string
    }
    interface ICreateQuiz {
        QuizName: string,
        Duration: string,
        LessonId: string,
        CreatorId: string
        listQuestionAndAnswers: IQuizQuestion[]
    }
    interface IQuiz {
        quizId: string
        quizName: string
        duration: string
        passRate?: string
        lessonId: string
        status: boolean
        creatorId: string
        createdAt: string
        updatedAt: string
    }
    interface IClassStudent {
        classId: string,
        name: string,
        creatorId: string,
        classCode: string,
        createdAt: string,
        updatedAt: string,
        imageThemes: string,
        blockId: string
    }
    interface ISubject {
        subjectId: string,
        subjectName: string,
        SubjectCode: string,
        creatorBy: string,
        teacherId: string,
        createdAt: string,
        updatedAt: string
    }
    interface ISubjectClass {
        classId: string,
        subject: {
            subjectId: string;
            subjectCode: string;
            subjectName: string;
            description: string;
            creatorBy: string;
            createdAt: string;
            updatedAt: string;
            teacherID: string;
            teacher: null;
            creator: null;
            classSubjects: null;
        },
        teacherName: string,
        teacherEmail: string,
        teacherAvatar: string,
        imgTheme: string
    }

    interface IBlogWithUser {
        userId: string,
        userName: string;
        userEmail: string;
        userAvatar: string;
        blog: {
            blogId: string;
            creatorId: string;
            view: number;
            status: number;
            content: string;
            numLike: number;
            createdAt: Date;
            updatedAt: Date;
            creator: null;
            commentBlogs: null;
            classBlogs: null;
        }
    }
    interface IHomeworkSubmission {
        submissionId: string,
        homeworkId: string,
        userId: string,
        statusHomework: number,
        submittedAt: string,
        feedBack: string
    }
}
