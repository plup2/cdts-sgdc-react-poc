import React from 'react';
import ReactDOM from 'react-dom/client';
import { /*BrowserRouter,*/ createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import Cdts from 'cdts-sgdc-react';

const cdtsSetup = {
    base: {
        exitSecureSite: {
            exitScript: true,
            displayModal: true,
            //exitURL: '/exit', //exitURL is not current supported in cdts-react
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
        //NOTE: set lngLinks to `null` to disable, leave undefined for default link
        //lngLinks: [{ "href": "?lang=fr", "lang": "fr", "text": "Français" }],

        breadcrumbs: [{
            title: "Home",
            href: '/',/*"https://www.canada.ca/en/index.html"*/
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

        /*headerMenu: {
            text: "Account",
            links: [{
                href: "https://www.google.ca",
                text: "Google-ca"
            },
            {
                href: "/settings",
                text: "Link 2",
            }],
            logoutLink: {
                href: "/form",
                text: "Logout Link",
            }
        }*/

    },
};

//TODO: Cleanup
//https://shallowdepth.online/posts/2022/04/why-usenavigate-hook-in-react-router-v6-triggers-waste-re-renders-and-how-to-solve-it/
//https://github.com/remix-run/react-router/issues/7634#issuecomment-1513091516    <<<
//https://github.com/remix-run/react-router/issues/7634#issuecomment-1306650156
//https://github.com/remix-run/react-router/issues/7634#issuecomment-1017572625
const router = createBrowserRouter([{ path: "*", element: <App /> }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Cdts mode="app" initialSetup={cdtsSetup} routerNavigateTo={(location) => router.navigate(location)}><RouterProvider router={router} /></Cdts>
);
