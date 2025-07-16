using System;
using System.Collections.Generic;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<Invoicedetail> Invoicedetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("invoice_pkey");

            entity.ToTable("invoice");

            entity.HasIndex(e => e.Invoicenumber, "invoice_invoicenumber_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Appuserid)
                .HasMaxLength(450)
                .HasColumnName("appuserid");
            entity.Property(e => e.Clientname)
                .HasMaxLength(255)
                .HasColumnName("clientname");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .HasDefaultValueSql("'USD'::character varying")
                .HasColumnName("currency");
            entity.Property(e => e.Duedate).HasColumnName("duedate");
            entity.Property(e => e.Invoicenumber)
                .HasMaxLength(50)
                .HasColumnName("invoicenumber");
            entity.Property(e => e.Issuedate).HasColumnName("issuedate");
            entity.Property(e => e.Notes)
                .HasMaxLength(255)
                .HasDefaultValueSql("''::character varying")
                .HasColumnName("notes");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Totalamount)
                .HasPrecision(10, 2)
                .HasColumnName("totalamount");
        });

        modelBuilder.Entity<Invoicedetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("invoicedetails_pkey");

            entity.ToTable("invoicedetails");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Discount)
                .HasPrecision(5, 4)
                .HasDefaultValueSql("0.0000")
                .HasColumnName("discount");
            entity.Property(e => e.Invoiceid).HasColumnName("invoiceid");
            entity.Property(e => e.Itemdescription)
                .HasMaxLength(255)
                .HasColumnName("itemdescription");
            entity.Property(e => e.Linetotal)
                .HasPrecision(10, 2)
                .HasColumnName("linetotal");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Taxrate)
                .HasPrecision(5, 4)
                .HasDefaultValueSql("0.0000")
                .HasColumnName("taxrate");
            entity.Property(e => e.Unitprice)
                .HasPrecision(10, 2)
                .HasColumnName("unitprice");

            entity.HasOne(d => d.Invoice).WithMany(p => p.Invoicedetails)
                .HasForeignKey(d => d.Invoiceid)
                .HasConstraintName("fk_invoice");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
