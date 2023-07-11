export { default as cdtsDefaults } from './defaults';

/**
 * Returns whether or not the specified URL is relative - ignores (ie returns false) empty strings, URLs in querystring and anchor links (ie '#')
*/
export function isUrlRelative(url) {
    if ((url || '') === '') return false;

    let index = url.indexOf('?'); //if there's a querystring, ignore it
    if (index >= 0) {
        url = url.substring(0, index);
    }

    //if url does NOT have '://' anywhere after first character or start with '//') AND doesn't not start with '#'
    return (!(url.indexOf('://') > 0 || url.indexOf('//') === 0)) && url.indexOf('#') !== 0;
}

/**
 * Returns the CDTS base URL based on the specified environment.
*/
export function getCdtsHref(cdtsEnvironment) {
    let baseUrl;
    let rnOverridesAppVersion = false;

    if (cdtsEnvironment.cdnEnv === 'esdcprod') {
        rnOverridesAppVersion = cdtsEnvironment.version === 'rn';
        baseUrl = cdtsEnvironment.theme === 'gcintranet' ? 'https://templates.service.gc.ca/app/cls/WET' : 'https://cdts.service.canada.ca/app/cls/WET';
    }
    else if (cdtsEnvironment.cdnEnv != null && (cdtsEnvironment.cdnEnv.substr(0, 4) === 'http')) {
        return cdtsEnvironment.cdnEnv; //if starts with http: return as-is
    }
    else { //any other value is considered "prod"
        if (cdtsEnvironment.theme === 'gcintranet') {
            rnOverridesAppVersion = cdtsEnvironment.version === 'rn';
            baseUrl = 'https://cdts.service.canada.ca/app/cls/WET';
        }
        else {
            baseUrl = 'https://www.canada.ca/etc/designs/canada/cdts';
        }
    }

    return rnOverridesAppVersion
        ? `${baseUrl}/${cdtsEnvironment.theme}/`.replace('/app/cls/', '/rn/cls/')
        : `${baseUrl}/${cdtsEnvironment.theme}/${cdtsEnvironment.version}/`;
}

/** Derives CDTS environment parameters from stylesheet URL. 
 *  Returns null if cssHref is invalid.
 *  Returns objects with null properties if cssHref only partially matches what is expected. */
export function deriveCDTSEnv(cssHref) {
    if (!cssHref) return null;
    try {
        const url = new URL(cssHref);
        const hostname = url.hostname.toLowerCase();
        const pathname = url.pathname.toLowerCase();
        const baseUrl = cssHref.substring(0, cssHref.lastIndexOf('/cdts/cdts-') + 1);

        //theme
        const theme = pathname.includes('/gcintranet/') ? 'gcintranet' : 'gcweb';

        //cdnEnv
        let cdnEnv = null;
        if (hostname === 'www.canada.ca' || hostname === 'canada.ca') {
            cdnEnv = 'prod';
        }
        else if (hostname === 'cdts.service.canada.ca') {
            cdnEnv = theme === 'gcweb' ? 'esdcprod' : 'prod'; //depends on theme
        }
        else if (hostname === 'templates.service.gc.ca') {
            cdnEnv = 'esdcprod'; //TODO: Investigate whether we should be theme dependent (and probable reverse cdts.service.canada.ca, which is currently wrong)
        }
        else {
            cdnEnv = baseUrl; //anything else is taken as-is minux the stylesheet's location, including trailing slash
        }

        //version
        let version = null;
        if (pathname.includes('/rn/cls/') || pathname.includes('/rn/cdts/')) {
            version = 'rn';
        }
        else {
            version = (pathname.match(/\/(v[0-9]+_[0-9]+_[0-9]+)\//) || [null, null])[1];
        }

        return { cdnEnv, theme, version, baseUrl };
    }
    catch (error) {
        console.error('Unexpected error parsing CDTS stylesheet URL, unable to derive CDTS parameters, defaults will be used.', error);
        return null;
    }
}

/** Locates the CDTS CSS link in the current document. Returns null if not found  */
export function findCDTSCssHref() {
    return Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).map((e) => e.getAttribute('href')).find((href) => href?.includes('/cdts/cdts-')) || null;
}

/** Appends the a script element with the specified src and id to the parentElement. Returns a Promise that will be completed when the script's load event triggers. */
export function appendScriptElement(parentElement, src, id) {

    return new Promise(function cdase(resolve, reject) {
        const elem = document.createElement('script');

        if (id) elem.setAttribute('id', id);
        elem.onload = resolve.bind(null);
        elem.onerror = reject;
        elem.setAttribute('src', src);

        parentElement.appendChild(elem);
    });
}

/** Replaces the children of the specified parentElemRef with newChildElem */
export function replaceElementChildren(parentElemRef, newChildElem) {
    if (!parentElemRef) return;
    if (parentElemRef.replaceChildren) {
        parentElemRef.replaceChildren(newChildElem);
    }
    else {
        //replaceChildren not available, go old school
        parentElemRef.innerText = '';
        parentElemRef.appendChild(newChildElem);
    }
}

/** Install a click event handler of the specified language (anchor/link) element which will cancel default behavior and invoke the specified callback(). */
export function installLangLinkEvent(langLinkElem, callback) {
    if (langLinkElem) {
        langLinkElem.addEventListener('click', (e) => {
            e.preventDefault();

            try {
                callback(e);
            }
            catch (error) {
                console.error('CDTS: Error trying to switch language', error);
            }

            return false;
        });
    }
    else {
        console.warn('CDTS: Unable to find language link. Language switching will not function properly.');
    }
}

const LANGLINK_CONFIG_ENGLISH = { "href": "#", "lang": "en", "text": "English", };
const LANGLINK_CONFIG_FRENCH = { "href": "#", "lang": "fr", "text": "Français", };
//WARNING: ***** IF CDTS CHANGES THE WAY THE LANGUAGE LINK IS ADDED TO THE PAGE, THIS QUERYSELECTOR MAY HAVE TO BE ADJUSTED
export const LANGLINK_QUERY_SELECTOR = '#wb-lng a[lang][href="#"]'; //i.e.: a link within the section id="wb-lng" that has a lang attribute and href="#"
export const LANGCODE_ENGLISH = 'en';
export const LANGCODE_FRENCH = 'fr';

/** Returns the CDTS configuration object for a "top" language link in the specified language */
export function getLanguageLinkConfig(langCode) {
    //(returns french is "fr", for everything else returns english)
    return langCode === LANGCODE_FRENCH ? LANGLINK_CONFIG_FRENCH : LANGLINK_CONFIG_ENGLISH;
}

/**
 * Installs event on "react navigation" links found in the specified element (a navigation is any link to a relative URL)
 * If navigateToCallback is undefined/null, this function does nothing
*/
export function installNavLinkEvents(parentElem, navigateToCallback) {
    if (!(parentElem && navigateToCallback)) return;

    const linkElems = parentElem.querySelectorAll('a[href]');

    linkElems.forEach((elem) => {
        const url = elem.getAttribute('href');

        if (isUrlRelative(url)) {
            //TODO: not just click, keydown/keyup as well
            elem.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    navigateToCallback(url);
                }
                catch (error) {
                    console.error('CDTS: An error occured handling navigation link event', error);
                }
                return false;
            });
        }
    });
}

