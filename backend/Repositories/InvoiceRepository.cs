using backend.Data;
using backend.Dtos.InvoicesDtos;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.IsolatedStorage;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

            invoiceModel.Invoicenumber = $"INV-{invoiceModel.Id}";
            _context.Invoices.Update(invoiceModel);
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

        public async Task<GetAllResult> GetAllAsync(QueryObject query)
        {
            var invoices = _context.Invoices.AsQueryable();

            //Query
            if (!string.IsNullOrWhiteSpace(query.InvoiceNumber))
                invoices = invoices.Where(i => i.Invoicenumber!.Contains(query.InvoiceNumber));

            if (!string.IsNullOrWhiteSpace(query.ClientName))
                invoices = invoices.Where(i => i.Clientname!.Contains(query.ClientName));

            if (query.FromDate.HasValue)
                invoices = invoices.Where(i => i.Issuedate >= query.FromDate);

            if (query.ToDate.HasValue)
                invoices = invoices.Where(i => i.Issuedate <= query.ToDate);

            if (query.DueFrom.HasValue)
                invoices = invoices.Where(i => i.Duedate >= query.DueFrom);

            if (query.DueTo.HasValue)
                invoices = invoices.Where(i => i.Duedate <= query.DueTo);

            if (query.Status.HasValue)
                invoices = invoices.Where(i => i.Status == query.Status);

            if (query.MinTotal.HasValue)
                invoices = invoices.Where(i => i.Totalamount >= query.MinTotal);

            if (query.MaxTotal.HasValue)
                invoices = invoices.Where(i => i.Totalamount <= query.MaxTotal);

            if (!string.IsNullOrWhiteSpace(query.Currency))
                invoices = invoices.Where(i => i.Currency == query.Currency);

            // Sorting
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                switch (query.SortBy.ToLower())
                {
                    case "invoicenumber":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Invoicenumber)
                            : invoices.OrderBy(i => i.Invoicenumber);
                        break;

                    case "clientname":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Clientname)
                            : invoices.OrderBy(i => i.Clientname);
                        break;

                    case "issuedate":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Issuedate)
                            : invoices.OrderBy(i => i.Issuedate);
                        break;

                    case "duedate":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Duedate)
                            : invoices.OrderBy(i => i.Duedate);
                        break;

                    case "status":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Status)
                            : invoices.OrderBy(i => i.Status);
                        break;

                    case "totalamount":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Totalamount)
                            : invoices.OrderBy(i => i.Totalamount);
                        break;

                    case "currency":
                        invoices = query.IsDescending
                            ? invoices.OrderByDescending(i => i.Currency)
                            : invoices.OrderBy(i => i.Currency);
                        break;

                    default:
                        // fallback if SortBy is invalid
                        invoices = invoices.OrderBy(i => i.Id);
                        break;
                }
            }
            else
            {
                // Default Sorting
                invoices = invoices.OrderBy(i => i.Id);
            }

            // Pagination
            var pageNumber = query.PageNumber > 0 ? query.PageNumber : 1;
            var pageSize = query.PageSize > 0 ? query.PageSize : 10;

            var skipNumber = (pageNumber - 1) * pageSize;

            var result = await invoices.Skip(skipNumber).Take(query.PageSize).ToListAsync();
            var count = await invoices.CountAsync();

            return new GetAllResult
            {
                Invoices = result,
                TotalCount = count
            };
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
                Updatedinvoice.Currency = invoiceModel.Currency;
                Updatedinvoice.Notes = invoiceModel.Notes;

                _context.Update(Updatedinvoice);
                await _context.SaveChangesAsync();
            }

            return Updatedinvoice;
        }

        public async Task<Invoice?> UpdateInvoiceTotalAsync(int id)
        {
            var total = await _context.Invoicedetails.Where(d => d.Invoiceid == id).SumAsync(d => d.Linetotal);

            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice is not null)
            {
                invoice.Totalamount = total;
                _context.Update(invoice);
                await _context.SaveChangesAsync();
            }

            return invoice;
        }
    }
}
