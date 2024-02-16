import { Component, OnInit, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../states/app.state';
import { selectConversationId, selectSelectedUserBot, selectSelectedUserBotDetails } from '../states/auth/auth.selector';
import { AuthService } from '../auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { setConversationId } from '../states/auth/auth.action';
import { UserBotDetails } from '../states/auth/auth.reducer';
import { ToastrService } from 'ngx-toastr';

interface ConversationMessage {
  role: string;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [ CommonModule, LucideAngularModule, FormsModule ] ,
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  conversation: ConversationMessage[] = [
    {
      role: 'bot',
      text: 'Hi, how can I help you today?',
      timestamp: new Date()
    }
  ];
  question = "";
  selectedUserBot$: Observable<string>;
  conversationId$: Observable<string>;
  selectedUserBotDetails$: Observable<UserBotDetails>;
  conversation_id = '';
  isLoading = false;
  private subscriptions = new Subscription();
  botId = '';

  constructor(private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) { 
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
    this.conversationId$ = this.store.select(selectConversationId);
    this.selectedUserBotDetails$ = this.store.select(selectSelectedUserBotDetails);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.botId = botId;
        this.resetChat();
      })
    );
  }

  resetChat(): void {
    this.conversation = [
      {
        role: 'bot',
        text: 'Hi, how can I help you today?',
        timestamp: new Date()
      }
    ];
    this.question = '';
    if (this.botId) {
      this.authService.createConversation({ bot_id: this.botId }).subscribe(
        response => {
          this.store.dispatch(setConversationId({ conversationId: response.data.conversation_id }));
        },
        error => {
          this.toastr.error('Error fetching conversation', 'Error',{
            timeOut: 1000,
          });
          //console.error('Error fetching PDF:', error);
        }
      );
    }
  }

  handleQuery(): void {
    if (!this.question.trim()) {
      //alert('Please enter a question');
      this.toastr.warning('Please enter a question', 'Warning', {
        timeOut: 1000,
      });
    }
    else{
    let questionText = '';
    questionText = this.question;
    this.question = '';
    this.isLoading = true;
    const userMessage: ConversationMessage = {
      role: 'user',
      text: questionText,
      timestamp: new Date()
    };
    this.conversation.push(userMessage);
    let botId;
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(bot_id => {
        botId = bot_id;
      })
    );
    let conversationId;
    this.subscriptions.add(
      this.conversationId$.subscribe(conversation_id => {
        conversationId = conversation_id;
      })
    );
      let body = { 
        bot_id: botId, 
        conversation_id: conversationId,
        question:  questionText,
      };
    // this.authService.createBotQuery( body ).subscribe(res => {
    // });

    this.authService.createBotQuery({ 
      question: questionText, 
      conversation_id: conversationId,
      bot_id: botId
    }).subscribe(res => {
      const botResponse: ConversationMessage = {
        role: 'bot',
        text: res.data.message,
        timestamp: new Date()
      };
      this.conversation.push(botResponse);
    }, err => {
      //console.error('Error sending query:', err);
      this.toastr.error('Error sending query', 'Error',{
        timeOut: 1000,
      });
    }).add(() => {
      this.isLoading = false;
      this.question = '';
    });
    }
  }

  handleEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isLoading) {
      this.handleQuery();
    }
  }
}
