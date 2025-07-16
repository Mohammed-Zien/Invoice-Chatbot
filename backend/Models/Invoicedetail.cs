using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Invoicedetail
{
    public int Id { get; set; }

    public int Invoiceid { get; set; }

    public string Itemdescription { get; set; } = null!;

    public int Quantity { get; set; }

    public decimal Unitprice { get; set; }

    public decimal? Linetotal { get; set; }

    public decimal? Taxrate { get; set; }

    public decimal? Discount { get; set; }

    public virtual Invoice Invoice { get; set; } = null!;
}
