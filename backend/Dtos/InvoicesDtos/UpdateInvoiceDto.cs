using backend.DataAnnotations;

namespace backend.Dtos.InvoicesDtos
{
    public class UpdateInvoiceDto
    {
        public string? Clientname { get; set; }

        [DueDateDataAnnotation]
        public DateOnly? Duedate { get; set; }

        public int Status { get; set; }

        public string? Currency { get; set; }

        public string? Notes { get; set; }

    }
}
