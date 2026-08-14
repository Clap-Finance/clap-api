import {
  constants,
  createCipheriv,
  createDecipheriv,
  createHmac,
  createPrivateKey,
  privateDecrypt,
  timingSafeEqual,
} from 'node:crypto';

const AES_TAG_LENGTH = 16;

export class FlowCryptoError extends Error {}

export interface DecryptedFlowRequest {
  decryptedBody: Record<string, any>;
  aesKey: Buffer;
  initialVector: Buffer;
}

export function decryptFlowRequest(body: Record<string, any>, privateKeyPem: string): DecryptedFlowRequest {
  const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;

  if (typeof encrypted_aes_key !== 'string' || typeof encrypted_flow_data !== 'string' || typeof initial_vector !== 'string') {
    throw new FlowCryptoError('Request body is missing encrypted_aes_key, encrypted_flow_data or initial_vector');
  }

  let aesKey: Buffer;
  try {
    aesKey = privateDecrypt(
      {
        key: createPrivateKey(privateKeyPem),
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encrypted_aes_key, 'base64'),
    );
  } catch (err) {
    throw new FlowCryptoError(`Failed to decrypt AES key: ${(err as Error).message}`);
  }

  const encryptedBody = Buffer.from(encrypted_flow_data, 'base64');
  const initialVector = Buffer.from(initial_vector, 'base64');

  try {
    const decipher = createDecipheriv('aes-128-gcm', aesKey, initialVector);
    decipher.setAuthTag(encryptedBody.subarray(-AES_TAG_LENGTH));
    const decrypted = Buffer.concat([decipher.update(encryptedBody.subarray(0, -AES_TAG_LENGTH)), decipher.final()]).toString('utf-8');
    return { decryptedBody: JSON.parse(decrypted), aesKey, initialVector };
  } catch (err) {
    throw new FlowCryptoError(`Failed to decrypt flow data: ${(err as Error).message}`);
  }
}

export function encryptFlowResponse(response: unknown, aesKey: Buffer, initialVector: Buffer): string {
  const flippedIv = Buffer.from(initialVector.map((b) => b ^ 0xff));
  const cipher = createCipheriv('aes-128-gcm', aesKey, flippedIv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(response), 'utf-8'), cipher.final()]);
  return Buffer.concat([encrypted, cipher.getAuthTag()]).toString('base64');
}

export function verifyHubSignature(rawBody: Buffer | string, signatureHeader: string | undefined, appSecret: string): boolean {
  if (!signatureHeader || !appSecret) return false;

  const expected = signatureHeader.startsWith('sha256=') ? signatureHeader.slice('sha256='.length) : signatureHeader;
  const actual = createHmac('sha256', appSecret).update(rawBody).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(actual, 'utf-8'), Buffer.from(expected, 'utf-8'));
  } catch {
    return false;
  }
}