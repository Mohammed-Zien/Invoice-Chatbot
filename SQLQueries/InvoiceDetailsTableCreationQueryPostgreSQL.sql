CREATE TABLE InvoiceDetails (
    Id SERIAL PRIMARY KEY,
    InvoiceId INT NOT NULL,
    ItemDescription VARCHAR(255) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10, 2) NOT NULL,
    LineTotal DECIMAL(10, 2),
    TaxRate DECIMAL(5, 4) DEFAULT 0.0000 CHECK (TaxRate BETWEEN 0 AND 1),
    Discount DECIMAL(5, 4) DEFAULT 0.0000 CHECK (Discount BETWEEN 0 AND 1),
    CONSTRAINT fk_invoice
        FOREIGN KEY (InvoiceId)
        REFERENCES Invoice(Id)
        ON DELETE CASCADE
);
