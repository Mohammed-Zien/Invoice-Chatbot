using backend.Dtos.InvoicesDtos;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepo;
        public InvoicesController(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepo = invoiceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            var invoices = await _invoiceRepo.GetAllAsync(query);

            var invoicesDtos = invoices.Invoices.Select(i => i.toGetInvoiceDto());

            return Ok(invoicesDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var invoice = await _invoiceRepo.GetByIdAsync(id);

            if (invoice is null)
                return NotFound($"404 : INVOICE {id} IS NOT FOUND");

            return Ok(invoice.toGetInvoiceDtoWithDetails());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateInvoiceDto createInvoiceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var invoice = await _invoiceRepo.CreateAsync(createInvoiceDto.toInvoiceFromCreateInvoiceDto());

            return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, invoice.toGetInvoiceDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        { 
            var invoice = await _invoiceRepo.DeleteAsync(id);
            if (invoice is null)
                return NotFound($"404 : INVOICE {id} IS NOT FOUND");

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateInvoiceDto invoiceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _invoiceRepo.UpdateAsync(id, invoiceDto.toInvoiceFromUpdateInvoiceDto());

            if(result is null)
                return NotFound($"404 : INVOICE {id} IS NOT FOUND");

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result.toGetInvoiceDto());
        }

    }
}
