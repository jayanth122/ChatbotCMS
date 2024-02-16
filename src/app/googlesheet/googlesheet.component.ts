import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { selectGoogleSheetData, selectSelectedUserBot } from '../states/auth/auth.selector';
import { AppState } from '../states/app.state';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth.service';
import { setGoogleSheetData } from '../states/auth/auth.action';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-googlesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule ],
  templateUrl: './googlesheet.component.html',
  styleUrl: './googlesheet.component.css'
})
export class GooglesheetComponent {
  videoUrl: string = '../../assets/gsheet.mov';
  googleSheetData$: Observable<any>;
  selectedUserBot$: Observable<any>;

  constructor(private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) {
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
    this.googleSheetData$ = this.store.select(selectGoogleSheetData);
  }

  ngOnInit() {
    this.selectedUserBot$.subscribe(botId => {
      this.fetchGoogleSheetData(botId);
    });
  }

  openGoogleSheet() {
    this.googleSheetData$.pipe(take(1)).subscribe(data => {
      const url = data.google_sheet_url;
      if (url) {
        window.open(url, '_blank');
      }
    });
  }

  updateGoogleSheet() {
    let botId: string | null = null;
    this.selectedUserBot$.subscribe(id => botId = id).unsubscribe();
    if (botId) {
      this.authService.updateBotsheet({ bot_id: botId }).subscribe((response: any) => {
        //this.fetchGoogleSheetData(botId);
        //alert('Google Sheet Updated');
        this.toastr.success('Update have been successfully done.','Update Success',{
          timeOut: 1000,
        });
      });
    }
    else 
    console.error('Bot ID not found');
    this.toastr.error('Unable to update Google Sheet.','Error',{
      timeOut: 1000,
    });
    
  }    

  fetchGoogleSheetData(botId: string) {
    if (botId) {
      this.authService.getBotsheet({ bot_id: botId }).subscribe((response: any) => {
        //console.log(response.data);
        this.store.dispatch(setGoogleSheetData({ googleSheetData: response.data }));
      });
    }
  }


}
