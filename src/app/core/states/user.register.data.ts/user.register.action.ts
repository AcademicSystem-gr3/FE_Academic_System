import { createAction, props } from "@ngrx/store";
import { IUserRegister } from "./user.register.reducer";

export const setUserRegister = createAction(
    '[Register] Set user',
    props<{ userRegister: IUserRegister }>()
);

export const clearUserRegister = createAction('[Register] Clear user');
