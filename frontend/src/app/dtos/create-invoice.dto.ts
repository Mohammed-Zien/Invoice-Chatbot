export interface CreateInvoiceDto {
  invoicenumber: string;
  clientname: string;
  duedate: string | null;
  status: number;
  currency: string;
  notes: string | null;
}
