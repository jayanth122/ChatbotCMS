import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';
import { selectConversation, selectConversationMessages, selectSelectedUserBot } from '../states/auth/auth.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { AuthService } from '../auth.service';
import { setClearConversationMessages, setClearWhatsApp, setConversation, setConversationMessages } from '../states/auth/auth.action';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-chatlog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, MatDatepickerModule, MatFormFieldModule],
  templateUrl: './chatlog.component.html',
  styleUrl: './chatlog.component.css',
  providers: [provideNativeDateAdapter()],
})
export class ChatlogComponent {
  selectedChatCategory: string;
  selectedIntegration: string;
  isTabletOrMobile: boolean;
  mobile: boolean;
  // conversation$: Observable<any[]>;
  selectedUserBot$: Observable<any>;
  conversationMessages$: Observable<any>;
  private subscriptions = new Subscription();

  question: string = '';
  isLoading: boolean = true;
  selectedItem: any;
  msgLoader: boolean = false;
  filteredConversations: any[] = [];

  chats: [];

  chatCategories: string[] = ["All Chats", "Saved Chats"];
  integrations: string[] = ["whatsApp", "telegram", "website"];

  constructor(private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) {
    // this.conversation$ = this.store.select(selectConversation);
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);;
    this.conversationMessages$ = this.store.select(selectConversationMessages);
    this.selectedChatCategory = "All Chats";
    this.selectedIntegration = "website";
    this.isTabletOrMobile = false;
    this.mobile = false;
    this.chats = [];

  }
  ngOnInit() {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.fetchConversation(botId);
      })
    );

    this.subscriptions.add(
      this.store.select(selectConversation)
        .pipe(
          map(conversations => conversations.filter(conversation => this.filterConversationByCategory(conversation)))
        )
        .subscribe(filteredConversations => {
          this.filteredConversations = filteredConversations;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(setClearConversationMessages());
  }

  fetchConversation(botId: string) {
    if (botId) {
      this.authService.getConversation({ bot_id: botId }).subscribe((response: any) => {
        if (response.data) {
          this.chats = response.data;
          console.log(response.data);
        }
        this.store.dispatch(setConversation({ conversation: response.data }));
        this.isLoading = false;
      });
    }
  }

  selectConversation() {

  }

  setFavoriteConversation(item: any) {
    let body = {
      conversation_id: item?.conversation?._id,
      favorite: !item?.conversation?.favorite,
    };
    this.authService.favoriteConversation(body).subscribe((response: any) => {
      if (response.data) {
        this.selectedItem = {
          ...item,
          conversation: {
            ...item.conversation,
            favorite: !item.conversation.favorite,
          },
        }
      }
    })
  }

  handleEnter(data: any) {

  }

  handleQuery(): void {
    if (!this.question.trim()) {
      this.toastr.warning('Please enter a question', 'Warning', {
        timeOut: 1000,
      });
    }
    else {
      let questionText = '';
      questionText = this.question;
      this.question = '';
      let botId;
      this.subscriptions.add(
        this.selectedUserBot$.subscribe(bot_id => {
          botId = bot_id;
        })
      );
      let conversationId;
      let body = {
        bot_id: botId,
        conversation_id: this.selectedItem?.conversation._id,
        question: questionText,
      };
      this.authService.createBotQuery(body).subscribe(res => {
        this.fetchMessageData(body?.conversation_id);
      }, err => {
        this.toastr.error('Error sending query', 'Error', {
          timeOut: 1000,
        });
      }).add(() => {
        this.question = '';
      });
    }
  }

  fetchMessageData(id: any) {
    if (id) {
      this.authService.getConversationMessages({ conversation_id: id }).subscribe(
        response => {
          this.store.dispatch(setConversationMessages({ conversationMessages: response.data }));
        },
        error => {
          this.toastr.error('Error fetching messages', 'Error', {
            timeOut: 1000,
          });
        }
      );
    }
  }

  handleConversation(item: any) {
    this.msgLoader = true;
    this.selectedItem = item;
    this.getUserConversationMessages(
      item?.conversation?._id
    );
  }

  getUserConversationMessages(id: any) {

    this.authService.getConversationMessages({ conversation_id: id }).subscribe((response: any) => {
      if (response.data) {
      }
      this.store.dispatch(setConversationMessages({ conversationMessages: response.data }));
    });
    this.msgLoader = false;
  }


  filterConversationByCategory(conversation: any): boolean {
    // Implement your filtering logic based on the selectedChatCategory
    if (this.selectedChatCategory === 'All Chats') {
      return true; // Return true to include the conversation
    } else if (this.selectedChatCategory === 'Saved Chats') {
      return conversation.conversation.favorite === true; // Adjust this based on your conversation structure
    }
    return true;
  }

  filterConversationByIntegration(conversation: any): boolean {
    // Implement your filtering logic based on the selectedChatCategory
    if (this.selectedIntegration === '') {
      return true; // Return true to include the conversation
    } else if (this.selectedIntegration === conversation.conversation.method) {
      return true; // Adjust this based on your conversation structure
    }
    return false;
  }

 // TODO: manintain datatype for date
  filterConversationByDate(conversations:any, startDate:any, endDate:any): boolean {
      const createdAt = new Date(conversations.conversation.created_at);
      if(!startDate) return createdAt <= new Date(endDate);
      if(!endDate) return createdAt >= new Date(startDate)
      return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
  }

  handleDateChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement): void {
    this.subscriptions.add(
      this.store.select(selectConversation)
        .pipe(
          map(conversations => conversations.filter(conversation => this.filterConversationByDate(conversation, dateRangeStart.value,dateRangeEnd.value)))
        )
        .subscribe(filteredConversations => {
          this.filteredConversations = filteredConversations;
        })
    );
  }

  handleChatCategorySelect(category: string): void {
    this.selectedChatCategory = category;
    // Filter conversations based on the selected category
    this.subscriptions.add(
      this.store.select(selectConversation)
        .pipe(
          map(conversations => conversations.filter(conversation => this.filterConversationByCategory(conversation)))
        )
        .subscribe(filteredConversations => {
          this.filteredConversations = filteredConversations;
        })
    );
  }
  

  handleSelectIntegrations(integration: string): void {
    this.selectedIntegration = integration;

    this.subscriptions.add(
      this.store.select(selectConversation)
        .pipe(
          map(conversations => conversations.filter(conversation => this.filterConversationByIntegration(conversation)))
        )
        .subscribe(filteredConversations => {
          this.filteredConversations = filteredConversations;
        })
    );
  }

  setMobile(value: boolean): void {
    this.mobile = value;
  }

}