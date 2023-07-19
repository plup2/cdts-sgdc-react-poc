import { default as React } from 'react';

import { useCdtsContext } from './Cdts';

import { resetExitScript } from '../utilities';

/**
 * Represents a link which should be handled by the WET "exit script" functionality.
 * (i.e. will present a confirmation popup to the user if leaving the current web  site)
 */
function WetExternalLink(props) {
    const { baseConfig } = useCdtsContext();

    return <a {...props} ref={(ref) => {
        if (ref) resetExitScript([ref], baseConfig)
    }}>{props.children}</a>
}

export default WetExternalLink;