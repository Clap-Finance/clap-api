import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateVirtualAccountDto, AccountType } from '../src/premiumtrust/dto/premiumtrust.dto';

function validDto() {
  return {
    firstName: 'EZEKIEL',
    lastName: 'FADIPE',
    bvn: 22142668052,
    emailAddress: 'jos@gmail.com',
    phoneNumber: '08032111222',
    dob: '12-Jul-1987',
    accountType: AccountType.STATIC,
  };
}

async function errorsOf(dto: Record<string, unknown>) {
  const instance = plainToInstance(CreateVirtualAccountDto, dto);
  return validate(instance);
}

describe('CreateVirtualAccountDto validation', () => {
  it('accepts a valid payload', async () => {
    const errors = await errorsOf(validDto());
    expect(errors).toHaveLength(0);
  });

  it('rejects missing required fields', async () => {
    const errors = await errorsOf({});
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects a malformed DOB', async () => {
    const errors = await errorsOf({ ...validDto(), dob: '1987-07-12' });
    expect(errors.some((e) => e.property === 'dob')).toBe(true);
  });

  it('rejects a non-numeric BVN', async () => {
    const errors = await errorsOf({ ...validDto(), bvn: '22142668052' });
    expect(errors.some((e) => e.property === 'bvn')).toBe(true);
  });

  it('rejects an invalid accountType', async () => {
    const errors = await errorsOf({ ...validDto(), accountType: 7 });
    expect(errors.some((e) => e.property === 'accountType')).toBe(true);
  });

  it('accepts dynamic accountType', async () => {
    const errors = await errorsOf({ ...validDto(), accountType: AccountType.DYNAMIC });
    expect(errors).toHaveLength(0);
  });
});
