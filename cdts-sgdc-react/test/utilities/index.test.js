
import {
    isUrlRelative, getCdtsHref, deriveCDTSEnv, findCDTSCssHref,
    appendScriptElement, replaceElementChildren, getLanguageLinkConfig,
    cleanupBaseConfig
} from '../../src/utilities';

//---[ ***** isUrlRelative

describe('isUrlRelative tests', () => {
    test('empty', () => {
        expect(isUrlRelative()).toBe(false);
        expect(isUrlRelative('')).toBe(false);
    });

    test('absolute', () => {
        expect(isUrlRelative('https://www.google.ca')).toBe(false);
        expect(isUrlRelative('https://www.google.ca?l=en')).toBe(false); //with query string parameter for good measure
        expect(isUrlRelative('https://www.google.ca#section')).toBe(false); //with anchor for good measure
    });

    test('protocol-relative-is-absolute', () => {
        //(protocol-relative considered absolute for us)
        expect(isUrlRelative('//www.google.ca')).toBe(false);
        expect(isUrlRelative('//www.google.ca?l=en')).toBe(false); //with query string parameter for good measure
        expect(isUrlRelative('//www.google.ca#section')).toBe(false); //with anchor for good measure
    });

    test('relative', () => {
        expect(isUrlRelative('/mypage')).toBe(true);
        expect(isUrlRelative('/mypage/other?l=en')).toBe(true); //with query string parameter for good measure
        expect(isUrlRelative('/mypage/other#section')).toBe(true); //with anchor for good measure

        expect(isUrlRelative('mypage')).toBe(true);
        expect(isUrlRelative('mypage/other?l=en')).toBe(true); //with query string parameter for good measure
        expect(isUrlRelative('mypage/other#section')).toBe(true); //with anchor for good measure
    });

    test('anchor-relative-is-absolute', () => {
        //(anchor links are considered absolute, see function);
        expect(isUrlRelative('#')).toBe(false);
        expect(isUrlRelative('#bla')).toBe(false);
    });
});

//---[ ***** getCdtsHref

