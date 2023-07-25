# React components for the Centrally Deployed Templates Solution (CDTS)

## Basic Usage

To use, in your project: 
  - In index.html, add the stylesheet element to the HEAD section corresponding to your desired environment:

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

    | Property Name   | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | mode            | {string} OPTIONAL   | Which "mode" CDTS should render, one of `"common"` (for basic CDTS template) or `"app"` (for web application CDTS template), default is `"app"`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | initialSetup    | {object} OPTIONAL   | An object containing the initial setup for the various CDTS sections. Once initially rendered, CDTS sections can be updated by using `useCdtsContext().set*(...)` functions <br>For initial setup and all *CDTS Configuration Object* properties, see [CDTS documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_.3Chead.3E_references).                                                                                                                                                                                           |
    | routeNavigateTo | {function} OPTIONAL | If using CDTS's top or side menu, language switching or any customized link pointing within the application, this should be a function which takes a "location" parameter that will be called by CDTS links to perform navigation. See [Navigation](#Navigation) section below for example. <br>**IMPORTANT**: if not specified, application relative links will cause a browser navigation/full page reload. Language switching will also not operate properly.                                                                                                             |
    | environment     | {object} OPTIONAL   | An object containing `cdnEnv`, `theme`, and `version` CDTS properties. If not specified, will be derived from CDTS CSS link element in index.html. This auto-detection is usually enough and _there is typically no need to specify this property_.                                                                                                                                                                                                                                                                                                                          |
    | initialLanguage | {string} OPTIONAL   | Used to overrides CDTS's language for initial rendering.  Default value will be taken from the `lang` attribute of the `html` element, or 'en' if not found, so _there is typically no need to specify this property_. <br>Language can then be read and controlled with `useCtdsContext().language` and `useCtdsContext().setLanguage`. <br>**NOTE**: CDTS CURRENTLY ONLY SUPPORTS 'en' and 'fr' languages. <br>**NOTE**: If this value is different from the current `lang` attribute of the `html` element, inconsistencies in language could occur between CDTS and WET. |

(For details on CDTS initialSetup and section config objects, see CDTS documentation https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html and/or sample pages https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_1_0/cdts/samples/)

## CDTS Context

You application will have access to the CDTS React context which will allow it to deal with CDTS configuration and language changes. The hook `useCdtsContext` can be used to access it, for example:
```javascript
import { useCdtsContext } from "@cdts-sgdc/cdts-sgdc-react";

...
function MyReactComponent() {
    const cdtsProps = useCdtsContext();

    ...
}
```

The properties available in the CDTS context are:

| Property Name   | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cdtsEnvironment | {object}   | Contains the current CDTS mode, cdnEnv, version, theme and baseUrl values (which are either auto-detected from index.html's CSS link element or explicitly specifed to the `Cdts` component).                                                                                                                                                                                                                       |
| wetInstanceId   | {number}   | The current WET "instance id", can be used to identify when WET is being reloaded from scratch (typically because of a language switch).                                                                                                                                                                                                                                                                            |
| language        | {string}   | (values: null, "en" or "fr") The language of the currently loaded CDTS instance. _Will be `null` until CDTS script has been successfully injected_                                                                                                                                                                                                                                                                  |
| setLanguage     | {function} | Function taking a single {string} parameter (which must be either "en" or "fr"). Can be used to programatically request a CDTS language change.                                                                                                                                                                                                                                                                     |
| baseConfig      | {object}   | The `base` CDTS configuration section. (where `exitScript` and `webAnalytics` features are configured).                                                                                                                                                                                                                                                                                                             |
| setBaseConfig   | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `base` configuration section. Refer to [CDTS Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_.3Chead.3E_references) for details.                                                                                                                                                |
| top             | {object}   | The `top` CDTS configuration section.                                                                                                                                                                                                                                                                                                                                                                               |
| setTop          | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `top` configuration section. Refer to [CDTS "top" Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_top_references) for details. <br>NOTE: The CDTS React component adds its own requirements to the `top` section's `lngLinks` properties. See language switching section below. |
| preFooter       | {object}   | The `preFooter` CDTS configuration section.                                                                                                                                                                                                                                                                                                                                                                         |
| setPreFooter    | {function} | Function taking a single {object} parameter. Used to programatically modify the CDTS `preFooter` configuration section. Refer to [CDTS "preFooter" Documentation](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html#Section_pre-footer_references) for details.                                                                                                                               |

footer, setFooter, sectionMenu, setSectionMenu


## Navigation

-to be completed- (expand on routeNavigateTo property, example with react-router-or refer to sample)

## Handling CDTS Language Switching

-to be completed-

## Other CDTS Configuration

-to be completed-

## Using WET Components

-to be completed- (WetComponentContainer/WetExternalLink component?)

## Other Public Functions

-to be completed-