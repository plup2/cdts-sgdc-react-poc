import { LANGCODE_ENGLISH, LANGCODE_FRENCH } from ".";

const cdtsDefaults = {
    cdtsEnvironment: {
        cndEnv: 'prod',
        theme: 'gcweb',
        version: 'v4_1_0',
    },

    getInitialLanguage: () => {
        const htmlLang = document.documentElement.getAttribute("lang")?.toLowerCase() || LANGCODE_ENGLISH;

        return htmlLang.startsWith(LANGCODE_FRENCH) ? LANGCODE_FRENCH : LANGCODE_ENGLISH; //default everything other than french to english.
    },
};

export default cdtsDefaults;
