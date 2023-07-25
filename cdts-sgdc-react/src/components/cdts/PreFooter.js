/* eslint no-undef: "off" */
import { default as React, memo } from 'react';

import { installNavLinkEvents, replaceElementChildren, resetExitScript } from '../../utilities';
import { resetWetComponents } from '../../utilities/wet';

function PreFooter({ cdnEnv, baseConfig, config, language, routerNavigateTo }) {

    //NOTE: We can't simply use `<div id="cdts-react-def-preFooter" dangerouslySetInnerHTML={{ __html: wet.builder.preFooter({ cdnEnv, ...config }) }}></div>`
    //      We need to add our event handler to the relative links after they have been added to the document.
    const tmpElem = document.createElement('div');
    //(can't use outerHTML on an orphan element)
    tmpElem.insertAdjacentHTML('afterbegin', wet.builder.preFooter({ cdnEnv, ...config }));
    if (baseConfig?.exitSecureSite?.exitScript) resetExitScript(tmpElem, baseConfig); //apply CDTS exit script if enabled

    return (
        <div id="cdts-react-def-preFooter" ref={(ref) => {
            replaceElementChildren(ref, tmpElem);

            //Go through all the links we added to add handler to relative ones
            installNavLinkEvents(tmpElem, routerNavigateTo);

            //CDTS's PreFooter could use the WET share component, we need to re-initialize it
            resetWetComponents('wb-share');
        }}></div>
    );
}

export default memo(PreFooter);
