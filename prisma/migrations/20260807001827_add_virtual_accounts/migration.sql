-- CreateEnum
CREATE TYPE "VirtualAccountType" AS ENUM ('STATIC', 'DYNAMIC');

-- CreateEnum
CREATE TYPE "VirtualAccountStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "VirtualAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "accountType" "VirtualAccountType" NOT NULL DEFAULT 'STATIC',
    "bankName" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "status" "VirtualAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "bvn" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualAccount_accountNo_key" ON "VirtualAccount"("accountNo");

-- CreateIndex
CREATE INDEX "VirtualAccount_userId_idx" ON "VirtualAccount"("userId");

-- AddForeignKey
ALTER TABLE "VirtualAccount" ADD CONSTRAINT "VirtualAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
