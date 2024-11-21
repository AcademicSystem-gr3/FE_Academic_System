import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgxEditorModule, NzButtonModule],
  templateUrl: './form-editor.component.html',
  styleUrl: './form-editor.component.scss'
})
export class FormEditorComponent implements OnChanges, OnInit {
  @Input() blog: IBlogWithUser | undefined;
  @Input() openEditorForm: boolean | undefined
  @Output() updateBlog = new EventEmitter<IBlogWithUser>();
  @Output() openForm = new EventEmitter<void>();
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() contentBlog = new EventEmitter<string>();
  openEditor = false
  editorUpdate: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  formEdit = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });

  constructor() {
    this.editorUpdate = new Editor();
  }
  ngOnInit(): void {
    this.formEdit.setValue({
      editorContent: this.blog?.blog.content as string
    })
    this.formEdit.valueChanges.subscribe(() => {
      this.formValidityChange.emit(this.formEdit.valid)
      this.contentBlog.emit(this.formEdit.getRawValue().editorContent as string)
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blog'].currentValue !== changes['blog'].previousValue) {
      this.formEdit.setValue({
        editorContent: this.blog?.blog.content as string
      })
    }
  }
  handleCloseEditForm() {
    this.openForm.emit()
  }
  submitUpdateForm() {
    this.updateBlog.emit(this.blog)
  }
  // handleOpenEditForm() {
  //   this.openForm.emit(this.openEditor)
  // }
}

