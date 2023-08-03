import themeSRIHashes from '../../src/utilities/sri';

import { cdtsDefaults } from '../../src/utilities';

describe('themeSRIHashes table', () => {
    test('contains gcweb entry for the default version', () => {
        const themeKey = `gcweb/${cdtsDefaults.cdtsEnvironment.version}`;

        expect(themeSRIHashes[themeKey]?.['compiled/wet-en.js']).toBeDefined();
        expect(themeSRIHashes[themeKey]?.['compiled/wet-fr.js']).toBeDefined();
    });

    test('contains gcintranet entry for the default version', () => {
        const themeKey = `gcintranet/${cdtsDefaults.cdtsEnvironment.version}`;

        expect(themeSRIHashes[themeKey]?.['compiled/wet-en.js']).toBeDefined();
        expect(themeSRIHashes[themeKey]?.['compiled/wet-fr.js']).toBeDefined();
    });
});
