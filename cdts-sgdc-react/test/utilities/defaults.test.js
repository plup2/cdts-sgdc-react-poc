import cdtsDefaults from '../../src/utilities/defaults';

describe('getInitialLanguage testing sequentially', () => {
    describe('html attribute is english', () => {
        test('returns english', () => {
            document.documentElement.setAttribute('lang', 'en');
            expect(cdtsDefaults.getInitialLanguage()).toBe('en');

            document.documentElement.setAttribute('lang', 'EN');
            expect(cdtsDefaults.getInitialLanguage()).toBe('en');

            document.documentElement.setAttribute('lang', 'en-CA');
            expect(cdtsDefaults.getInitialLanguage()).toBe('en');
        });
    });

    describe('html attribute is french', () => {
        test('returns french', () => {
            document.documentElement.setAttribute('lang', 'fr');
            expect(cdtsDefaults.getInitialLanguage()).toBe('fr');

            document.documentElement.setAttribute('lang', 'FR');
            expect(cdtsDefaults.getInitialLanguage()).toBe('fr');

            document.documentElement.setAttribute('lang', 'fr-CA');
            expect(cdtsDefaults.getInitialLanguage()).toBe('fr');
        });
    });

    describe('html attribute is anything else', () => {
        test('returns english', () => {
            document.documentElement.setAttribute('lang', 'zz');
            expect(cdtsDefaults.getInitialLanguage()).toBe('en');
        });
    });

    describe('html attribute is absent', () => {
        test('returns english', () => {
            document.documentElement.removeAttribute('lang');
            expect(cdtsDefaults.getInitialLanguage()).toBe('en');
        });
    });
});