import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { GlobalErrorHandler,  HubService,AuthGuard,AuthenticationService, FileService } from "./shared/services";
import { AppComponent } from "./app.component";
import { OAuthModule, OAuthService } from "angular-oauth2-oidc";
import { NgSpinKitModule } from 'ng-spin-kit'
import {
  HomeComponent,
  UsersComponent,
  LinkPreviewComponent,
  AttachmentComponent,
  MessagesComponent,
  AuthCallbackComponent,
  ConversationHeaderComponent

} from "./components";
import { AppRoutes } from "./app.routes";
import { APP_CONFIG, LiveConfig,LocalConfig } from "./shared/app.config";
import { TruncatePipe,SafeHtmlPipe } from "./shared/pipes";
import { LinkyModule } from "angular-linky";
import "hammerjs";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/services';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {LayoutModule} from '@angular/cdk/layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';

import { MatListModule ,MatSnackBarModule,MatProgressSpinnerModule,MatTooltipModule, MatTabsModule ,MatButtonModule , MatProgressBarModule, MatSelectModule , MatMenuModule ,MatInputModule, MatToolbarModule, MatSidenavModule, MatCardModule, MatIconModule,MatGridListModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { LyResizingCroppingImageModule } from 'angular2-resizing-cropping-image';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { MomentModule } from 'angular2-moment';
import { UserSettingsDialogComponent } from './components/user-settings-dialog/user-settings-dialog.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EmojiListComponent } from './components/emoji-list/emoji-list.component';
import {ImageCropperComponent} from 'ng2-img-cropper';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersComponent,
    LinkPreviewComponent,
    AttachmentComponent,
    ConversationHeaderComponent,
    MessagesComponent,
    TruncatePipe,
    SafeHtmlPipe, 
    AuthCallbackComponent,
    NewMessageComponent,  
    UserDataComponent,   
    ImageUploadComponent,   
    UserSettingsDialogComponent, 
    LoaderComponent, EmojiListComponent,ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatGridListModule,
    MatSidenavModule,
    HttpClientModule,
    ScrollDispatchModule,
    HttpModule,
    AppRoutes,
    MomentModule,
    LinkyModule,
    LyResizingCroppingImageModule,
    MatSlideToggleModule,
    NgSpinKitModule,
    OAuthModule.forRoot()
  ],
  providers: [
    { provide: APP_CONFIG, useValue: (environment.production ) ? LiveConfig : LocalConfig },
    { provide: HTTP_INTERCEPTORS, useClass:TokenInterceptor,multi:true },
    {provide:ErrorHandler, useClass:GlobalErrorHandler},
    AuthenticationService,

    HubService,AuthGuard,OAuthService,FileService
  
  ],
  entryComponents:[UserSettingsDialogComponent],

  bootstrap: [AppComponent]
})
export class AppModule { }
