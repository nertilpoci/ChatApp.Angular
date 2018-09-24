import { Component, OnInit, Input, Inject } from '@angular/core';
import { AuthenticationService } from '../../shared/services'
import { Attachment, AtachmentContentType } from '../../shared/model'
import { getIconForExtension } from 'font-awesome-filetypes'
import { APP_CONFIG, AppConfig } from "../../shared/app.config";
@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {
  @Input() attachments: Attachment[] = [];
  images: any[] = [];
  videos: any[] = [];
  audios: any[] = [];
  others: any[] = [];
  apiUrl: string;
  authorizationQueryString:string;
  AtachmentContentType = AtachmentContentType;
  constructor( @Inject(APP_CONFIG) private config: AppConfig, private authService:AuthenticationService) {
    this.apiUrl = config.attachmentsUrl;
    this.authorizationQueryString="?authorization=" +authService.getToken();
  }

  open(index: number): void {
  }
  ngOnInit() {
    for (let attachment of this.attachments) {
      if (attachment.attachmentType == AtachmentContentType.Image) {
        let img = {
          src: `${this.apiUrl}/${attachment.id}${this.authorizationQueryString}`,
          caption: attachment.fileName,
          thumb: `${this.apiUrl}/${attachment.id}${this.authorizationQueryString}`
        };
        this.images.push(img);
      }
      else if (attachment.attachmentType == AtachmentContentType.Video) {
        this.videos.push(attachment)
      }
      else if (attachment.attachmentType == AtachmentContentType.Audio) {
        this.audios.push(attachment)
      }
      else if (attachment.attachmentType == AtachmentContentType.Other) {
        this.others.push(attachment)
      }
    }
  }

  checkType(shouldbe: AtachmentContentType, is: AtachmentContentType): boolean {
    return shouldbe == is;
  }

  fileIcon(filename: string): string {
    const extension = filename.split('.').pop();
    const icon = getIconForExtension(extension);
    return icon;
  }

}
