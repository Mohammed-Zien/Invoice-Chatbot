using backend.DataAnnotations;

namespace backend.Dtos.InvoicesDtos
{
    public class CreateInvoiceDto
    {
        public string? Invoicenumber { get; set; }

        public string? Clientname { get; set; }

        [DueDateDataAnnotation]
        public DateOnly? Duedate { get; set; }

        public int Status { get; set; }

        public string? Currency { get; set; }

        public string? Notes { get; set; }
    }
}
