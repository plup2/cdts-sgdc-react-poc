import { useEffect, lazy, Suspense } from 'react';
import { /*BrowserRouter,*/ Routes, Route, Link } from 'react-router-dom';

import { useCdtsContext } from "cdts-sgdc-react";

import Page1 from './pages/Page1';
const Page2 = lazy(() => import('./pages/Page2'));
const Page3 = lazy(() => import('./pages/Page3'));

function App() {

    console.log('!!!!! RENDER APP !!!!!');

    const { language: cdtsLanguage, top, setTop } = useCdtsContext();

    //NOTE: Don't include "top" in dependencies for this effect hook!
    useEffect(() => {

        const config = {
            ...top,
            appName: [{
                text: cdtsLanguage === 'fr' ? "Nom de l'application" : "Application name",
                href: "/"
            }],
        };

        console.log('!!!! APP !!!! language is', cdtsLanguage, config);
        setTop(config);
    }, [cdtsLanguage]); //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <h1 property="name" id="wb-cont">My Application?</h1>
            <nav>
                <Link to="/">Root</Link>&nbsp;
                <Link to="/settings">Settings</Link>&nbsp;
                <Link to="/form">Form</Link>
            </nav>
            <Suspense fallback="Loading...">
                <Routes>
                    <Route path='/' element={<Page1 />} />
                    <Route path='/settings' element={<Page2 />} />
                    <Route path='/form' element={<Page3 />} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;