import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { PaymentComponent } from './payment/payment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PdfComponent } from './pdf/pdf.component';
import { BotSelectionComponent } from './bot-selection/bot-selection.component';
import { TextComponent } from './text/text.component';
import { WebsiteComponent } from './website/website.component';
import { PreviewComponent } from './preview/preview.component';
import { TelegramComponent } from './telegram/telegram.component';
import { GooglesheetComponent } from './googlesheet/googlesheet.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { CustomerSupportComponent } from './customersupport/customersupport.component';
import { ChatlogComponent } from './chatlog/chatlog.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/preview', pathMatch: 'full'},
      // { path: 'dashboard', component: DashboardComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'pdf', component: PdfComponent },
      { path: 'bot-selection', component: BotSelectionComponent },
      { path: 'text', component: TextComponent },
      { path: 'website', component: WebsiteComponent },
      { path: 'preview', component: PreviewComponent },
      { path: 'telegram', component: TelegramComponent },
      { path: 'googlesheet', component: GooglesheetComponent },
      {path: "whatsapp", component: WhatsappComponent},
      {path:"customer-support", component: CustomerSupportComponent},
      {path: "chatlog" , component: ChatlogComponent}
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
