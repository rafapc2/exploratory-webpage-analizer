import { describe, it, expect } from 'vitest';
function absolutizeUrl(base: string, rel: string) {
  return new URL(rel, base).href;
}
describe('absolutizeUrl', () => {
  it('makes relative URL absolute', () => {
    expect(absolutizeUrl('https://a.com/x/', '../img.png')).toBe('https://a.com/img.png');
  });
});
