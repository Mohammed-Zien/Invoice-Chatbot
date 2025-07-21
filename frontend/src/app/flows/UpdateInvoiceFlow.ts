import { Flow } from './flow.interface';
import { UpdateInvoiceDto } from '../dtos/update-invoice.dto';
import { GetInvoiceDto } from '../dtos/GetInvoiceDto';
export class UpdateInvoiceFlow implements Flow<{ id: number; dto: UpdateInvoiceDto }> {
  public step = 0;
  private Updatedinvoice: Partial<UpdateInvoiceDto> = {};
  private lastError: string | null = null;
  
  constructor(private OldInvoice : Partial<GetInvoiceDto>) {  }


  handleUserInput(input: string): void {
    this.lastError = null;

    switch (this.step)
    {
      case 0:
      {
        if(/y/.test(input.trim().toLowerCase()))
        {
          this.step++;
        }
        else
        {
          this.step++; // ADD CANCELATION LOGIC
        }
        break;
      }
      case 1:
      {
        if(/no|none|don't|skip/.test(input.trim().toLowerCase()))
        {
          this.Updatedinvoice.clientname = this.OldInvoice.clientname;
        }
        else
        {
          if(input.trim() === '')
          {
            this.lastError = "Client Name cannot be empty";
            return;
          }
          else
          {
            this.Updatedinvoice.clientname = input.trim();
          }
        }
        this.step++;
        break;
      }

      case 2:
      {
        const lowered = input.toLowerCase().trim();

        if (/no|none|don't|skip/.test(lowered))
        {
          this.Updatedinvoice.duedate = this.OldInvoice.duedate;
          this.step++;
        } 
        else if (lowered === "today") {
          this.Updatedinvoice.duedate = new Date().toLocaleDateString('en-CA');
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
            switch (unit) {
              case "day": now.setDate(now.getDate() + amount); break;
              case "week": now.setDate(now.getDate() + amount * 7); break;
              case "month": now.setMonth(now.getMonth() + amount); break;
              case "year": now.setFullYear(now.getFullYear() + amount); break;
            }
            this.Updatedinvoice.duedate = now.toISOString().split('T')[0]; // ISO 8601 format
            this.step++;
          } 
          else
          {
            const parsed = new Date(input);
            if (!isNaN(parsed.getTime()))
            {
              this.Updatedinvoice.duedate = parsed.toISOString().split('T')[0];
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

      case 3:
      {
        const statusMap: Record<string, number> = {
          unpaid: 0,
          pending: 1,
          paid: 2
        };

        const lowered = input.trim().toLowerCase();

        if(/no|none|don't|skip/.test(lowered))
        {
          this.Updatedinvoice.status = this.OldInvoice.status;
          this.step++;
        }
        else
        {

        const status = statusMap[lowered];

        if (status !== undefined)
        {
          this.Updatedinvoice.status = status;
          this.step++;
        } 
        else 
        {
          this.lastError = "Status must be one of: unpaid, pending, or paid.";
        }
        }
        break;
      }

      case 4: 
      {
        if(/no|none|don't|skip/.test(input.trim().toLowerCase()))
        {
          this.Updatedinvoice.currency = this.OldInvoice.currency;
          this.step++;
        }
        else
        {
          const currency = input.trim().toUpperCase();
          if (currency.length <= 3 && currency.length > 0)
          {
            this.Updatedinvoice.currency = currency;
            this.step++;
          }
          else 
          {
            this.lastError = "Invalid currency code.";
          }
        }
        
        break;
      }

      case 5:
      {
        this.Updatedinvoice.notes = /no|none|skip/i.test(input) ? this.OldInvoice.notes : input.trim();
        this.step++;
        break;
      }
    }
  }

  getCurrentPrompt(): string {
    switch (this.step) {
      case 0: return `Invoice Number: ${this.OldInvoice.invoiceNumber}\n\nClient: ${this.OldInvoice.clientname}\nIssue: ${this.OldInvoice.issuedate}\nDue: ${this.OldInvoice.duedate}\nStatus: ${this.getStatusText(this.OldInvoice.status!)}\nTotal Amount: ${this.OldInvoice.totalamount} ${this.OldInvoice.currency}\nNotes: ${this.OldInvoice.notes}\n\n Continue ?`;
      case 1: return "What's the updated client name?";
      case 2: return "Updated due date?";
      case 3: return "What's the new status? (unpaid, pending, or paid)";
      case 4: return "Updated currency code?";
      case 5: return "Any updated notes?";
      default: return "Invoice update complete.";
    }
  }

  getSuggestions(): string[] {
    switch (this.step) {
      case 0: return ["Yes"];
      case 1: return ["skip", "Acme Corp", "Globex Inc", "Wayne Enterprises"];
      case 2: return ["no", "today", "2 weeks", "1 month"];
      case 3: return ["skip", "unpaid", "pending", "paid"];
      case 4: return ["skip", "USD", "EUR", "EGP"];
      case 5: return ["No"];
      default: return [];
    }
  }

  getErrorMessage(): string | null {
    const error = this.lastError;
    this.lastError = null;
    return error;
  }

  isComplete(): boolean {
    return this.step > 5;
  }

  getResult(): { id: number; dto: UpdateInvoiceDto }
  {
    const id = parseInt(this.OldInvoice.invoiceNumber?.split("-")[1]!);
    console.log("INVOICE NUMBER : " + this.OldInvoice.invoiceNumber);

    return {
      id: id,
      dto: {
        clientname: this.Updatedinvoice.clientname ?? this.OldInvoice.clientname!,
        duedate: this.Updatedinvoice.duedate ?? this.OldInvoice.duedate ?? null,
        status: this.Updatedinvoice.status ?? this.OldInvoice.status!,
        currency: this.Updatedinvoice.currency ?? this.OldInvoice.currency!,
        notes: this.Updatedinvoice.notes ?? this.OldInvoice.notes ?? null
      }
    };
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
