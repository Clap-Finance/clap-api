import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHmac } from 'node:crypto';
import { PremiumTrustConfig } from './premiumtrust.config';

function toBytes(value: string, size: number): Buffer {
  if (/^[0-9a-fA-F]+$/.test(value) && value.length === size * 2) {
    return Buffer.from(value, 'hex');
  }
  const buf = Buffer.from(value, 'utf8');
  if (buf.length === size) return buf;
  const fixed = Buffer.alloc(size);
  buf.copy(fixed, 0, 0, Math.min(buf.length, size));
  return fixed;
}

@Injectable()
export class PremiumTrustEncryptionService {
  constructor() {
    PremiumTrustConfig.get();
  }

  private get config() {
    return PremiumTrustConfig.get();
  }

  private get key(): Buffer {
    return toBytes(this.config.secretKey, 32);
  }

  private get iv(): Buffer {
    return toBytes(this.config.clientIv, 16);
  }

  encrypt(plainText: string): string {
    const cipher = createCipheriv('aes-256-cbc', this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt(cipherText: string): string {
    const decipher = createDecipheriv('aes-256-cbc', this.key, this.iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherText, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  hmacSha256(message: string): string {
    return createHmac('sha256', this.key).update(message, 'utf8').digest('hex').toUpperCase();
  }
}
