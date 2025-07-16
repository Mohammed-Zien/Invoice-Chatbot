using backend.Data;
using backend.Dtos.InvoicesDtos;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.IsolatedStorage;

namespace backend.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDbContext _context;
        public InvoiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Invoice> CreateAsync(Invoice invoiceModel)
        { 
            await _context.Invoices.AddAsync(invoiceModel);
            await _context.SaveChangesAsync();

            return invoiceModel;
        }

        public async Task<Invoice?> DeleteAsync(int id)
        {
            var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            if (invoice is not null)
            {
                _context.Remove(invoice);
                await _context.SaveChangesAsync();
            }

            return invoice;
        }


        public Task<List<Invoice>> GetAllAsync()
        {
            return _context.Invoices.ToListAsync();
        }

        public Task<Invoice?> GetByIdAsync(int id)
        {
            return _context.Invoices.Include(d => d.Invoicedetails).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<bool> InvoiceExists(int id)
        {
            return await _context.Invoices.AnyAsync(i => i.Id == id);
        }

        public async Task<Invoice?> UpdateAsync(int id, Invoice invoiceModel)
        {
            var Updatedinvoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            
            if(Updatedinvoice is not null)
            {
                Updatedinvoice.Clientname = invoiceModel.Clientname;
                Updatedinvoice.Duedate = invoiceModel.Duedate;
                Updatedinvoice.Status = invoiceModel.Status;
                Updatedinvoice.Totalamount = invoiceModel.Totalamount;
                Updatedinvoice.Currency = invoiceModel.Currency;
                Updatedinvoice.Notes = invoiceModel.Notes;

                _context.Update(Updatedinvoice);
                await _context.SaveChangesAsync();
            }

            return Updatedinvoice;
        }
    }
}
