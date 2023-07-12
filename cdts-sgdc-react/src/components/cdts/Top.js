/* eslint no-undef: "off" */
import { default as React, memo, useCallback } from 'react';

import {
    replaceElementChildren, resetExitScript, installNavLinkEvents, installLangLinkEvent, getLanguageLinkConfig,
    LANGCODE_ENGLISH, LANGCODE_FRENCH, LANGLINK_QUERY_SELECTOR
} from '../../utilities';

function Top({ cdnEnv, baseConfig, config, language, setLanguage, sectionMenu, routerNavigateTo }) {

    let lngLinkOverriden = false;

    console.log('!!!! CDTS RENDER Top', language);

    //The function that will be called from the CDTS <a> element event handler
    const langLinkCallback = useCallback((e) => {
        let newLang = null;
        if (e && e.currentTarget && e.currentTarget.getAttribute) newLang = e.currentTarget.getAttribute("lang")?.toLowerCase();
        if (!newLang) newLang = language === LANGCODE_FRENCH ? LANGCODE_ENGLISH : LANGCODE_FRENCH; //if somehow we couldn't get to the anchor's lang, flip current language as a fallback

        setLanguage(newLang);
    }, [language, setLanguage]);


    const topConfig = { cdnEnv, ...config, topSecMenu: sectionMenu != null };

    //NOTE: Create the default language link if undefined/null, but leave empty if empty array as a way for users to disable language link.
    if (!topConfig.lngLinks) {
        topConfig.lngLinks = [getLanguageLinkConfig(language === LANGCODE_FRENCH ? LANGCODE_ENGLISH : LANGCODE_FRENCH)]; //get link config for "opposite" language
        lngLinkOverriden = true;
    }

    //NOTE: We can't simply use `<div id="cdts-react-def-top" dangerouslySetInnerHTML={{ __html: wet.builder.top({ cdnEnv, ...config }) }}></div>`
    //      We need to add our event handler to the language link (if any) and other relative links after they have been added to the document.
    const tmpElem = document.createElement('div');
    //(can't use outerHTML on an orphan element)
    tmpElem.insertAdjacentHTML('afterbegin', wet.builder.top(topConfig));
    // If exitScript is enabled, (re)apply it for our links
    if (baseConfig?.exitSecureSite?.exitScript) resetExitScript(tmpElem, baseConfig);

    return (
        <div id="cdts-react-def-top" ref={(ref) => {
            replaceElementChildren(ref, tmpElem);

            //If we installed our handle language link, install the handler for it
            if (lngLinkOverriden) installLangLinkEvent(tmpElem.querySelector(LANGLINK_QUERY_SELECTOR), langLinkCallback);

            //Go through all the links we added to add handler to relative ones
            installNavLinkEvents(tmpElem, routerNavigateTo);

            //(unlike AppTop, we have no customizable links to go through)
        }}></div>
    );
}

export default memo(Top);
