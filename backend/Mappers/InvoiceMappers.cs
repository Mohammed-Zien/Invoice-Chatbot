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
                Invoicenumber = invoiceModel.Invoicenumber,
                Clientname = invoiceModel.Clientname,
                Issuedate = invoiceModel.Issuedate,
                Duedate = invoiceModel.Duedate,
                Status = invoiceModel.Status,
                Totalamount = invoiceModel.Totalamount,
                Currency = invoiceModel.Currency,
                Notes = invoiceModel.Notes
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
                Totalamount = 0, //TODO: Calculate using details,
                Currency = invoiceDto.Currency,
                Notes = invoiceDto.Notes,

                Appuserid = "admin", // TODO: Add this once IdentityCore is set up
                // Invoicedetails = ...      // TODO: Link once details are added
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
                Totalamount = 0, //TODO: Calculate using details,
                Currency = invoiceDto.Currency,
                Notes = invoiceDto.Notes,

                Appuserid = "admin", // TODO: Add this once IdentityCore is set up
                // Invoicedetails = ...      // TODO: Link once details are added
            };
        }
    }
}
