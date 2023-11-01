import React from 'react';
import ReactDOM from 'react-dom/client';
import { /*BrowserRouter,*/ createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import Cdts from '@cdts-sgdc/cdts-sgdc-react';

const cdtsSetup = {
    base: {
        exitSecureSite: {
            exitScript: true,
            displayModal: true,
            //exitURL: '/exit', //exitURL is not currently supported in cdts-react
            exitMsg: 'This is a custom exit message.',
            targetWarning: 'This is a custom new window message.',
            exitDomains: 'www.google.com',
        },
        //sriEnabled: false,
    },
    top: {
        appName: [{
            text: "Application name",
            href: "/"
        }],
        //NOTE: set lngLinks to `[]` to disable, leave undefined for default link
        //lngLinks: [{ "href": "?lang=fr", "lang": "fr", "text": "Français" }],
        //lngLinks: [],

        breadcrumbs: [{
            title: "Home",
            href: '/',/*"https://www.canada.ca/en/index.html" */
        }],

        menuLinks: [
            {
                text: "Overview",
                href: "/"
            },
            {
                text: "First Section",
                href: "/about"
            },
            {
                href: "#",
                text: "Second Section",
                subLinks: [{
                    subhref: "#",
                    subtext: "Subsection 1"
                },
                {
                    subhref: "https://www.google.com",
                    subtext: "Google-com"
                },
                {
                    subhref: "https://www.google.ca",
                    subtext: "Google-ca"
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
    },
    /*secmenu: {
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
    },*/
};

// Creating a BrowerRouter/RouterProvider so we can use its navigate function
// (the remaining routes can still be defined with a `<Routes>` inside the `<App />` component)
// ( https://github.com/remix-run/react-router/issues/7634#issuecomment-1513091516 )
const router = createBrowserRouter([{ path: "*", element: <App /> }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Cdts mode="app" waitPanelTimeout={20000} initialSetup={cdtsSetup} routerNavigateTo={(location) => router.navigate(location)}>
        <RouterProvider router={router} />
    </Cdts>
);
