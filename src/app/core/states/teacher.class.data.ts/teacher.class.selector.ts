import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassState } from './teacher.class.reducer';

// Tạo feature selector
export const selectClassState = createFeatureSelector<ClassState>('class'); // 'class' là tên feature khi đăng ký trong StoreModule

// Tạo selector để lấy danh sách class
export const selectClass = createSelector(
    selectClassState,
    (state: ClassState) => state.class
);