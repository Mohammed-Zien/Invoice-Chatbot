import { Flow } from './flow.interface';

export class DeleteInvoiceFlow implements Flow<string> {
  private step = 0;
  private invoiceId: number | null = null;
  private invoiceNumber: string | null = null;
  private lastError: string | null = null;

  handleUserInput(input: string): void {
    this.lastError = null;

    switch(this.step)
    {
      case 0:
        {
          this.invoiceNumber = input.trim()

          if(!this.invoiceNumber.match(/^INV-\d+$/))
          {
            this.lastError = "Invalide Invoice Number, Invoice Numbers are in form of INV-123";
          }
          else
          {
            this.invoiceId = parseInt(this.invoiceNumber.split("-", 2)[1]);
            this.step++;
          }
          break;
        }
      case 1:
        {
          const confirm = input.trim() === "confirm";
          this.step++;
          break;
        }
    }
  }

  getCurrentPrompt(): string {
    switch (this.step) {
      case 0:
        return 'Please enter the Invoice Number of the invoice you want to delete:';
      case 1:
        return `Are you sure you want to delete invoice ${this.invoiceNumber}? Type 'confirm' to proceed.`;
      default:
        return '';
    }
  }

  getSuggestions(): string[] {
    switch (this.step) {
      case 0:
        return [];
      case 1:
        return ['confirm'];
      default:
        return [];
    }
  }

  isComplete(): boolean {
    return this.step > 1;
  }

  getErrorMessage(): string | null {
    const error = this.lastError;
    this.lastError = null; // Clear after retrieving
    return error;
  }

  getResult(): string {
    if (this.invoiceId === null) throw new Error('No invoice ID selected.');
    return this.invoiceNumber!;
  }
}
