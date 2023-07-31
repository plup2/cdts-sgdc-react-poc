
//https://jestjs.io/docs/getting-started
//https://stackoverflow.com/questions/72371227/jest-i-want-to-put-test-code-under-project-test-directory-but-configuration

import {
    isUrlRelative, getCdtsHref, deriveCDTSEnv, findCDTSCssHref,
    appendScriptElement
} from '../../src/utilities';

//---[ ***** isUrlRelative

test('isUrlRelative empty', () => {
    expect(isUrlRelative()).toBe(false);
    expect(isUrlRelative('')).toBe(false);
});

test('isUrlRelative absolute', () => {
    expect(isUrlRelative('https://www.google.ca')).toBe(false);
    expect(isUrlRelative('https://www.google.ca?l=en')).toBe(false); //with query string parameter for good measure
    expect(isUrlRelative('https://www.google.ca#section')).toBe(false); //with anchor for good measure
});

test('isUrlRelative protocol-relative-is-absolute', () => {
    //(protocol-relative considered absolute for us)
    expect(isUrlRelative('//www.google.ca')).toBe(false);
    expect(isUrlRelative('//www.google.ca?l=en')).toBe(false); //with query string parameter for good measure
    expect(isUrlRelative('//www.google.ca#section')).toBe(false); //with anchor for good measure
});

test('isUrlRelative relative', () => {
    expect(isUrlRelative('/mypage')).toBe(true);
    expect(isUrlRelative('/mypage/other?l=en')).toBe(true); //with query string parameter for good measure
    expect(isUrlRelative('/mypage/other#section')).toBe(true); //with anchor for good measure

    expect(isUrlRelative('mypage')).toBe(true);
    expect(isUrlRelative('mypage/other?l=en')).toBe(true); //with query string parameter for good measure
    expect(isUrlRelative('mypage/other#section')).toBe(true); //with anchor for good measure
});

test('isUrlRelative anchor-relative-is-absolute', () => {
    //(anchor links are considered absolute, see function);
    expect(isUrlRelative('#')).toBe(false);
    expect(isUrlRelative('#bla')).toBe(false);
});

//---[ ***** getCdtsHref

