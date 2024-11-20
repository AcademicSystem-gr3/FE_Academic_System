import { createAction, props } from "@ngrx/store";

export const loadClass = createAction('[Class] Load Class', props<{ blockName: string }>());
export const loadClassSuccess = createAction('[Class] Load Class Success', props<{ class: IClass[] }>());
export const loadClassFailure = createAction('[Class] Load Class Failure', props<{ error: string }>());

export const addClass = createAction('[Class] Add Class', props<{ class: ICreateClass }>());
export const addClassSuccess = createAction('[Class] Add Class Success', props<{ class: IClass[] }>());
export const addClassFailure = createAction('[Class] Add Class Failure', props<{ error: string }>());