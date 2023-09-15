import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {FILE_API_ENDPOINT} from "../common/constants";


@Injectable({
  providedIn: 'root'
})
export class FileService {

  private filesCopiedToClipboardSubject = new Subject<File[]>();

  constructor(private http: HttpClient) {
  }

  deleteFile(fileId: number): Observable<void> {
    return this.http.delete<void>(FILE_API_ENDPOINT + fileId);
  }

  getFilesCopiedToClipboardSubject(): Subject<File[]> {
    return this.filesCopiedToClipboardSubject;
  }

  setFilesCopiedToClipboardSubject(files: File[]) {
    this.filesCopiedToClipboardSubject.next(files);
  }

}
