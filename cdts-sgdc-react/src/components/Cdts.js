import { default as React, useEffect, useState, createContext, useContext, useCallback } from 'react';

import AppTop from './cdts/AppTop';
import AppFooter from './cdts/AppFooter';
import Top from './cdts/Top';
import PreFooter from './cdts/PreFooter';
import Footer from './cdts/Footer';
import SectionMenu from './cdts/SectionMenu';

import { getCdtsHref, deriveCDTSEnv, findCDTSCssHref, appendScriptElement, installNavLinkEvents, cdtsDefaults as defaults } from '../utilities';

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

//TODO: resetWetComponent removing the "-inited" ? (or with "key"? or a custom hook? https://stackoverflow.com/a/60949393)
//TODO: Confirm exitScript works  (including when a link is added dynamically after everything is loaded - may have to re-trigger wb-exitscript init BUT may have to reset class name and see if there is an adverse effect to re-scanning links)
//                   _should_ work, but have to ban the use of exitURL
//                   WHEN: Needs to be redone on EVERY render of ANY React component... ... ...ouch
//                   WHERE: ???
//                   Is there a React "postRender" event?
//                   componentDidUpdate and/or componentDidMount?   https://stackoverflow.com/questions/26556436/react-after-render-code
//TODO: Add a property "render even if wet is not ready" for App rendered?
//TODO: Language switching is not quite working (share component and sporadic exception)
//TODO: https://github.blog/2021-02-12-avoiding-npm-substitution-attacks/
//TODO: Dependencies Version specifier in main package
//TODO: SRI on CDTS script and configurable SRI (and/or detect run version)
//TODO: Is the content slightly more to the right compared to JavaTemplate? Yes it is, not menu or buttons, but fonts are different, Ahmad to investigate?
//TODO: Confirm no inital double-init when Strict mode is removed (no big deal either way I guess)
//TODO: Confirm wb-overlay , wb-lbx and wb-navcurr do not need their init to be re-triggered  (some of those are gcintranet only)
//TODO: Remove console.logs
async function installCDTS(cdtsEnvironment, baseConfig, language, isApplication, wetCurrentLang, setCdtsLoaded, routerNavigateTo) {
    try {
        const isLangSwitch = (language !== wetCurrentLang);

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
        await appendScriptElement(document.head, `${cdtsEnvironment.baseUrl}cdts/compiled/wet-${language}.js`, 'cdts-main-js');

        //---[ Sub-section components can now be rendered
        //if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null); //TODO: sort out this language switching mess

        //---[ Process the equivalent of refTop and refFooter
        if (!existingCdtsElem) {
            console.log('!!! CDTS refTop/refFooter');

            //---[ For initial load of CDTS, trigger re-render of CDTS components before applying refTop/refFooter
            if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null);

            // Create CDTS's localConfig object and apply refTop/refFooter
            wet.localConfig = { cdnEnv: cdtsEnvironment.cdnEnv, base: { ...baseConfig, isApplication, cdtsSetupExcludeCSS: true } }; //eslint-disable-line
            wet.utilities.applyRefTop(() => { //eslint-disable-line
                wet.utilities.applyRefFooter(() => { //eslint-disable-line
                    installWETHooks(routerNavigateTo);
                    /*$(document).on("wb-ready.wb", () => {  //eslint-disable-line
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!! WET INITIALIZED !!!!!!!!!!!!!!');
                        if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null);
                    });*/
                });
            });

            /*//if/when `installRef*` functions are available we could do this instead
            const cdtsParams = { ...baseConfig, cdnEnv: cdtsEnvironment.cdnEnv, isApplication, cdtsSetupExcludeCSS: true };
            wet.builder.installRefTop(cdtsParams); //eslint-disable-line
            wet.builder.installRefFooter(cdtsParams, () => installWETHooks(routerNavigateTo)); //eslint-disable-line*/
        }
        else if (isLangSwitch) {
            await reinstallWET(cdtsEnvironment);
            installWETHooks(routerNavigateTo);

            //---[ When re-loading WET following a language switch, wait until WET is fuilly initialized before trigering re-renderof CDTS components.
            $(document).on("wb-ready.wb", () => {  //eslint-disable-line
                console.log('!!!!!!!!!!!!!!!!!!!!!!!! WET INITIALIZED !!!!!!!!!!!!!!');
                if (setCdtsLoaded) setCdtsLoaded(typeof wet !== 'undefined' ? language : null);
            });
        }
    }
    catch (error) {
        console.error('>>>', error);
        //TODO: Handle errors by...?
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
    //(don't add anything back, WET will auto-inject what it needs in the proper language)

    //---[ BODY

    const reinsertElems = [];

    //Remove WET-related script from body
    //TODO: Make sure it is ok for gcIntranet as well
    document.body.querySelectorAll('script').forEach((script) => {
        const src = script.src || '';
        if (src.startsWith(cdtsEnvironment.baseUrl) && (src.includes('/wet-boew/js/') || src.endsWith('/cdts/cdtscustom.js'))) {
            reinsertElems.push(script); //keep track
            script.remove();
        }
    });

    //Undo a few other HTML elements/attributes added by WET during its initialization
    document.getElementById('wb-rsz')?.remove();
    document.documentElement.setAttribute('class', ''); //clear class on HTML other what WET puts back is not exactly same as when done from scratch

    //Add back the elements we removed from body in the same order
    for (const elem of reinsertElems) {
        await appendScriptElement(document.body, elem.src);
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
 *                                              CDTS CURRENTLY ONLY SUPPORTS 'en' and 'fr' languages.
 *       - routeNavigateTo: {function} OPTIONAL - If using CDTS's top or side menu or any customized link pointing within the application,
 *                                                this should be a function which takes a "location" parameter that will be called by CDTS links
 *                                                to perform navigation. For example if using react-router-dom, this function would simply be `(location) => router.navigate(location)`
 *                                                (if not specified, application relative links should still work but will cause a browser navigation/full page reload.
 * 
 * (For details on CDTS initialSetup and section config objects, see CDTS documentation https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-en.html and/or sample pages https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_0_47/cdts/samples/)
 */
function Cdts({ environment, mode = CDTS_MODE_APP, initialSetup, initialLanguage, routerNavigateTo, children }) {

    const [cdtsLoadedLang, setCdtsLoadedLang] = useState(null); //the language of the currently loaded CDTS, null until CDTS script as been injected
    const [cdtsEnvironment, setCdtsEnvironment] = useState(null);
    const [language, setLanguage] = useState(initialLanguage || defaults.getInitialLanguage());
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
                console.warn('CDTS CSS link element not found in document HEAD. Defaults will be used for CDTS environment selection, page may not render properly.');
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
        installCDTS(tmpEnvironment, initialSetup?.base || {}, language, mode === CDTS_MODE_APP, cdtsLoadedLang || language, setCdtsLoadedLang, routerNavigateTo);
    }, [environment, mode, language, routerNavigateTo]); //eslint-disable-line react-hooks/exhaustive-deps

    /*useEffect(() => { //TODO: Remove
        console.log('!!!!!!!!!!!!!!!!!!!!!! CDTS USEEFFECT [] !!!!!!!!!!!!!!!!!!!!', cdtsLoadedLang);
    }, [cdtsLoadedLang]);*/

    const switchLanguage = useCallback((newLang) => {
        document.documentElement.setAttribute('lang', newLang);
        setLanguage(newLang);
    }, [setLanguage]);

    console.log('!!! RENDER CDTS');

    const mainContent = (
        <main role="main" property="mainContentOfPage" className={!sectionMenu ? 'container' : 'col-md-9'} typeof="WebPageElement">
            <CdtsContext.Provider value={{ cdtsEnvironment, language: cdtsLoadedLang, setLanguage: switchLanguage, top, setTop, preFooter, setPreFooter, footer, setFooter, sectionMenu, setSectionMenu }}>
                {children}
            </CdtsContext.Provider>
            {cdtsLoadedLang && <PreFooter cdnEnv={cdtsEnvironment.cdnEnv} config={preFooter} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />}
        </main>
    );

    return (
        <>
            {cdtsLoadedLang
                && (mode === CDTS_MODE_APP
                    ? <AppTop cdnEnv={cdtsEnvironment.cdnEnv} config={top} language={cdtsLoadedLang} setLanguage={switchLanguage} sectionMenu={sectionMenu} routerNavigateTo={routerNavigateTo} />
                    : <Top cdnEnv={cdtsEnvironment.cdnEnv} config={top} language={cdtsLoadedLang} setLanguage={switchLanguage} sectionMenu={sectionMenu} routerNavigateTo={routerNavigateTo} />)}
            {!sectionMenu
                ? mainContent
                : <div className="container">
                    <div className="row">
                        {cdtsLoadedLang && <SectionMenu cdnEnv={cdtsEnvironment.cdnEnv} config={sectionMenu} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />}
                        {mainContent}
                    </div>
                </div>}
            {cdtsLoadedLang
                && (mode === CDTS_MODE_APP
                    ? <AppFooter cdnEnv={cdtsEnvironment.cdnEnv} config={footer} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />
                    : <Footer cdnEnv={cdtsEnvironment.cdnEnv} config={footer} language={cdtsLoadedLang} routerNavigateTo={routerNavigateTo} />)}
        </>
    );
}

export default Cdts;
