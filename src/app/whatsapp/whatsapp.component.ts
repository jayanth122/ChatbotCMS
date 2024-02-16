import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { ApiService } from "../api.service";
import { AuthService } from "../auth.service";
import {
  setClearWhatsApp,
  createWhatsApp,
  updateWhatsApp,
  whatsAppToggle,
} from "../states/auth/auth.action";
import {
  selectSelectedUserBot,
  selectWhatsAppData,
} from "../states/auth/auth.selector";
import { AppState } from "../states/app.state";
import { LucideAngularModule } from "lucide-angular";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-whatsapp",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: "./whatsapp.component.html",
  styleUrl: "./whatsapp.component.css",
})
export class WhatsappComponent implements OnInit, OnDestroy {
  isEnabled: boolean = false;
  selectedUserBot$!: Observable<string>;
  whatsAppData$!: Observable<any>;
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;
  isChanged: boolean = false;

  verifyToken: string = "";
  accessToken: string = "";
  phoneId: string = "";
  phoneNumber: string = "";

  private selectedUserBot: string | null = null
  private subscriptions: Subscription = new Subscription();
  showCopyCheckIcon: boolean = false;
  showVerifyCheckIcon: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private apiService: ApiService,
    private authService: AuthService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
    this.whatsAppData$ = this.store.select(selectWhatsAppData);
    // this.fetchWhatsAppData();
    this.subscriptions.add(
      this.selectedUserBot$.subscribe((botId: string) => {
        if (botId) {
          this.selectedUserBot = botId;
          this.fetchWhatsAppData(botId);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(setClearWhatsApp());
  }

  fetchWhatsAppData(botId: any): void {
    if (botId) {
      this.authService
        .getWhatsApp({ bot_id: botId })
        .subscribe((response: any) => {
          if (response.data) {
            this.verifyToken = response.data.verify_token || "";
            this.accessToken = response.data.auth_token || "";
            this.phoneId = response.data.phone_id || "";
            this.phoneNumber = response.data.phone_number || "";
            this.isLoading = false;
            this.store.dispatch(createWhatsApp({ body: response.data }));
            console.log(response.data);
          }
        });
    }
  }

  callWhatsApp(): void {
      this.subscriptions.add(
        this.whatsAppData$.subscribe((data: any) => {
          if (data) {
            this.updateWhatsApp();
          } else {
            this.createWhatsApp();
          }
        })
      );
  }

  createWhatsApp(): void {
    this.isLoading = true;
    const body: any = {
      bot_id: this.selectedUserBot,
      verify_token: this.verifyToken,
      auth_token: this.accessToken,
      phone_id: this.phoneId,
      phone_number: this.phoneNumber,
    };
    this.authService.createWhatsApp(body).subscribe((response: any) => {
      if (response.data) {
        console.log(response.data);
      }
      this.isLoading = false;
    }, (err: any) => {
      this.isLoading = false;
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 2000,
      });
    });
  }

  updateWhatsApp(): void {
    this.isLoading = true;
    const body: any = {
      bot_id: this.selectedUserBot,
      verify_token: this.verifyToken,
      auth_token: this.accessToken,
      phone_id: this.phoneId,
      phone_number: this.phoneNumber,
    };
    this.authService.updateWhatsApp(body).subscribe((response: any) => {
      if (response.data) {
        console.log(response.data);
      }
      this.isLoading = false;
    }, (err: any) => {
      this.isLoading = false;
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 2000,
      });
    });
  }

  toggleSwitch(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.whatsAppData$.subscribe((data: string) => {
        console.log("🚀 ~ WhatsappComponent ~ this.whatsAppData$.subscribe ~ data:", data)
        if (!data) {
          this.isEnabled = !this.isEnabled;
          this.authService
            .whatsAppToggle({ bot_id: this.selectedUserBot, status: this.isEnabled })
            .subscribe(() => {
              this.toastr.success('your status have been updated', 'Staus Updated',{
                timeOut: 1000,
              });
              this.isLoading = false;
              // this.fetchWhatsAppData();
            },(err: any) => {
              this.isLoading = false;
              this.toastr.error(err.error.message, 'Error', {
                timeOut: 2000,
              });
            });
        }
      })
    );
  }

  copyUrlToClipboard(): void {
    navigator.clipboard.writeText(
      "https://hp.defai.chat/api/whatsapp/webhook"
    )
    this.showCopyCheckIcon = true;
    setTimeout(() => {
      this.showCopyCheckIcon = false;
    },1000)
  }

  copyTokenToClipboard(): void {
    navigator.clipboard.writeText(this.verifyToken.toString())
    this.showVerifyCheckIcon = true;
    setTimeout(() => {
      this.showVerifyCheckIcon = false;
    },1000)
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}

