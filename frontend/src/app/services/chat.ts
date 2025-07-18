import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { Flow } from '../flows/flow.interface';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CreateInvoiceFlow } from '../flows/CreateInvoiceFlow';
import { UpdateInvoiceDto } from '../dtos/update-invoice.dto';
import { UpdateInvoiceFlow } from '../flows/UpdateInvoiceFlow';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DeleteInvoiceFlow } from '../flows/DeleteInvoiceFlow';

@Injectable({
  providedIn: 'root'
})
export class Chat {
  private readonly API_URL = 'http://localhost:5299/api/Invoices';
  constructor(private http: HttpClient) {}

  private activeFlow: Flow<any> | null = null;

  private _messages = new BehaviorSubject<ChatMessage[]>([
    { role: 'bot', content: 'How can I help you today?' }
  ]);
  public messages$ = this._messages.asObservable();

  private _suggestions = new BehaviorSubject<string[]>([
    'Create a new invoice',
    'Update an invoice',
    'Delete an invoice'
  ]);
  public suggestions$ = this._suggestions.asObservable();

  sendMessage(userInput: string) {
    // Append user message
    this.pushMessage('user', userInput);

    // CASE 1: Start new invoice flow
    if (!this.activeFlow && /cre/i.test(userInput)) {
      this.activeFlow = new CreateInvoiceFlow();
      this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
      this._suggestions.next(this.activeFlow.getSuggestions());
      return;
    }

    /*
          // CASE 2: Start update invoice flow
          if (!this.activeFlow && /update/i.test(userInput)) {
            const match = userInput.match(/invoice.*?(\d+)/i);
            const invoiceId = match ? Number(match[1]) : null;

            if (!invoiceId) {
              this.pushMessage('bot', 'Please provide the invoice ID you want to update (e.g., "update invoice 12")');
              return;
            }

            this.pushMessage('bot', `Fetching invoice ${invoiceId}...`);
            this.fetchInvoice(invoiceId).subscribe({
              next: (existing) => {
                this.activeFlow = new UpdateInvoiceFlow();
                this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
                this._suggestions.next(this.activeFlow.getSuggestions());
              },
              error: (err: Error) => {
                this.pushMessage('bot', `❌ Could not fetch invoice: ${err.message}`);
              }
            });
            return;
          }
    */

    // CASE 3: Start delete invoice flow
    if (!this.activeFlow && /del/i.test(userInput)) {
      this.activeFlow = new DeleteInvoiceFlow();
      this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
      this._suggestions.next(this.activeFlow.getSuggestions());
      return;
    }

    if (this.activeFlow) {
      this.activeFlow.handleUserInput(userInput);
      const error = this.activeFlow.getErrorMessage();

    if (error) {
      this.pushMessage("bot", error);
      this._suggestions.next(this.activeFlow.getSuggestions());
      return;
    }

    if (this.activeFlow.isComplete()) {
      const result = this.activeFlow.getResult();
      const isUpdate = this.activeFlow instanceof UpdateInvoiceFlow;
      const isDelete = this.activeFlow instanceof DeleteInvoiceFlow;
      const invoiceId = isUpdate ? result.id : isDelete ? result: null;
      this._suggestions.next([]);
      this.activeFlow = null;

      if (isDelete) {
        this.pushMessage('bot', `Deleting invoice ${invoiceId}...`);
        this.deleteInvoice(invoiceId!).subscribe({
          next: () => {
            this.pushMessage('bot', `🗑️ Invoice ${invoiceId} deleted successfully.`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
            ]);
          },
          error: (err: Error) => {
            this.pushMessage('bot', `❌ Failed to delete invoice:\n${err.message}`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
            ]);
          }
        });
        return;
      }

      this.pushMessage('bot', isUpdate ? 'Updating invoice...' : 'Saving invoice...');

      const request$ = isUpdate
        ? this.updateInvoice(invoiceId!, result)
        : this.saveInvoice(result);

      request$.subscribe({
        next: (res: any) => {
          const msg = isUpdate
            ? `✅ Invoice ${invoiceId} updated successfully.`
            : `✅ Invoice saved successfully with ID ${res.id}.`;
          this.pushMessage('bot', msg);

          this.pushMessage('bot', 'What would you like to do next?');
          this._suggestions.next([
            'Create a new invoice',
            'Update an invoice',
            'Delete an invoice',
          ]);
        },
        error: (err: Error) => {
          const msg = isUpdate
            ? `❌ Failed to update invoice:\n${err.message}`
            : `❌ Failed to save invoice:\n${err.message}`;
          this.pushMessage('bot', msg);
          this.pushMessage('bot', 'What would you like to do next?');
          this._suggestions.next([
            'Create a new invoice',
            'Update an invoice',
            'Delete an invoice',
          ]);
        }
      });

      return;
    }


    // No error and still in progress — continue flow
    this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
    this._suggestions.next(this.activeFlow.getSuggestions());
    return;
  }

    // CASE 3: No matching flow
    this.pushMessage('bot', "Sorry, I didn’t understand. Try something like 'create a new invoice'.");
    this._suggestions.next([]);
  }

  private pushMessage(role: 'user' | 'bot', content: string) {
    const updated = [...this._messages.value, { role, content }];
    this._messages.next(updated);
  }

  saveInvoice(dto: CreateInvoiceDto) {
    return this.http.post(`${this.API_URL}`, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';

        if (error.status === 0) {
          errorMsg = '❌ Could not connect to backend. Please check CORS or HTTPS.';
        } else if (error.status === 400 && error.error && typeof error.error === 'object') {
          const flatErrors = Object.values(error.error).flat();
          errorMsg = `❌ [${error.status}] ${flatErrors.join('\n')}`;
        } else {
          errorMsg = `❌ [${error.status}] ${error.statusText}`;
        }

        return throwError(() => new Error(errorMsg));
      })
    );  
  }

  fetchInvoice(id: number) {
    return this.http.get(`${this.API_URL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = error.status === 404
          ? `Invoice ${id} not found.`
          : `❌ [${error.status}] ${error.statusText}`;
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateInvoice(id: number, dto: UpdateInvoiceDto) {
    return this.http.put(`${this.API_URL}/${id}`, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';

        if (error.status === 0) {
          errorMsg = '❌ Could not connect to backend. Please check CORS or HTTPS.';
        } else if (error.status === 400 && error.error && typeof error.error === 'object') {
          const flatErrors = Object.values(error.error).flat();
          errorMsg = `❌ [${error.status}] ${flatErrors.join('\n')}`;
        } else {
          errorMsg = `❌ [${error.status}] ${error.statusText}`;
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }
  deleteInvoice(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';

        if (error.status === 0) {
          errorMsg = '❌ Could not connect to backend. Please check CORS or HTTPS.';
        } else if (error.status === 404) {
          errorMsg = `Invoice ${id} not found.`;
        } else {
          errorMsg = `❌ [${error.status}] ${error.statusText}`;
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }

}
