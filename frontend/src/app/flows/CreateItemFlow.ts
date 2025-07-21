import { Flow } from './flow.interface';
import { CreateItemDto } from '../dtos/CreateItemDto';

export class CreateItemFlow implements Flow<CreateItemDto> {
  private step = 0;
  private item: Partial<CreateItemDto> = {};
  private lastError: string | null = null;

  handleUserInput(input: string): void {
    this.lastError = null;

    switch (this.step) {
      case 0: {
        const desc = input.trim();
        if (desc === "") {
          this.lastError = "ERROR: Description is required.";
        } else {
          this.item.Itemdescription = desc;
          this.step++;
        }
        break;
      }

      case 1: {
        const quantity = parseInt(input);
        if (!isNaN(quantity) && quantity > 0) {
          this.item.Quantity = quantity;
          this.step++;
        } else {
          this.lastError = "Quantity must be a positive number.";
        }
        break;
      }

      case 2: {
        const price = parseFloat(input);
        if (!isNaN(price) && price >= 0) {
          this.item.Unitprice = price;
          this.step++;
        } else {
          this.lastError = "Unit price must be a non-negative number.";
        }
        break;
      }

      case 3: {
        const tax = parseFloat(input);
        if (!isNaN(tax) && tax >= 0 && tax <= 100) {
          this.item.Taxrate = tax/100;
          this.step++;
        } else {
          this.lastError = "Tax rate must be between 0 and 100.";
        }
        break;
      }

      case 4: {
        const discount = parseFloat(input);
        if (!isNaN(discount) && discount >= 0 && discount <= 100) {
          this.item.Discount = discount/100;
          this.step++;
        } else {
          this.lastError = "Discount must be between 0 and 100.";
        }
        break;
      }
    }
  }

  getCurrentPrompt(): string {
    switch (this.step) {
      case 0: return "What is the item description?";
      case 1: return "What is the quantity?";
      case 2: return "What is the unit price?";
      case 3: return "What is the tax rate (%)?";
      case 4: return "What is the discount (%)?";
      default: return "Item entry complete.";
    }
  }

  getSuggestions(): string[] {
    switch (this.step) {
      case 0: return ["Web Hosting", "Consultation", "Design Services"];
      case 1: return ["1", "5", "10"];
      case 2: return ["100", "49.99", "250"];
      case 3: return ["0", "10", "15"];
      case 4: return ["0", "5", "10"];
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

  getResult(): CreateItemDto {
    return {
      Itemdescription: this.item.Itemdescription!,
      Quantity: this.item.Quantity!,
      Unitprice: this.item.Unitprice!,
      Taxrate: this.item.Taxrate!,
      Discount: this.item.Discount!
    };
  }
}
