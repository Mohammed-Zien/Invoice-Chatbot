using backend.Data;
using backend.Dtos.InvoiceDetailsDtos;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class InvoiceDetailRepository : IInvoiceDetailsRepository
    {
        private readonly ApplicationDbContext _context;
        public InvoiceDetailRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Invoicedetail> CreateAsync(Invoicedetail invoiceModel)
        {
            await _context.AddAsync(invoiceModel);
            await _context.SaveChangesAsync();

            return invoiceModel;
        }

        public async Task<Invoicedetail?> DeleteAsync(int id)
        {
            var result = await _context.Invoicedetails.FirstOrDefaultAsync(i => i.Id == id);

            if(result is not null)
            {
                _context.Remove(result);
                await _context.SaveChangesAsync();
            }

            return result;
        }

        public async Task<List<Invoicedetail>> GetAllAsync()
        {
            return await _context.Invoicedetails.ToListAsync();
        }

        public async Task<Invoicedetail?> GetByIdAsync(int id)
        {
            var result = await _context.Invoicedetails.FirstOrDefaultAsync(i => i.Id == id);

            return result;
        }

        public async Task<Invoicedetail?> UpdateAsync(int id, Invoicedetail invoiceModel)
        {
            var UpdatedInvoiceDetail = await _context.Invoicedetails.FirstOrDefaultAsync(i => i.Id == id);

            if(UpdatedInvoiceDetail is not null)
            {
                UpdatedInvoiceDetail.Itemdescription = invoiceModel.Itemdescription;
                UpdatedInvoiceDetail.Quantity = invoiceModel.Quantity;
                UpdatedInvoiceDetail.Unitprice = invoiceModel.Unitprice;
                UpdatedInvoiceDetail.Linetotal = invoiceModel.Linetotal;
                UpdatedInvoiceDetail.Taxrate = invoiceModel.Taxrate;
                UpdatedInvoiceDetail.Discount = invoiceModel.Discount;

                _context.Update(UpdatedInvoiceDetail);
                await _context.SaveChangesAsync();
            }

            return UpdatedInvoiceDetail;
        }
    }
}
