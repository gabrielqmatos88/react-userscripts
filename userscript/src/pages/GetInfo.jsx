import React, { useEffect, useState } from 'react';
import FormHeader from '../components/FormHeader';
import { getProp } from '../utils';
const $ = window.$;

const GetInfo = () => {
    const [state, setState] = useState({});
    const getInfo = (obj) => {
        console.log('getInfo', obj);
        let info;
        if (!obj) {
            info = $.xmo.getValuesTree({
                'modelName': 'Device/DeviceInfo/ModelName',
                'modelNumber': 'Device/DeviceInfo/ModelNumber',
                'serialNumber': 'Device/DeviceInfo/SerialNumber',
                'fwVersion': 'Device/DeviceInfo/SoftwareVersion',
                'extFwVersion': 'Device/DeviceInfo/ExternalFirmwareVersion',
                'intFwVersion': 'Device/DeviceInfo/InternalFirmwareVersion'
            });
        } else {
            info = {
                'modelName': getProp(obj,'Device.DeviceInfo.ModelName', ''),
                'modelNumber': getProp(obj,'Device.DeviceInfo.ModelNumber', ''),
                'serialNumber': getProp(obj,'Device.DeviceInfo.SerialNumber', ''),
                'fwVersion': getProp(obj,'Device.DeviceInfo.SoftwareVersion', ''),
                'extFwVersion': getProp(obj,'Device.DeviceInfo.ExternalFirmwareVersion', ''),
                'intFwVersion': getProp(obj,'Device.DeviceInfo.InternalFirmwareVersion', '')
            };
        }
        info.fwVersion =  info.extFwVersion + ' - (' + info.intFwVersion + ' )';
        return info;
    };

    const validateParsedFile = (result) => {
        const info = getInfo(result);
        return !!info.modelName || !!info.modelNumber || !!info.serialNumber || !!info.fwVersion;
    };

    useEffect(() => {
        const guiCore = getProp($,'gui.core', '');
        setState(guiCore);
    }, [])
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
                <GatewayInfo info={state} />
            </div>
        </>
    );
}

export default GetInfo;