using backend.Dtos.InvoiceDetailsDtos;
using backend.Models;

namespace backend.Dtos.InvoicesDtos
{
    public class GetInvoiceDtoWithDetails
    {
        public string? InvoiceNumber { get; set; }

        public string? Clientname { get; set; }

        public DateOnly Issuedate { get; set; }

        public DateOnly? Duedate { get; set; }

        public int Status { get; set; }

        public decimal? Totalamount { get; set; }

        public string? Currency { get; set; }

        public string? Notes { get; set; }

        public virtual ICollection<GetInvoiceDetailDto> Invoicedetails { get; set; } = new List<GetInvoiceDetailDto>();

    }
}
