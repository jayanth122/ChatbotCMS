import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular'; 
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { selectSelectedUserBot, selectSelectedUserBotDetails, selectUserBots } from '../states/auth/auth.selector';
import { UserBot, UserBotDetails } from '../states/auth/auth.reducer';
import { setSelectedUserBot, setSelectedUserBotDetails, setUserBots } from '../states/auth/auth.action';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateBotDetailsComponent } from '../update-bot-details/update-bot-details.component';
import { CreateBotComponent } from '../create-bot/create-bot.component';
import { ToastrService } from 'ngx-toastr';

interface UserBotResponse {
  data: UserBot[]; 
}

@Component({
  selector: 'app-bot-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, AsyncPipe],
  templateUrl: './bot-selection.component.html',
  styleUrls: ['./bot-selection.component.css']
})
export class BotSelectionComponent implements OnInit, OnDestroy {
  userBots$: Observable<UserBot[]>;
  selectedUserBot$: Observable<string>;
  selectedUserBotDetails$: Observable<UserBotDetails>;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService, private store: Store<AppState>, private router: Router, private dialog: MatDialog, private toastr: ToastrService) {
    this.userBots$ = this.store.select(selectUserBots);
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
    this.selectedUserBotDetails$ = this.store.select(selectSelectedUserBotDetails);
  }

  openDialog() {
    this.dialog.open(UpdateBotDetailsComponent, {disableClose: true});
    
  }

  openCreateBot(){
    this.dialog.open(CreateBotComponent, {disableClose: true});
  }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.getUserBots().subscribe(
        (response: UserBotResponse) => {
          //console.log('User bots', response.data);
          this.store.dispatch(setUserBots({ userBots: response.data }));
          this.setInitialSelectedBot();
        },
        (error) => {
        }
      )
    );
  }

  setInitialSelectedBot() {
    this.subscriptions.add(
      this.userBots$.pipe(first()).subscribe(bots => {
        if (bots && bots.length > 0) {
          const botId = bots[0]._id;
          let botDetails = {
            name: bots[0].name,
            character: bots[0].character,
          };
          this.store.dispatch(setSelectedUserBot({ selectedUserBot: botId }));
          this.store.dispatch(setSelectedUserBotDetails({ selectedUserBotDetails: botDetails }));
        }
      })
    );
  }

  onBotSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const botId = selectElement.value;
    this.store.dispatch(setSelectedUserBot({ selectedUserBot: botId }));
    this.subscriptions.add(
      this.userBots$.pipe(first()).subscribe(bots => {
        const selectedBot = bots.find(bot => bot._id === botId);
        if (selectedBot) {
          let botDetails = {
            name: selectedBot.name,
            character: selectedBot.character
          };
          this.store.dispatch(setSelectedUserBotDetails({ selectedUserBotDetails: botDetails }));
          this.toastr.success('You are now using ' + selectedBot.name, 'Chatbot Switch',{
            timeOut: 1000,
          });
        }
      })
    );
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
