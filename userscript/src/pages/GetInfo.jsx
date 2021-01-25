import React from 'react';
import FormHeader from '../components/FormHeader';
import { getProp } from '../utils';
const $ = window.$;

const GetInfo = () => {
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

    const validateParsedFile = (result) => {
        const info = getInfo(result);
        return !!info.modelName || !!info.modelNumber || !!info.serialNumber || !!info.fwVersion;
    };

    const guiCore = getProp($,'gui.core', '');
    const GatewayInfo = ({title, info}) => {
        const data = getInfo(info);
        return (
            <div className='software-version-box'>
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
        return <div className='info-line'><strong>{label}:</strong><span>{ value !== '' ? value : '-' }</span></div>
    };
    return (
        <>
            <FormHeader title='Software Version'></FormHeader>
            <div>
                <GatewayInfo info={guiCore} />
            </div>
        </>
    );
}

export default GetInfo;