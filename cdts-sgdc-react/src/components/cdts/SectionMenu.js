/* eslint no-undef: "off" */
import { default as React, memo } from 'react';

import { installNavLinkEvents, replaceElementChildren } from '../../utilities';

function SectionMenu({ cdnEnv, config, language, routerNavigateTo }) {

    console.log('!!!! CDTS RENDER SectionMenu');

    //NOTE: We can't simply use `<nav ... dangerouslySetInnerHTML={{ __html: wet.builder.secmenu({ cdnEnv, ...config }) }}></div>`
    //      We need to add our event handler to the relative links after they have been added to the document.
    const tmpElem = document.createElement('div');
    //(can't use outerHTML on an orphan element)
    tmpElem.insertAdjacentHTML('afterbegin', wet.builder.secmenu({ cdnEnv, ...config }));

    return (
        <nav id="wb-sec" className="wb-sec col-md-3" typeof="SiteNavigationElement" role="navigation" ref={(ref) => {
            replaceElementChildren(ref, tmpElem);

            //Go through all the links we added to add handler to relative ones
            installNavLinkEvents(tmpElem, routerNavigateTo);
        }
        }></nav>
    );
}

export default memo(SectionMenu);
