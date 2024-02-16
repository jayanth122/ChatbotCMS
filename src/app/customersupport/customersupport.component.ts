import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../states/app.state';
import { selectConversationId, selectSelectedUserBot } from '../states/auth/auth.selector';
import { AuthService } from '../auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { setConversationId } from '../states/auth/auth.action';

interface CustomerSupportMessage {
  conversation_id: string;
  created_at: string;
  message: string;
  message_by: string;
  updated_at: string;
  _id: string;
}

@Component({
  selector: 'app-customersupport',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './customersupport.component.html',
  styleUrls: ['./customersupport.component.css'],
  providers: [AuthService] // Add AuthService to providers
})
export class CustomerSupportComponent implements OnInit {
  customerSupportMessages: CustomerSupportMessage[] = [];
  customerSupportConversationID: string | undefined;
  inputMessage: string = '';

  constructor(private authService: AuthService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.fetchActiveConversation();
  }

  fetchActiveConversation(): void {
    this.authService.getActiveConversation().subscribe(
      (response: any) => {
        this.customerSupportConversationID = response.conversationId;
        this.fetchConversationMessages();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  fetchConversationMessages(): void {
    if (this.customerSupportConversationID) {
      this.authService.getCustomerSupportConversation(this.customerSupportConversationID).subscribe(
        (response: any) => {
          this.customerSupportMessages = response.payload || [];
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  handleInputChange(event: any): void {
    this.inputMessage = event.target.value;
  }

  sendMessage(): void {
    if (!this.inputMessage.trim() || !this.customerSupportConversationID) return;

    const messagePayload = new URLSearchParams();
    messagePayload.append('conversation_id', this.customerSupportConversationID);
    messagePayload.append('message_by', 'user');
    messagePayload.append('message', this.inputMessage);

    this.authService.createCustomerSupportMessage(messagePayload.toString()).subscribe(
      (res) => {
        console.log('Message sent:', res);
        this.inputMessage = ''; // Clear input after sending
        this.fetchConversationMessages(); // Refresh the chat window
      },
      (err) => {
        console.error('Error sending message:', err);
      }
    );
  }
}






// import { Component, OnInit, NgModule } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Observable, Subscription } from 'rxjs';
// import { AppState } from '../states/app.state';
// import { selectConversationId, selectSelectedUserBot } from '../states/auth/auth.selector';
// import { AuthService } from '../auth.service';
// import { LucideAngularModule } from 'lucide-angular';
// import { setConversationId } from '../states/auth/auth.action';

// interface ConversationMessage {
//   role: string;
//   text: string;
//   timestamp: Date;
// }
// @Component({
//   selector: 'app-customersupport',
//   standalone: true,
//   imports: [CommonModule, FormsModule, LucideAngularModule],
//   templateUrl: './customersupport.component.html',
//   styleUrl: './customersupport.component.css'
// })


// export class CustomerSupportComponent implements OnInit {
//   conversation: ConversationMessage[] = [
//     {
//       role: 'bot',
//       text: 'Hi, how can I help you today?',
//       timestamp: new Date()
//     }
//   ];
//   question = "";
//   selectedUserBot$: Observable<string>;
//   conversationId$: Observable<string>;
//   conversation_id = '';
//   isLoading = false;
//   private subscriptions = new Subscription();
//   botId = '';

//   constructor(private authService: AuthService, private store: Store<AppState>) { 
//     this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
//     this.conversationId$ = this.store.select(selectConversationId);
//   }

//   ngOnInit(): void {
//     this.subscriptions.add(
//       this.selectedUserBot$.subscribe(botId => {
//         this.botId = botId;
//         this.resetChat();
//       })
//     );
//   }

//   resetChat(): void {
//     this.conversation = [
//       {
//         role: 'bot',
//         text: 'Hi, how can I help you today?',
//         timestamp: new Date()
//       }
//     ];
//     this.question = '';
//     if (this.botId) {
//       this.authService.createConversation({ bot_id: this.botId }).subscribe(
//         response => {
//           this.store.dispatch(setConversationId({ conversationId: response.data.conversation_id }));
//         },
//         error => {
//           console.error('Error fetching PDF:', error);
//         }
//       );
//     }
//   }

//   handleQuery(): void {
//     if (!this.question.trim()) {
//       alert('Please enter a question');
//     }
//     else{
//     this.isLoading = true;
//     const userMessage: ConversationMessage = {
//       role: 'user',
//       text: this.question,
//       timestamp: new Date()
//     };
//     this.conversation.push(userMessage);
//     let botId;
//     this.subscriptions.add(
//       this.selectedUserBot$.subscribe(bot_id => {
//         botId = bot_id;
//       })
//     );
//     let conversationId;
//     this.subscriptions.add(
//       this.conversationId$.subscribe(conversation_id => {
//         conversationId = conversation_id;
//       })
//     );
//       let body = { 
//         bot_id: botId, 
//         conversation_id: conversationId,
//         question:  this.question,
//       };
//     this.authService.createBotQuery( body ).subscribe(res => {
//       this.question = '';
//     });

//     this.authService.createBotQuery({ 
//       question: this.question, 
//       conversation_id: conversationId,
//       bot_id: botId
//     }).subscribe(res => {
//       const botResponse: ConversationMessage = {
//         role: 'bot',
//         text: res.data.message,
//         timestamp: new Date()
//       };
//       this.conversation.push(botResponse);
//     }, err => {
//       console.error('Error sending query:', err);
//     }).add(() => {
//       this.isLoading = false;
//       this.question = '';
//     });
//     }
//   }

//   handleEnter(event: KeyboardEvent): void {
//     if (event.key === 'Enter' && !this.isLoading) {
//       this.handleQuery();
//     }
//   }
// }
