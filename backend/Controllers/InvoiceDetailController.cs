using backend.Dtos.InvoiceDetailsDtos;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceDetailController : ControllerBase
    {
        private readonly IInvoiceDetailsRepository _invoiceDetailRepo;
        private readonly IInvoiceRepository _invoiceRepo;

        public InvoiceDetailController(IInvoiceDetailsRepository invoiceDetailsRepository, IInvoiceRepository invoiceRepository)
        {
            _invoiceDetailRepo = invoiceDetailsRepository;
            _invoiceRepo = invoiceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _invoiceDetailRepo.GetAllAsync();

            return Ok(result.Select(i => i.toInvoiceDetailDto()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var result = await _invoiceDetailRepo.GetByIdAsync(id);

            if (result is null)
                return NotFound($"404: INVOICE DETAIL {id} NOT FOUND");

            return Ok(result.toInvoiceDetailDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _invoiceDetailRepo.DeleteAsync(id);

            if (result is null)
                return NotFound($"404: INVOICE DETAIL {id} NOT FOUND");

            return Ok($"SUCESS : Invoice {id} deleted");
        }

        [HttpPost("{invoice_id}")]
        public async Task<IActionResult> Create([FromRoute] int invoice_id, [FromBody] CreateInvoiceDetailDto invoiceDetailDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _invoiceRepo.InvoiceExists(invoice_id))
                return BadRequest($"INVOICE {invoice_id} DOES NOT EXIST");

            var result = await _invoiceDetailRepo.CreateAsync(invoiceDetailDto.toInvoiceDetailFromCreateInvoiceDetailDto(invoice_id));

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result.toInvoiceDetailDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute]int id, [FromBody] UpdateInvoiceDetailDto invoiceDetailDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _invoiceDetailRepo.UpdateAsync(id, invoiceDetailDto.toInvoiceDetailFromUpdateInvoiceDetailDto());

            if (result is null)
                return NotFound($"404: INVOICE DETAIL {id} IS NOT FOUND");

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result.toInvoiceDetailDto());
        }
    }
}
