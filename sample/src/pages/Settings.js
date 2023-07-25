import { WetExternalLink } from '@cdts-sgdc/cdts-sgdc-react';

function Settings() {
    return (<>
        <h2>The "settings" page (or a least a page called Settings).</h2>
        <h3>Normal links (popup may show up inconsistently depending on timing)</h3>
        <p><a href="https://www.google.com">Google-com</a></p>
        <p><a href="https://www.google.com" target="_blank" rel="noreferrer">Google-com-newin</a></p>
        <p><a href="https://www.google.ca">Google-ca</a></p>
        <p><a href="https://www.google.ca" target="_blank" rel="noreferrer">Google-ca-newwin</a></p>
        <hr />
        <h3>WetExternalLink (popup should always be applied properly)</h3>
        <p><WetExternalLink href="https://www.google.com">Google-com</WetExternalLink></p>
        <p><WetExternalLink href="https://www.google.com" target="_blank" rel="noreferrer">Google-com-newin</WetExternalLink></p>
        <p><WetExternalLink href="https://www.google.ca">Google-ca</WetExternalLink></p>
        <p><WetExternalLink href="https://www.google.ca" target="_blank" rel="noreferrer">Google-ca-newwin</WetExternalLink></p>
    </>
    );
}

export default Settings;