// import { WhatsAppData } from './../states/auth/auth.reducer';
// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api.service';
// import { AuthService } from '../auth.service';
// import { Store } from '@ngrx/store';
// import { setConversationId } from '../states/auth/auth.action';
// import { AppState } from '../states/app.state';
// import { Observable, Subscription } from 'rxjs';
// @Component({
//   selector: 'app-whatsapp',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './whatsapp.component.html',
//   styleUrl: './whatsapp.component.css'
// })
// export class WhatsappComponent  {
//   whatsAppData: any; // Define the type of your whatsAppData object
//   apiToken: string = '';
//   isEnabled: boolean = false;
//   accessToken: string = '';
//   verifyToken: string = '';
//   isPasswordVisible: boolean = false;
//   phoneId: string = '';
//   phoneNumber: string = '';
//   webhookUrl: string = "https://hp.defai.chat/api/whatsapp/webhook";
//   isChanged: boolean = false;
//   isLoading: boolean = false
//   selectedUserBot$!: Observable<any>;
//   private subscriptions = new Subscription();

//   constructor(
//     private store: Store<AppState>,
//     private apiService: ApiService,  private authService : AuthService) {} // Inject your ApiService or HttpClient service

//   ngOnInit() {
//       this.subscriptions.add(
//         this.selectedUserBot$.subscribe(botId => {
//           this.fetchWhatsappData(botId);
//         })
//       );
//     }

//   // fetchWhatsappData(botId: string) {
//   //   if (botId) {
//   //     this.authService.getWhatsapp({ bot_id: botId }).subscribe((response: any) => {
//   //       if(response.data){
//   //         console.log(response);
//   //       this.apiToken = response.data.whatsass_token;
//   //       this.isEnabled = response.data.bot_enabled;
//   //       this.store.dispatch(setConversationId({ conversationId: response }));
//   //       }
//   //     });
//   //   }
//   // }
//   fetchWhatsAppData() {
//     if (this.selectedUserBot) {
//       this.authService.getWhatsapp({ bot_id: this.selectedUserBot._id || this.selectedUserBot.bot_id })
//         .subscribe(
//           (data: any) => {
//             this.whatsAppData = data;
//             this.updateFormFields();
//           },
//           (error: any) => {
//             console.error('Error fetching WhatsApp data:', error);
//           }
//         );
//     }
//   }

//   updateFormFields() {
//     if (this.whatsAppData) {
//       this.verifyToken = this.whatsAppData?.verify_token || '';
//       this.accessToken = this.whatsAppData?.auth_token || '';
//       this.phoneId = this.whatsAppData?.phone_id || '';
//       this.phoneNumber = this.whatsAppData?.phone_number || '';
//       this.isEnabled = this.whatsAppData?.bot_enabled || false;
//     }
//   }

//   callWhatsApp() {
//     if (this.whatsAppData) {
//       this.updateUserWhatsApp();
//     } else {
//       this.createUserWhatsApp();
//     }
//   }

//   updateUserWhatsApp() {
//     // Implement your logic to update WhatsApp data
//     console.log('Updating WhatsApp data...');
//   }

//   createUserWhatsApp() {
//     // Implement your logic to create WhatsApp data
//     console.log('Creating WhatsApp data...');
//   }

//   toggleSwitch() {
//     this.isEnabled = !this.isEnabled;
//   }

//   copyToClipboard(text: string) {
//     navigator.clipboard.writeText(text);
//   }

//   setAccessToken(value: string) {
//     this.accessToken = value;
//   }

//   togglePasswordVisibility() {
//     this.isPasswordVisible = !this.isPasswordVisible;
//   }

//   setPhoneId(value: string) {
//     this.phoneId = value;
//   }

//   setPhoneNumber(value: string) {
//     this.phoneNumber = value;
//   }

//   // Function to copy the webhook URL to the clipboard
//   copyWebhookUrl() {
//     // Select the input element
//     const inputElement = document.getElementById('webhookInput') as HTMLInputElement;

//     // Check if the input element exists
//     if (inputElement) {
//       // Select the text inside the input element
//       inputElement.select();

//       // Execute the copy command
//       document.execCommand('copy');

//       // Optionally, provide feedback to the user that the URL has been copied
//       alert('Webhook URL copied to clipboard');
//     }
//   }

//   // Function to copy verfy token to the clipboard
//   copyVerifyToken() {
//     // Select the input element
//     const inputElement = document.getElementById('verifyTokenInput') as HTMLInputElement;

//     // Check if the input element exists
//     if (inputElement) {
//       // Select the text inside the input element
//       inputElement.select();

//       // Execute the copy command
//       document.execCommand('copy');

//       // Optionally, provide feedback to the user that the URL has been copied
//       alert('Verify Token copied to clipboard');
//     }
//   }

//   // onToggleChange(): void {
//   //   console.log('toggle changed on:', this.isEnabled);
//   //   let currentBotId: string | null = null;
//   //   this.selectedUserBot$.subscribe(botId => currentBotId = botId).unsubscribe();

//   //   if (currentBotId) {
//   //     this.authService.({ bot_id: currentBotId, status: this.isEnabled }).subscribe((response: any) => {
//   //       alert('Telegram Bot ' + (this.isEnabled ? 'Enabled' : 'Disabled'));
//   //       this.selectedUserBot$.subscribe(botId => this.fetchWhatsappData(botId)).unsubscribe();
//   //     });
//   //   }
//   // }

// }