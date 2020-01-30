import React, {useState, useEffect, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container,TextField, Button, FormControl} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import WarningIcon from '@material-ui/icons/Warning';
import SendIcon from '@material-ui/icons/Send';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import rgImg from './imgs/card.svg';
import profImg from './imgs/user.svg';
import verifiedGif from './imgs/verified.gif';
import verifyingGif from './imgs/verifying.gif'
import loadImage from 'blueimp-load-image';
import 'blueimp-canvas-to-blob';
// import {faceDetect, newFace, findSimilar } from '../../access-back/facedetection';
// import {storage} from '../../access-back/firebase/index';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
// import fs from 'fs';
// import Jimp from 'jimp';
// import './verified.css';
const cpf = require('cpf');


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "Insert API key here",
  authDomain: "access-9b291.firebaseapp.com",
  databaseURL: "https://access-9b291.firebaseio.com",
  projectId: "access-9b291",
  storageBucket: "access-9b291.appspot.com",
  messagingSenderId: "XX",
  appId: "XX",
  measurementId: "XX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously().catch( error =>{
  console.log(error.code, error.message);
})
//MAKE CREDENTIALS IN JSON OR COOKIE OR SMTH
var storage = firebase.app().storage("access-9b291.appspot.com");
var storageRef = storage.ref();

firebase.auth().onAuthStateChanged( user =>{
  if(user){
    // var isAnonymous = user.isAnonymous;
    // var uid = user.uid;
    // console.log(`User ${isAnonymous}, with ID: ${uid}`);
  }else{
    console.log('User not signed in');
  }
})

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  headline: {
    fontSize: '2rem',
    margin: '1rem'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 250,
  },
  border:{
    // border: '1px dashed rgb(187, 186, 186)',
    width: 230,
    height: 100,
    padding: '0.5rem',
    margin: 'auto'
  },
  upload: {
    // width: 230,
    // backgroundColor: '#fff',
    // borderRadius: '50%',
    display: 'flex',
    margin: 'auto',
    marginTop: '0.5rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontSize: 16,
  },
  Icon: {
    opacity: 0.6,
    height: 64,
    width: 64,
  },
  FileInput: {
    display: 'none'
  },
  button: {
    backgroundColor: 'Navy',
    margin: 'auto',
    marginBottom: '2rem',
    width: '8rem',
    fontSize: '1.2rem'
  },
}));

const initState = {
  firstName: "",
  lastName: "",
  cpf: "",
  host: "Dunha",
  visitDate: new Date(),
  selfie: null,
  selfieBlob: "",
  docPic: null,
  docPicBlob: ""
}

