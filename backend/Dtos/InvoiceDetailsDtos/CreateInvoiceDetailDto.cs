using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.InvoiceDetailsDtos
{
    public class CreateInvoiceDetailDto
    {
        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string Itemdescription { get; set; } = null!;

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
        public int Quantity { get; set; }

        [Range(0.01, 999999.99, ErrorMessage = "Unit price must be greater than 0.")]
        public decimal Unitprice { get; set; }

        [Range(0, 9999999.99)]
        public decimal? Linetotal { get; set; }

        [Range(0, 1, ErrorMessage = "Tax rate must be between 0 and 1.")]
        public decimal? Taxrate { get; set; }

        [Range(0, 1, ErrorMessage = "Discount must be between 0 and 1.")]
        public decimal? Discount { get; set; }
    }
}
