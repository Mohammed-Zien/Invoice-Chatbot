using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.InvoiceDetailsDtos
{
    public class UpdateInvoiceDetailDto
    {
        [Required]
        [StringLength(255, MinimumLength = 1)]
        [DefaultValue("Item Description")]
        public string Itemdescription { get; set; } = null!;

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
        [DefaultValue(1)]
        public int Quantity { get; set; }

        [Range(0.01, 999999.99, ErrorMessage = "Unit price must be greater than 0.")]
        [DefaultValue(0)]
        public decimal Unitprice { get; set; }

        [Range(0, 1, ErrorMessage = "Tax rate must be between 0 and 1.")]
        [DefaultValue(0)]
        public decimal? Taxrate { get; set; }

        [Range(0, 1, ErrorMessage = "Discount must be between 0 and 1.")]
        [DefaultValue(0)]
        public decimal? Discount { get; set; }
    }
}
