import { useEffect, lazy, Suspense } from 'react';
import { /*BrowserRouter,*/ Routes, Route, Link } from 'react-router-dom';

import { useCdtsContext } from "@cdts-sgdc/cdts-sgdc-react";

import Home from './pages/Home';
const Settings = lazy(() => import('./pages/Settings'));
const Form = lazy(() => import('./pages/Form'));

function App() {

    //NOTE: This example only deals with "top" for brevety, other sections should also be handled as needed.
    //NOTE: It would also be good practice to separate the creation of the "top" and other section objects in another module.
    const { language: cdtsLanguage, top, setTop } = useCdtsContext();

    //---[ Used to respond to language changes
    //---[ (NOTE: Don't include "top" or other CDTS sections we're changing in dependency list for this effect hook!)
    useEffect(() => {
        // Create new "top" config in proper language
        const newTopConfig = {
            ...top,
            appName: [{
                text: cdtsLanguage === 'fr' ? "Nom de l'application" : "Application name",
                href: "/"
            }],
        };

        setTop(newTopConfig);
    }, [cdtsLanguage]); //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <h1 property="name" id="wb-cont">My Application?</h1>
            <nav>
                <Link to="/">Home</Link>&nbsp;
                <Link to="/settings">Settings</Link>&nbsp;
                <Link to="/form">Form</Link>
            </nav>
            <Suspense fallback="Loading...">
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/form' element={<Form />} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;