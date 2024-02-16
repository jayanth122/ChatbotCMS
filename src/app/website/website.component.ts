import { Component, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../states/app.state';
import { selectSelectedUserBot, selectWebsiteData } from '../states/auth/auth.selector';
import { AuthService } from '../auth.service';
import { setWebsiteData } from '../states/auth/auth.action';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [ CommonModule, LucideAngularModule, FormsModule ],
  templateUrl: './website.component.html',
  styleUrl: './website.component.css'
})
export class WebsiteComponent {
  inputWebsite: string = '';  
  selectedWebsiteIds: Set<string> = new Set();
  websiteData$: Observable<any[]>;
  private subscriptions = new Subscription();
  selectedUserBot$: Observable<string>;
  
  constructor( private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) { 
    this.websiteData$ = this.store.select(selectWebsiteData);
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.fetchWebsiteData(botId);
      })
    );
  }

  onCheckboxChange(pdfId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedWebsiteIds.add(pdfId);
    } else {
      this.selectedWebsiteIds.delete(pdfId);
    }
  }

  onDeleteSelected() {
    const selectedIds = Array.from(this.selectedWebsiteIds);
    if (selectedIds.length > 0) {
      const deletionRequests = selectedIds.map(websiteId => 
        this.authService.deleteBotWebsite({ document_id: websiteId })
      );
      forkJoin(deletionRequests).subscribe(
        () => {
          this.selectedWebsiteIds.clear();
          this.selectedUserBot$.subscribe(botId => {
            this.fetchWebsiteData(botId);
            this.toastr.success('Website has been deleted successfully.', 'Bit Website Deleted', { 
              timeOut: 1000,
            });
          });
        },
        error => {
          this.toastr.error('Error during Website deletion', 'Error', {
            timeOut: 1000,
          });
          //console.error('Error during Website deletion:', error);
        }
      );
    } else {
     alert('No Text selected for deletion');
    }
  }

  fetchWebsiteData(botId: string) {
    if (botId) {
      this.authService.getBotWebsite({ bot_id: botId }).subscribe(
        response => {
          //console.log('Text data:', response.data);
          this.store.dispatch(setWebsiteData({ websiteData: response.data }));
        },
        error => {
          console.error('Error fetching PDF:', error);
        }
      );
    }
  }

  onUpload(): void {
    if (this.inputWebsite) {
      //if(this.inputWebsite && (this.inputWebsite.startsWith("http://") || this.inputWebsite.startsWith("https://"))){
        if(this.isValidUrl(this.inputWebsite)){
        this.selectedUserBot$.subscribe(selectedUserBot => {
          let setBotId = "";
          this.selectedUserBot$.subscribe(botId => {
            setBotId = botId;
          });
          this.authService.updateBotWebsite({ 
            bot_id: setBotId, 
            website_url: this.inputWebsite
          }).subscribe(
            response => {
              this.inputWebsite = '';
              //alert('Your website has been uploaded successfully.')
              this.toastr.success('Your website has been uploaded successfully.', 'Website Uploaded', {
                timeOut: 1000,
              });
              this.fetchWebsiteData(setBotId);
            },
            error => {
              console.error('Error uploading website:', 'Error Uploading Website',{
                timeOut: 1000,
              });
            }
          );
  
        });
      }
      else{
        //alert('Please enter a valid URL');
        this.toastr.warning('', 'Please enter a valid URL', {
          timeOut: 1000,
        });
      }
    } else {
      alert('Please enter some URL before uploading.');
    }
  }

  isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  }
}
