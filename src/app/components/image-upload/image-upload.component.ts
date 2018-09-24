import { Component, OnInit,Inject } from '@angular/core';
import {FileService} from '../../shared/services'
import { APP_CONFIG, AppConfig } from "../../shared/app.config";
import {MatSnackBar} from '@angular/material';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  uploadProgress:number;
  isUploading:boolean;
  data: any;
  cropperSettings: CropperSettings;

  constructor(private snackBar:MatSnackBar,private fService:FileService,@Inject(APP_CONFIG) private config: AppConfig) { 

    this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth =200;
        this.cropperSettings.croppedHeight = 200;
        this.cropperSettings.canvasWidth = 200;
        this.cropperSettings.canvasHeight = 200;
        this.cropperSettings.rounded = true;
        this.cropperSettings.keepAspect = true;
        this.cropperSettings.noFileInput=true;
        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
       
        this.data = {};
  }

  ngOnInit() {
  }
  upload(value:any)
  {
    this.isUploading=true;
    var block = value.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    
    // Convert it to a blob to upload
    var blob = this.b64toBlob(realData, contentType,512);
    this.fService.uploadFile(blob,"profile.png",this.config.profilePictureUrl,(progress)=>{
      this.uploadProgress=progress;
    },()=>{
      this.isUploading=false;
      this.uploadProgress=0;
       this.snackBar.open("Profile picture changed, refreshing is needed to view changes",null, {
      duration: 2000,
    });
    },()=>{
       this.snackBar.open("Something went wrong!!!. Please try again.",null, {
      duration: 2000,
    });
    })
  }
   b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
}
