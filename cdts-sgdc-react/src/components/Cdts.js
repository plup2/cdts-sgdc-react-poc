import { default as React, useEffect, useState, createContext, useContext, useCallback } from 'react';

import PreFooter from './cdts/PreFooter';
import SectionMenu from './cdts/SectionMenu';

import {
    cdtsDefaults as defaults,
    getCdtsHref, deriveCDTSEnv, findCDTSCssHref, appendScriptElement,
    installNavLinkEvents, resetExitScript, cleanupBaseConfig,
    getLanguageLinkConfig, installLangLinkEvent, LANGCODE_ENGLISH, LANGCODE_FRENCH, LANGLINK_QUERY_SELECTOR,
} from '../utilities';
import { resetWetComponents } from '../utilities/wet';
import themeSRIHashes from '../utilities/sri';

import "./cdts.css";

const CDTS_MODE_APP = 'app';

const CdtsContext = createContext();

/**
 * Returns the CdtsContext object
 */
export function useCdtsContext() {
    return useContext(CdtsContext);
};

/** Installs some WET hooks to detect when some components have finished initializing */
function installWETHooks(routerNavigateTo) {
    //---[ Menu
    $(document).on("wb-ready.wb-menu", (e) => { //eslint-disable-line
        // When the wb-menu WET control finish initializing (which could be re-written links), we can install our routing event on relative links.
        installNavLinkEvents(e?.target, routerNavigateTo);
    });
}

//TODO: Does "main" also has to be directly under body?  (confirm, maybe WET will be fixed?)
/**
 * Install and initializes CDTS, both initially and after a language switch.
 *
 * NOTE: When this function returns successfully, CDTS scripts are loaded but WET loading and initialization are not complete yet.
 *
 * @returns true if CDTS script were successfully loaded, otherwise returns false
 */
async function installCDTS(cdtsEnvironment, baseConfig, language, isApplication, wetCurrentLang, setCdtsLoaded, wetCurrentId, setWetId, routerNavigateTo) {
    try {
        const isLangSwitch = (language !== wetCurrentLang);
        const sriEnabled = baseConfig?.sriEnabled !== false; //if sriEnabled is not explicitly set to false, default to true

        //---[ Remove existing element (if any)
        const existingCdtsElem = document.getElementById('cdts-main-js');
        if (existingCdtsElem) {
            try {
                existingCdtsElem.remove();
            }
            catch (error) {
                console.error('CDTS: Unable to remove previously injected script element, this could be trouble.', error);
            }
        }

        //---[ Add CDTS script for specified environment, version and language
        const sriHash = sriEnabled ? themeSRIHashes[`${cdtsEnvironment.theme}/${cdtsEnvironment.version}`]?.[`compiled/wet-${language}.js`] : null;
        await appendScriptElement(document.head, `${cdtsEnvironment.baseUrl}cdts/compiled/wet-${language}.js`, 'cdts-main-js', sriHash);

        //---[ Process the equivalent of refTop and refFooter
        if (!existingCdtsElem) {
            //---[ For initial load of CDTS, trigger re-render of CDTS components before applying refTop/refFooter
            if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null);
            //if (setWetId) setWetId(wetCurrentId + 1); //no need on initial load

            // Create CDTS's localConfig object and apply refTop/refFooter
            wet.localConfig = { cdnEnv: cdtsEnvironment.cdnEnv, base: { ...baseConfig, isApplication, sriEnabled, cdtsSetupExcludeCSS: true } }; //eslint-disable-line
            wet.utilities.applyRefTop(() => { //eslint-disable-line
                wet.utilities.applyRefFooter(() => { //eslint-disable-line
                    //(first, call the original CDTS "setup" footer-completed handler)
                    wet.utilities.onRefFooterCompleted(); //eslint-disable-line

                    //Install our WET hooks
                    installWETHooks(routerNavigateTo);
                    //(unlike when we reload (see `else` below), initial load has already called `setCdtsLoaded` so no need for `wb-read.wb` event handler)
                });
            });
        }
        else if (isLangSwitch) {
            await reinstallWET(cdtsEnvironment, language);
            installWETHooks(routerNavigateTo);

            //---[ When re-loading WET following a language switch, wait until WET is fuilly initialized before trigering re-renderof CDTS components.
            $(document).on("wb-ready.wb", () => {  //eslint-disable-line
                if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null);
                if (setWetId) setWetId(wetCurrentId + 1);
            });
        }

        return true;
    }
    catch (error) {
        console.error('CDTS: An error occured installing CDTS and WET onto the page. Page may not render properly. -', error);
        return false;
    }
}

