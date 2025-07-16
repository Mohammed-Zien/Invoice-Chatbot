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
        public async Task<Invoice> CreateAsync(CreateInvoiceDto invoiceDto)
        {
            var invoiceModel = invoiceDto.toInvoiceFromCreateInvoiceDto();
            
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
            return _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Invoice?> UpdateAsync(int id, UpdateInvoiceDto invoiceDto)
        {
            var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            if(invoice is not null)
            {
                invoice.Clientname = invoiceDto.Clientname;
                invoice.Duedate = invoiceDto.Duedate;
                invoice.Status = invoiceDto.Status;
                invoice.Currency = invoiceDto.Currency;
                invoice.Notes = invoiceDto.Notes;

                _context.Update(invoice);
                await _context.SaveChangesAsync();
            }

            return invoice;
        }
    }
}
