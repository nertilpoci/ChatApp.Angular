import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from "@angular/common/http";
import { LinkPreview } from '../../shared/model'
import { AuthenticationService } from '../../shared/services'
import { APP_CONFIG, AppConfig } from "../../shared/app.config";

@Component({
  selector: 'app-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.css']
})
export class LinkPreviewComponent implements OnInit {
  @Input() message: string;
  metadatas: LinkPreview[] = [];

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig, private authService:AuthenticationService) {
   }

  
  ngOnInit() {
    if (!this.message) return;

    let links = this.getLinks(this.message);

    if (links) {
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        this.getUrlData(link);
      }
    }
  }

  getUrlData(url: string) {
    this.http.get<LinkPreview>(this.config.link_preview_uri +"?url=" + url  +"&authorization=" + this.authService.getToken())
      .subscribe(
      data => {
        let metadata: LinkPreview = data;
        if (!metadata.hasData) {
          metadata.description = metadata.url;
        }
        if (!metadata.imageUrl) {
          metadata.imageUrl = "http://icons.iconarchive.com/icons/iconsmind/outline/512/Internet-icon.png";
        }
        this.metadatas.push(metadata);
      },
      err => {
        console.log(err);
      }
      );
  }

  getLinks(text: string): RegExpMatchArray {
    var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/?)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\)){0,}(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s\!()\[\]{};:\'\"\.\,<>?«»“”‘’]){0,})\b/gmi;
    let result = text.match(regexp);
    return result;
  }
  
}
