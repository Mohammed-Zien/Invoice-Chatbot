using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Invoice
{
    public int Id { get; set; }

    public string? Invoicenumber { get; set; }

    public string? Clientname { get; set; }

    public DateOnly Issuedate { get; set; }

    public DateOnly? Duedate { get; set; }

    public int Status { get; set; }

    public decimal? Totalamount { get; set; }

    public string? Currency { get; set; }

    public string? Notes { get; set; }

    public string Appuserid { get; set; } = null!;

    public virtual ICollection<Invoicedetail> Invoicedetails { get; set; } = new List<Invoicedetail>();
}
