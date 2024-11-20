import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../service.base';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environments } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor(private serviceBase: ServiceBaseService, private http: HttpClient) { }

  uploadFile(file: File, directory: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('directory', directory);
    return this.http.post<any>(`${environments.apiUrl}/api/file/upload`,
      formData);
  }
  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${environments.apiUrl}/assignment/${fileName}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