describe('getCdtsHref tests', () => {
    test('prod-gcweb-specific', () => {
        expect(getCdtsHref({
            theme: "gcweb",
            cdnEnv: "prod",
            version: "v9_9_9",
        })).toMatch(/^https:\/\/www.canada.ca\/etc\/designs\/canada\/cdts\/gcweb\/v9_9_9\//);
    });

    test('prod-gcintranet-specific', () => {
        expect(getCdtsHref({
            theme: "gcintranet",
            cdnEnv: "prod",
            version: "v9_9_9",
        })).toMatch(/^https:\/\/cdts.service.canada.ca\/app\/cls\/WET\/gcintranet\/v9_9_9\//);
    });

    test('esdcprod-gcweb-specific', () => {
        expect(getCdtsHref({
            theme: "gcweb",
            cdnEnv: "esdcprod",
            version: "v9_9_9",
        })).toMatch(/^https:\/\/cdts.service.canada.ca\/app\/cls\/WET\/gcweb\/v9_9_9\//);
    });

    test('esdcprod-gcintranet-specific', () => {
        expect(getCdtsHref({
            theme: "gcintranet",
            cdnEnv: "esdcprod",
            version: "v9_9_9",
        })).toMatch(/^https:\/\/templates.service.gc.ca\/app\/cls\/WET\/gcintranet\/v9_9_9\//);
    });

    test('prod-gcweb-rolling', () => {
        expect(getCdtsHref({
            theme: "gcweb",
            cdnEnv: "prod",
            version: "rn",
        })).toMatch(/^https:\/\/www.canada.ca\/etc\/designs\/canada\/cdts\/gcweb\/rn\//);
    });

    test('prod-gcintranet-rolling', () => {
        expect(getCdtsHref({
            theme: "gcintranet",
            cdnEnv: "prod",
            version: "rn",
        })).toMatch(/^https:\/\/cdts.service.canada.ca\/rn\/cls\/WET\/gcintranet\//);
    });

    test('esdcprod-gcweb-rolling', () => {
        expect(getCdtsHref({
            theme: "gcweb",
            cdnEnv: "esdcprod",
            version: "rn",
        })).toMatch(/^https:\/\/cdts.service.canada.ca\/rn\/cls\/WET\/gcweb\//);
    });

    test('esdcprod-gcintranet-rolling', () => {
        expect(getCdtsHref({
            theme: "gcintranet",
            cdnEnv: "esdcprod",
            version: "rn",
        })).toMatch(/^https:\/\/templates.service.gc.ca\/rn\/cls\/WET\/gcintranet\//);
    });

    test('custom', () => {
        expect(getCdtsHref({
            theme: "gcweb",
            cdnEnv: "https://server2.domain.net/cdts/myversion/",
            version: "v9_9_9",
        })).toMatch(/^https:\/\/server2.domain.net\/cdts\/myversion\//);
    });


    test('invalid-cdnENv-is-prod', () => {
        expect(getCdtsHref({
            theme: "gcweb",
            cdnEnv: "invalidValue",
            version: "v9_9_9",
        })).toMatch(/^https:\/\/www.canada.ca\/etc\/designs\/canada\/cdts\/gcweb\/v9_9_9\//);
    });
});

//---[ ***** deriveCDTSEnv

describe('deriveCDTSEnv tests', () => {
    test('null-is-null', () => {
        expect(deriveCDTSEnv(null)).toBe(null);
    });

    test('blank-is-null', () => {
        expect(deriveCDTSEnv('')).toBe(null);
    });

    test('prod-gcweb-specific', () => {
        expect(deriveCDTSEnv("https://www.canada.ca/etc/designs/canada/cdts/gcweb/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://www.canada.ca/etc/designs/canada/cdts/gcweb/v9_9_9/",
            theme: "gcweb",
            cdnEnv: "prod",
            version: "v9_9_9",
        });
    });

    test('prod-gcintranet-specific', () => {
        expect(deriveCDTSEnv("https://cdts.service.canada.ca/app/cls/WET/gcintranet/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://cdts.service.canada.ca/app/cls/WET/gcintranet/v9_9_9/",
            theme: "gcintranet",
            cdnEnv: "prod",
            version: "v9_9_9",
        });
    });

    test('esdcprod-gcweb-specific', () => {
        expect(deriveCDTSEnv("https://cdts.service.canada.ca/app/cls/WET/gcweb/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://cdts.service.canada.ca/app/cls/WET/gcweb/v9_9_9/",
            theme: "gcweb",
            cdnEnv: "esdcprod",
            version: "v9_9_9",
        });
    });

    test('esdcprod-gcintranet-specific', () => {
        expect(deriveCDTSEnv("https://templates.service.gc.ca/app/cls/WET/gcintranet/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://templates.service.gc.ca/app/cls/WET/gcintranet/v9_9_9/",
            theme: "gcintranet",
            cdnEnv: "esdcprod",
            version: "v9_9_9",
        });
    });

    test('prod-gcweb-rolling', () => {
        expect(deriveCDTSEnv("https://www.canada.ca/etc/designs/canada/cdts/gcweb/rn/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://www.canada.ca/etc/designs/canada/cdts/gcweb/rn/",
            theme: "gcweb",
            cdnEnv: "prod",
            version: "rn",
        });
    });

    test('prod-gcintranet-rolling', () => {
        expect(deriveCDTSEnv("https://cdts.service.canada.ca/rn/cls/WET/gcintranet/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://cdts.service.canada.ca/rn/cls/WET/gcintranet/",
            theme: "gcintranet",
            cdnEnv: "prod",
            version: "rn",
        });
    });

    test('esdcprod-gcweb-rolling', () => {
        expect(deriveCDTSEnv("https://cdts.service.canada.ca/rn/cls/WET/gcweb/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://cdts.service.canada.ca/rn/cls/WET/gcweb/",
            theme: "gcweb",
            cdnEnv: "esdcprod",
            version: "rn",
        });
    });

    test('esdcprod-gcintranet-rolling', () => {
        expect(deriveCDTSEnv("https://templates.service.gc.ca/rn/cls/WET/gcintranet/cdts/cdts-styles.css")).toMatchObject({
            baseUrl: "https://templates.service.gc.ca/rn/cls/WET/gcintranet/",
            theme: "gcintranet",
            cdnEnv: "esdcprod",
            version: "rn",
        });
    });

    test('custom', () => {
        expect(deriveCDTSEnv("https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/cdts/cdts-app-styles.css")).toMatchObject({
            baseUrl: "https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/",
            theme: "gcweb",
            cdnEnv: "https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/",
            version: "v4_1_0",
        });
    });
});

//---[ ***** findCDTSCssHref

describe('findCDTSCssHref testing sequentially', () => {
    //(separating in describe blocks so tests don't run in parrelel)
    describe('when head does NOT have suitable link', () => {
        test('not-found', () => {
            const elem = document.createElement('link');
            elem.setAttribute('rel', 'stylesheet');
            elem.setAttribute('href', 'https://server2.domain.net:8282/some.css');
            document.head.appendChild(elem);

            expect(findCDTSCssHref()).toBe(null);
            elem.remove(); //cleanup
        });
    });

    describe('when head DOES have suitable link', () => {
        test('found', () => {
            const elem = document.createElement('link');
            elem.setAttribute('rel', 'stylesheet');
            elem.setAttribute('href', 'https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/cdts/cdts-app-styles.css');
            document.head.appendChild(elem);

            expect(findCDTSCssHref()).toBe('https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/cdts/cdts-app-styles.css');
            elem.remove(); //cleanup
        });
    });

    describe('when head has a link but no href', () => {
        test('does not crash', () => {
            const elem = document.createElement('link');
            elem.setAttribute('rel', 'stylesheet');
            document.head.appendChild(elem);

            expect(findCDTSCssHref()).toBe(null);
            elem.remove(); //cleanup
        });
    });
});

//---[ ***** appendScriptElement

describe('appendScriptElement tests', () => {
    test('resolves-on-load', () => {
        return new Promise((resolveTest, rejectTest) => {
            const parent = document.createElement('div');

            // appendScriptElement is async/returns a Promise which will complete when onload event is triggered...
            appendScriptElement(parent, 'testsrc', 'testid', 'testsri')
                .then(resolveTest).catch(rejectTest);

            setTimeout(() => {
                const scriptElem = parent.querySelector('#testid');
                if (!scriptElem) rejectTest('Expected <script> element to be found after 250ms of waiting');

                if (scriptElem.getAttribute('src') !== 'testsrc') rejectTest(`Invalid value for script's src attribute: ${scriptElem.getAttribute('src')} (expected: "testsrc")`);
                if (scriptElem.getAttribute('integrity') !== 'testsri') rejectTest(`Invalid value for script's integrity attribute: ${scriptElem.getAttribute('integrity')} (expected: "testsri")`);
                if (scriptElem.getAttribute('crossorigin') !== 'anonymous') rejectTest(`Invalid value for script's integrity attribute: ${scriptElem.getAttribute('crossorigin')} (expected: "anonymous")`);

                scriptElem.remove(); //cleanup
                scriptElem.onload(); //manually call onload event (jsdom will obviously not dot it)
            }, 250);  //wait 250ms to give time for appendScript to do its job
        });
    });

    test('rejects-on-error', () => {
        return new Promise((resolveTest, rejectTest) => {
            const parent = document.createElement('div');

            // appendScriptElement is async/returns a Promise which will reject when onerror event is triggered...
            appendScriptElement(parent, 'testsrcerr', 'testerr', 'testsrierr')
                .then(() => rejectTest('Exception <script> to throw an error, got resolved instead')).catch((e) => {
                    resolveTest();
                });

            setTimeout(() => {
                const scriptElem = parent.querySelector('#testerr');
                if (!scriptElem) rejectTest('Expected <script> element to be found after 250ms of waiting');

                scriptElem.remove(); //cleanup
                scriptElem.onerror('testerror'); //manually call onerror event (jsdom will obviously not dot it)
            }, 250);  //wait 250ms to give time for appendScript to do its job
        });
    });
});

//---[ ***** replaceElementChildren

describe('replaceElementChildren tests', () => {
    test('success', () => {
        const parent = document.createElement('div');
        parent.setAttribute("id", "testid");
        const ogChild = document.createTextNode('Original child content');
        parent.appendChild(ogChild);

        const newChild = document.createTextNode('New child content');

        replaceElementChildren(parent, newChild);

        expect(parent.outerHTML).toBe('<div id="testid">New child content</div>');
    });

    test('nocrash-on-parent-null', () => {
        const newChild = document.createTextNode('New child content');

        replaceElementChildren(null, newChild);

        //except no exception thrown
    });
});

//---[ ***** getLanguageLinkConfig

describe('getLanguageLinkConfig tests', () => {
    test('french-is-french', () => {
        expect(getLanguageLinkConfig('fr')).toMatchObject({ lang: 'fr' });
    });

    test('english-is-english', () => {
        expect(getLanguageLinkConfig('en')).toMatchObject({ lang: 'en' });
    });

    test('anythingelse-is-english', () => {
        expect(getLanguageLinkConfig('zz')).toMatchObject({ lang: 'en' });
    });
});


//---[ ***** cleanupBaseConfig

describe('cleanupBaseConfig tests', () => {
    test('null-is-empty', () => {
        expect(cleanupBaseConfig(null)).toEqual({});
    });

    test('same-object-if-no-change', () => {
        const tmp = { myProp: 'Hello', mySub: { myOther: 'World' } };

        expect(cleanupBaseConfig(tmp)).toBe(tmp);
    });

    test('removes-exitURL', () => {
        const input = {
            myProp: 'Hello',
            mySub: { myOther: 'World' },
            exitSecureSite: {
                someProp: 'SomeValue',
                exitURL: 'https://myserver.domain.net/exitPage',
            },
        };

        const output = {
            myProp: 'Hello',
            mySub: { myOther: 'World' },
            exitSecureSite: {
                someProp: 'SomeValue',
            },
        };

        expect(cleanupBaseConfig(input)).toStrictEqual(output);
    });
});