test('getCdtsHref prod-gcweb-specific', () => {
    expect(getCdtsHref({
        theme: "gcweb",
        cdnEnv: "prod",
        version: "v9_9_9",
    })).toMatch(/^https:\/\/www.canada.ca\/etc\/designs\/canada\/cdts\/gcweb\/v9_9_9\//);
});

test('getCdtsHref prod-gcintranet-specific', () => {
    expect(getCdtsHref({
        theme: "gcintranet",
        cdnEnv: "prod",
        version: "v9_9_9",
    })).toMatch(/^https:\/\/cdts.service.canada.ca\/app\/cls\/WET\/gcintranet\/v9_9_9\//);
});

test('getCdtsHref esdcprod-gcweb-specific', () => {
    expect(getCdtsHref({
        theme: "gcweb",
        cdnEnv: "esdcprod",
        version: "v9_9_9",
    })).toMatch(/^https:\/\/cdts.service.canada.ca\/app\/cls\/WET\/gcweb\/v9_9_9\//);
});

test('getCdtsHref esdcprod-gcintranet-specific', () => {
    expect(getCdtsHref({
        theme: "gcintranet",
        cdnEnv: "esdcprod",
        version: "v9_9_9",
    })).toMatch(/^https:\/\/templates.service.gc.ca\/app\/cls\/WET\/gcintranet\/v9_9_9\//);
});

test('getCdtsHref prod-gcweb-rolling', () => {
    expect(getCdtsHref({
        theme: "gcweb",
        cdnEnv: "prod",
        version: "rn",
    })).toMatch(/^https:\/\/www.canada.ca\/etc\/designs\/canada\/cdts\/gcweb\/rn\//);
});

test('getCdtsHref prod-gcintranet-rolling', () => {
    expect(getCdtsHref({
        theme: "gcintranet",
        cdnEnv: "prod",
        version: "rn",
    })).toMatch(/^https:\/\/cdts.service.canada.ca\/rn\/cls\/WET\/gcintranet\//);
});

test('getCdtsHref esdcprod-gcweb-rolling', () => {
    expect(getCdtsHref({
        theme: "gcweb",
        cdnEnv: "esdcprod",
        version: "rn",
    })).toMatch(/^https:\/\/cdts.service.canada.ca\/rn\/cls\/WET\/gcweb\//);
});

test('getCdtsHref esdcprod-gcintranet-rolling', () => {
    expect(getCdtsHref({
        theme: "gcintranet",
        cdnEnv: "esdcprod",
        version: "rn",
    })).toMatch(/^https:\/\/templates.service.gc.ca\/rn\/cls\/WET\/gcintranet\//);
});

test('getCdtsHref custom', () => {
    expect(getCdtsHref({
        theme: "gcweb",
        cdnEnv: "https://server2.domain.net/cdts/myversion/",
        version: "v9_9_9",
    })).toMatch(/^https:\/\/server2.domain.net\/cdts\/myversion\//);
});


test('getCdtsHref invalid-cdnENv-is-prod', () => {
    expect(getCdtsHref({
        theme: "gcweb",
        cdnEnv: "invalidValue",
        version: "v9_9_9",
    })).toMatch(/^https:\/\/www.canada.ca\/etc\/designs\/canada\/cdts\/gcweb\/v9_9_9\//);
});

//---[ ***** deriveCDTSEnv

test('deriveCDTSEnv null-is-null', () => {
    expect(deriveCDTSEnv(null)).toBe(null);
});

test('deriveCDTSEnv blank-is-null', () => {
    expect(deriveCDTSEnv('')).toBe(null);
});

test('deriveCDTSEnv prod-gcweb-specific', () => {
    expect(deriveCDTSEnv("https://www.canada.ca/etc/designs/canada/cdts/gcweb/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://www.canada.ca/etc/designs/canada/cdts/gcweb/v9_9_9/",
        theme: "gcweb",
        cdnEnv: "prod",
        version: "v9_9_9",
    });
});

test('deriveCDTSEnv prod-gcintranet-specific', () => {
    expect(deriveCDTSEnv("https://cdts.service.canada.ca/app/cls/WET/gcintranet/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://cdts.service.canada.ca/app/cls/WET/gcintranet/v9_9_9/",
        theme: "gcintranet",
        cdnEnv: "prod",
        version: "v9_9_9",
    });
});

test('deriveCDTSEnv esdcprod-gcweb-specific', () => {
    expect(deriveCDTSEnv("https://cdts.service.canada.ca/app/cls/WET/gcweb/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://cdts.service.canada.ca/app/cls/WET/gcweb/v9_9_9/",
        theme: "gcweb",
        cdnEnv: "esdcprod",
        version: "v9_9_9",
    });
});

test('deriveCDTSEnv esdcprod-gcintranet-specific', () => {
    expect(deriveCDTSEnv("https://templates.service.gc.ca/app/cls/WET/gcintranet/v9_9_9/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://templates.service.gc.ca/app/cls/WET/gcintranet/v9_9_9/",
        theme: "gcintranet",
        cdnEnv: "esdcprod",
        version: "v9_9_9",
    });
});

test('deriveCDTSEnv prod-gcweb-rolling', () => {
    expect(deriveCDTSEnv("https://www.canada.ca/etc/designs/canada/cdts/gcweb/rn/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://www.canada.ca/etc/designs/canada/cdts/gcweb/rn/",
        theme: "gcweb",
        cdnEnv: "prod",
        version: "rn",
    });
});

test('deriveCDTSEnv prod-gcintranet-rolling', () => {
    expect(deriveCDTSEnv("https://cdts.service.canada.ca/rn/cls/WET/gcintranet/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://cdts.service.canada.ca/rn/cls/WET/gcintranet/",
        theme: "gcintranet",
        cdnEnv: "prod",
        version: "rn",
    });
});

test('deriveCDTSEnv esdcprod-gcweb-rolling', () => {
    expect(deriveCDTSEnv("https://cdts.service.canada.ca/rn/cls/WET/gcweb/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://cdts.service.canada.ca/rn/cls/WET/gcweb/",
        theme: "gcweb",
        cdnEnv: "esdcprod",
        version: "rn",
    });
});

test('deriveCDTSEnv esdcprod-gcintranet-rolling', () => {
    expect(deriveCDTSEnv("https://templates.service.gc.ca/rn/cls/WET/gcintranet/cdts/cdts-styles.css")).toMatchObject({
        baseUrl: "https://templates.service.gc.ca/rn/cls/WET/gcintranet/",
        theme: "gcintranet",
        cdnEnv: "esdcprod",
        version: "rn",
    });
});

test('deriveCDTSEnv custom', () => {
    expect(deriveCDTSEnv("https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/cdts/cdts-app-styles.css")).toMatchObject({
        baseUrl: "https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/",
        theme: "gcweb",
        cdnEnv: "https://server2.domain.net:8282/app/cls/WET/gcweb/v4_1_0/",
        version: "v4_1_0",
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

test('appendScriptElement resolves-on-load', () => {
    return new Promise((resolveTest, rejectTest) => {
        const parent = document.createElement('div');

        // appendScriptElement is async/returns a Promise which will complte when on load event is triggers...
        appendScriptElement(parent, 'testsrc', 'testid', 'testsri')
            .then(resolveTest).catch(rejectTest);

        setTimeout(() => {
            const scriptElem = parent.querySelector('script');
            if (!scriptElem) rejectTest('Expected <script> element to be found after 250ms of waiting');

            //TODO: Complete
            scriptElem.onload();
        }, 250);  //wait 250ms to give time for appendScript to do its job
        //expect(1).toBe(2);
    });
});