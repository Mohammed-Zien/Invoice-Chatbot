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
                Taxrate = invoiceDetailModel.Taxrate,
                Discount = invoiceDetailModel.Discount,
                Linetotal = (invoiceDetailModel.Quantity * invoiceDetailModel.Unitprice) * (1 - invoiceDetailModel.Discount) * (1 + invoiceDetailModel.Taxrate),
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
                Taxrate = invoiceDetailDto.Taxrate,
                Discount = invoiceDetailDto.Discount,
                Linetotal = (invoiceDetailDto.Quantity * invoiceDetailDto.Unitprice) * (1 - invoiceDetailDto.Discount) * (1 + invoiceDetailDto.Taxrate),
            };
        }
        public static Invoicedetail toInvoiceDetailFromUpdateInvoiceDetailDto(this UpdateInvoiceDetailDto invoiceDetailDto)
        {
            return new Invoicedetail
            {
                Itemdescription = invoiceDetailDto.Itemdescription,
                Quantity = invoiceDetailDto.Quantity,
                Unitprice = invoiceDetailDto.Unitprice,
                Taxrate = invoiceDetailDto.Taxrate,
                Discount = invoiceDetailDto.Discount,
                Linetotal = (invoiceDetailDto.Quantity * invoiceDetailDto.Unitprice) * (1 - invoiceDetailDto.Discount) * (1 + invoiceDetailDto.Taxrate),
            };
        }
    }
}
