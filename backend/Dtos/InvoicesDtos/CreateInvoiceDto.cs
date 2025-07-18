using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using backend.DataAnnotations;

public class CreateInvoiceDto
{
    [Required]
    [StringLength(255)]
    [DefaultValue("Client Name")]
    public string? Clientname { get; set; }

    [DueDateDataAnnotation] // Custom annotation to insure that the due date is after the issue date
    public DateOnly? Duedate { get; set; }
    
    [Required]
    [Range(0, 2)]
    [DefaultValue(0)]
    public int Status { get; set; }

    [StringLength(3, MinimumLength = 3)]
    [DefaultValue("USD")]
    public string? Currency { get; set; } = "USD";

    [StringLength(255)]
    [DefaultValue("")]
    public string? Notes { get; set; } = "";
}
