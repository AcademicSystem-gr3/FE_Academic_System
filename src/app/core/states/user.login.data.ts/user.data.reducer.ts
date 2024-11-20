import { createReducer, on } from '@ngrx/store';
import {
    loadUser,
    loadUserSuccess,
    loadUserFailure,
    updateUser,
    updateUserSuccess,
    updateUserFailure
} from './user.data.action';

export interface UserState {
    user: IUser | null;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    error: null,
};
export interface AppState {
    user: UserState;
}
export const userReducer = createReducer(
    initialState,
    on(loadUser, (state) => ({ ...state })),
    on(loadUserSuccess, (state, { user }) => ({
        ...state,
        user
    })),

    on(loadUserFailure, (state, { error }) => ({ ...state, error })),
    on(updateUser, (state) => ({ ...state })),
    on(updateUserSuccess, (state, { user }) => ({
        ...state,
        user: user
    })),

    on(updateUserFailure, (state, { error }) => ({ ...state, error }))
);
