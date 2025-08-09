import { formatNumber } from '../utils/app.util';

describe('formatNumber', () => {
    it('formats decimals with default locale (en-US)', () => {
        expect(formatNumber(1000000.5)).toBe('1,000,000.5');
    });

    it('formats currency (USD)', () => {
        expect(formatNumber(1234.56, { type: 'currency', currency: 'USD' }))
            .toBe('$1,234.56');
    });

    it('formats currency (AUD) in en-AU locale', () => {
        expect(formatNumber(1234.5, { type: 'currency', currency: 'AUD', locale: 'en-AU' }))
            .toBe('$1,234.50'); // en-AU shows "$"
    });

    it('formats percent (0.123 => 12%)', () => {
        expect(formatNumber(0.123, { type: 'percent' })).toBe('12%');
    });

    it('formats unit (kilobyte) short', () => {
        expect(formatNumber(1536, { type: 'unit', unit: 'kilobyte' })).toBe('1,536 kB');
    });

    it('honors minimumFractionDigits / maximumFractionDigits', () => {
        expect(
            formatNumber(12.3, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ).toBe('12.30');
    });

    it('works with negative numbers', () => {
        expect(formatNumber(-9876.5, { type: 'currency', currency: 'USD' }))
            .toBe('-$9,876.50');
    });

    it('allows custom locale (de-DE uses comma as decimal)', () => {
        expect(formatNumber(1234.5, { locale: 'de-DE' })).toBe('1.234,5');
    });
});
