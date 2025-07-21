export interface GetInvoiceDto { 
  invoiceNumber: string;
  clientname: string;
  issuedate: string;
  duedate: string | null;
  status: number;
  totalamount: number;
  currency: string;
  notes: string | null;
}
