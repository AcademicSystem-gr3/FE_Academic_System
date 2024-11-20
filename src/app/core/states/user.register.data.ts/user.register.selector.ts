import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

const selectDataRegisterUserState = (state: AppState) => state.registerUser

export const selectDataUser = createSelector(
    selectDataRegisterUserState,
    (state) => state?.userRegister
)