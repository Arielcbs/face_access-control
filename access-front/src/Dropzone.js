import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import cloud_upload from './imgs/cloud_upload-24px.svg';

const useStyles = makeStyles(theme => ({
    Dropzone: {
        height: 200,
        width: 200,
        backgroundColor: '#fff',
        border: '2px dashed rgb(187, 186, 186)',
        borderRadius: '50%',
        display: 'flex',
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontSize: 16,
      },
      
      Icon: {
        opacity: 0.6,
        height: 64,
        width: 64,
      },

      FileInput: {
          display: 'none'
      }
  }));


export default function Dropzone(props) {
    const classes = useStyles();
    // const fileInputRef = React.createRef();

    

    const openFileDialog = (e) => {
        document.getElementById('fileInputRef').click();
      }
    
    return (
      <div name='docPic' className={classes.Dropzone} onClick={openFileDialog}>
        <img
        alt="upload"
        className={classes.Icon}
        src={props.imgSrc ? props.imgSrc : cloud_upload}
        />
        <input
        id='docPic'
        className={classes.FileInput}
        type="file"
        accept="image/*"
        multiple
        onChange={props.handleChange}
        />
        <span>Clique para inserir um arquivo </span>
      </div>
    )
}
