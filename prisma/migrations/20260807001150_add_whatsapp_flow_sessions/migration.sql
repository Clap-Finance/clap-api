-- CreateTable
CREATE TABLE "WhatsappFlowSession" (
    "id" TEXT NOT NULL,
    "flowToken" TEXT NOT NULL,
    "waId" TEXT NOT NULL,
    "flowName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappFlowSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappFlowSession_flowToken_key" ON "WhatsappFlowSession"("flowToken");

-- CreateIndex
CREATE INDEX "WhatsappFlowSession_waId_idx" ON "WhatsappFlowSession"("waId");
