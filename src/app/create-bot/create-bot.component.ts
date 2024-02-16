import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserBot } from '../states/auth/auth.reducer';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { Router } from '@angular/router';
import { selectUserBots } from '../states/auth/auth.selector';
import { first } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './create-bot.component.html',
  styleUrl: './create-bot.component.css'
})
export class CreateBotComponent {
  botName: string = ''; // The name of the bot
  botCharacter: string = ''; // The character of the bot
  botText: string = ''; // The text of the bot
  showCreateForm: boolean = true; // Initially show the create form
  showUploadSection: boolean = false; // Initially hide the upload section
  userBots$: Observable<UserBot[]>;
  botExists: boolean = false;
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  private subscriptions = new Subscription();
  botPdfFile: File | null = null;
  isPdf: boolean = false;
  isText: boolean = false;

  constructor(private authService: AuthService, private store: Store<AppState>, private router: Router, private dialog: MatDialog, private toastr: ToastrService) {
    this.userBots$ = this.store.select(selectUserBots);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (this.checkFileSize(file)) {
        this.botPdfFile = file;
        this.isPdf = true;
      } else {
        event.target.value = '';
        console.error('File size exceeds the limit');
      }
    }
  }

  checkFileSize(file: File): boolean {
    if (file.size > this.MAX_FILE_SIZE) {
      alert("File size exceeds 10MB. Please select a smaller file.");
      return false;
    }
    return true;
  }

  toggleVisibility(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showUploadSection = !this.showUploadSection;
  }

  createBot(): void {
    console.log(this.botName, this.botCharacter, this.botText, this.botPdfFile);
    this.authService.createUserBot({ name: this.botName, character: this.botCharacter }).subscribe(
      (response) => {
        if (this.isPdf)
          this.uploadBotPdf(response.data._id);
        else if (this.isText)
          this.uploadBotText(response.data._id);
        this.closeCreateBot();
        this.toastr.success('Your new Chatbot'+ this.botName +'created.', 'Bot Created',{
          timeOut: 1000,
        });
        setTimeout(function() {
          window.location.reload();
        }, 1000);  
        this.dialog.closeAll();
      },
      (error) => {
        console.error('Error creating bot', error);
      }
    );
  }

  uploadBotText(botId: string): void {
    this.authService.updateBotText({ bot_id: botId, text: this.botText }).subscribe(
      (response) => {
        //console.log('Text uploaded', response);
        this.toastr.success('Your text has been successfully added.', 'Text Added',{
          timeOut: 1000,
        });
      },
      (error) => {
        console.error('Error uploading text', error);
      }
    );
  }

  uploadBotPdf(botId: string): void {
    if (this.botPdfFile) {
      const formData = new FormData();
      // Append necessary data to formData
      formData.append('name', this.botPdfFile.name);
      formData.append('pdf_file', this.botPdfFile);
      formData.append('size', this.botPdfFile.size.toString());
      formData.append('bot_id', botId);

      // Call the AuthService method to upload the PDF
      this.authService.updateBotPdf(formData).subscribe(
        () => {
          console.log('PDF uploaded successfully');
        },
        error => {
          // Handle upload error
          console.error('Error uploading PDF:', error);
        }
      );
    }
    else {
      //alert("No file selected");
      this.toastr.warning('No file selected','No PDF Selected',{
        timeOut: 1000,
      });
    }
  }

  backToPreviousStep(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showUploadSection = !this.showUploadSection;
  }

  checkBotExists(): void {
    this.subscriptions.add(
      this.userBots$.pipe(first()).subscribe(bots => {
        this.botExists = bots.some(bot => bot.name.toLowerCase() === this.botName.toLowerCase());
      })
    );
  }

  botTextUpdate(): void {
    this.isText = true;
  }

  closeCreateBot(): void {
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
