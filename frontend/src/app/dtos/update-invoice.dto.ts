export interface UpdateInvoiceDto {
  clientname: string;
  duedate: string | null;
  status: number;
  currency: string;
  notes: string | null;
}
