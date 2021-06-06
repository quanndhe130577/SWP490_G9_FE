import React, { Component } from 'react';
import { Input } from 'reactstrap';
import i18next from 'i18next';
class Select extends Component {
    render() {
        const { value, label, required, isDisable, submitted, onChange, items } = this.props
        return (<div className={"form-group" + (submitted && !value ? " has-error" : "")}>
            <label>
                {label} {required ? <span>*</span> : ""}
            </label>
            <Input
                type='select'
                value={value}
                // className="boderLine"
                disabled={isDisable}
                onChange={evt => {
                    let val = evt.target.value;
                    if (val === '') val = null;
                    if (onChange) {
                        onChange(val);
                    }
                }}>
                <option value=''>{i18next.t('pleaseChoose')}</option>
                {items.map((item, index) =>
                    <option value={item.value} key={index}>{item.label}</option>)}
            </Input>
        </div>)
    }
}

export default Select;