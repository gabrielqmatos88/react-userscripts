import React, { useRef, useState } from 'react';
import { FileDrop } from 'react-file-drop';
import FormHeader from '../components/FormHeader';
import './GuiCoreUpload.css'
import classnames from 'classnames';
import If from '../components/If';
import { getProp } from '../utils';
const $ = window.$;

const GuiCoreUpdate = ({ onClose }) => {
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [reading, setReading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef(null);

    const onFileInputChange = (event) => {
        setShowPreview(false);
        const { files } = event.target;
        console.log('files', files);
        // do something with your files...
    };

    const onTargetClick = () => {
        fileInputRef.current.click();
    };

    const getInfo = (obj) => {
        console.log('getInfo', obj);
        const info = {
            'modelName': getProp(obj,'Device.DeviceInfo.ModelName', ''),
            'modelNumber': getProp(obj,'Device.DeviceInfo.ModelNumber', ''),
            'serialNumber': getProp(obj,'Device.DeviceInfo.SerialNumber', ''),
            'fwVersion': getProp(obj,'Device.DeviceInfo.SoftwareVersion', ''),
            'extFwVersion': getProp(obj,'Device.DeviceInfo.ExternalFirmwareVersion', ''),
            'intFwVersion': getProp(obj,'Device.DeviceInfo.InternalFirmwareVersion', '')
        };
        return info;
    };

    const guiCore = getProp($,'gui.core', '');

    const validateParsedFile = (result) => {
        const info = getInfo(result);
        return !!info.modelName || !!info.modelNumber || !!info.serialNumber || !!info.fwVersion;
    };

    const GatewayInfo = ({title, info}) => {
        const data = getInfo(info);
        return (
            <div className='col-half'>
                <h3>{ title }</h3>
                <DisplayLabel label='Model name  ' value={ data.modelName }/>
                <DisplayLabel label='Model number' value={ data.modelNumber }/>
                <DisplayLabel label='Serial      ' value={ data.serialNumber }/>
                <DisplayLabel label='Firmware    ' value={ data.fwVersion }/>
                <DisplayLabel label='Ext Firmware' value={ data.extFwVersion }/>
                <DisplayLabel label='Int Firmware' value={ data.intFwVersion }/>
            </div>
        );
    };
    const DisplayLabel = ({ label, value }) => {
        return <p><strong>{label}:</strong> { value !== '' ? value : '-' }</p>
    };

    const parseFile = async (file) => {
        return new Promise((resolve, reject) => {
            try {
                const type = /\.(jpg|png|jpeg|bmp)$/i.test(file.name) ? 'image' : 'json';
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    setReading(false);
                    let result = reader.result;
                    if (type === 'json') {
                        try {
                            result = JSON.parse(result);
                            if (!validateParsedFile(result)){
                                throw new Error('invalid content');
                            }
                        } catch (error) {
                            reject('invalid format');
                        }
                    }
                    resolve({
                        type,
                        result: result,
                        name: file.name
                    });
                });
                reader.addEventListener('progress', (e) => {
                    if (e.loaded && e.total) {
                        const percent = (e.loaded / e.total) * 100;
                        console.log('progress','loaded:', e.loaded, 'total:', e.total ,'percent:', percent, Math.round(percent));
                        setProgress(Math.round(percent));
                    }
                });
                setProgress(0);
                if (type === 'image') {
                    reader.readAsDataURL(file);
                    setReading(true);
                } else {
                    reader.readAsText(file);
                    setReading(true);
                }
            } catch (error) {
                setReading(false);
                setProgress(0);
                reject('invalid content');
            }
        });
    };

    const checkFile = async (files) => {
        setError('');
        const filename = getProp(files, '0.name', '');
        if (!/\.(json|jpg|png|jpeg|bmp)$/i.test(filename)) {
            setError('wrong file format, it must be a json file');
        } else {
            try {
                setSelectedFile(files[0]);
                const result = await parseFile(files[0]);
                if (result.type === 'image') {
                    console.log('image', result);
                } else {
                    console.log('json', result.result);
                }
                setResult(result);
            } catch (error) {
                setError('Invalid content, it must be a json');
            }
        }
    };

    const DropFileText = ({placeHolder}) => {
        if (!!result) {
            if (result.type === 'image') {
                return (<>
                    <img src={result.result} alt='image' />
                    <p>name: { selectedFile.name }</p>
                </>);
            }
        }
        if (reading) {
            return `reading ${progress}%`;
        }
        if (error){
            return error;
        }
        return placeHolder;
    };

    const handleUpdateGuiCore = (e) => {
        try {
            $.gui.core = result.result;
            $.xmo.saveStorage();
            if (onClose) {
                onClose();
            }
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {}
    };

    return (
        <>
            <FormHeader title='File upload'></FormHeader>
            <div className={(classnames('file-wrapper', { error: error !== '' }))}>
                <FileDrop onTargetClick={onTargetClick} onDrop={(files) => {
                    checkFile(files);
                }}><DropFileText placeHolder='Drop a dm.json file here.'/></FileDrop>
            </div>
            <If condition={!!result && result.type === 'json'}>
                <div className='form'>
                    <div className='d-flex d-flex-space-between'>
                        <GatewayInfo title="Current DM" info={guiCore} />
                        <GatewayInfo title="New DM" info={result?.result} />
                    </div>
                    <div className='form-row'>
                        <button type='button' className='btn' onClick={handleUpdateGuiCore}>Update Gui Core</button>
                        <button type='button' className='btn' onClick={(e) => {
                            setShowPreview(true);
                        }}>Preview</button>
                    </div>
                </div>
                <If condition={showPreview}>
                    <div className="gui-core-result">
                        <h4>Preview</h4>
                        <pre>{ result && result.result ? JSON.stringify(result.result, null, 2) : '' }</pre>
                    </div>
                </If>
            </If>
            <input
                onChange={onFileInputChange}
                accept='.json'
                ref={fileInputRef}
                type="file"
                className="hidden"
            />
        </>
    );
}

export default GuiCoreUpdate;