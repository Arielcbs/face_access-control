const request = require('request-promise');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = 'xx';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

// const imageUrl =
    //donald trump find similar try
    //'https://static.politico.com/dims4/default/dbb2ed4/2147483647/resize/1160x%3E/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2Fcb%2F18%2F62fb9a8b46339ba7117e6d336ce0%2F190925-donald-trump-gty-773.jpg';
    //courtney cox find similar try
    //'http://www.gstatic.com/tv/thumb/persons/13912/13912_v9_ba.jpg';
    //jennifer aniston find similar try
    // 'https://peopledotcom.files.wordpress.com/2019/10/jennifer-aniston-8.jpg';
    //jennifer aniston db entry
    //'https://www.gannett-cdn.com/presto/2019/02/08/USAT/fc2a9feb-a841-4161-8bf2-aac151fea596-VPCLIFE_JENNIFER_ANISTON_THUMB.jpg';
    // donald trump db entry
    // 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg';

//FACE THAT WILL BE COMPARED TO DB
// var comparingFace;

// Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'recognitionModel': 'recognition_02'
    // 'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
    //     'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

//FACE DETECT
export async function faceDetect(imageUrl){
  var bodyContent = `{"url": "${imageUrl}"}`;
  const options = {
    method: 'POST',
    uri: uriBase,
    qs: params,
    body: bodyContent,
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
  };
  
  var comparingFace = await request(options).then((body) => {
    let jsonResponse = JSON.parse(body);
    // console.log(jsonResponse[0].faceId);
    return jsonResponse[0].faceId;
  }).catch( err => {
    console.log('Error: ', err);
    return err;
  });
  return comparingFace;
}


// FACE LIST CREATE

// const newFaceList = {
//   uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/facelists/testfacelist',
//   headers: {
//     'Content-Type': 'application/json',
//     'Ocp-Apim-Subscription-Key' : subscriptionKey
//   },
//   body: '{"name": "sample_list","userData": "User-provided data attached to the face list.","recognitionModel": "recognition_02"}'
// }

// request.put(newFaceList, (error, res, body) =>{
//     if(error){
//       console.log('Error:' + error);
//     }
//     console.log(body);
// })



// FACE LIST ADD FACE
export function newFace(imageUrl){

  const newFace = {
    uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/facelists/testfacelist/persistedFaces?detectionModel=detection_02',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
    },
    body: '{"url": " '+ imageUrl + '"}'
  }
  
  request.post(newFace, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    console.log('JSON Response\n');
    console.log(jsonResponse);
    return(jsonResponse);
  });
}

 // FACE FIND SIMILAR
export async function findSimilar(comparingFace){
  const findSimilar = {
    method: 'POST',
    uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/findsimilars',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
    },
    body: '{"faceId": "'+ comparingFace +'","faceListId": "testfacelist","mode": "matchPerson"}'
  }

  var foundSimilar = await request(findSimilar).then((body) => {
    // console.log(findSimilar.body);
    // let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    let jsonResponse = JSON.parse(body);
    // console.log('JSON Response\n');
    // console.log(jsonResponse);
    console.log(jsonResponse);
    return jsonResponse;
  }).catch(err => {
    console.log('Error: ', err);
    return err
  });

  return foundSimilar;
}
  