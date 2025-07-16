using backend.Models;

namespace backend.Dtos.InvoicesDtos
{
    public class GetInvoiceDto
    {
        public string? Invoicenumber { get; set; }

        public string? Clientname { get; set; }

        public DateOnly Issuedate { get; set; }

        public DateOnly? Duedate { get; set; }

        public int Status { get; set; }

        public decimal? Totalamount { get; set; }

        public string? Currency { get; set; }

        public string? Notes { get; set; }
    }
}
