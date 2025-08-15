import { describe, it, expect } from 'vitest';
// Simula getUniqueSelector sin DOM
function getUniqueSelector(el: any): string {
  if (el.id) return `#${el.id}`;
  let path = [];
  while (el && el.nodeType === 1 && !el.isBody) {
    let selector = el.nodeName.toLowerCase();
    if (el.className) selector += '.' + (Array.isArray(el.classList) ? el.classList.join('.') : el.classList);
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(' > ');
}
describe('getUniqueSelector', () => {
  it('returns id if present', () => {
    const el = { id: 'test', nodeType: 1 };
    expect(getUniqueSelector(el)).toBe('#test');
  });
});
