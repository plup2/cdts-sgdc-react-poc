/*
import { default as React, useEffect } from 'react';

import { resetWetComponents, useCdtsContext } from 'cdts-sgdc-react';

class Page3 extends React.Component {

    componentDidMount() {
        console.log('THIS IS PAGE3 RENDERED!!!');
        resetWetComponent('wb-frmvld');
    }

    render() {
        return (<>
            <h2>A WET form...</h2>
            <div className="wb-frmvld">
                <form action="#" method="get" id="validation-example" onSubmit={() => alert('Hello There!')}>
                    <div className="form-group">
                        <label htmlFor="title1" className="required"><span className="field-name">Title</span> <strong className="required">(required)</strong></label>
                        <select className="form-control" id="title1" name="title1" required="required">
                            <option label="Select a title"></option>
                            <option value="dr">Dr.</option>
                            <option value="esq">Esq.</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fname1" className="required"><span className="field-name">First name</span> <strong className="required">(required)</strong></label>
                        <input className="form-control" id="fname1" name="fname1" type="text" required="required" pattern=".{2,}" data-rule-minlength="2" />
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                    <input type="reset" value="Reset" className="btn btn-default" />
                </form>
            </div>
        </>
        );
    }
}*/

/*
import { default as React, useEffect } from 'react';

import { resetWetComponents, useCdtsContext } from 'cdts-sgdc-react';

function SomeComp() {
    const { wetInstanceId } = useCdtsContext();

    return [<div key={wetInstanceId}>Hello from comp!</div>];
}

function Page3() {
    const { wetInstanceId, language: cdtsLanguage } = useCdtsContext();

    useEffect(() => {
        console.log('THIS IS PAGE3 EFFECTED!!!');
        resetWetComponents('wb-frmvld');
    }, [wetInstanceId]);

    console.log('THIS IS PAGE3 RENDER!!!');
    return (<>
        <h2>A WET form...</h2>
        <div id="blabla123" data-othertest={cdtsLanguage}>Hello</div>
        <SomeComp />
        <div>{wetInstanceId}</div>
        {[<div key={wetInstanceId} data-othertest={cdtsLanguage}>Hello <span id="blabla125">Another</span></div>]}
        <button onClick={() => {
            document.getElementById('blabla123')?.setAttribute("data-hello", "world");
            document.getElementById('blabla125')?.setAttribute("data-hello", "world");
        }}>!</button>
        {[<div key={wetInstanceId} data-othertest={cdtsLanguage}>Hello <span id="blabla127">Another?</span></div>]}
        <button onClick={() => resetWetComponents('wb-frmvld')}>!!</button>
        {[<div key={wetInstanceId} className="wb-frmvld">
            <form action="#" method="get" id="validation-example" onSubmit={() => alert('Hello There!')}>
                <div className="form-group">
                    <label htmlFor="title1" className="required"><span className="field-name">Title</span> <strong className="required">(required)</strong></label>
                    <select className="form-control" id="title1" name="title1" required="required">
                        <option label="Select a title"></option>
                        <option value="dr">Dr.</option>
                        <option value="esq">Esq.</option>
                        <option value="mr">Mr.</option>
                        <option value="ms">Ms.</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="fname1" className="required"><span className="field-name">First name</span> <strong className="required">(required)</strong></label>
                    <input className="form-control" id="fname1" name="fname1" type="text" required="required" pattern=".{2,}" data-rule-minlength="2" />
                </div>
                <input type="submit" value="Submit" className="btn btn-primary" />
                <input type="reset" value="Reset" className="btn btn-default" />
            </form>
        </div>]}
        <SomeComp />
        <div key={wetInstanceId}>Duplicate?</div>
        <SomeComp />
    </>
    )
}
*/

import { default as React, useState } from 'react';

import { WetContainer, resetWetComponents } from 'cdts-sgdc-react';

function Page3() {
    const [title, setTitle] = useState(null);

    return (<>
        <h2>A WET form...</h2>

        <WetContainer><div id="blabla123" data-othertest="cdtsLanguage">Hello</div></WetContainer>
        <WetContainer><div data-othertest="cdtsLanguage">Hello <span id="blabla125">Another</span></div></WetContainer>
        <button onClick={() => {
            document.getElementById('blabla123')?.setAttribute("data-hello", "world");
            document.getElementById('blabla125')?.setAttribute("data-hello", "world");
        }}>!</button>
        <button onClick={() => resetWetComponents('wb-frmvld')}>!!</button>
        <button onClick={() => setTitle(title + '.')}>!!!</button>

        <WetContainer wetComponentNames="wb-frmvld" reinitOnUpdate={true}>
            <div className="wb-frmvld">
                {title && <h4>{title}</h4>}
                <form action="#" method="get" id="validation-example" onSubmit={() => alert('Hello There!')}>
                    <div className="form-group">
                        <label htmlFor="title1" className="required"><span className="field-name">Title</span> <strong className="required">(required)</strong></label>
                        <select className="form-control" id="title1" name="title1" required="required">
                            <option label="Select a title"></option>
                            <option value="dr">Dr.</option>
                            <option value="esq">Esq.</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fname1" className="required"><span className="field-name">First name</span> <strong className="required">(required)</strong></label>
                        <input className="form-control" id="fname1" name="fname1" type="text" required="required" pattern=".{2,}" data-rule-minlength="2" />
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                    <input type="reset" value="Reset" className="btn btn-default" />
                </form>
            </div>
        </WetContainer>

        <WetContainer><div>Duplicate?</div></WetContainer>
    </>
    )
}

export default Page3;