/**
 * This function inspects the specified CDTS "base" config and
 * removes any unsupported elements. Returns original object if no
 * modification is needed, otherwise returns new object containing "sanitized" setup.
 */
export function cleanupBaseConfig(baseConfig, issueWarning = false) {
    let vtr = baseConfig || {};

    if (baseConfig.exitSecureSite?.exitURL) {
        if (issueWarning) console.warn('CDTS: Configuration base.exitSecureSite.exitURL not supported for React template, property will be ignored.');
        vtr = { ...vtr };
        delete vtr.exitSecureSite.exitURL;
    }

    return vtr;
}

export function resetExitScript(parentElem, baseConfig) {
    if (!baseConfig) return;
    if (!wet.utilities.wetExitScript) return; //eslint-disable-line    

    const config = cleanupBaseConfig(baseConfig);

    //if not enabled (including displayModal), don't do anything
    //(we don't support exitUrl, which gets removed by cleanup, so if displayModal is false it's not woth continuing)
    if (!(config.exitSecureSite?.exitScript && config.exitSecureSite?.displayModal)) return;

    //get applicable `a` elements 
    const elems = Array.from(parentElem.querySelectorAll('a[href]:not(.wb-exitscript)')); //(all `a` that have `href` but not exit script class already)
    console.log('Re-applying exit script...', elems.length); //TODO: Remove

    wet.utilities.wetExitScript( //eslint-disable-line 
        config.exitSecureSite.displayModal != null ? config.exitSecureSite.displayModal.toString() : 'undefined',
        config.exitSecureSite.exitURL != null ? config.exitSecureSite.exitURL : 'undefined',
        config.exitSecureSite.exitDomains != null ? config.exitSecureSite.exitDomains : 'undefined',
        config.exitSecureSite.exitMsg != null ? config.exitSecureSite.exitMsg : 'undefined',
        config.exitSecureSite.yesMsg != null ? config.exitSecureSite.yesMsg : 'undefined',
        config.exitSecureSite.cancelMsg != null ? config.exitSecureSite.cancelMsg : 'undefined',
        config.exitSecureSite.msgBoxHeader != null ? config.exitSecureSite.msgBoxHeader : 'undefined',
        config.exitSecureSite.targetWarning != null ? config.exitSecureSite.targetWarning : 'undefined',
        config.exitSecureSite.displayModalForNewWindow != null ? config.exitSecureSite.displayModalForNewWindow.toString() : 'undefined',
        elems
    );
}