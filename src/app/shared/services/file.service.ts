import { Injectable, Inject } from "@angular/core";
// import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { APP_CONFIG, AppConfig } from "../app.config";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { SendingModel } from "../model/sendingModel";
import { AuthenticationService } from "./authentication.service";
// import { Headers, RequestOptions } from "@angular/http";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from "@angular/common/http";
// import { APP_CONFIG, AppConfig } from "../app.config";
@Injectable()
export class FileService {
  private apiUrl = "";
  constructor(private httpClient: HttpClient,@Inject(APP_CONFIG) private config: AppConfig,private authService:AuthenticationService) {
    this.apiUrl = this.apiUrl;
  }
  upload(files: FileList,url:string,progressChanged: (progress:number) => void,finished: (response:HttpResponse<any>) => void,failed: (err:any) => void) {

    const formData = new FormData();
    for (var i = 0; i < files.length; i++)
      formData.append(files[i].name, files[i]);

    const req = new HttpRequest(
      "POST",
      url,
      formData,
      {
        reportProgress: true
      }
    );
    var request= this.httpClient.request(req).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          let uploadProgress = Math.round(100 * event.loaded / event.total);
          if(progressChanged!=null) progressChanged(uploadProgress)
        } else if (event.type === HttpEventType.Response) {
         if(finished!=null) finished(event);
        }
      },
      err => {
        if(failed!=null) failed(err);
      }
    );
    return request;
  }
  uploadFile(blob: Blob,name:string ,url:string,progressChanged: (progress:number) => void,finished: (response:HttpResponse<any>) => void,failed: (err:any) => void) {
    
        const formData = new FormData();
          formData.append(name, blob);
    
        const req = new HttpRequest(
          "POST",
          url,
          formData,
          {
            reportProgress: true
          }
        );
       
        var request= this.httpClient.request(req).subscribe(
          event => {
            if (event.type === HttpEventType.UploadProgress) {
              let uploadProgress = Math.round(100 * event.loaded / event.total);
              if(progressChanged!=null) progressChanged(uploadProgress)
            } else if (event.type === HttpEventType.Response) {
             if(finished!=null) finished(event);
            }
          },
          err => {
            if(failed!=null) failed(err);
          }
        );
        return request;
      }
}
