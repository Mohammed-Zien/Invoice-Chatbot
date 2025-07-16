using backend.Dtos.InvoiceDetailsDtos;
using backend.Models;

namespace backend.Mappers
{
    public static class InvoiceDetailMappers
    {
        public static GetInvoiceDetailDto toInvoiceDetailDto(this Invoicedetail invoiceDetailModel)
        {
            return new GetInvoiceDetailDto
            {
                Itemdescription = invoiceDetailModel.Itemdescription,
                Quantity = invoiceDetailModel.Quantity,
                Unitprice = invoiceDetailModel.Unitprice,
                Linetotal = invoiceDetailModel.Linetotal,
                Taxrate = invoiceDetailModel.Taxrate,
                Discount = invoiceDetailModel.Discount,
            };
        }

        public static Invoicedetail toInvoiceDetailFromCreateInvoiceDetailDto(this CreateInvoiceDetailDto invoiceDetailDto, int invoiceID)
        {
            return new Invoicedetail
            {
                Invoiceid = invoiceID,
                Itemdescription = invoiceDetailDto.Itemdescription,
                Quantity = invoiceDetailDto.Quantity,
                Unitprice = invoiceDetailDto.Unitprice,
                Linetotal = invoiceDetailDto.Linetotal,
                Taxrate = invoiceDetailDto.Taxrate,
                Discount = invoiceDetailDto.Discount,
            };
        }
        public static Invoicedetail toInvoiceDetailFromUpdateInvoiceDetailDto(this UpdateInvoiceDetailDto invoiceDetailDto)
        {
            return new Invoicedetail
            {
                Itemdescription = invoiceDetailDto.Itemdescription,
                Quantity = invoiceDetailDto.Quantity,
                Unitprice = invoiceDetailDto.Unitprice,
                Linetotal = invoiceDetailDto.Linetotal,
                Taxrate = invoiceDetailDto.Taxrate,
                Discount = invoiceDetailDto.Discount,
            };
        }
    }
}