//WARNING: ***** This function is kind of a hack to get WET, which is not designed for dynamic pages, to re-initialize itself in the proper language.
//         ***** For WET, "the proper language" is the value of the `lang` attribute on the `html` element.
//         ***** This function bascially searches all WET-related scripts that were injected by CDTS and re-inserts them. 
//         ***** IF WET CHANGES THE WAY IT INITIALIZES, THIS FUNCTION WILL HAVE TO BE UPDATED.
async function reinstallWET(cdtsEnvironment) {
    //---[ HEAD

    //Remove WET-related scripts from head
    document.head.querySelectorAll('script').forEach((script) => {
        const src = script.src || '';
        if (src.startsWith(cdtsEnvironment.baseUrl) && src.includes('/wet-boew/js/')) {
            script.remove();
        }
    });

    document.head.querySelectorAll('object').forEach((o) => {
        const src = o.data || '';
        if (src.startsWith(cdtsEnvironment.baseUrl) && src.includes('/wet-boew/js/')) {
            o.remove();
        }
    });
    //(don't add anything back, WET will auto-inject what it needs in the proper language)

    //---[ BODY

    const reinsertElems = [];

    //Remove WET-related script from body (do NOT remove jqeury - it leads to problems)
    document.body.querySelectorAll('script').forEach((script) => {
        const src = script.src || '';
        if (src.startsWith(cdtsEnvironment.baseUrl) && (src.includes('/wet-boew/js/') || src.endsWith('/cdts/cdtscustom.js')) && (!src.endsWith('/jquery.min.js'))) {
            reinsertElems.push(script); //keep track
            script.remove();
        }
    });

    //Undo a few other HTML elements/attributes added by WET during its initialization
    document.getElementById('wb-rsz')?.remove();
    document.documentElement.setAttribute('class', ''); //clear class on HTML otherwise what WET puts back is not exactly same as when done from scratch

    //Unbind ALL jquery events (we're assuming we're the only one using it...could be refined later) (https://stackoverflow.com/a/64500579)
    //side-note: to get list of event handlers on (for example) document: $._data($(document).get(0), 'events')
    if (typeof $ !== 'undefined') $(document).off().find("*").off(); //eslint-disable-line

    //Add back the elements we removed from body in the same order
    for (const elem of reinsertElems) {
        await appendScriptElement(document.body, elem.src, elem.getAttribute('id'), elem.getAttribute('integrity'));
    }
}

function getTopPlaceholderHeight(mode, topConfig) {
    //NOTE: The values returned by this were taken by manual observation of a rendered page using various options.
    //      Not ideal since any change in CDTS will not automatically be reflected here, but will have to do for now.
    if (mode === CDTS_MODE_APP) {
        let height = 109;//banner(49) + appBar_without_buttons(45) + margins(15)
        if ((!topConfig?.lngLinks) || topConfig?.lngLinks.length > 0) {
            height += 33; //language link  (either default when null or explicitly specified)
        }
        if (topConfig?.appSettings || topConfig?.signIn || topConfig?.signOut) {
            height += 18; //app bar button margin
        }
        if (topConfig?.menuLinks) {
            height += 55; //menu
        }
        if (topConfig?.breadcrumbs) {
            height += 59; //breadcrumbs
        }
        console.warn('height=', height);
        return height;
    }
    else {
        return 219; //whole top section
    }
}

