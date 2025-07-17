using backend.Dtos.InvoicesDtos;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Interfaces
{
    public interface IInvoiceRepository
    {
        public Task<GetAllResult> GetAllAsync(QueryObject query);
        public Task<Invoice?> GetByIdAsync(int id);
        public Task<Invoice> CreateAsync(Invoice invoiceModel);
        public Task<Invoice?> UpdateAsync(int id, Invoice invoiceModel);
        public Task<Invoice?> DeleteAsync(int id);
        public Task<bool> InvoiceExists(int id);
        public Task<Invoice?> UpdateInvoiceTotalAsync(int id);
    }
}
