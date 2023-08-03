# React components for the Centrally Deployed Templates Solution (CDTS)

A template solution for React applications. The templates provided are running [Centrally Deployed Templates Solution (CDTS)](https://cenw-wscoe.github.io/sgdc-cdts/docs/index-en.html) to implement [wet-boew, the Web Experience Toolkit](https://github.com/wet-boew/wet-boew).


## Disclaimer

The current version of the CDTS React component is considered a prototype and has not been tested for production use.
The CDTS and particularily the WET library were initialy designed to be used on static pages.
This project is an attempt to bridge the gaps to make CDTS and WET usable on a dynamic React web application.  Unforeseen side-effects or problems may remain to be found and applications should be tested with care on different browsers.

In other words:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

Issues can be reported on the [Github repository](https://github.com/wet-boew/cdts-sgdc-react/issues).

## Basic Usage

To use, in your project: 

  - Add the cdts package to your React project: `npm install --save @cdts-sgdc/cdts-sgdc-react`

  - In index.html, add the stylesheet element to the HEAD section corresponding to the desired template/environment:

    | Version                   | Theme                          | Environment | Mode       | CSS URL                                                                                                                  |
    | ------------------------- | ------------------------------ | ----------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
    | specific<br>(e.g. v4_1_0) | gcweb                          | prod        | app        | `<link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/cdts/gcweb/v4_1_0/cdts/cdts-app-styles.css">`     |
    | specific<br>(e.g. v4_1_0) | gcweb                          | prod        | common     | `<link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/cdts/gcweb/v4_1_0/cdts/cdts-styles.css">`         |
    | specific<br>(e.g. v4_1_0) | gcweb                          | esdcprod    | app        | `<link rel="stylesheet" href="https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_1_0/cdts/cdts-app-styles.css">`        |
    | specific<br>(e.g. v4_1_0) | gcweb                          | esdcprod    | common     | `<link rel="stylesheet" href="https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_1_0/cdts/cdts-styles.css">`            |
    | specific<br>(e.g. v4_1_0) | gcintranet                     | prod        | app/common | `<link rel="stylesheet" href="https://cdts.service.canada.ca/app/cls/WET/gcintranet/v4_1_0/cdts/cdts-styles.css">`       |
    | specific<br>(e.g. v4_1_0) | gcintranet                     | esdcprod    | app/common | `<link rel="stylesheet" href="https://templates.service.gc.ca/app/cls/WET/gcintranet/v4_1_0/cdts/cdts-styles.css">`      |
    | specific<br>(e.g. v4_1_0) | gcintranet<br>(ESDC sub-theme) | prod        | app/common | `<link rel="stylesheet" href="https://cdts.service.canada.ca/app/cls/WET/gcintranet/v4_1_0/cdts/cdts-esdc-styles.css">`  |
    | specific<br>(e.g. v4_1_0) | gcintranet<br>(ESDC sub-theme) | esdcprod    | app/common | `<link rel="stylesheet" href="https://templates.service.gc.ca/app/cls/WET/gcintranet/v4_1_0/cdts/cdts-esdc-styles.css">` |
    | rolling                   | gcweb                          | prod        | app        | `<link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/cdts/gcweb/rn/cdts/cdts-app-styles.css">`         |
    | rolling                   | gcweb                          | prod        | common     | `<link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/cdts/gcweb/rn/cdts/cdts-styles.css">`             |
    | rolling                   | gcweb                          | esdcprod    | app        | `<link rel="stylesheet" href="https://cdts.service.canada.ca/rn/cls/WET/gcweb/cdts/cdts-app-styles.css">`                |
    | rolling                   | gcweb                          | esdcprod    | common     | `<link rel="stylesheet" href="https://cdts.service.canada.ca/rn/cls/WET/gcweb/cdts/cdts-styles.css">`                    |
    | rolling                   | gcintranet                     | prod        | app/common | `<link rel="stylesheet" href="https://cdts.service.canada.ca/rn/cls/WET/gcintranet/cdts/cdts-styles.css">`               |
    | rolling                   | gcintranet                     | esdcprod    | app/common | `<link rel="stylesheet" href="https://templates.service.gc.ca/rn/cls/WET/gcintranet/cdts/cdts-styles.css">`              |
    | rolling                   | gcintranet<br>(ESDC sub-theme) | prod        | app/common | `<link rel="stylesheet" href="https://cdts.service.canada.ca/rn/cls/WET/gcintranet/cdts/cdts-esdc-styles.css">`          |
    | rolling                   | gcintranet<br>(ESDC sub-theme) | esdcprod    | app/common | `<link rel="stylesheet" href="https://templates.service.gc.ca/rn/cls/WET/gcintranet/cdts/cdts-esdc-styles.css">`         |

  - In index.js, put your application's main component in the `Cdts` component, specifying at least the properties `initialSetup` and `routeNavigateTo`. 
    For example: 
    ```javascript
      import Cdts from '@cdts-sgdc/cdts-sgdc-react';
      
      ...
      root.render(<Cdts initialSetup={...} routeNavigateTo={...}><App /></Cdts>);
    ```
    **Supported properties**:

    | Property Name       | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | ------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | mode                | {string} OPTIONAL   | Which "mode" CDTS should render, one of `"common"` (for basic CDTS template) or `"app"` (for web application CDTS template), default is `"app"`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | **initialSetup**    | {object} OPTIONAL   | An object containing the initial setup for the various CDTS sections. Once initially rendered, CDTS sections can be updated by using `useCdtsContext().set*(...)` functions <br>For initial setup and all *CDTS Configuration Object* properties, see [CDTS documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_.3Chead.3E_references).                                                                                                                                                                                           |
    | **routeNavigateTo** | {function} OPTIONAL | If using CDTS's top or side menu, language switching or any customized link pointing within the application, this should be a function which takes a "location" parameter that will be called by CDTS links to perform navigation. See [Navigation](#Navigation) section below for example. <br>**IMPORTANT**: if not specified, application relative links will cause a browser navigation/full page reload.                                                                                                                                                                |
    | environment         | {object} OPTIONAL   | An object containing `cdnEnv`, `theme`, and `version` CDTS properties. If not specified, will be derived from CDTS CSS link element in index.html. This auto-detection is usually enough and _there is typically no need to specify this property_.                                                                                                                                                                                                                                                                                                                          |
    | initialLanguage     | {string} OPTIONAL   | Used to overrides CDTS's language for initial rendering.  Default value will be taken from the `lang` attribute of the `html` element, or 'en' if not found, so _there is typically no need to specify this property_. <br>Language can then be read and controlled with `useCtdsContext().language` and `useCtdsContext().setLanguage`. <br>**NOTE**: CDTS CURRENTLY ONLY SUPPORTS 'en' and 'fr' languages. <br>**NOTE**: If this value is different from the current `lang` attribute of the `html` element, inconsistencies in language could occur between CDTS and WET. |

(For details on CDTS initialSetup and section config objects, see CDTS documentation https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html and/or sample pages https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_1_0/cdts/samples/)

## CDTS Context

The application will have access to the CDTS React context which will allow it to deal with CDTS configuration and language changes. The hook `useCdtsContext` can be used to access it, for example:
```javascript
import { useCdtsContext } from "@cdts-sgdc/cdts-sgdc-react";

//...
function MyReactComponent() {
    const cdtsProps = useCdtsContext();

    //...
}
```

The properties available in the CDTS context are:

| Property Name   | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cdtsEnvironment | {object}   | Contains the current CDTS mode, cdnEnv, version, theme and baseUrl values (which are either auto-detected from index.html's CSS link element or explicitly specifed to the `Cdts` component).                                                                                                                                                                                                                             |
| wetInstanceId   | {number}   | The current WET "instance id", can be used to identify when WET is being reloaded from scratch (typically because of a language switch).                                                                                                                                                                                                                                                                                  |
| language        | {string}   | (values: null, "en" or "fr") The language of the currently loaded CDTS instance. _Will be `null` until CDTS script has been successfully injected_                                                                                                                                                                                                                                                                        |
| setLanguage     | {function} | Function taking a single {string} parameter (which must be either "en" or "fr"). Can be used to programatically request a CDTS language change.                                                                                                                                                                                                                                                                           |
| baseConfig      | {object}   | The `base` CDTS configuration section. (where `exitScript` and `webAnalytics` features are configured).                                                                                                                                                                                                                                                                                                                   |
| setBaseConfig   | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `base` configuration section. Refer to [CDTS Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_.3Chead.3E_references) for details.                                                                                                                                                      |
| top             | {object}   | The `top` CDTS configuration section.                                                                                                                                                                                                                                                                                                                                                                                     |
| setTop          | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `top` configuration section. Refer to [CDTS "appTop" Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_appTop_references) for details. <br>NOTE: The CDTS React component adds its own requirements to the `top` section's `lngLinks` properties. See language switching section below. |
| preFooter       | {object}   | The `preFooter` CDTS configuration section.                                                                                                                                                                                                                                                                                                                                                                               |
| setPreFooter    | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `preFooter` configuration section. Refer to [CDTS "preFooter" Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_pre-footer_references) for details.                                                                                                                                     |
| footer          | {object}   | The `footer` CDTS configuration section.                                                                                                                                                                                                                                                                                                                                                                                  |
| setFooter       | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `setFooter` configuration section. Refer to [CDTS "appFooter" Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_appFooter_references) for details.                                                                                                                                      |
| sectionMenu     | {object}   | The `sectionMenu` CDTS configuration section.                                                                                                                                                                                                                                                                                                                                                                             |
| setSectionMenu  | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `setSectionMenu` configuration section. Refer to [CDTS "setSectionMenu" Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_menu_references) for details.                                                                                                                                 |

## Navigation

CDTS will detect any relative link it is asked to generate and attach its own event handler to call back into the React ecosystem for navigation (to avoid a full-page reload).
To be able to do this local navigation, a function needs to be passed to the `Cdts` component through the `routeNavigateTo` property. This function will receive as parameter the target URL and the event object, and is reponsible for performing navigation using whatever system the application is using.

For a simple example, if using _react-router_, the function can invoke React's BrowserRouter for navigation:

```javascript
/*index.js*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import Cdts from '@cdts-sgdc/cdts-sgdc-react';

const cdtsSetup = {/*...*/};

// Creating a BrowerRouter/RouterProvider so we can use its navigate function
// (the remaining routes can still be defined with a `<Routes>` inside the `<App />` component)
const router = createBrowserRouter([{ path: "*", element: <App /> }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Cdts initialSetup={cdtsSetup} routerNavigateTo={(location, e) => router.navigate(location)}>
        <RouterProvider router={router} />
    </Cdts>
);
```

## Handling CDTS Language Switching

The CDTS and the WET library support both English and French languages but only one can be active at any given time. 
When the standard language link is clicked, the CDTS React component will automatically reload CDTS and WET in the proper language.
The context property `useCdtsContext().language` can be used by the application to re-configure the various section and perform whatever other action is necessary.
The context function `useCdtsContent().setLanguage(...)` can be called by the application to programatically request a CDTS language switch.

### The Language Link

Normally in CDTS, the application must configure the standard language link in the configuration of the `top` section (see [CDTS Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_appTop_references)).
However the CDTS React component adds its own functionality so the application doesn't have to deal with language switching itself.
It is still possible for the application to customize the standard language link, though it is recommended to let the CDTS Component take care of it and instead respond to changes of `useCdtsContext().language`.

And so, for the `lngLinks` property of the `top` section:
  - If left `undefined` or set to `lngLinks: null` : The CDTS React component will install its default event. This is the recommended option.
  - If set to an empty array (i.e. `lngLinks: []`) : Disables the generation of the standard CDTS language link.
  - If set to any other valid value (e.g. `lngLinks: [{"lang": "fr", "href": "/to_french",	"text": "Français"}]`) : An "normal" language link will be generated accordingly and the CDTS language switch event will NOT be attached. In this case the application will have to call `useCdtsContent().setLanguage(...)` explicitly.

### Handling Language Changes

To respond to CDTS language switching, the application can defined a React effect on the context property `useCdtsContext().language`.
The handler should perform whatever action the application needs, as well as re-configuring the CDTS sections in the proper language.
This can be done either in the "App" or any other component.

Example:

```javascript
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useCdtsContext } from "@cdts-sgdc/cdts-sgdc-react";

import Home from './pages/Home';
import Settings from './pages/Settings';

function App() {

    // >>> This example only deals with "top" for brevety, other sections should also be handled as needed.
    // >>> Depending on length, it would also be good practice to separate the creation of the "top" and other section objects in an other module.
    const { language, top, setTop } = useCdtsContext();

    // Language Switching "effect" handler
    // (NOTE: Don't include "top" or other CDTS sections we're changing in dependency list for this effect hook!)
    useEffect(() => {
        // Create new "top" config in proper language
        const newTopConfig = {
            ...top,
            appName: [{
                text: language === 'fr' ? "Nom de l'application" : "Application name",
                href: "/"
            }],
            //...
        };
        setTop(newTopConfig);

        //...
    }, [language]);

    return (
        <>
            <h1 property="name" id="wb-cont">Main Content</h1>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/settings' element={<Settings />} />
            </Routes>
        </>
    );
}

export default App;
```

## Using WET Components

The CDTS and WET libraries were designed with the assumption that the web page remains static, which obvisouly present challenges when interacting with dynamic pages such as a React application.
The CDTS React package provides a number of other components to help wrap HTML elements using WET "components" and make sure they are properly re-initialized when the React component is re-rendered.

### WetContainer

The `WetContainer` component is used to surround HTML element(s) making use of WET "component(s)". It has two main purposes:
   - Triggers a reinitialization of the specified WET components when this React component is re-rendered.
   - Makes sure children are re-created from scratch on render instead of cached by React (necessary because WET components could modify the DOM wihtout React "knowing", which can lead to inconsistencies)
 
**Properties**:

  | Property Name     | Type                            | Description                                                                                                                      |
  | ----------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
  | wetComponentNames | {string / [string...]} OPTIONAL | The name of the WET component(s) used in the children content                                                                    |
  | resetOnUpdate     | {boolean} OPTIONAL              | default false - If true, WET component(s) will be re-initialized on every Rect component update, otherwise only on every render. |

For example, if using the WET form validation "component":

```javascript
import { default as React, useState } from 'react';

import { WetContainer } from '@cdts-sgdc/cdts-sgdc-react';

function Form() {
    const [firstName, setFirstName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        //...
    };

    return (<>
        <h2>A WET form...</h2>

        <WetContainer wetComponentNames="wb-frmvld">
            <div className="wb-frmvld">
                <form id="validation-example" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fname1" className="required"><span className="field-name">First name</span> <strong className="required">(required)</strong></label>
                        <input id="fname1" name="fname1" className="form-control"
                            type="text" required="required" pattern=".{2,}" data-rule-minlength="2"
                            value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                    <input type="reset" value="Reset" className="btn btn-default" />
                </form>
            </div>
        </WetContainer>
    </>
    )
}

export default Form;
```

### WetExternalLink

If the [exitSecureSite functionality](https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_1_0/cdts/samples/exitscript-en.html) of CDTS is enabled in the `base` configuration object, the CDTS React component will ensure any external links it has under its control are properly handled.
To make sure any external link that are within the application's components are handled in a consistent manner, the `WetExternalLink` component should be used.
(**If normal `<a>` elements are used, the exit popup may show up inconsistently depending on timing**)

Example:
```javascript
import { default as React } from 'react';

import { WetExternalLink } from '@cdts-sgdc/cdts-sgdc-react';

function ExternalLinkSample() {
    return (<>
        <h2>Some external links...</h2>

        <p><WetExternalLink href="https://www.google.ca">Go to google.ca</WetExternalLink></p>
        <p><WetExternalLink href="https://www.google.ca" target="_blank" rel="noreferrer">Go to google.ca (new window)</WetExternalLink></p>
    </>
    );
}

export default ExternalLinkSample;
```

## Other Exported Functions

### resetWetComponents Function

This function is mainly used by the `WetContainer` component and typically would not be called directly, but is begin made available should there be a need.

This function triggers a re-initialization of all instances of WET components with the specified name(s) currently on the page.
NOTE: WET components should not be confused with React components, WET components are identified by the CSS class used to mark HTML elements they should apply to (e.g. "wb-frmvld")

Parameters:

  | Name              | Type        | Description                                                                     |
  | ----------------- | ----------- | ------------------------------------------------------------------------------- |
  | wetComponentNames | {...string} | Series of string parameters specifiying the WET components to be re-initialized |
