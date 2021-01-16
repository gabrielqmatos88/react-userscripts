import React from 'react';

const If = ({ children, condition}) => {
    return (
        <>
            { condition !== null && condition !== undefined && condition !== '' && condition !== false ? children : null }
        </>
    );
}

export default If;