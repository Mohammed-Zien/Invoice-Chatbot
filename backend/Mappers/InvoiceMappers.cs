using backend.Dtos.InvoicesDtos;
using backend.Models;
using System.IO.IsolatedStorage;

namespace backend.Mappers
{
    public static class InvoiceMappers
    {
        public static GetInvoiceDto toGetInvoiceDto(this Invoice invoiceModel)
        {
            return new GetInvoiceDto
            {
                Id = invoiceModel.Id,
                Invoicenumber = invoiceModel.Invoicenumber,
                Clientname = invoiceModel.Clientname,
                Issuedate = invoiceModel.Issuedate,
                Duedate = invoiceModel.Duedate,
                Status = invoiceModel.Status,
                Totalamount = invoiceModel.Totalamount,
                Currency = invoiceModel.Currency ?? "USD",
                Notes = invoiceModel.Notes ?? ""
            };
        }
        public static GetInvoiceDtoWithDetails toGetInvoiceDtoWithDetails(this Invoice invoiceModel)
        {
            return new GetInvoiceDtoWithDetails
            {
                Id = invoiceModel.Id,
                Invoicenumber = invoiceModel.Invoicenumber,
                Clientname = invoiceModel.Clientname,
                Issuedate = invoiceModel.Issuedate,
                Duedate = invoiceModel.Duedate,
                Status = invoiceModel.Status,
                Totalamount = invoiceModel.Totalamount,
                Currency = invoiceModel.Currency ?? "USD",
                Notes = invoiceModel.Notes ?? "",
                Invoicedetails = invoiceModel.Invoicedetails.Select(i => i.toInvoiceDetailDto()).ToList()
            };
        }

        public static Invoice toInvoiceFromCreateInvoiceDto(this CreateInvoiceDto invoiceDto)
        {
            return new Invoice
            {
                Invoicenumber = invoiceDto.Invoicenumber,   
                Clientname = invoiceDto.Clientname,
                Issuedate = DateOnly.FromDateTime(DateTime.Today),
                Duedate = invoiceDto.Duedate,
                Status = invoiceDto.Status,
                Currency = invoiceDto.Currency ?? "USD",
                Notes = invoiceDto.Notes ?? "",

                Appuserid = "admin", // TODO: Add this once IdentityCore is set up
            };
        }

        public static Invoice toInvoiceFromUpdateInvoiceDto(this UpdateInvoiceDto invoiceDto)
        {
            return new Invoice
            {
                Clientname = invoiceDto.Clientname,
                Issuedate = DateOnly.FromDateTime(DateTime.Today),
                Duedate = invoiceDto.Duedate,
                Status = invoiceDto.Status,
                Currency = invoiceDto.Currency ?? "USD",
                Notes = invoiceDto.Notes ?? "",

                Appuserid = "admin", // TODO: Add this once IdentityCore is set up
            };
        }
    }
}
