import React from 'react';
import FormHeader from '../components/FormHeader';

const ChangePassword = ({ onClose }) => {
    return (
        <>
            <FormHeader title='Change password'>
                <div className='d-flex d-flex-center-v'>
                    <a href='#'>md5</a>
                    <a href='#'>sha-512</a>
                </div>
            </FormHeader>
            <form className='form' onSubmit={(e) => {
                e.preventDefault();
            }}>
                <div className="form-row">
                    {/* <label for="login">Login</label> */}
                    <input type="text" name='login' id="login" placeholder='Login' />
                </div>
                <div className="form-row">
                    {/* <label for="pwd">Password</label> */}
                    <input type="text" name='password' id='pwd' placeholder='Password' />
                </div>
                <div className="form-row d-flex-space-between">
                    <button className='btn' type="submit">Change</button>
                    <button className='btn' type="button" onClick={() => {
                        if (onClose) {
                            onClose();
                        } else {
                            console.log('onClose trigered');
                        }
                    }}>Close</button>
                </div>
            </form>
        </>
    );
}

export default ChangePassword;