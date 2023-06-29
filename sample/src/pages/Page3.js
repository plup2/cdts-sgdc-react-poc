import { default as React, useEffect } from 'react';

import { resetWetComponent, useCdtsContext } from 'cdts-sgdc-react';

/*
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


function Page3() {
    const { language: cdtsLanguage } = useCdtsContext();

    useEffect(() => {
        console.log('THIS IS PAGE3 EFFECTED!!!', document.querySelector('.wb-frmvld')?.outerHTML);
        resetWetComponent('wb-frmvld');
    }, []);

    console.log('THIS IS PAGE3 RENDER!!!', document.querySelector('.wb-frmvld')?.outerHTML);
    return (<>
        <h2>A WET form...</h2>
        <div id="blabla123" data-othertest={cdtsLanguage}>Hello</div>
        <button onClick={() => document.getElementById('blabla123')?.setAttribute("data-hello", "world")}>!</button>
        <button onClick={() => resetWetComponent('wb-frmvld')}>!!</button>
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
    )
}


export default Page3;
