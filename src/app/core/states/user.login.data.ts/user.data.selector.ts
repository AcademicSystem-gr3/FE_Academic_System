// user.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.data.reducer';


export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, (state: UserState) => state.user);
export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error);
