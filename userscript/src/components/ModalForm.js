import React from 'react';

const ModalForm = ({ children, outSideClick }) => {
    return (
        <div className="u-backdrop open" id='global-modal' onClick={outSideClick}>
          <div className="u-modal" onClick={(e) => { e.stopPropagation(); } }>
            { children }
          </div>
        </div>
    );
}

export default ModalForm;