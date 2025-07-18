import { Flow } from './flow.interface';

export class DeleteInvoiceFlow implements Flow<number> {
  private step: 'ask_id' | 'confirm_delete' | 'done' = 'ask_id';
  private invoiceId: number | null = null;
  private errorMessage: string | null = null;

  handleUserInput(input: string): void {
    this.errorMessage = null;

    if (this.step === 'ask_id') {
      const id = Number(input.trim());
      if (isNaN(id) || id <= 0) {
        this.errorMessage = '❌ Please enter a valid invoice ID (positive number).';
        return;
      }
      this.invoiceId = id;
      this.step = 'confirm_delete';
      return;
    }

    if (this.step === 'confirm_delete') {
      if (input.trim().toLowerCase() === 'confirm') {
        this.step = 'done';
        return;
      } else {
        this.errorMessage = `❌ Type 'confirm' to delete invoice #${this.invoiceId}.`;
        return;
      }
    }
  }

  getCurrentPrompt(): string {
    switch (this.step) {
      case 'ask_id':
        return '🗑️ Please enter the ID of the invoice you want to delete:';
      case 'confirm_delete':
        return `⚠️ Are you sure you want to delete invoice #${this.invoiceId}? Type 'confirm' to proceed.`;
      default:
        return '';
    }
  }

  getSuggestions(): string[] {
    switch (this.step) {
      case 'ask_id':
        return [];
      case 'confirm_delete':
        return ['confirm'];
      default:
        return [];
    }
  }

  isComplete(): boolean {
    return this.step === 'done';
  }

  getErrorMessage(): string | null {
    return this.errorMessage;
  }

  getResult(): number {
    if (this.invoiceId === null) throw new Error('No invoice ID selected.');
    return this.invoiceId;
  }
}
