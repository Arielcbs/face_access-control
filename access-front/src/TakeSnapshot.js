import React from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const onTakePhoto = (dataUri) => {
    // Do stuff with the dataUri photo...
    console.log('takePhoto');
}

export default function TakeSnapshot(props) {
    return (
        <div>
            <Camera isFullscreen={true} isImageMirror = {false} idealFacingMode = {FACING_MODES.ENVIRONMENT} onTakePhoto = { (dataUri) => {onTakePhoto(dataUri)} }/>
        </div>
    )
}