/**
 * CDTS Component.  Injects standard GoC/CDTS UI elements onto the page.
 * 
 * To use, in your project: 
 *   - In index.html, add the proper stylesheet elements to the HEAD section. 
 * 
 *   - In index.js, surround your application using the CDTS component: `root.render(<Cdts props...><App /></Cdts>);`
 *     Where `props` can be:
 *       - environment: {object} OPTIONAL - An object containing `cdnEnv`, `theme`, and `version` CDTS properties.
 *                                          If not specified, will be derived from CDTS CSS link element in index.html.
 *                                          This auto-detection is usually enough and this typically no need to specify this property.
 *       - mode: {string} OPTIONAL - Which "mode" CDTS should render, one of "common" (for basic CDTS template) or "app" (for web application CDTS template), default is "app".
 *       - initialSetup: {object} OPTIONAL - An object containing the initial setup for the various CDTS sections.
 *                                           Once initially rendered, CDTS sections can be updated by using `useCdtsContext().set*(...)` functions
 *                                           For initial setup and all CDTS section configuration, see CDTS documentation. 
 *       - initialLanguage: {string} OPTIONAL - Used to overrides CDTS's language for initial rendering.  
 *                                              Default value will be taken from the `lang` attribute of the `html` element, or 'en' if not found, so there is typically no need to specify this property.
 *                                              Language can then be read and controlled with `useCtdsContext().language` and `useCtdsContext().setLanguage`
 *                                              NOTE: CDTS CURRENTLY ONLY SUPPORTS 'en' and 'fr' languages.
 *                                              NOTE: If this value is different from the current `lang` attribute of the `html` element, inconsistencies in language could occur between CDTS and WET.
 *       - routeNavigateTo: {function} OPTIONAL - If using CDTS's top or side menu, language switching or any customized link pointing within the application,
 *                                                this should be a function which takes a "location" parameter that will be called by CDTS links
 *                                                to perform navigation. For example if using react-router-dom, this function would simply be `(location) => router.navigate(location)`
 *                                                (IMPORTANT: if not specified, application relative links will cause a browser navigation/full page reload.)
 *       - waitPanelTimeout: {integer} OPTIONAL - Controls whether to show a "wait while loading" panel until CDTS and WET have finished loading. 
 *                                                Default value is 0. Possible values:
 *                                                  < 0  : Loading panel disabled, the application will be displayed right away with CDTS template applied when available
 *                                                  == 0 : Loading panel will be displayed until CDTS is loaded, no timeout (panel will be cancelled if CDTS is not accessible)
 *                                                  > 0  : (milliseconds) Loading panel will be displayed until CDTS is loaded or the timeout period has elapsed.
 * 
 * (For details on CDTS initialSetup and section config objects, see CDTS documentation https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-en.html and/or sample pages https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_0_47/cdts/samples/)
 */
