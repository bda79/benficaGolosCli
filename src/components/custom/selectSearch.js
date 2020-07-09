import React, { useState, useEffect } from 'react';
import './selectSearch.scss';
import SelectSearch from 'react-select-search';

const Select = (props) => {
    const [ value, setValue ] = useState(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props])

    const onChange = value => {
        setValue(value);
        props.onChange(value);
    }

    return (
        <SelectSearch
            options={props.options}
            search
            placeholder={props.hint}
            onChange={onChange}
            value={value || null}
        />)
}

export default Select;