using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;

public class CreateInvoiceDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string? Invoicenumber { get; set; }

    [Required]
    [StringLength(255)]
    public string? Clientname { get; set; }

    [DueDateDataAnnotation] // Custom annotation to insure that the due date is after the issue date
    public DateOnly? Duedate { get; set; }
    
    [Required]
    [Range(0, 2)]
    public int Status { get; set; }

    [Range(0, 999999.99)]
    public decimal? Totalamount { get; set; } = 0;

    [StringLength(3, MinimumLength = 3)]
    public string? Currency { get; set; } = "USD";

    [StringLength(255)]
    public string? Notes { get; set; } = "";
}
