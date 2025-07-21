import { Injectable, ɵIS_INCREMENTAL_HYDRATION_ENABLED } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { Flow } from '../flows/flow.interface';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CreateInvoiceFlow } from '../flows/CreateInvoiceFlow';
import { UpdateInvoiceDto } from '../dtos/update-invoice.dto';
import { UpdateInvoiceFlow } from '../flows/UpdateInvoiceFlow';
import { CreateItemFlow } from '../flows/CreateItemFlow';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DeleteInvoiceFlow } from '../flows/DeleteInvoiceFlow';
import { CreateItemDto } from '../dtos/CreateItemDto';
import { LLMResponse } from '../models/LLM-response';
import { GetInvoiceFlow } from '../flows/GetInvoiceFlow';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Chat {
  private readonly API_URL = 'http://localhost:5299/api';
  constructor(private http: HttpClient) {}

  private activeFlow: Flow<any> | null = null;
  private pendingUpdateInvoice = false;

  private awaitingItemDecision = false;
  private invoiceIdForItems: number | null = null;


  private _messages = new BehaviorSubject<ChatMessage[]>([
    { role: 'bot', content: 'How can I help you today?' }
  ]);
  public messages$ = this._messages.asObservable();

  private _suggestions = new BehaviorSubject<string[]>([
    'Create a new invoice',
    'Update an invoice',
    'Delete an invoice',
    'Show an invoice'

  ]);
  public suggestions$ = this._suggestions.asObservable();

  private _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();
  

  private setLoading(loading: boolean) {
    this._isLoading.next(loading);
  }

  async sendMessage(userInput: string)
  {
    // Append user message
    this.pushMessage('user', userInput);

    // CASE 1: Start new invoice flow
    if (!this.activeFlow && /cre/i.test(userInput))
    {
      this.activeFlow = new CreateInvoiceFlow();
      this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
      this._suggestions.next(this.activeFlow.getSuggestions());
      return;
    }

     // CASE 3: Start delete invoice flow
    if (!this.activeFlow && /del/i.test(userInput))
    {
      this.activeFlow = new DeleteInvoiceFlow();
      this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
      this._suggestions.next(this.activeFlow.getSuggestions());
      return;
    }

    // CASE 3: Update Flow - Phase 1
    if (!this.activeFlow && !this.pendingUpdateInvoice && /up/i.test(userInput)) {
      this.pushMessage('bot', "Enter the Invoice Number (e.g., INV-123):");
      this._suggestions.next([]);
      this.pendingUpdateInvoice = true;
      return;
    }

    // CASE 3: Update Flow - Phase 2
    if (this.pendingUpdateInvoice) {
      const InvoiceNumber = userInput.trim();

      if (!InvoiceNumber.match(/^INV-\d+$/)) {
        this.pushMessage("bot", "Invalid Invoice Number. Use format INV-123.");
        this.pushMessage('bot', 'What would you like to do next?');
        this._suggestions.next([
          'Create a new invoice',
          'Update an invoice',
          'Delete an invoice',
          'Show an invoice'
        ]);
        return;
      }
      const InvoiceId = parseInt(InvoiceNumber.split('-')[1]);
      this.pushMessage('bot', "Fetching Invoice...");
      
      this.setLoading(true);
      try {
        const existing = await this.fetchInvoice(InvoiceId);
        console.log('Fetched invoice:', existing);
        this.activeFlow = new UpdateInvoiceFlow(existing);
        this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
        this._suggestions.next(this.activeFlow.getSuggestions());
      } catch (err: any) {
        this.pushMessage("bot", `Could not fetch invoice: ${err.message}`);
      } finally {
        this.setLoading(false);
      }

      this.pendingUpdateInvoice = false;
      return;
    }

    // === ITEM DECISION STATE ===
    if (this.awaitingItemDecision)
    {
      const reply = userInput.trim().toLowerCase();
      if (reply === 'yes')
      {
        this.activeFlow = new CreateItemFlow();
        this.awaitingItemDecision = false;
        this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
        this._suggestions.next(this.activeFlow.getSuggestions());
        return;
      }
      else if (reply === 'no')
      {
        this.awaitingItemDecision = false;
        this.invoiceIdForItems = null;
        this.pushMessage('bot', 'Invoice creation complete. What would you like to do next?');
        this._suggestions.next([
          'Create a new invoice',
          'Update an invoice',
          'Delete an invoice',
          'Show an invoice'
        ]);
        return;
      }
      else 
      {
        this.pushMessage('bot', "Please answer 'Yes' or 'No'. Would you like to add another item?");
        return;
      }
    }

    // Case 4 LLM Call
    if (!this.activeFlow && userInput.startsWith('ask/'))
    {
      const question = userInput.split("/")[1];
      this.pushMessage("bot", "Thinking...");
      this.setLoading(true);
      try {
        const response = await this.AskLLM(question);
        this.pushMessage("bot", response.answer);
        this.pushMessage('bot', 'What would you like to do next?');
        this._suggestions.next([
          'Create a new invoice',
          'Update an invoice',
          'Delete an invoice',
          'Show an invoice'

        ]);
        return;
      } catch (err: any) {
        this.pushMessage("bot", `ERROR: ${err.message}`);
        this.pushMessage('bot', 'What would you like to do next?');
        this._suggestions.next([
          'Create a new invoice',
          'Update an invoice',
          'Delete an invoice',
          'Show an invoice'

        ]);
        return;
      } finally {
        this.setLoading(false);
      }
    }

    // Case 5 get by ID
    if (!this.activeFlow && /(get|show|fetch)/i.test(userInput)) 
    {
      this.activeFlow = new GetInvoiceFlow();
      this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
      this._suggestions.next(this.activeFlow.getSuggestions());
      return;
    }

    if (this.activeFlow)
    {
      this.activeFlow.handleUserInput(userInput);
      const error = this.activeFlow.getErrorMessage();

      if (error)
      {
        this.pushMessage("bot", error);
        this._suggestions.next(this.activeFlow.getSuggestions());
        return;
      }

      // No error and still in progress — continue flow
      if (!this.activeFlow.isComplete())
      {
        this.pushMessage('bot', this.activeFlow.getCurrentPrompt());
        this._suggestions.next(this.activeFlow.getSuggestions());
        return;
      }

      if (this.activeFlow.isComplete()) 
      {
        const result = this.activeFlow.getResult();
        const isUpdate = this.activeFlow instanceof UpdateInvoiceFlow;
        const isDelete = this.activeFlow instanceof DeleteInvoiceFlow;
        const isCreate = this.activeFlow instanceof CreateInvoiceFlow;
        const isItemCreate = this.activeFlow instanceof CreateItemFlow;
        const isGet = this.activeFlow instanceof GetInvoiceFlow;
        const invoiceId = isUpdate ?  result.id : isDelete ? result: null;
        this._suggestions.next([]);
        this.activeFlow = null;

        if (isDelete)
        {
          this.pushMessage('bot', `Deleting invoice ${invoiceId}...`);
          this.setLoading(true);
          try {
            await this.deleteInvoice(invoiceId.trim().split("-")[1]!);
            this.pushMessage('bot', `Invoice ${invoiceId} deleted successfully.`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
              'Show an invoice'

            ]);
          } catch (err: any) {
            this.pushMessage('bot', `Failed to delete invoice:\n${err.message}`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
              'Show an invoice'

            ]);
          } finally {
            this.setLoading(false);
          }
          return;
        }

        if (isCreate)
        {
          this.pushMessage('bot', `Saving Invoice...`);
          this.setLoading(true);
          try {
            const res: any = await this.saveInvoice(result);
            this.invoiceIdForItems = res.invoiceNumber.split("-")[1];
            this.pushMessage('bot', `Invoice saved with number ${res.invoiceNumber}.`);
            this.pushMessage('bot', 'Would you like to add items next?');
            this._suggestions.next(['Yes', 'No']);
            this.awaitingItemDecision = true;
          } catch (err: any) {
            this.pushMessage('bot', `Failed to save invoice:\n${err.message}`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
              'Show an invoice'

            ]);
          } finally {
            this.setLoading(false);
          }
          return;
        }

        if(isUpdate)
        {
          this.pushMessage('bot', `Updating Invoice...`);
          this.setLoading(true);
          try {
            const res: any = await this.updateInvoice(invoiceId, result.dto);
            this.pushMessage('bot', `Invoice ${invoiceId} updated successfully.`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
            ]);
          } catch (err: any) {
            this.pushMessage('bot', `Failed to update invoice:\n${err.message}`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
              'Show an invoice'

            ]);
          } finally {
            this.setLoading(false);
          }
          return;
        }

        if(isGet)
        {
          this.pushMessage("bot", "Fetching Invoice");
          this.setLoading(true);
          try {
            const result_fetch: any = await this.fetchInvoice(parseInt(result.split("-")[1]));
            this.pushMessage("bot", `Invoice Number: ${result_fetch.invoiceNumber}\n\nClient: ${result_fetch.clientname}\nIssue: ${result_fetch.issuedate}\nDue: ${result_fetch.duedate}\nStatus: ${this.getStatusText(result_fetch.status!)}\nTotal Amount: ${result_fetch.totalamount} ${result_fetch.currency}\nNotes: ${result_fetch.notes}\n\n`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
              'Show an invoice'

            ]);
          } catch (err: any) {
            this.pushMessage('bot', `Failed to Fetch invoice:\n${err.message}`);
            this.pushMessage('bot', 'What would you like to do next?');
            this._suggestions.next([
              'Create a new invoice',
              'Update an invoice',
              'Delete an invoice',
              'Show an invoice'

            ]);
          } finally {
            this.setLoading(false);
          }
          return;
        }

        if (isItemCreate)
        {
          const invoiceId = this.invoiceIdForItems;
          console.log("invoiceIdForItems" + this.invoiceIdForItems);

          if (!invoiceId) {
            this.pushMessage('bot', 'Error: No invoice found to attach the item to.');
            this.activeFlow = null;
            return;
          }

          this.pushMessage('bot', 'Saving item...');
          this.setLoading(true);
          try {
            await this.saveItem(invoiceId, result);
            this.pushMessage('bot', 'Item added successfully.');
            this.pushMessage('bot', 'Would you like to add another item?');
            this._suggestions.next(['Yes', 'No']);
            this.awaitingItemDecision = true;
            this.activeFlow = null;
          } catch (err: any) {
            this.pushMessage('bot', `Failed to save item:\n${err.message}`);
            this.pushMessage('bot', 'Would you like to try adding it again?');
            this._suggestions.next(['Yes', 'No']);
            this.awaitingItemDecision = true;
            this.activeFlow = null;
          } finally {
            this.setLoading(false);
          }
          return;
        }

        return;
      }
    
    }

    // No matching flow
    this.pushMessage('bot', "Sorry, I didn't understand. Try something like 'create a new invoice'.");
    this._suggestions.next([]);
    return;


  }

  private pushMessage(role: 'user' | 'bot', content: string) {
    const updated = [...this._messages.value, { role, content }];
    this._messages.next(updated);
  }

  async saveInvoice(dto: CreateInvoiceDto) {
    try {
      return await firstValueFrom(this.http.post(`${this.API_URL}/Invoices`, dto));
    } catch (error: any) {
      let errorMsg = '';

      if (error.status === 0) {
        errorMsg = 'Could not connect to backend. Please check CORS or HTTPS.';
      } else if (error.status === 400 && error.error && typeof error.error === 'object') {
        const flatErrors = Object.values(error.error).flat();
        errorMsg = `[${error.status}] ${flatErrors.join('\n')}`;
      } else {
        errorMsg = `[${error.status}] ${error.statusText}`;
      }

      throw new Error(errorMsg);
    }
  }

  async fetchInvoice(id: number) {
    try {
      return await firstValueFrom(this.http.get(`${this.API_URL}/Invoices/${id}`));
    } catch (error: any) {
      let errorMsg = error.status === 404
        ? `Invoice INV-${id} not found.`
        : `[${error.status}] ${error.statusText}`;
      throw new Error(errorMsg);
    }
  }

  async updateInvoice(id: number, dto: UpdateInvoiceDto) {
    try {
      return await firstValueFrom(this.http.put(`${this.API_URL}/Invoices/${id}`, dto));
    } catch (error: any) {
      let errorMsg = '';

      if (error.status === 0) {
        errorMsg = 'Could not connect to backend. Please check CORS or HTTPS.';
      } else if (error.status === 400 && error.error && typeof error.error === 'object') {
        const flatErrors = Object.values(error.error).flat();
        errorMsg = `[${error.status}] ${flatErrors.join('\n')}`;
      } else {
        errorMsg = `[${error.status}] ${error.statusText}`;
      }

      throw new Error(errorMsg);
    }
  }

  async deleteInvoice(id: number) {
    try {
      return await firstValueFrom(this.http.delete(`${this.API_URL}/Invoices/${id}`));
    } catch (error: any) {
      let errorMsg = '';

      if (error.status === 0) {
        errorMsg = 'Could not connect to backend. Please check CORS or HTTPS.';
      } else if (error.status === 404) {
        errorMsg = `Invoice ${id} not found.`;
      } else {
        errorMsg = `[${error.status  }] ${error.statusText}`;
      }

      throw new Error(errorMsg);
    }
  }

  async saveItem(invoiceId: number, itemDto: CreateItemDto) {
    try {
      return await firstValueFrom(this.http.post(`${this.API_URL}/InvoiceDetail/${invoiceId}`, itemDto));
    } catch (error: any) {
      let errorMsg = '';
      if (error.status === 0) {
        errorMsg = 'Could not connect to backend. Please check CORS or HTTPS.';
      } else if (error.status === 400 && error.error && typeof error.error === 'object') {
        const flatErrors = Object.values(error.error).flat();
        errorMsg = `[${error.status}] ${flatErrors.join('\n')}`;
      } else {
        errorMsg = `[${error.status}] ${error.statusText}`;
      }
      throw new Error(errorMsg);
    }
  }

  async AskLLM(question: string): Promise<LLMResponse> {
    try {
      return await firstValueFrom(this.http.post<LLMResponse>('http://127.0.0.1:8000/ask', {question}));
    } catch (error: any) {
      const errorMsg = "Something went wrong please try again later.";
      throw new Error(errorMsg);
    }
  }

  getStatusText(status: number): string {
      switch (status) {
        case 0: return "Unpaid";
        case 1: return "Pending";
        case 2: return "Paid";
        default: return "Unknown";
      }
  }

}