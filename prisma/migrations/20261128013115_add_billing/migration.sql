-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "document" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "hourlyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "urgencyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "entryAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expirationDate" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "signatureHash" TEXT,
    "signerName" TEXT,
    "publicToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unitValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyDuration" INTEGER NOT NULL DEFAULT 12,
    "order" INTEGER NOT NULL DEFAULT 0,
    "quoteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "quoteId" TEXT,
    "objectClause" TEXT,
    "timelineClause" TEXT,
    "paymentClause" TEXT,
    "ipClause" TEXT,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "providerSigned" BOOLEAN NOT NULL DEFAULT false,
    "providerSignedAt" TIMESTAMP(3),
    "providerSignerName" TEXT,
    "providerSignatureHash" TEXT,
    "clientSigned" BOOLEAN NOT NULL DEFAULT false,
    "clientSignedAt" TIMESTAMP(3),
    "clientSignerName" TEXT,
    "clientSignatureHash" TEXT,
    "sentAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "publicToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotes_number_key" ON "quotes"("number");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_publicToken_key" ON "quotes"("publicToken");

-- CreateIndex
CREATE INDEX "quotes_clientId_idx" ON "quotes"("clientId");

-- CreateIndex
CREATE INDEX "quote_items_quoteId_idx" ON "quote_items"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_number_key" ON "contracts"("number");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_publicToken_key" ON "contracts"("publicToken");

-- CreateIndex
CREATE INDEX "contracts_clientId_idx" ON "contracts"("clientId");

-- CreateIndex
CREATE INDEX "contracts_quoteId_idx" ON "contracts"("quoteId");

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
