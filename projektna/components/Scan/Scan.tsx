import React from 'react';
import ScanQRCode from '../ScanQRCode/ScanQRCode';
import ScanNFC from '../ScanNFC/ScanNFC';

export default function Scan() {
    return (
        <>
            <ScanQRCode />
            {/* <ScanNFC /> */}
        </>
    );
}
