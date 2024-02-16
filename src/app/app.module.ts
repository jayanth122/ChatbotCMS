import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { PaymentComponent } from './payment/payment.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PdfComponent } from './pdf/pdf.component';
import { GooglesheetComponent } from './googlesheet/googlesheet.component';
import { TextComponent } from './text/text.component';
import {
  LucideAngularModule, Upload, FileText,
  AlertOctagon, ChevronLeft, Settings, Bot, 
  Plus, PenLine, GalleryVerticalEnd,
  Users, Gauge, MessagesSquare, SendHorizontal,
  PercentCircle, Percent, BadgePercent, Search,
  ArrowUpCircle, AlertCircle, FolderInput, PanelTop, Globe,Sheet,UserRound, Bookmark, BookmarkCheck,Loader, Eye, EyeOff, Copy, CopyCheck
} from 'lucide-angular';
import { provideState, provideStore } from '@ngrx/store'
import { counterReducer } from './states/counter/counter.reducer';
import { authReducer } from './states/auth/auth.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    MatSlideToggleModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    LoginComponent,
    LayoutComponent,
    PaymentComponent,
    TextComponent,
    UserProfileComponent,
    PdfComponent,
    GooglesheetComponent,
    LucideAngularModule.pick({
      Upload, FileText, AlertOctagon,
      ChevronLeft, Bot, Settings, Plus, Users, Gauge,
      MessagesSquare, Globe, GalleryVerticalEnd, Sheet,
      SendHorizontal, PercentCircle, Percent, BadgePercent,UserRound,
      Search, ArrowUpCircle, AlertCircle, FolderInput, PenLine, PanelTop, Bookmark, BookmarkCheck ,Loader, Eye, EyeOff, Copy, CopyCheck
    }),
  ],
  providers: [
    provideStore({}),
    provideState({ name: 'counter', reducer: counterReducer }),
    provideState({ name: 'auth', reducer: authReducer }),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }