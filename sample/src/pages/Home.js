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
            <button onClick={() => {
                console.log('top height: ', document.getElementById('cdts-to-be-removed').getBoundingClientRect().top + window.scrollY);

                const lngLinksRect = document.getElementById('wb-lng')?.getBoundingClientRect();
                console.log('lngLinks height: ', lngLinksRect?.height);

                const bannerRect = document.querySelector('div.brand[property="publisher"][typeof="GovernmentOrganization"]')?.getBoundingClientRect();
                console.log('banner height: ', bannerRect?.height); //TODO: buttons will change this height

                const appBarRect = document.querySelector('.app-bar')?.getBoundingClientRect();
                console.log('appBar height: ', appBarRect?.height);
                const appButtonRect = document.querySelector('a.btn[href="/settings"]')?.getBoundingClientRect();
                console.log('appBar button height: ', appButtonRect?.height);
                const appButtonMargin = appBarRect?.height - appButtonRect?.height;
                console.log('appBar burron maring: ', appButtonMargin);

                const menuRect = document.getElementById('wb-sm')?.getBoundingClientRect();
                console.log('menu height: ', menuRect?.height);

                const breadcrumbRect = document.getElementById('wb-bc')?.getBoundingClientRect();
                console.log('breadcrumb height: ', breadcrumbRect?.height);

                const subSectionsHeight = lngLinksRect?.height + bannerRect?.height + appBarRect?.height + menuRect?.height + breadcrumbRect?.height;
                const overallHeight = document.querySelector('header.cdtsreact-top-tag')?.getBoundingClientRect()?.height;
                const marginHeight = overallHeight - subSectionsHeight;

                console.log('subSection height: ', subSectionsHeight);
                console.log('margin height: ', marginHeight);
                console.log('(', overallHeight);
            }}>top height?</button>
        </>
    );
}

export default memo(Home);
