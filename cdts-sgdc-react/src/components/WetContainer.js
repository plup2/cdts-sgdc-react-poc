import { default as React, useEffect } from 'react';

import { useCdtsContext } from './Cdts';
import { resetWetComponents } from '../utilities/wet';

/**
 * Component used to surround HTML element(s) making use of WET "component(s)".
 * 
 * This component performs two functions:
 *   - Triggers a reinitialization of the specified WET components when this React component is re-rendered.
 *   - Makes sure children are re-created from scratch on render (necessary because WET components could modify the DOM wihtout React "knowing")
 * 
 * Properties:
 *   - wetComponentNames: {string|[string...]} - The name of the WET component(s) used in children
 *   - resetOnUpdate: {boolean} default false - If true, WET component(s) will be re-initialized on every Rect component update, otherwise only on every render.
 */
function WetContainer({ wetComponentNames, resetOnUpdate, children }) {
    const { wetInstanceId } = useCdtsContext();

    useEffect(() => {
        //---[ Re-init WET component(s)...
        if (wetComponentNames) {
            resetWetComponents(wetComponentNames);
        }
    }, resetOnUpdate ? null : [wetComponentNames, wetInstanceId]); //eslint-disable-line react-hooks/exhaustive-deps

    //NOTE: Returning in an array using React's `ref` attribute as a way to force re-creation of DOM element
    //      (other React would only update, leaving any WET-added attributes in an undefined state)
    return [<div key={wetInstanceId}>{children}</div>];
}

export default WetContainer;
