using backend.Dtos.InvoiceDetailsDtos;
using backend.Models;

namespace backend.Interfaces
{
    public interface IInvoiceDetailsRepository
    {
        public Task<List<Invoicedetail>> GetAllAsync();
        public Task<Invoicedetail?> GetByIdAsync(int id);
        public Task<Invoicedetail> CreateAsync(Invoicedetail invoiceModel);
        public Task<Invoicedetail?> UpdateAsync(int id, Invoicedetail invoiceModel);
        public Task<Invoicedetail?> DeleteAsync(int id);
    }
}
