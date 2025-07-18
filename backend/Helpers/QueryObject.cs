using backend.Models;

namespace backend.Helpers
{
    public class QueryObject
    {
        public string? InvoiceNumber { get; set; }
        public string? ClientName { get; set; } = null;
        public DateOnly? FromDate { get; set; } = null;
        public DateOnly? ToDate { get; set; } = null;
        public DateOnly? DueFrom { get; set; } = null;
        public DateOnly? DueTo { get; set; } = null;
        public int? Status { get; set; } = null;
        public decimal? MinTotal { get; set; } = null;
        public decimal? MaxTotal { get; set; } = null;
        public string? Currency { get; set; } = null;

        public string? SortBy { get; set; }
        public bool IsDescending { get; set; } = false;

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
