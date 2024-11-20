import { createAction, props } from '@ngrx/store';


// Define actions
export const loadUser = createAction('[User] Load User');
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: IUser }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());

export const updateUser = createAction('[User] Update User', props<{ user: IUpdateProfile }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: IUser }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());
