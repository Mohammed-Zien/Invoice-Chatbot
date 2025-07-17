using backend.Models;

namespace backend.Dtos.InvoicesDtos
{
    public class GetAllResult
    {
        public List<Invoice> Invoices { get; set; } = new();
        public int TotalCount { get; set; }
    }
}
