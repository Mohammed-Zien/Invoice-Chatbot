import { Flow } from './flow.interface';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';

export class CreateInvoiceFlow implements Flow<CreateInvoiceDto> {
  private step = 0;
  private invoice: Partial<CreateInvoiceDto> = {};
  private lastError: string | null = null;

  handleUserInput(input: string): void {
    this.lastError = null; // Reset error each time

    switch (this.step)
    {
      case 0:
      {
        if(input.trim() === "")
        {
          this.lastError = "ERROR: Client Name is Rquired";
        }
        else
        {
          this.invoice.clientname = input.trim();
          this.step++;
        }

        break;
      }

      case 1:
      {
        const lowered = input.toLowerCase().trim();

        if (/no|none|don't|skip/.test(lowered))
        {
          this.invoice.duedate = null;
          this.step++;
        }
        else if (lowered === "today")
        {
          this.invoice.duedate = new Date().toISOString().split("T")[0];
          this.step++;
        }
        else 
        {
          const now = new Date();
          const match = lowered.match(/(\d+)?\s*(day|week|month|year)s?/);

          if (match)
          {
            const [, amountStr, unit] = match;
            const amount = parseInt(amountStr || "1", 10);
            switch (unit)
            {
              case "day": now.setDate(now.getDate() + amount); break;
              case "week": now.setDate(now.getDate() + amount * 7); break;
              case "month": now.setMonth(now.getMonth() + amount); break;
              case "year": now.setFullYear(now.getFullYear() + amount); break;
            }
            this.invoice.duedate = now.toISOString().split("T")[0];
            this.step++;
          }
          else
          {
            const parsed = new Date(input);
            if (!isNaN(parsed.getTime()))
            {
              this.invoice.duedate = parsed.toISOString().split("T")[0];
              this.step++;
            }
            else 
            {
              this.lastError = "I didn't understand the due date. Try something like '2 weeks' or '2025-08-01'.";
            }
          }
        }
        break;
      }

      case 2:
      {
        const statusMap: Record<string, number> = {
          unpaid: 0,
          pending: 1,
          paid: 2
        };
        const status = statusMap[input.toLowerCase().trim()];
        if (status !== undefined)
        {
          this.invoice.status = status;
          this.step++;
        } 
        else
        {
          this.lastError = "Status must be one of: unpaid, pending, or paid.";
        }
        break;
      }
      
      case 3:
      {
        const currency = input.trim().toUpperCase();
        if(currency.length <= 3 && currency.length > 0)
        {
            this.invoice.currency = currency;
            this.step++;
        }
        else
        {
             this.lastError = "Invalid Currency";
        }
        
        break;
      }

      case 4:
      {
        this.invoice.notes = /no|none|skip/i.test(input) ? null : input.trim();
        this.step++;
        break;
      }
    }
  }

  getCurrentPrompt(): string {
    switch (this.step) {
      case 0: return "What is the client's name?";
      case 1: return "When is the due date?";
      case 2: return "What is the invoice status? (unpaid, pending, or paid)";
      case 3: return "What is the currency?";
      case 4: return "Any notes to include?";
      case 5: return "Would you like to add Items next ?"
      default: return "Invoice header complete.";
    }
  }

  getSuggestions(): string[] {
    switch (this.step) {
      case 0: return ["Acme Corp", "Stark Industries", "Wayne Enterprises"];
      case 1: return ["no due date", "today", "2 weeks", "1 month"];
      case 2: return ["unpaid", "pending", "paid"];
      case 3: return ["USD", "EUR", "EGP"];
      case 4: return ["No"];
      case 5: return ["Yes", "No"]
      default: return [];
    }
  }

  getErrorMessage(): string | null {
    const error = this.lastError;
    this.lastError = null; // Clear after retrieving
    return error;
  }

  isComplete(): boolean {
    return this.step > 4;
  }

  getResult(): CreateInvoiceDto {
    return {
      clientname: this.invoice.clientname!,
      duedate: this.invoice.duedate ?? null,
      status: this.invoice.status!,
      currency: this.invoice.currency!,
      notes: this.invoice.notes ?? null
    };
  }
}
