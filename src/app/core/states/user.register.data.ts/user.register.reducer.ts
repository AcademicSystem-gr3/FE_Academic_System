import { createReducer, on } from "@ngrx/store"
import { clearUserRegister, setUserRegister } from "./user.register.action"

export interface IUserRegister {
    email: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    password: string;
}

export interface IUserRegisterState {
    userRegister: IUserRegister | null;
}

export const initialDataUserRegisterState: IUserRegisterState = {
    userRegister: {
        email: "",
        fullname: "",
        phoneNumber: "",
        address: "",
        password: ""
    }
};
export const userRegisterUser = createReducer(
    initialDataUserRegisterState,
    on(setUserRegister, (state, { userRegister }) => ({ ...state, userRegister })),
    on(clearUserRegister, state => ({ ...state, userRegister: null }))
)