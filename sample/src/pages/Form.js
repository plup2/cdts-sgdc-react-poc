import { default as React, useState } from 'react';

import { WetContainer } from '@cdts-sgdc/cdts-sgdc-react';

function Form() {
    const [title, setTitle] = useState(null);
    const [salutation, setSalutation] = useState('');
    const [firstName, setFirstName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        alert(`Hello [${salutation} ${firstName}]`);
    };

    return (<>
        <h2>A WET form...</h2>

        <div id="testDiv1" data-othertest="someData">Normal &lt;div&gt;, cached, not reset on re-render (non-React attributes stay)</div>
        <WetContainer><div id="testDiv2" data-othertest="someData">WetContainer, contents reset on <span id="testSpan1">re-render</span></div></WetContainer>
        <button onClick={() => {
            document.getElementById('testDiv1')?.setAttribute("data-added", "someOtherData");
            document.getElementById('testSpan1')?.setAttribute("data-added", "someOtherData");
        }}>Direct DOM setAttribute!</button>
        <button onClick={() => setTitle(title ? title + '.' : 'Some Form')}>setTitle</button>

        <WetContainer wetComponentNames="wb-frmvld" reinitOnUpdate={true}>
            <div className="wb-frmvld">
                {title && <h4>{title}</h4>}
                <form id="validation-example" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="salutation1" className="required"><span className="field-name">Salutation</span> <strong className="required">(required)</strong></label>
                        <select id="salutation1" name="salutation1" className="form-control" required="required" value={salutation} onChange={(e) => setSalutation(e.target.value)} >
                            <option label="Select a title"></option>
                            <option value="dr">Dr.</option>
                            <option value="esq">Esq.</option>
                            <option value="mr">Mr.</option>
                            <option value="ms">Ms.</option>
                        </select>
                    </div>
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

        <WetContainer><div>Another WetContainer, should not create duplicates</div></WetContainer>
    </>
    )
}

export default Form;
