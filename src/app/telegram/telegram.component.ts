import { Component, OnInit, NgModule } from '@angular/core';
import { AuthService } from '../auth.service'; // Update with the correct path
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppState } from '../states/app.state';
import { Store } from '@ngrx/store';
import { selectSelectedUserBot, selectTelegramData } from '../states/auth/auth.selector';
import { LucideAngularModule, EyeOff } from 'lucide-angular';
import { setTelegramData } from '../states/auth/auth.action';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-telegram',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.css']
})
export class TelegramComponent {
  isEnabled: boolean = false;
  apiToken: string = '';
  private subscriptions = new Subscription();
  videoUrl: string = '../../assets/telegram.mp4';
  telgramBotFatherUrl: string = 'https://telegram.me/BotFather';
  telegramData$: Observable<any>;
  selectedUserBot$: Observable<any>;

  constructor(private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) {
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
    this.telegramData$ = this.store.select(selectTelegramData);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.fetchTelegramData(botId);
      })
    );
  }

  onToggleChange(): void {
    //console.log('toggle changed on:', this.isEnabled);
    let currentBotId: string | null = null;
    this.selectedUserBot$.subscribe(botId => currentBotId = botId).unsubscribe();
  
    if (currentBotId) {
      this.authService.telegramToggle({ bot_id: currentBotId, status: this.isEnabled }).subscribe((response: any) => {
        this.toastr.success('Telegram bot has been ' + (this.isEnabled ? 'Enabled.' : 'Disabled.'), 'Telegram' + (this.isEnabled ? 'Enabled' : 'Disabled'), {
          timeOut: 1000,
        });
        this.selectedUserBot$.subscribe(botId => this.fetchTelegramData(botId)).unsubscribe();
      });
    }
  }

  fetchTelegramData(botId: string) {
    if (botId) {
      this.authService.getTelegram({ bot_id: botId }).subscribe((response: any) => {
        if(response.data){
        this.apiToken = response.data.telegram_token;
        this.isEnabled = response.data.bot_enabled;
        this.store.dispatch(setTelegramData({ telegramData: response }));
        }
      });
    }
  }

  getTelegramData(): any {
    this.subscriptions.add(
      this.telegramData$.subscribe(telegramData => {
        return telegramData;
      })
    );
  }

  
  callTelegram() {
    console.log('api token: ', this.apiToken);
    if (this.getTelegramData()) {
      this.updateTelegram();
    }
    else {
      this.createTelegram();
    }
  }

  updateTelegram() {
    //console.log('update telegram');
    let currentBotId: string | null = null;
    this.selectedUserBot$.subscribe(botId => currentBotId = botId).unsubscribe();
    this.authService.updateTelegram({ bot_id: currentBotId, api_token: this.apiToken }).subscribe(
      (data: any) => {
        // Success callback
        this.toastr.success('Telegram bot has been successfully updated.', 'Telegram Updated', {
          timeOut: 1000,
        });
      },
      (error: any) => {
        // Error callback
        // You can customize the error message based on the error object if needed
        this.toastr.error('Failed to update Telegram bot. Please try again.', 'Update Failed', {
          timeOut: 3000,
        });
    
        // Optionally, log the error or perform other error handling
        console.error(error);
      }
    );
  }

  createTelegram() {
    let currentBotId: string | null = null;
    this.selectedUserBot$.subscribe(botId => currentBotId = botId).unsubscribe();
    this.authService.createTelegram({ bot_id: currentBotId, telegram_token: this.apiToken }).subscribe((response: any) => {
      //alert('Telegram Bot Created');
      this.toastr.success('Telegram bot has been successfully registered.', 'Telegram Register', {
        timeOut: 1000,
      });
      this.selectedUserBot$.subscribe(botId => this.fetchTelegramData(botId)).unsubscribe();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
