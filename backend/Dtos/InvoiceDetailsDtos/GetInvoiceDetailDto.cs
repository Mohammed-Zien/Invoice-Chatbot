namespace backend.Dtos.InvoiceDetailsDtos
{
    public class GetInvoiceDetailDto
    {
        public string Itemdescription { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal Unitprice { get; set; }

        public decimal? Linetotal { get; set; }

        public decimal? Taxrate { get; set; }

        public decimal? Discount { get; set; }
    }
}
