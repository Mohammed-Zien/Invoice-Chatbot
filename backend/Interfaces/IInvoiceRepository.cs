using backend.Dtos.InvoicesDtos;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Interfaces
{
    public interface IInvoiceRepository
    {
        public Task<List<Invoice>> GetAllAsync();
        public Task<Invoice?> GetByIdAsync(int id);
        public Task<Invoice> CreateAsync(CreateInvoiceDto invoiceDto);
        public Task<Invoice?> UpdateAsync(int id, UpdateInvoiceDto invoiceDto);
        public Task<Invoice?> DeleteAsync(int id);
    }
}
