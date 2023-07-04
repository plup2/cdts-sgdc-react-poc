# React components for the Centrally Deployed Templates Solution (CDTS)

## Basic Usage

To use, in your project: 
  - In index.html, add the proper stylesheet elements to the HEAD section. 

  - In index.js, surround your application using the CDTS component: `root.render(<Cdts props...><App /></Cdts>);`
    Where `props` can be:
      - environment: {object} OPTIONAL - An object containing `cdnEnv`, `theme`, and `version` CDTS properties.  If not specified, will be derived from CDTS CSS link element in index.html
      - mode: {string} OPTIONAL - Which "mode" CDTS should render, one of "common" (for basic CDTS template) or "app" (for web application CDTS template), default is "app".
      - initialSetup: {object} OPTIONAL - An object containing the initial setup for the various CDTS sections.
                                          Once initially rendered, CDTS sections can be updated by using `useCdtsContext().set*(...)` functions
                                          For initial setup and all CDTS section configuration documentation. 
      - initialLanguage: {string} OPTIONAL - Used to overrides CDTS's language for initial rendering.  
                                             Default value will be taken from the `lang` attribute of the `html` element, or 'en' if not found. 
                                             Language can be read and controlled with `useCtdsContext().language` and `useCtdsContext().setLanguage`
                                             NOTE: CDTS CURRENTLY ONLY SUPPORTS 'en' and 'fr' languages.
                                             NOTE: If this value is different from the current `lang` attribute of the `html` element, inconsistencies in language could occur between CDTS and WET.
      - routeNavigateTo: {function} OPTIONAL - If using CDTS's top or side menu or any customized link pointing within the application,
                                               this should be a function which takes a "location" parameter that will be called by CDTS links
                                               to perform navigation. For example if using react-router-dom, this function would simply be `(location) => router.navigate(location)`
                                               (if not specified, application relative links should still work but will cause a browser navigation/full page reload.

(For details on CDTS initialSetup and section config objects, see CDTS documentation https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-en.html and/or sample pages https://cdts.service.canada.ca/app/cls/WET/gcweb/v4_0_47/cdts/samples/)

## Navigation

-to be completed- (expand on routeNavigateTo property, example with react-router-or refer to sample)

## CDTS Context

You application will have access to the CDTS context which will allow it to deal with live CDTS configuration and language changes.

### Handling CDTS Language

-to be completed-

### Other CDTS Configuration

-to be completed-

### Using WET components

-to be completed- (WetComponentContainer component?)
