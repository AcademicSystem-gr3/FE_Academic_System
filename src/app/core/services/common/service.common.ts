import { Injectable } from "@angular/core";
import { ServiceBaseService } from "../service.base";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private serviceBase: ServiceBaseService) { }

    registerUser(user: IRegisterUser) {
        return this.serviceBase.post<any>('/api/register', { ...user })
    }
    updateUser(user: any) {
        return this.serviceBase.put<any>('/api/user/update', { ...user })
    }
    changePassword(password: IChangePassword) {
        return this.serviceBase.put<any>('/api/user/change-password', { ...password })
    }
    getUser(userId: string) {
        const params = new HttpParams({ fromString: `userId=${userId}` });
        return this.serviceBase.get<IUser>('/api/user/get-user', params);
    }
}