function Cdts({ environment, mode = CDTS_MODE_APP, initialSetup, initialLanguage, routerNavigateTo, waitPanelTimeout = 0, children }) {

    const [cdtsLoadedLang, setCdtsLoadedLang] = useState(null); //the language of the currently loaded CDTS, null until CDTS script has been injected
    const [wetInstanceId, setWetInstanceId] = useState(0); //the WET "instance id", can be used to identify when WET is being reloaded from scratch.
    const [cdtsEnvironment, setCdtsEnvironment] = useState(null);
    const [loadingTimeoutLapsed, setLoadingTimeoutLapsed] = useState(null); //used to track loading "spinner" div
    const [language, setLanguage] = useState(initialLanguage || defaults.getInitialLanguage()); //the current application language, could be different than cdtsLoadedLang if CDTS hasn't finished (re)initializing.
    const [baseConfig, setBaseConfig] = useState(initialSetup?.base);
    const [top, setTop] = useState(initialSetup?.top || {});
    const [preFooter, setPreFooter] = useState(initialSetup?.preFooter || {});
    const [footer, setFooter] = useState(initialSetup?.footer || {});
    const [sectionMenu, setSectionMenu] = useState(initialSetup?.secmenu || null);

    //---[ Effect: initial CDTS installation and re-init on CDTS environment/language
    useEffect(() => { //triggered when environment/language changes
        //---[ Initialize cdtsEnvironment
        let tmpEnvironment;
        if (environment) {
            tmpEnvironment = { ...environment };
        }
        else {
            //---[ No environment: create one from CSS URL
            const cssHref = findCDTSCssHref();
            if (cssHref) {
                tmpEnvironment = deriveCDTSEnv(cssHref) || defaults.cdtsEnvironment;
            }
            else {
                console.warn('CDTS: CSS link element not found in document HEAD. Defaults will be used for CDTS environment selection, page may not render properly.');
                tmpEnvironment = defaults.cdtsEnvironment;
            }
        }
        tmpEnvironment.cdnEnv ||= defaults.cdtsEnvironment.cndEnv;
        tmpEnvironment.version ||= defaults.cdtsEnvironment.version;
        tmpEnvironment.theme ||= defaults.cdtsEnvironment.theme;
        tmpEnvironment.baseUrl ||= getCdtsHref(tmpEnvironment);
        tmpEnvironment.mode ||= mode;
        setCdtsEnvironment(tmpEnvironment);
        //console.log('CDTS: Using environment:', tmpEnvironment);

        //---[ Load CDTS on page
        installCDTS(tmpEnvironment, cleanupBaseConfig(initialSetup?.base, true), language, mode === CDTS_MODE_APP, cdtsLoadedLang || language, setCdtsLoadedLang, wetInstanceId, setWetInstanceId, routerNavigateTo).then((isSuccess) => {
            if (!isSuccess) {
                //if there was an error loading CDTS, cancel wait panel
                document.getElementById('cdtsreact-loading-full')?.remove();
                setLoadingTimeoutLapsed(true);
            }
        });
    }, [environment, mode, language, routerNavigateTo]); //eslint-disable-line react-hooks/exhaustive-deps

    //---[ Callback: Changes the page language to specified language (including HTML element's attribute and triggering CDTS language reload)
    const switchLanguage = useCallback((newLang) => {
        document.documentElement.setAttribute('lang', newLang);
        setLanguage(newLang);
    }, [setLanguage]);

    //---[ Callback: Event callback for language switching
    const langLinkCallback = useCallback((e) => {
        let newLang = null;
        if (e && e.currentTarget && e.currentTarget.getAttribute) newLang = e.currentTarget.getAttribute("lang")?.toLowerCase();
        if (!newLang) newLang = cdtsLoadedLang === LANGCODE_FRENCH ? LANGCODE_ENGLISH : LANGCODE_FRENCH; //if somehow we couldn't get to the anchor's lang, flip current language as a fallback

        switchLanguage(newLang);
    }, [cdtsLoadedLang, switchLanguage]);

    //NOTE: Because WET imposes rigid rules about the structure of the HTML, we can't really have AppTop/Top/AppFooter/Footer as React components
    //      since they have to be directly under <body>. We'll instead handle those sections "directly" in useEffects
    useEffect(function installTop() { // *************************** TOP
        if (!cdtsLoadedLang) {
            if (loadingTimeoutLapsed === null && waitPanelTimeout > -1) { //if timeout not started and we should have a loading panel
                setLoadingTimeoutLapsed(false);

                document.body.querySelectorAll('.cdtsreact-top-tag').forEach((e) => e.remove());

                let tmpElem = document.createElement('div'); //the loading overlay
                tmpElem.setAttribute('id', 'cdtsreact-loading-full');
                tmpElem.classList.add('cdtsreact-top-tag');
                tmpElem.classList.add('cdtsreact-spinner-full');
                tmpElem.appendChild(document.createElement('div'));
                document.body.insertAdjacentElement('afterbegin', tmpElem);

                tmpElem = document.createElement('div'); //the top spacer
                tmpElem.classList.add('cdtsreact-top-tag');
                tmpElem.classList.add('cdtsreact-spinner');
                tmpElem.setAttribute('id', 'cdtsreact-loading-top');
                tmpElem.setAttribute('style', `height: ${getTopPlaceholderHeight(mode, top)}px;`);
                //tmpElem.appendChild(document.createElement('div'));
                document.body.insertAdjacentElement('afterbegin', tmpElem);

                if (waitPanelTimeout > 0) { //if timeout not started and should be
                    setTimeout(() => {
                        document.getElementById('cdtsreact-loading-full')?.remove();
                        setLoadingTimeoutLapsed(true);
                    }, waitPanelTimeout);
                }
            }
            return;
        }

        let lngLinkOverriden = false;
        const topConfig = { cdnEnv: cdtsEnvironment.cdnEnv, ...top, topSecMenu: sectionMenu != null };

        //NOTE: Create the default language link if undefined/null, but leave empty if empty array as a way for users to disable language link.
        if (!topConfig.lngLinks) {
            topConfig.lngLinks = [getLanguageLinkConfig(cdtsLoadedLang === LANGCODE_FRENCH ? LANGCODE_ENGLISH : LANGCODE_FRENCH)]; //get link config for "opposite" language
            lngLinkOverriden = true;
        }

        //---[ Create TOP
        const tmpElem = document.createElement('template'); //top's content must be directly in <body>, so use "template" element as temporary container
        //(can't use outerHTML on an orphan element)
        tmpElem.insertAdjacentHTML('afterbegin', mode === CDTS_MODE_APP ? wet.builder.appTop(topConfig) : wet.builder.top(topConfig)); //eslint-disable-line
        //inject a "marker/tag" class
        for (let e of tmpElem.children) e.classList.add('cdtsreact-top-tag'); //using `children` and not `childNodes`, we only want elements
        // If exitScript is enabled, (re)apply it for our links
        if (baseConfig?.exitSecureSite?.exitScript) resetExitScript(tmpElem, baseConfig);

        //---[ Remove any elements from previous runs
        document.body.querySelectorAll('.cdtsreact-top-tag').forEach((e) => e.remove());

        //---[ Install right after body
        for (let i = tmpElem.children.length - 1; i >= 0; i--) {
            const e = tmpElem.children[i];
            document.body.insertAdjacentElement('afterbegin', e);
            installNavLinkEvents(e, routerNavigateTo); //Go through all the links we added to add handler to relative ones
        }
        if (lngLinkOverriden) installLangLinkEvent(document.body.querySelector(LANGLINK_QUERY_SELECTOR), langLinkCallback); //If we installed our own language link, install the handler for it
        if (mode === CDTS_MODE_APP) {
            //CDTS's appTop could use the WET menu component, we need to re-initialize it
            //(WET component will recreate our links, so our events need be re-applied. This happens the in global "wb-ready.wb-menu" handler (installed in installWetHooks))
            resetWetComponents('wb-menu');
        }
    }, [top, mode, cdtsEnvironment, baseConfig, cdtsLoadedLang, switchLanguage, langLinkCallback, sectionMenu, routerNavigateTo, loadingTimeoutLapsed, waitPanelTimeout]);

    useEffect(function installFooter() { // *************************** FOOTER
        if (!cdtsLoadedLang) return;

        //---[ Create FOOTER
        const footerConfig = { cdnEnv: cdtsEnvironment.cdnEnv, ...footer };
        const tmpElem = document.createElement('template'); //footer's content must be directly in <body>, so use "template" element as temporary container
        //(can't use outerHTML on an orphan element)
        tmpElem.insertAdjacentHTML('afterbegin', mode === CDTS_MODE_APP ? wet.builder.appFooter(footerConfig) : wet.builder.footer(footerConfig)); //eslint-disable-line
        //inject a "marker/tag" class
        for (let e of tmpElem.children) e.classList.add('cdtsreact-footer-tag'); //using `children` and not `childNodes`, we only want elements
        // If exitScript is enabled, (re)apply it for our links
        if (baseConfig?.exitSecureSite?.exitScript) resetExitScript(tmpElem, baseConfig);

        //---[ Remove any elements from previous runs
        document.body.querySelectorAll('.cdtsreact-footer-tag').forEach((e) => e.remove());

        //---[ Install right after body
        const children = Array.from(tmpElem.children); //don't want a live list for this, so convert to array
        for (let i = 0; i < children.length; i++) {
            const e = children[i];
            document.body.appendChild(e);
            installNavLinkEvents(e, routerNavigateTo); //Go through all the links we added to add handler to relative ones
        }
    }, [footer, mode, cdtsEnvironment, baseConfig, cdtsLoadedLang, routerNavigateTo]);

    //---[ ***** Rendering of CDTS

    const mainContent = (
        <main role="main" property="mainContentOfPage" className={!sectionMenu ? 'container' : 'col-md-9'} typeof="WebPageElement">
            <CdtsContext.Provider value={{ cdtsEnvironment, wetInstanceId, language: cdtsLoadedLang, setLanguage: switchLanguage, baseConfig, setBaseConfig, top, setTop, preFooter, setPreFooter, footer, setFooter, sectionMenu, setSectionMenu }}>
                {children}
            </CdtsContext.Provider>
            {cdtsLoadedLang && <PreFooter cdnEnv={cdtsEnvironment.cdnEnv} baseConfig={baseConfig} config={preFooter} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />}
        </main>
    );

    return (
        <>
            {!sectionMenu
                ? (cdtsLoadedLang || (loadingTimeoutLapsed || waitPanelTimeout < 0)) && mainContent
                : <div className="container">
                    <div className="row">
                        {cdtsLoadedLang && <SectionMenu cdnEnv={cdtsEnvironment.cdnEnv} baseConfig={baseConfig} config={sectionMenu} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />}
                        {(cdtsLoadedLang || (loadingTimeoutLapsed || waitPanelTimeout < 0)) && mainContent}
                    </div>
                </div>}
        </>
    );
}

export default Cdts;
