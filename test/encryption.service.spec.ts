import { PremiumTrustEncryptionService } from '../src/premiumtrust/premiumtrust.encryption.service';
import { createHmac, createCipheriv } from 'node:crypto';

const KEY = '603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4';
const IV = '000102030405060708090a0b0c0d0e0f';

function makeService(key = KEY, iv = IV) {
  process.env.PREMIUMTRUST_CLIENT_ID = 'test-client';
  process.env.PREMIUMTRUST_SECRET_KEY = key;
  process.env.PREMIUMTRUST_CLIENT_IV = iv;
  return new PremiumTrustEncryptionService();
}

describe('PremiumTrustEncryptionService', () => {
  beforeEach(() => {
    delete process.env.PREMIUMTRUST_CLIENT_ID;
    delete process.env.PREMIUMTRUST_SECRET_KEY;
    delete process.env.PREMIUMTRUST_CLIENT_IV;
  });

  describe('encrypt/decrypt', () => {
    it('round-trips a payload', () => {
      const svc = makeService();
      const plain = JSON.stringify({ firstName: 'EZEKIEL', bvn: 22142668052, accountType: 1 });
      expect(svc.decrypt(svc.encrypt(plain))).toBe(plain);
    });

    it('produces hex output', () => {
      const svc = makeService();
      const out = svc.encrypt('hello');
      expect(out).toMatch(/^[0-9a-f]+$/);
    });

    it('round-trips non-ASCII payloads (UTF-8)', () => {
      const svc = makeService();
      const plain = JSON.stringify({ name: 'Túndé 🎉', city: 'Cotonou' });
      expect(svc.decrypt(svc.encrypt(plain))).toBe(plain);
    });

    it('decrypts data encrypted with the reference implementation', () => {
      const svc = makeService();
      const cipher = createCipheriv('aes-256-cbc', Buffer.from(KEY, 'hex'), Buffer.from(IV, 'hex'));
      const encrypted = Buffer.concat([cipher.update('secret payload', 'utf8'), cipher.final()]);
      expect(svc.decrypt(encrypted.toString('hex'))).toBe('secret payload');
    });
  });

  describe('hmacSha256', () => {
    it('produces an uppercase hex HMAC-SHA256', () => {
      const svc = makeService();
      const hmac = svc.hmacSha256('message');
      const expected = createHmac('sha256', Buffer.from(KEY, 'hex'))
        .update('message', 'utf8')
        .digest('hex')
        .toUpperCase();
      expect(hmac).toBe(expected);
      expect(hmac).toMatch(/^[0-9A-F]{64}$/);
    });
  });

  describe('config validation', () => {
    it('throws when env vars are missing', () => {
      expect(() => new PremiumTrustEncryptionService()).toThrow(/Missing environment variables/);
    });
  });
});
