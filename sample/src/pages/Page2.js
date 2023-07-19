import { WetExternalLink } from 'cdts-sgdc-react';

function Page2() {
    return (<>
        <h2>This is the second page.</h2>
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

export default Page2;
