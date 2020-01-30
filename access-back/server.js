const express    = require('express'),
      cors       = require('cors'),
      multer  = require('multer'),
      face    = require('./facedetection');

const app = express();
var upload = multer({ dest: 'uploads/' });



require('dotenv').config();

// const whitelist = ['http://localhost:3001'];
// const corsOptions = {
//     origin: function(origin, callback) {
//         if(whitelist.indexOf(origin) != -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// };

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors());

app.get('/', (req,res) =>{
  console.log(req.body.firstName);
  res.send('fff');
})

// app.post('/saveselfie',upload.single('selfie'), (req,res) =>{
  // var storage = firebase.storage();
  // var storageRef = storage.ref(); 
  // var selfiePath = `testimgs/${req.body.firstName}.jpg`;
  // var selfieRef = bucket.child(selfiePath);

  // const uploadSelfieTask = selfieRef.put(req.file);

  // uploadSelfieTask.on('state_changed', 
  //   snapshot => {console.log(snapshot)},
  //   error => {console.log(error)},
  //   () => { 
      
  //     uploadSelfieTask.snapshot.ref.getDownloadURL()
  //     .then(selfieUrl => {
  //       // console.log(selfieUrl);
  //       // console.log(uploadSelfieTask.snapshot.metadata.name)
  //       // setSelfieUrl(selfieUrl);
  //     })
  //   }
  // );
    // res.send('teste')
  // res.json({selfieUrl: selfieUrl})
// })

// app.post('/savedocpic',upload.single('docPic'), (req,res) =>{
//   var docPicPath = `testimgs/${req.body.firstName}-${req.body.cpf}.jpg`;
//   var docPicRef = storageRef.child(docPicPath);

//   const uploadDocPicTask = docPicRef.put(req.file);
//   uploadDocPicTask.on('state_changed', 
//     snapshot => {}, 
//     error => {console.log(error)},
//     () => { uploadDocPicTask.snapshot.ref.getDownloadURL()
//       .then(docPicUrl => {
//         console.log(docPicUrl);
        // console.log(uploadDocPicTask.snapshot.metadata.name)
        // setDocPicUrl(docPicUrl);
  //     })
  //   }
  // )
  // res.json({docPicUrl: docPicUrl})
// })

async function verifySelfie(selfieUrl, docPicUrl){
  // var result = await face.faceDetect(selfieUrl)
  // .then(
  //   (comparingFace) => {
  //     face.findSimilar(comparingFace)
  //     .then((result) => {
  //       if(result[0] && result[0].persistedFaceId){
  //         if(result[0].confidence > 0.80){
  //           console.log("Confidence of selfie match", result[0].confidence);
  //           verifyDocPic(docPicUrl)
  //         }
  //       }else{
  //         face.newFace(selfieUrl).then(() =>{
  //           verifyDocPic(docPicUrl)
  //         })
  //         console.log('New Face saved')

  //       }
  //     })
  //   }
  // )

  var comparingFace = await face.faceDetect(selfieUrl);
  var resultSelfie = await face.findSimilar(comparingFace);
  console.log(resultSelfie);
  if(resultSelfie[0] && resultSelfie[0].persistedFaceId){
    if(resultSelfie[0].confidence > 0.80){
      console.log("Confidence of selfie match is over 80%", resultSelfie[0].confidence);
      var resultDocPic = await verifyDocPic(docPicUrl);
      return {resultSelfie, resultDocPic};
      
    }else{
      console.log("Confidence of selfie match is under 80%", resultSelfie[0].confidence);
      return resultSelfie[0].confidence;
    }
  }else{
    face.newFace(selfieUrl).then(async (x) =>{
      console.log('new face result',x);
      var resultDocPic = await verifyDocPic(docPicUrl);
      return resultDocPic;
    })
    console.log('New Face saved')
  }
}

async function verifyDocPic(docPicUrl){
  // face.faceDetect(docPicUrl)
  // .then(
  //   (comparingFace) => {
  //     face.findSimilar(comparingFace)
  //     .then((result) => {
  //       if(result[0] && result[0].persistedFaceId){
  //         if(result[0].confidence > 0.80){
  //           console.log("Confidence of Doc Pic match", result[0].confidence);
  //         }
  //       }else{
  //             console.log("pics don't match");
  //       }
  //     })
  //   }
  // )

  var comparingFace = await face.faceDetect(docPicUrl);
  var resultDocPic = await face.findSimilar(comparingFace)
  if(resultDocPic[0] && resultDocPic[0].persistedFaceId){
    if(resultDocPic[0].confidence > 0.80){
      console.log("Confidence of Doc Pic match is over 80%", resultDocPic[0].confidence);
      return resultDocPic;
    }else{
      console.log("Confidence of Doc Pic match is under 80%", resultDocPic[0].confidence);
      return resultDocPic;
    }
  }else{
        console.log("pics don't match");
        return 0;
  }
}

async function verifyFaces(selfieUrl, docPicUrl){
  var faceId1 = await face.faceDetect(selfieUrl);
  var faceId2 = await face.faceDetect(docPicUrl);
  var result = await face.faceVerify(faceId1, faceId2);
  return result;
}


app.post('/verifyfaces', (req,res) => {
  var selfieUrl = req.body.selfieUrl;
  var docPicUrl = req.body.docPicUrl;
  console.log(selfieUrl)
  console.log(docPicUrl)
  async function check() {
    var X = await verifySelfie(selfieUrl, docPicUrl);
    console.log('result in verify faces',X);
    // var result = await verifyFaces(selfieUrl, docPicUrl);
    // console.log(result)
    // res.json(result)
  }
  check();
})


app.listen(3000, () => {
  console.log('App listening to port 3000');
});