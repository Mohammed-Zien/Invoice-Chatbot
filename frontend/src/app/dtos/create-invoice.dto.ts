export interface CreateInvoiceDto {
  clientname: string;
  duedate: string | null;
  status: number;
  currency: string;
  notes: string | null;
}
