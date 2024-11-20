import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TeacherService } from "../../services/teacher/service.teacher";
import { catchError, map, of, switchMap } from "rxjs";
import { addClass, addClassSuccess, loadClass, loadClassFailure, loadClassSuccess } from "./teacher.class.action";
import { updateUser } from "../user.login.data.ts/user.data.action";

@Injectable()
export class TeacherClassEffects {
    constructor(
        private actions$: Actions,
        private teacherClassService: TeacherService
    ) { }
    loadClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadClass),
            switchMap((action) =>
                this.teacherClassService.getAdllClassInBlock(action.blockName).pipe(
                    map(classData => {
                        if (classData) {
                            console.log('>>> class data', classData);
                            return loadClassSuccess({ class: classData });
                        } else {
                            return loadClassFailure({ error: 'Class data not found' });
                        }
                    }),
                    catchError(error => of(loadClassFailure({ error: error.message })))
                )
            )
        )
    );
    addClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addClass),
            switchMap(({ class: newClass }) =>
                this.teacherClassService.handleCreateClass(newClass).pipe(
                    switchMap(
                        (action) => this.teacherClassService.getAdllClassInBlock(action.block.name).pipe(
                            map(classData => {
                                if (classData) {
                                    console.log('>>> class data', classData);
                                    return loadClassSuccess({ class: classData });
                                } else {
                                    return loadClassFailure({ error: 'Class data not found' });
                                }
                            }))
                    ),
                    catchError(error => of(loadClassFailure({ error: error.message })))
                )
            )
        )
    );
}