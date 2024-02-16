import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { selectSelectedUserBot, selectTextData } from '../states/auth/auth.selector';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { setTextData } from '../states/auth/auth.action';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [ CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css'
})
export class TextComponent {
  inputText: string = '';  
  selectedTextIds: Set<string> = new Set();
  textData$: Observable<any[]>;
  private subscriptions = new Subscription();
  selectedUserBot$: Observable<string>;
  constructor( private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) { 
    this.textData$ = this.store.select(selectTextData);
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.fetchTextData(botId);
      })
    );
  }

  onUpload(): void {
    if (this.inputText) {
      this.selectedUserBot$.subscribe(selectedUserBot => {
        let setBotId = "";
        this.selectedUserBot$.subscribe(botId => {
          setBotId = botId;
        });
        this.authService.updateBotText({ 
          bot_id: setBotId, 
          text: this.inputText 
        }).subscribe(
          response => {
            this.toastr.success('Text uploaded successfully.', 'Success', {
              timeOut: 1000,
            });
            this.inputText = '';
            this.fetchTextData(setBotId);
          },
          error => {
            this.toastr.error('Error uploading text.', 'Error', {
              timeOut: 1000,
            });
          }
        );

      });
    } else {
      //alert('Please enter some text before uploading.');
      this.toastr.warning('Please enter some text before uploading.', 'Warning', {
        timeOut: 1000,
      });
    }
  }

  onCheckboxChange(pdfId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedTextIds.add(pdfId);
    } else {
      this.selectedTextIds.delete(pdfId);
    }
  }

  fetchTextData(botId: string) {
    if (botId) {
      this.authService.getBotText({ bot_id: botId }).subscribe(
        response => {
          this.store.dispatch(setTextData({ textData: response.data }));
        },
        error => {
          this.toastr.error('Error fetching text data.', 'Error', {
            timeOut: 1000,
          });
          //console.error('Error fetching PDF:', error);
        }
      );
    }
  }

  onDeleteSelected() {
    const selectedIds = Array.from(this.selectedTextIds);
    if (selectedIds.length > 0) {
      const deletionRequests = selectedIds.map(textId => 
        this.authService.deleteBotText({ document_id: textId })
      );
      forkJoin(deletionRequests).subscribe(
        () => {
          this.selectedTextIds.clear();
          this.selectedUserBot$.subscribe(botId => {
            this.fetchTextData(botId);
            this.toastr.success('Your text has been deleted successfully.', 'Tex Deleted', {
              timeOut: 1000,
            });
          });
        },
        error => {
          this.toastr.error('Error during text deletion.', 'Error', {
            timeOut: 1000,
          });
        }
      );
    } else {
     //alert('No Text selected for deletion');
      this.toastr.warning('No Text selected for deletion.', 'Warning', {
        timeOut: 1000,
      });
    }
  }
}