export default function VisitRegister() {
  const classes = useStyles();
  const [ values, setValues ] = useState(initState);
  const [docPicUrl, setDocPicUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [errors, setErrors] = useState({cpf: false});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resizeSelfieTrigger, setResizeSelfieTrigger] = useState(false);
  const [resizeDocPicTrigger, setResizeDocPicTrigger] = useState(false);
  const [resizedSelfie, setResizedSelfie] = useState();
  const [resizedDocPic, setResizedDocPic] = useState();
  const [resizedSelfieBlob, setResizedSelfieBlob] = useState();
  const [resizedDocPicBlob, setResizedDocPicBlob] = useState();
  // const [selfieBase64, setSelfieBase64] = useState();
  // const [docPicBase64, setDocPicBase64] = useState();

  const openFileDialogSelfie = (e) => {
    document.getElementById('selfie').click();
  };

  const openFileDialogDocPic = (e) => {
    document.getElementById('docPic').click();
  };

  // function getBase64(file, callback) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = callback;
  //   reader.onerror = function (error) {
  //     console.log('Error: ', error);
  //   };
  // }

  // async function resizeImage(){
  //   const width = 800;
  //   const reader = new FileReader();
  //   var fileName = "";
  //   if(resizeSelfieTrigger){
  //     fileName = values.selfie.name;
  //     reader.readAsDataURL(values.selfie);
  //   }else if(resizeDocPicTrigger){
  //     fileName = values.docPic.name;
  //     reader.readAsDataURL(values.docPic);
  //   }
  //   reader.onload = event => {
  //     const img = new Image();
  //     img.src = event.target.result;
  //     img.onload = () => {
  //       const elem = document.createElement('canvas')
  //       const scaleFactor = width / img.width;
  //       elem.width = width;
  //       elem.height = img.height * scaleFactor;
  //       const ctx = elem.getContext('2d');
  //       // img.width and img.height will contain the original dimensions
  //       ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
  //       ctx.canvas.toBlob((blob) => {
  //           const file = new File([blob], fileName, {
  //               type: 'image/jpeg',
  //               lastModified: Date.now()
  //           });
  //           if(resizeSelfieTrigger){
  //             setResizedSelfie(file);
  //             setResizeSelfieTrigger(false);
              
  //           }else if(resizeDocPicTrigger){
  //             setResizedDocPic(file);
  //             setResizeDocPicTrigger(false);
  //           }
  //       }, 'image/jpeg', 1);
  //     }
  //     reader.onerror = error => console.log(error);
  //   };
  // }

  const saveResized = useCallback(
    (blob, file) => {
      if(resizeSelfieTrigger){
        var resSelfBlob = URL.createObjectURL(blob)
        // console.log(resSelfBlob);
        setResizedSelfieBlob(resSelfBlob);
        setResizedSelfie(file);
        setResizeSelfieTrigger(false);
      }else if(resizeDocPicTrigger){
        var resDocBlob = URL.createObjectURL(blob)
        // console.log(resDocBlob);
        setResizedDocPicBlob(resDocBlob);
        setResizedDocPic(file);
        setResizeDocPicTrigger(false);
      }
      return;
    },
    [resizeDocPicTrigger, resizeSelfieTrigger],
  )
  
   const rotateImg = useCallback(
    () => {
      // CHECK EVERY ORIENTATION POSSIBLE
      // TRY PUTTING EVERYTHING INSIDE READER.ONLOAD
      // ....................................................................................
      var reader = new FileReader();
      var fileName;
      if(resizeSelfieTrigger){
         fileName = values.selfie.name;
        reader.readAsDataURL(values.selfie);
      }else if(resizeDocPicTrigger){
        fileName = values.docPic.name;
        reader.readAsDataURL(values.docPic);
      }
      var image = new Image()
      reader.onload = event =>{
        var width = 800;
        var orientation;
        image.src = event.target.result;
        // console.log('image source',image.src)
        loadImage((resizeSelfieTrigger? values.selfie : values.docPic), (cv,data) =>{
          const elem = document.createElement('canvas');
          // console.log(data.exif)
          if(data.exif){
            // console.log(data.exif.get('Orientation'));
            orientation = data.exif.get('Orientation');
          }else{
            orientation = 1;
          }
          if(!orientation || orientation > 8) {
            orientation = 1;
          }
          const scaleFactor = width / image.width;
          var height = image.height * scaleFactor;
          if (orientation > 4) {
            // elem.width = height
            // elem.height = width
            elem.width = image.height * scaleFactor;
            elem.height = width;
          }else{
            // elem.width = width
            // elem.height = height
            elem.width = width;
            elem.height = image.height * scaleFactor;
          }
          console.log('Orientation:',orientation)
          var ctx = elem.getContext('2d');
          switch(orientation){
            case 1:
              // console.log(width)
              // console.log('orientation 1',image.height, scaleFactor)
              ctx.drawImage(image, 0, 0, width, image.height * scaleFactor);
              ctx.canvas.toBlob( blob =>{
                // console.log(blob);  
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                // console.log(file)
                saveResized(blob, file);
              })
            break
    
            case 2:
              //horizontal flip
              ctx.translate(width, 0)
              ctx.scale(-1,1)
              ctx.drawImage(image, 0, 0, width, image.height * scaleFactor);
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now() 
                })
                saveResized(blob, file);
              })  
            break
    
            case 3:
              //180° rotate left
              ctx.translate(width, height)
              ctx.rotate(Math.PI)
              ctx.drawImage(image, 0, 0, width, image.height * scaleFactor);
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                saveResized(blob, file);
              })
            break
    
            case 4:
              //vertical flip
              ctx.translate(0, height)
              ctx.scale(1,-1)
              ctx.drawImage(image, 0, 0, width, image.height * scaleFactor);
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                saveResized(blob, file);
              })
            break
    
            case 5:
              //vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI)
              ctx.scale(1,-1)
              ctx.drawImage(image, 0, 0, width, (image.height * scaleFactor) );
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                saveResized(blob, file);
              })
            break
    
            case 6:
              //90° rotate right
              ctx.rotate(0.5 * Math.PI)
              ctx.translate(0, -height)
              ctx.drawImage(image, 0, 0, width, (image.height * scaleFactor) );
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                saveResized(blob, file);
              })
            break
    
            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI)
              ctx.translate(width, -height)
              ctx.scale(-1, 1)
              ctx.drawImage(image, 0, 0, width, (image.height * scaleFactor) );
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                saveResized(blob, file);
              })
            break
    
            case 8:
              // 90° rotate left
              console.log(width)
              console.log('orientation 8',image.height, scaleFactor)
              ctx.rotate(-0.5 * Math.PI)
              ctx.translate(-width, 0)
              ctx.drawImage(image, 0, 0, width,(image.height * scaleFactor) );
              ctx.canvas.toBlob( blob =>{
                const file = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                saveResized(blob, file);
              })
            break
  
            default:
            console.log("entered default case")
            break
          }
            
        }, {meta: true, orientation: 1});
      }
      },
     [values.docPic, values.selfie, saveResized, resizeSelfieTrigger, resizeDocPicTrigger],
   )

  function handleChange(event, date){
    if(date){
      setValues({
        ...values,
        visitDate: event
      });
    }
    else if(event.target.files){
      var file = URL.createObjectURL(event.target.files[0]);
      if(event.target.id === 'selfie'){
        setSelfieUrl("");
        setResizeSelfieTrigger(true);
        // getBase64(event.target.files[0], (e) =>{
        //   setSelfieBase64(e.target.result.replace(/^data:image.+;base64,/, ''));
        // });
        setValues({
          ...values,
          [event.target.id]: event.target.files[0],
          selfieBlob: file
        })
      }else if(event.target.id === 'docPic'){
        setDocPicUrl("");
        setResizeDocPicTrigger(true);
        // getBase64(event.target.files[0], (e) =>{
        //   setDocPicBase64(e.target.result.replace(/^data:image.+;base64,/, ''));
        // });
        setValues({
          ...values,
          [event.target.id]: event.target.files[0],
          docPicBlob: file
        })
      }else{
        console.log("Something trying to upload", event);
      }
    }else{
      setValues({
        ...values,
        [event.target.id]: event.target.value
      })
    }
  }

  function handleBlur(event){
    if(event.target.id === 'visitDate'){
      window.scrollBy(0, document.body.scrollHeight);
    }else if(event.target.id === 'cpf'){
      if(cpf.isValid(event.target.value, true)){
        const formattedCpf = cpf.format(event.target.value);
        //SEARCH FOR CPF IN DB, IF EXISTS POPULATE STATE
        //{CODE HERE}
        //ELSE CONTINUE
        setValues({
          ...values,
          [event.target.id]: formattedCpf
        })
        setErrors({
          ...errors,
          'cpf': false
        })
      } else{
        setErrors({
          ...errors,
          'cpf': true
        })
      }
    }
  }

  async function fetchUrls(){
    var selfiePath = `testimgs/${values.firstName}.jpg`;
    var selfieRef = storageRef.child(selfiePath);
    var docPicPath = `testimgs/${values.firstName}-${values.cpf}.jpg`;
    var docPicRef = storageRef.child(docPicPath);
    // var Urls = [];
    const uploadSelfieTask = selfieRef.put(resizedSelfie);
    var waitForSelfie = await uploadSelfieTask.on('state_changed', 
      snapshot => {},
      error => {console.log(error)},
       () => { uploadSelfieTask.snapshot.ref.getDownloadURL()
        .then(selfieUrl => {
          console.log(selfieUrl);
          setSelfieUrl(selfieUrl);
        }).catch( err =>{ console.log(err)})
      }
    );
  
    const uploadDocPicTask = docPicRef.put(resizedDocPic);
    var waitForDocPic = await uploadDocPicTask.on('state_changed', 
      snapshot => {}, 
      error => {console.log(error)},
      () => { uploadDocPicTask.snapshot.ref.getDownloadURL()
        .then(docPicUrl => {
          console.log(docPicUrl);
          // console.log(uploadDocPicTask.snapshot.metadata.name)
          setDocPicUrl(docPicUrl);
        })
      }
    )

    return {waitForSelfie, waitForDocPic};
  }

  async function sendToVerify(){
    // if(values.cpf === "" || errors.cpf === true){
    //   alert("Insira o CPF corretamente")
    // }else if(values.firstName === "" && values.lastName === ""){
    //   alert("Insira o Nome e sobrenome corretamente")
    // }else if(values.docPic && values.selfie){
      setIsVerifying(true);
    if(selfieUrl === '' || docPicUrl === ''){
      fetchUrls()
    }else{
      console.log('Pics already have links')
    }
    
    
      //TEST TRYING TO SEND TO BACKEND VIA FORM DATA
      // var imgFormData = new FormData();
      // imgFormData.append('firstName', values.firstName);
      // imgFormData.append('cpf', values.cpf);
      // imgFormData.append('selfie', values.selfie, `${values.firstName}.jpg`);
      // // imgFormData.append('docPic', values.docPic);
      // // console.log(imgFormData)
      // axios({
      //   method: 'POST',
      //   url: 'http://localhost:3000/saveselfie',
      //   data: imgFormData,
      //   config: { headers: {'Content-Type': 'multipart/form-data'}}
      // }).then( (res) =>{
      //   console.log(res.data);
      // })

      // await axios.post('http://localhost:3000/saveselfie', {
      //     firstName: values.firstName, 
      //     cpf: values.cpf, 
      //     selfie: values.selfie,
      //     docPic: values.docPic
      // }, {headers: { 'Content-Type' : 'multipart/form-data'}})
      // .then( (res) =>{
      //   console.log(res.data);
      // })
  }
  

  
  const verifyFaces = useCallback(
    async () => {
      var faces = {
        'selfieUrl': selfieUrl,
        'docPicUrl': docPicUrl
      }
      console.log(faces);
      var response = await axios({
        method: 'POST',
        url: 'http://192.168.33.102:3000/verifyfaces',
        data: faces
      }).then( (res) =>{
        console.log(res.data);
        return res.data
      })
      console.log(response);
      return response;
    },
    [selfieUrl, docPicUrl],
  )

  useEffect(() => {
    if(isVerifying && selfieUrl && docPicUrl){
        verifyFaces().then((verification) =>{
          setIsVerifying(false);
          console.log(verification)
          if(verification.isIdentical){
            setVerified(true);
          }
      })
    }
    if(resizeSelfieTrigger || resizeDocPicTrigger){
      rotateImg()
    }
  }, [rotateImg, verifyFaces, isVerifying, selfieUrl, docPicUrl, resizedSelfieBlob, resizedDocPicBlob, resizeSelfieTrigger, resizeDocPicTrigger])
 
  return (
    <Container maxWidth='md'>
    
    {verified ? <div><div>Face verificada e cadastro conclúido</div><img src={verifiedGif} alt='Verificado!'/></div> : 
    <div>
      <FormControl>
      <div className={classes.headline}>Registro de Visitantes</div>
        <div>
          <TextField
            id="host"
            label="Pessoa visitada"
            disabled
            // error={errors.cpf ? true : false}
            className={classes.textField}
            value={values.host}
            onChange={handleChange}
            // onBlur={handleBlur}
            margin="normal"
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<WarningIcon />}
            onClick={() => alert("Por favor, peça para que a pessoa que você irá visitar te envie um convite")}
          >
          Não irei visitar esta pessoa
          </Button>
        </div>
        <div>
        <TextField
          id="cpf"
          label="CPF"
          error={errors.cpf ? true : false}
          className={classes.textField}
          value={values.cpf}
          onChange={handleChange}
          onBlur={handleBlur}
          margin="normal"
        />
        </div>
        <div>
        <TextField
          id="firstName"
          label="Primeiro Nome"
          className={classes.textField}
          value={values.firstName}
          onChange={handleChange}
          margin="normal"
        />
        </div>
        <div>
        <TextField
          id="lastName"
          label="Sobrenome"
          className={classes.textField}
          value={values.lastName}
          onChange={handleChange}
          margin="normal"
        />
        </div>
        <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          className={classes.textField}
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="visitDate"
          label="Data da visita"
          value={values.visitDate}
          onChange={handleChange}
          onBlur={handleBlur}
          KeyboardButtonProps={{
              'aria-label': 'change date',
          }}
          />
        </MuiPickersUtilsProvider>
        </div>
        {isVerifying ? <img src={verifyingGif} alt='Verificando...'/> : 
        <div>
          {/* PUT VERIFIED IN HERE */}
        <div className={classes.border}>
          <div>Foto do rosto</div>
          <div name='selfie' className={classes.upload}>
            <img
              id='selfieBlob'
              alt="selfie"
              className={classes.Icon}
              src={values.selfie ? resizedSelfieBlob : profImg}
            />
            <input
              id='selfie'
              className={classes.FileInput}
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={openFileDialogSelfie}
            >
              Tirar foto
            </Button>
          </div>
        </div>
        <div className={classes.border}>
          <div>Foto do Documento</div>
          <div name='docPic' className={classes.upload}>
            <img
              id='docPicBlob'
              alt="documento"
              className={classes.Icon}
              src={values.docPic ? resizedDocPicBlob : rgImg}
            />
            <input
              id='docPic'
              className={classes.FileInput}
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={openFileDialogDocPic}
            >
              Tirar foto
            </Button>
          </div>
        </div>
        </div>
        }
        {/* <TakeSnapshot /> */}
        {/* Trying to make a verified CSS */}
        {/* <div className={isVerifying ? 'FileInput': ''}>
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        </div> */}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SendIcon />}
          onClick={sendToVerify}
        >
          Enviar
        </Button>
        {/* <img id='teste' src={resizedSelfieBlob ? resizedSelfieBlob : profImg} alt='teste'/> */}
        {/* <div>{selfieBase64} and {docPicBase64}</div> */}
      </FormControl>
    </div>
   }
    </Container>
  )
}
