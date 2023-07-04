
/**
 * Trigger a re-initialization of all instances of WET components with the specified name(s).
 * (WET components should not be confused with React components, WET components are identified
 *  by the CSS class used to mark HTML elements they should apply to (e.g. "wb-frmvld")
 * 
 * @param componentNames Series of string parameters specifiying the WET components to be re-initialized.
 */
export function resetWetComponents(...componentNames) {
    if (typeof $ === 'undefined') return;

    for (let name of componentNames) {
        if (Array.isArray(name)) {
            for (let n of name) {
                $(`.${n}`).trigger('wb-init'); //eslint-disable-line
            }
        }
        else {
            $(`.${name}`).trigger('wb-init'); //eslint-disable-line
        }
    }
}
