/* eslint no-undef: "off" */
import { default as React, memo } from 'react';

import { installNavLinkEvents, replaceElementChildren } from '../../utilities';

function AppFooter({ cdnEnv, config, language, routerNavigateTo }) {

    console.log('!!!! CDTS RENDER AppFooter');

    //NOTE: We can't simply use `<div id="cdts-react-def-footer" dangerouslySetInnerHTML={{ __html: wet.builder.appFooter({ cdnEnv, ...config }) }}></div>`
    //      We need to add our event handler to the relative links after they have been added to the document.
    const tmpElem = document.createElement('div');
    //(can't use outerHTML on an orphan element)
    tmpElem.insertAdjacentHTML('afterbegin', wet.builder.appFooter({ cdnEnv, ...config }));

    return (
        <div id="cdts-react-def-footer" ref={(ref) => {
            replaceElementChildren(ref, tmpElem);

            //Go through all the links we added to add handler to relative ones
            installNavLinkEvents(tmpElem, routerNavigateTo);
        }}></div>
    );
}

export default memo(AppFooter);
