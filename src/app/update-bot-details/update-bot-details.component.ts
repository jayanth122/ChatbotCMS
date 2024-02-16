import { Component, OnInit, NgModule  } from '@angular/core';
import { UserBotDetails } from '../states/auth/auth.reducer';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AppState } from '../states/app.state';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { selectSelectedUserBot, selectSelectedUserBotDetails } from '../states/auth/auth.selector';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { setSelectedUserBot } from '../states/auth/auth.action';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update-bot-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, AsyncPipe, FormsModule],
  templateUrl: './update-bot-details.component.html',
  styleUrl: './update-bot-details.component.css'
})
export class UpdateBotDetailsComponent {
  showUpdateForm: boolean = true; 
  showDeleteForm: boolean = false; 
  userBotName: string = '';
  userBotCharacter: string = '';
  selectedUserBot$: Observable<string>;
  selectedUserBotDetails$: Observable<UserBotDetails>;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService, private store: Store<AppState>, private router: Router, private dialog: MatDialog, private toastr: ToastrService) {
    this.selectedUserBotDetails$ = this.store.select(selectSelectedUserBotDetails);
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
  }

  ngOnInit() {
    this.selectedUserBotDetails$.subscribe((details) => {
      this.userBotName = details.name;
      this.userBotCharacter = details.character;
    });
  }

  deleteBot() {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.authService.deleteUserBot({ bot_id: botId }).subscribe(
          (response) => {
            console.log('response', response);
            //alert('Bot Deleted Successfully');
            this.toastr.success('Your Bot'+ this.userBotName +' has been deleted successfully.', 'Bot Deleted', {
              timeOut: 2000,
            });
            setTimeout(function() {
              window.location.reload();
            }, 2000);            
            this.dialog.closeAll();
          },
          (error) => {
            this.toastr.error('Error deleting bot' + this.userBotName, 'Error Deleting Bot', {  
              timeOut: 2000,
            });
            //console.log('error deleting bot', error);
          }
        );
      })
    );
  }

  activateDelete(){
    this.showDeleteForm = !this.showDeleteForm;
    this.showUpdateForm = !this.showUpdateForm;
  }

  activateUpdate(){
    this.showDeleteForm = !this.showDeleteForm;
    this.showUpdateForm = !this.showUpdateForm;
  }

  updateBot() {
    if(!this.noChanges()){
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.authService.updateUserBot({ bot_id: botId,name: this.userBotName, character: this.userBotCharacter }).subscribe(
          (response) => {
            console.log('response', response);
            this.toastr.success('Your Bot'+ this.userBotName +' has been updated successfully.', 'Bot updated', {
              timeOut: 1000,
            });
            setTimeout(function() {
              window.location.reload();
            }, 300);            
            this.dialog.closeAll();
          },
          (error) => {
            this.toastr.error('Your Bot'+ this.userBotName +' has not been updated.', 'Error Updating Bot', {
              timeOut: 1000,
            });
          }
        );
      })
    );
    }
    else{
      this.toastr.success('Your Bot'+ this.userBotName +' has been updated successfully.', 'Bot updated', {
        timeOut: 1000,
      });
      setTimeout(function() {
      }, 300);
      this.dialog.closeAll();
    }
}

closeUpdate(){
  this.dialog.closeAll();
}

noChanges(): boolean{
  let noChanges = Boolean(true);
  this.subscriptions.add(
    this.selectedUserBotDetails$.subscribe(details => {
      if (this.userBotName === details.name && this.userBotCharacter === details.character) {
        noChanges =  true;
      }
      else
      noChanges = false;
    })
  );
  return noChanges;
}

}
