import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload } from 'lucide-angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AppState } from '../states/app.state';
import { selectPdfData, selectSelectedUserBot } from '../states/auth/auth.selector';
import { Store } from '@ngrx/store';
import { setPdfData } from '../states/auth/auth.action';
import { forkJoin } from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent {
  selectedUserBot$: Observable<string>;
  pdfData$: Observable<any[]>;
  selectedPdfIds: Set<string> = new Set();
  private subscriptions = new Subscription();
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;
  isPdfSelected: boolean = false;
  private selectedPdfFile: File | null = null;

  constructor(private authService: AuthService, private store: Store<AppState>, private toastr: ToastrService) {
    this.selectedUserBot$ = this.store.select(selectSelectedUserBot);
    this.pdfData$ = this.store.select(selectPdfData);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.selectedUserBot$.subscribe(botId => {
        this.fetchPdfData(botId);
      })
    );
  }

  checkFileSize(file: File): boolean {
    if (file.size > this.MAX_FILE_SIZE) {
      this.toastr.error('File size exceeds 10MB. Please select a smaller file."', 'Error adding File',{
        timeOut: 1000,
      });
      return false;
    }
    return true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.isPdfSelected = false;
      this.selectedPdfFile = null;
      return;
    }
  
    const file = input.files[0];
    if (this.checkFileSize(file)) {
      this.isPdfSelected = true;
      this.selectedPdfFile = file;
    } else {
      input.value = '';
      this.isPdfSelected = false;
      this.selectedPdfFile = null;
    }
  }

  uploadPdf(): void {
    if (!this.selectedPdfFile) {
      console.error('No file selected');
      this.toastr.warning('No file selected','Warning',{
        timeOut: 1000,
      });
      return;
    }
    const formData = new FormData();
    // Append necessary data to formData
    formData.append('name', this.selectedPdfFile.name);
    formData.append('pdf_file', this.selectedPdfFile);
    formData.append('size', this.selectedPdfFile.size.toString());
    
    this.selectedUserBot$.subscribe(botId => {
      formData.append('bot_id', botId);
    });

    // Call the AuthService method to upload the PDF
    this.authService.updateBotPdf(formData).subscribe(
      () => {
        this.toastr.success('PDF has been successfully added.', 'PDF Added',{
          timeOut: 1000,
        });
        this.resetFileInput();
      },
      error => {
        // Handle upload error
        console.error('Error uploading PDF:', error);
      }
    );
  }

  private resetFileInput(): void {
    this.selectedPdfFile = null;
    this.isPdfSelected = false;
    this.selectedUserBot$.subscribe(botId => {
      this.fetchPdfData(botId);
    });
  }

  fetchPdfData(botId: string) {
    if (botId) {
      this.authService.getBotPdf({ bot_id: botId }).subscribe(
        response => {
          this.store.dispatch(setPdfData({ pdfData: response.data }));
        },
        error => {
          console.error('Error fetching PDF:', error);
        }
      );
    }
  }

  onCheckboxChange(pdfId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedPdfIds.add(pdfId);
    } else {
      this.selectedPdfIds.delete(pdfId);
    }
  }

  onDeleteSelected() {
    const selectedIds = Array.from(this.selectedPdfIds);
    if (selectedIds.length > 0) {
      const deletionRequests = selectedIds.map(pdfId => 
        this.authService.deleteBotPdf({ document_id: pdfId })
      );
      forkJoin(deletionRequests).subscribe(
        () => {
          this.selectedPdfIds.clear();
          this.selectedUserBot$.subscribe(botId => {
            this.fetchPdfData(botId);
          });
        },
        error => {
          console.error('Error during PDF deletion:', error);
        }
      );
    } else {
      console.log('No PDF selected for deletion');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}

