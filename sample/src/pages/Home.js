import { memo } from 'react';

import { useCdtsContext } from '@cdts-sgdc/cdts-sgdc-react';

const newTop = {
    appName: [{
        text: "Application name New",
        href: "/"
    }],


    breadcrumbs: [{
        title: "Home",
        href: '/',/*"https://www.canada.ca/en/index.html"*/
    },
    {
        title: "Settings",
        href: '/settings',
    }],

    menuLinks: [
        {
            text: "Overview"
        },
        {
            text: "First Section",
            href: "/about"
        },
        {
            href: "#",
            text: "Second Section",
            subLinks: [{
                subhref: "https://www.google.com",
                subtext: "Google-com"
            },
            {
                subhref: "https://www.google.ca",
                subtext: "Google-ca"
            },
            {
                subhref: "https://www.google.ca",
                subtext: "Google-ca-newwin",
                newWindow: true,
            },
            {
                subhref: "/settings",
                subtext: "Subsection 4"
            },
            {
                subhref: "#",
                subtext: "Second section - More",
                acronym: "Description of abbreviation"
            }],
        }],
    appSettings: [{ href: "/settings" }],
    signIn: [{ href: "/" }],
};

const newPreFooter = {
    screenIdentifier: 'AB123',
    dateModified: '2023/12/31',
    versionIdentifier: 'v0.9.0',
    showFeedback: '/settings',
};

const newFooter = {
    contactLink: [{ href: '/settings' }],
    termsLink: [{ href: '/about' }],
    privacyLink: [{ href: 'https://www.google.ca' }],

    footerSections: {
        title: "Title",
        links: [{
            href: "/settings",
            text: "Portal footer link 1"
        }, {
            href: "/about",
            text: "Portal footer link 2"
        }, {
            href: "/",
            text: "Portal footer link 3",
        }, {
            href: "https://www.google.ca",
            text: "Google-ca",
        }]
    },

    contextualFooter: {
        title: "Title2",
        links: [{
            text: "Link 1",
            href: "/settings"
        },
        {
            text: "Link 2",
            href: "/"
        },
        {
            text: "Google-ca",
            href: "https://www.google.ca"
        }]
    }
};

const newSectionMenu = {
    sections: [{
        sectionName: "[Topic - Local navigation]",
        menuLinks: [
            {
                href: "#", text: "Link 1", subLinks: [
                    { subhref: "#11a", subtext: "Link 1.1 a)" },
                    { subhref: "https://www.google.ca", subtext: "Google-ca" },
                    { subhref: "https://www.google.ca", subtext: "Google-ca-newwin", "newWindow": true },
                    { subhref: "#11d", subtext: "Link 1.1 d)" }
                ]
            },
            { href: "https://www.google.com", text: "Google-com" },
            { href: "https://www.google.com", text: "Google-com-newwin", "newWindow": true },
            { href: "/settings", text: "Settings" }
        ]
    },
    {
        sectionName: "Section name 3",
        menuLinks: [{ "href": "/settings", "text": "Link 1" }]
    },
    {
        sectionName: "Section name ... 27",
        menuLinks: [{ "href": "https://www.google.ca", "text": "Google-ca" }]
    }]
};


function Home() {
    const { setLanguage, setTop, setPreFooter, setFooter, setSectionMenu } = useCdtsContext();

    return (
        <>
            <p>This some content</p>
            <button onClick={() => setTop(newTop)}>setTop!</button>
            <button onClick={() => setPreFooter(newPreFooter)}>setPreFooter!</button>
            <button onClick={() => setFooter(newFooter)}>setFooter!</button>
            <button onClick={() => setSectionMenu(newSectionMenu)}>setSectionMenu!</button>
            <button onClick={() => setLanguage('en')}>setLanguage!</button>
        </>
    );
}

export default memo(Home);
