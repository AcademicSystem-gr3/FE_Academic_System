import { createReducer, on } from "@ngrx/store";
import { addClass, addClassFailure, addClassSuccess, loadClass, loadClassFailure, loadClassSuccess } from "./teacher.class.action";

export interface ClassState {
    class: IClass[],
    error?: string
}
const initialState: ClassState = {
    class: [],
    error: undefined
}
export const classReducer = createReducer(
    initialState,
    on(loadClass, (state) => ({ ...state })),
    on(loadClassSuccess, (state, { class: classList }) => ({
        ...state,
        class: classList
    })),
    on(loadClassFailure, (state, { error }) => ({ ...state, error })),
    on(addClass, (state) => ({ ...state })),
    on(addClassSuccess, (state, { class: classList }) => ({
        ...state,
        class: classList
    })),
    on(addClassFailure, (state, { error }) => ({ ...state, error }))
)