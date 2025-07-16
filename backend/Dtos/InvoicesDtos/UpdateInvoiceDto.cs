using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;

public class UpdateInvoiceDto
{
    [Required]
    [StringLength(255)]
    public string? Clientname { get; set; }

    [Required]
    [DueDateDataAnnotation] // Custom annotation to insure that the due date is before the issue date
    public DateOnly? Duedate { get; set; }

    [Range(0, 2)]
    public int Status { get; set; }

    [Range(0, 999999.99)]
    public decimal? Totalamount { get; set; }

    [StringLength(3, MinimumLength = 3)]
    public string? Currency { get; set; }

    [StringLength(255)]
    public string? Notes { get; set; }
}
