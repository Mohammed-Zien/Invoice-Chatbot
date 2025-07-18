import { Flow } from './flow.interface';
import { UpdateInvoiceDto } from '../dtos/update-invoice.dto';

export class UpdateInvoiceFlow implements Flow<UpdateInvoiceDto> {
  private step = 0;
  private invoice: Partial<UpdateInvoiceDto> = {};
  private lastError: string | null = null;
  

  handleUserInput(input: string): void {
    this.lastError = null;

    switch (this.step) {
      case 0: {
        this.invoice.clientname = input.trim();
        this.step++;
        break;
      }

      case 1: {
        const lowered = input.toLowerCase().trim();

        if (/no|none|don't|skip/.test(lowered)) {
          this.invoice.duedate = null;
          this.step++;
        } else if (lowered === "today") {
          this.invoice.duedate = new Date().toLocaleDateString('en-CA');
          this.step++;
        } else {
          const now = new Date();
          const match = lowered.match(/(\d+)?\s*(day|week|month|year)s?/);

          if (match) {
            const [, amountStr, unit] = match;
            const amount = parseInt(amountStr || "1", 10);
            switch (unit) {
              case "day": now.setDate(now.getDate() + amount); break;
              case "week": now.setDate(now.getDate() + amount * 7); break;
              case "month": now.setMonth(now.getMonth() + amount); break;
              case "year": now.setFullYear(now.getFullYear() + amount); break;
            }
            this.invoice.duedate = now.toISOString().split('T')[0]; // ISO 8601 format
            this.step++;
          } else {
            const parsed = new Date(input);
            if (!isNaN(parsed.getTime())) {
              this.invoice.duedate = parsed.toISOString().split('T')[0];
              this.step++;
            } else {
              this.lastError = "I didn't understand the due date. Try something like '2 weeks' or '2025-08-01'.";
            }
          }
        }
        break;
      }

      case 2: {
        const statusMap: Record<string, number> = {
          unpaid: 0,
          pending: 1,
          paid: 2
        };
        const status = statusMap[input.toLowerCase().trim()];
        if (status !== undefined) {
          this.invoice.status = status;
          this.step++;
        } else {
          this.lastError = "Status must be one of: unpaid, pending, or paid.";
        }
        break;
      }

      case 3: {
        const currency = input.trim().toUpperCase();
        if (currency.length <= 3 && currency.length > 0) {
          this.invoice.currency = currency;
          this.step++;
        } else {
          this.lastError = "Invalid currency code.";
        }
        break;
      }

      case 4: {
        this.invoice.notes = /no|none|skip/i.test(input) ? null : input.trim();
        this.step++;
        break;
      }
    }
  }

  getCurrentPrompt(): string {
    switch (this.step) {
      case 0: return "What's the updated client name?";
      case 1: return "Updated due date? (or say 'no' to skip)";
      case 2: return "What's the new status? (unpaid, pending, or paid)";
      case 3: return "Updated currency code?";
      case 4: return "Any updated notes?";
      default: return "Invoice update complete.";
    }
  }

  getSuggestions(): string[] {
    switch (this.step) {
      case 0: return ["Acme Corp", "Globex Inc", "Wayne Enterprises"];
      case 1: return ["no", "today", "2 weeks", "1 month"];
      case 2: return ["unpaid", "pending", "paid"];
      case 3: return ["USD", "EUR", "EGP"];
      case 4: return ["No", "Add notes"];
      default: return [];
    }
  }

  getErrorMessage(): string | null {
    const error = this.lastError;
    this.lastError = null;
    return error;
  }

  isComplete(): boolean {
    return this.step > 4;
  }

  getResult(): UpdateInvoiceDto {
    return {
      clientname: this.invoice.clientname!,
      duedate: this.invoice.duedate ?? null,
      status: this.invoice.status!,
      currency: this.invoice.currency!,
      notes: this.invoice.notes ?? null
    };
  }
}
