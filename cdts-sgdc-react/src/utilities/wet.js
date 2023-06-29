
/**
 * Trigger a re-initialization of all instances of WET components with the specified name(s).
 * (WET components should not be confused with React components, WET components are identified
 *  by the CSS class used to mark HTML elements they should apply to (e.g. "wb-frmvld")
 * 
 * @param componentName A string or array of strings specifiying the WET components to be re-initialized.
 */
export function resetWetComponent(componentName) {
    if (typeof $ === 'undefined') return;

    if (Array.isArray(componentName)) {
        for (let name of componentName) {
            $(`.${name}`).trigger('wb-init'); //eslint-disable-line
        }
    }
    else {
        $(`.${componentName}`).trigger('wb-init'); //eslint-disable-line
    }
}
