import { describe, it, expect } from 'vitest';
import { maskPII } from '../src/content/pii-guard';
describe('maskPII', () => {
  it('masks emails', () => {
    const { text, flags } = maskPII('Contact: test@mail.com', 'mask');
    expect(text).toBe('Contact: *************');
    expect(flags.email).toBe(1);
  });
});
