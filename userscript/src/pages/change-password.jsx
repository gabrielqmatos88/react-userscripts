import React, { useState, useEffect, useRef } from 'react';
import FormHeader from '../components/FormHeader';
import './change-password.css';
import classNames from 'classnames';
import md5 from '../helpers/md5';
import { sha512 } from 'js-sha512';
import If from '../components/If';


const ChangePassword = ({ onClose }) => {
    const availableEncryptions = [
        {
            name: 'md5',
            fn: (val) => {
                return md5(val);
            }
        },
        {
            name: 'sha-512',
            fn: (val) => {
                return sha512(val);
            }
        }
    ];
    const [encryption, setEncryption] = useState(availableEncryptions[0]);
    const [state, setState] = useState({
        login: 'admin',
        password: 'admin',
        encPwd: ''
    });
    const hiddeInput = useRef(null);
    const handleInputChange = (e) => {
        const  { name, value } = e.target;
        setState({ ...state, [name] : value});
    };
    useEffect(() => {
        setState({ ...state, encPwd: encryption.fn(state.password) });
    },[state.password, encryption]);

    const formattedCommand = (user, pw) => {
        return `xmo-client -p "Device/UserAccounts/Users/User[Login='${user}']" -s "${pw}"`;
    };
    const EncPassword = ({ user, pw }) => {
        return (
            <div className='enc-result'>
                { formattedCommand(user, pw) }
            </div>
        );
    };
    return (
        <>
        {/* active: avEnc.name === encryption.name */}
            <FormHeader title='Change password'>
                <div className='d-flex d-flex-center-v encrypt-menu'>
                    { availableEncryptions.map(avEnc => (<a
                        key={avEnc.name}
                        className={ classNames({ active: avEnc.name === encryption.name })}
                        onClick={(e) => { setEncryption(avEnc); }}
                        >{ avEnc.name }</a>))
                    }
                </div>
            </FormHeader>
            <form className='form' onSubmit={(e) => {
                e.preventDefault();
            }}>
                <div className="form-row">
                    {/* <label for="login">Login</label> */}
                    <input type="text" name='login' id="login" placeholder='Login' onChange={handleInputChange} value={state.login} />
                </div>
                <div className="form-row">
                    {/* <label for="pwd">Password</label> */}
                    <input type="text" name='password' id='pwd' placeholder='Password' onChange={handleInputChange} value={state.password }/>
                </div>
                <If condition={!!state.encPwd}>
                    <EncPassword user={state.login} pw={state.encPwd} />
                </If>
                <div className="form-row d-flex-space-between">
                    <button className='btn' type="submit" onClick={() => {
                        hiddeInput.current.select();
                        document.execCommand('copy');
                        console.log('copied', formattedCommand(state.login, state.encPwd));
                    }}>Copy</button>
                    <button className='btn' type="button" onClick={() => {
                        if (onClose) {
                            onClose();
                        } else {
                            console.log('onClose trigered');
                        }
                    }}>Close</button>
                </div>
                <input type='text' className='hidden-copy-input' readOnly={true} ref={hiddeInput}  value={formattedCommand(state.login, state.encPwd)} />
            </form>
        </>
    );
}

export default ChangePassword;