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
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!! HELLO FROM MENU GLOBAL !!!!!!!!!!!!!!!!!!!!!!!!!!', e); //TODO: Remove
        installNavLinkEvents(e?.target, routerNavigateTo);
    });
}

//TODO: "main" also has to be directly under body?  (confirm, maybe WET will be fixed?)
//TODO: https://github.blog/2021-02-12-avoiding-npm-substitution-attacks/
//TODO: Dependencies Version specifier in main package  (and update versions?)
//TODO: Is the content slightly more to the right compared to JavaTemplate? Yes it is, not menu or buttons, but fonts are different, Ahmad to investigate?
//TODO: Confirm wb-overlay , wb-lbx and wb-navcurr do not need their init to be re-triggered  (some of those are gcintranet only)
//TODO: Remove console.logs
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
            console.log('!!! CDTS refTop/refFooter');

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
                console.log('!!!!!!!!!!!!!!!!!!!!!!!! WET INITIALIZED !!!!!!!!!!!!!!');
                if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null);
                if (setWetId) setWetId(wetCurrentId + 1);
            });
        }
    }
    catch (error) {
        console.error('CDTS: An error occured installing CDTS and WET onto the page. Page may not render properly. -', error);
    }
}

//WARNING: ***** This function is kind of a hack to get WET, which is not designed for dynamic pages, to re-initialize itself in the proper language.
//         ***** It bascially searches all WET-related scripts that were injected by CDTS and re-inserts them. 
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

/**
 * CDTS Component.  Injects standard GoC/CDTS UI elements onto the page.
 * 
 * To use, in your project: 
 *   - In index.html, add the proper stylesheet elements to the HEAD section. 
 * 
 *   - In index.js, surround your application using the CDTS component: `root.render(<Cdts props...><App /></Cdts>);`
 *     Where `props` can be:
 *       - environment: {object} OPTIONAL - An object containing `cdnEnv`, `theme`, and `version` CDTS properties.  If not specified, will be derived from CDTS CSS link element in index.html
 *       - mode: {string} OPTIONAL - Which "mode" CDTS should render, one of "common" (for basic CDTS template) or "app" (for web application CDTS template), default is "app".
 *       - initialSetup: {object} OPTIONAL - An object containing the initial setup for the various CDTS sections.
 *                                           Once initially rendered, CDTS sections can be updated by using `useCdtsContext().set*(...)` functions
 *                                           For initial setup and all CDTS section configuration documentation. 
 *       - initialLanguage: {string} OPTIONAL - Used to overrides CDTS's language for initial rendering.  
 *                                              Default value will be taken from the `lang` attribute of the `html` element, or 'en' if not found. 
 *                                              Language can be read and controlled with `useCtdsContext().language` and `useCtdsContext().setLanguage`
 *                                              NOTE: CDTS CURRENTLY ONLY SUPPORTS 'en' and 'fr' languages.
 *                                              NOTE: If this value is different from the current `lang` attribute of the `html` element, inconsistencies in language could occur between CDTS and WET.
 *       - routeNavigateTo: {function} OPTIONAL - If using CDTS's top or side menu or any customized link pointing within the application,
 *                                                this should be a function which takes a "location" parameter that will be called by CDTS links
 *                                                to perform navigation. For example if using react-router-dom, this function would simply be `(location) => router.navigate(location)`
 *                                                (IMPORTANT: if not specified, application relative links will cause a browser navigation/full page reload. Language switching will also not be operational)
 * 
 * (For details on CDTS initialSetup and section config objects, see CDTS documentation https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-en.html and/or sample pages https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_0_47/cdts/samples/)
 */
function Cdts({ environment, mode = CDTS_MODE_APP, initialSetup, initialLanguage, routerNavigateTo, children }) {

    const [cdtsLoadedLang, setCdtsLoadedLang] = useState(null); //the language of the currently loaded CDTS, null until CDTS script as been injected
    const [wetInstanceId, setWetInstanceId] = useState(0); //the WET "instance id", can be used to identify when WET is being reloaded from scratch.
    const [cdtsEnvironment, setCdtsEnvironment] = useState(null);
    const [language, setLanguage] = useState(initialLanguage || defaults.getInitialLanguage());
    const [baseConfig, setBaseConfig] = useState(initialSetup?.base);
    const [top, setTop] = useState(initialSetup?.top || {});
    const [preFooter, setPreFooter] = useState(initialSetup?.preFooter || {});
    const [footer, setFooter] = useState(initialSetup?.footer || {});
    const [sectionMenu, setSectionMenu] = useState(initialSetup?.secmenu || null);

    useEffect(() => { //triggered when environment/language changes
        console.log('!!! CDTS ONE-TIME-INIT');

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
        console.log('!!! Using CDTS environment:', tmpEnvironment);

        //---[ Load CDTS on page
        installCDTS(tmpEnvironment, cleanupBaseConfig(initialSetup?.base, true), language, mode === CDTS_MODE_APP, cdtsLoadedLang || language, setCdtsLoadedLang, wetInstanceId, setWetInstanceId, routerNavigateTo);
    }, [environment, mode, language, routerNavigateTo]); //eslint-disable-line react-hooks/exhaustive-deps

    const switchLanguage = useCallback((newLang) => {
        document.documentElement.setAttribute('lang', newLang);
        setLanguage(newLang);
    }, [setLanguage]);

    const langLinkCallback = useCallback((e) => {
        let newLang = null;
        if (e && e.currentTarget && e.currentTarget.getAttribute) newLang = e.currentTarget.getAttribute("lang")?.toLowerCase();
        if (!newLang) newLang = cdtsLoadedLang === LANGCODE_FRENCH ? LANGCODE_ENGLISH : LANGCODE_FRENCH; //if somehow we couldn't get to the anchor's lang, flip current language as a fallback

        switchLanguage(newLang);
    }, [cdtsLoadedLang, switchLanguage]);

    //NOTE: Because WET imposes rigid rules about the structure of the HTML, we can't really have AppTop/Top/AppFooter/Footer as React components
    //      since they have to be directly under <body>. We'll instead handle those sections "directly" in useEffects
    useEffect(function installTop() { // *************************** TOP
        console.log('!!!!!!!!!!!!!!!!!!!!!! CDTS USEEFFECT [top] !!!!!!!!!!!!!!!!!!!!', cdtsLoadedLang);
        if (!cdtsLoadedLang) return;

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
    }, [top, mode, cdtsEnvironment, baseConfig, cdtsLoadedLang, switchLanguage, langLinkCallback, sectionMenu, routerNavigateTo]);

    useEffect(function installFooter() { // *************************** FOOTER
        console.log('!!!!!!!!!!!!!!!!!!!!!! CDTS USEEFFECT [footer] !!!!!!!!!!!!!!!!!!!!', cdtsLoadedLang);
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

    console.log('!!! RENDER CDTS');

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
                ? mainContent
                : <div className="container">
                    <div className="row">
                        {cdtsLoadedLang && <SectionMenu cdnEnv={cdtsEnvironment.cdnEnv} baseConfig={baseConfig} config={sectionMenu} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />}
                        {mainContent}
                    </div>
                </div>}
        </>
    );
}

export default Cdts;
