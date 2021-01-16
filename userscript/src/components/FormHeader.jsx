import React from 'react';

const FormHeader = ({ title , children}) => {
    return (
        <div className='d-flex d-flex-space-between'>
            <h2>{ title }</h2>
            { children }
        </div>
    );
}

export default FormHeader;