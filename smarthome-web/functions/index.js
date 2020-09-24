'use strict';

const functions = require('firebase-functions');
const {smarthome} = require('actions-on-google');
const {google} = require('googleapis');
const util = require('util');
const admin = require('firebase-admin');
const firebase = require('firebase');

const jwt = require('jsonwebtoken');

const dados_api = require('./dados_api.json');
const secret_key = require('./secret_key.json');

const jwt_secret = secret_key.token.ACCESS_TOKEN; 

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: secret_key.firebaseConfig.databaseURL
});

firebase.initializeApp(secret_key.firebaseConfig);

const firebaseRef = admin.database().ref('/');
// Initialize Homegraph
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/homegraph'],
});
const homegraph = google.homegraph({
  version: 'v1',
  auth: auth,
});

// Request UI user login and get information from user
exports.login = functions.https.onRequest(async(request, response) => {
  if (request.method === 'GET') {
    functions.logger.log('Requesting login page');
  return response.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome to Sparky Home</title>
  
    </head>
    <style>
    body{
      margin: 0;
      background: #fafafa;
      }
      body,h1,h2,p,a,input{
      color: #555;
      font-family: Consolas, Arial;
      text-decoration: none;
      }
      /* modal styles */
      .modal{
      width: 300px;
      padding: 30px;
      margin: 100px auto;
      border-radius: 10px;
      background: white;
      box-shadow: 0px 0px 8px rgba(0,0,0,0.1);
      text-align: center;
      }
      
      /* form element styles */
      input{
      display: block;
      margin: 8px 0;
      padding: 8px 2px;
      border-width: 0 0 2px 0;
      width: 100%;
      }
      button{
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      background: #ee8905;
      border: 0;
      color: white;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      }
      
      /* auth styles */
      .auth{
      width: 100%;
      height: 100%;
      position: fixed;
      background: #fafafa;
      display: none;
      z-index: 1;
      }
      .auth.open{
      display: block;
      }
      .auth a{
      text-decoration: underline;
      cursor: pointer;
      }
      .auth .modal{
      display: none;
      }
      .auth .modal.active, .content.active{
      display: block;
      }
    </style>
    <body>  
      
      <!-- auth modals -->
      <div class="auth open">
        <div class="modal active">
          <h2>Login</h2>
          <form class="login" action="/login" method="post" >
            <input type="hidden" 
              name="responseurl" value="${request.query.responseurl}" />
            <input type="hidden" id="code"
              name="code" value="" />
              <input type="hidden" id="useruid"
                name="useruid" value="" />
            <input type="text" name="email" placeholder="Email">
            <input type="password" name="password" placeholder="Password">
            <button>Login</button>
            <p class="error"></p>
          </form>
          <!-- <div>Sem conta? <a class="switch">Registre agora.</a></div> -->
        </div>
      </div>

      <script> 
        const loginForm = document.querySelector('.login');
        loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          // get user info
          const email = loginForm['email'].value;
          const password = loginForm['password'].value;

          loginForm.submit();
          return true;
        });

      </script>

    </body>
  </html>
  `);
  } else if (request.method === 'POST') {
    
    functions.logger.log('post login');
    const responseurl = decodeURIComponent(request.body.responseurl);

    const idToken = await firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
    .then(({user}) => {
        try {
          const idToken = user.getIdToken();
          return idToken;
        }catch (error) {
          functions.logger.log('Error token:', error);
          return false;
        }
    }).catch( (error) =>{
      functions.logger.log('Error login:', error);
      return false;
    });

    if (idToken)
      response.redirect(`${responseurl}&code=${idToken}`);
    else
      response.send(400, 'Error login');
 
  }else {
    // Unsupported method
    response.send(405, 'Method Not Allowed');
  }

  return response.send();
});

/*
 * Request authorization endpoint
 */
exports.auth = functions.https.onRequest((request, response) => {
  const { redirect_uri, client_id, state, response_type } = request.query;
 
  // verificações de parametros
  if( dados_api.web.redirect_uris[0] !== redirect_uri )
    return response.send(`Url it's wrong.`);

  if( dados_api.web.client_id !== client_id )
    return response.send(`Client id it's diferent.`);

    if( response_type !== "code")
      return response.send(`Response type it's diferent.`);

  const responseurl = util.format('%s?state=%s',
    redirect_uri, state);

  return response.redirect(
      `/login?responseurl=${encodeURIComponent(responseurl)}`);
});

/**
 * Handler to exchange authorization code for refresh token
 */
async function handleAuthorizationCode(request, response) {
  console.log("Authorization Code Grant Received");

  try {
    const code = request.query.code ? request.query.code : request.body.code;
    // Auth code is a Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(code);
    request.user = decodedToken;
    // Verify UID exists in our database
   // const result = await admin.auth().getUser(decodedToken.uid);
    // Encode the user info as a JWT
    const refresh = jwt.sign({
      sub: request.user.uid
    }, jwt_secret);
    // Generate an initial access token
    const access = await getAccessToken(refresh, jwt_secret);
    // Register this refresh token for the given user
    //const userRef = firestore.doc(`users/${result.uid}`);
   // await userRef.set({ 'refresh_token': refresh });
    // Respond with the credentials
    const credentials = {
      token_type: "Bearer",
      access_token: access,
      refresh_token: refresh,
      expires_in: 3600
    };
    console.log('Issued refresh token', credentials);
    response.status(200).send(credentials);
  } catch (error) {
    console.error('Unable to issue refresh token', error);
    response.status(400).send({ "error": "invalid_grant" });
  }
}

/**
 * Handler to obtain access token from a refresh token
 */
async function handleRefreshToken(request, response) {
  console.log("Refresh Token Grant Received");

  try {
    const refreshToken = request.query.refresh_token ? request.query.refresh_token : request.body.refresh_token;
    // Validate token parameters
    const decodedToken = jwt.verify(refreshToken, jwt_secret);
    // if (decodedToken.aud !== functions.config().smarthome.id) throw new Error(`Unexpected client_id in token: ${decodedToken.aud}`);
    // // Verify UID exists in our database
    // const result = await auth.getUser(decodedToken.sub);
    // const userRef = firestore.doc(`users/${result.uid}`);
    // const user = await userRef.get();
    // // Verify incoming token matches our stored refresh token
    // const validToken = user.data().refresh_token;
    // if (validToken !== refreshToken) throw new Error(`Invalid refresh token received: ${refreshToken}`);

    // Obtain a new access token
    const token = await getAccessToken(refreshToken, jwt_secret);
    // Respond with the credentials
    const credentials = {
      token_type: "Bearer",
      access_token: token,
      expires_in: 3600
    };
    console.log('Issued access token', credentials);
    response.status(200).send(credentials);
  } catch (error) {
    console.error('Unable to issue access token', error);
    response.status(400).send({ "error": "invalid_grant" });
  }
}

/**
 * Exchange refresh token for access token
 */
async function getAccessToken(refreshToken, secret) {
  console.log("Obtaining access token");
  // Validate incoming token
  const decoded = jwt.verify(refreshToken, secret);
  // Re-encode with an expiration time
  return jwt.sign({
    sub: decoded.sub
  }, secret, {
      expiresIn: '1h'
    });
}

/*
 * Request token endpoint
 */
exports.token = functions.https.onRequest(async(request, response) => {
  
  functions.logger.log('Check if request is authorized with Firebase ID token');

  if (request.body.client_id !== dados_api.web.client_id
  || request.body.client_secret !== dados_api.web.client_secret) {
    response.status(400).send({ "error": "invalid_grant" });
    return;
  }
  
  if (request.body.grant_type === 'authorization_code') {
    handleAuthorizationCode(request, response);
  } else if (request.body.grant_type === 'refresh_token') {
    handleRefreshToken(request, response);
  } else {
    //Invalid request
    console.error(`Invalid request type: ${request.body.grant_type}`);
    response.status(400).send({ "error": "invalid_grant" });
  }

});

const app = smarthome();

/**
 * Handler to sync devices from user logged
 */
app.onSync( async(body, headers) => {
  functions.logger.info(`onSync`);
  const userId = validateCredentials(headers);
  let deviceList = [];

  const path = 'users/'+userId+'/devices';
  await firebaseRef.child(path).once('value', (user) =>{
    user.forEach( (snapshot) => {
      const { name, type} = snapshot.val();

      let trait = [];
      switch(type){
        case 'action.devices.types.LIGHT':
          trait = [
            'action.devices.traits.OnOff',
            'action.devices.traits.Brightness',
          ];
        break;
        case 'action.devices.types.SWITCH':
          trait = [
            'action.devices.traits.OnOff',
          ];
          break;
      }
      
      let item = {
        id: path+"/"+snapshot.key,
        type: type,
        traits: trait,
        name: {
          name: name,
        },
        willReportState: true
      };
      
      deviceList.push(item);
    });
  });

  return {
    requestId: body.requestId,
    payload: {
      agentUserId: userId,
      devices: deviceList
    },
  };

});

// Handle verify and validade credential from user logged 
function validateCredentials(headers) {
  if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    throw new Error('Request missing valid authorization');
  }

  const token = headers.authorization.split('Bearer ')[1];
  const decoded = jwt.verify(token, jwt_secret);

  return decoded.sub;
}

// Handle get data from database
const queryFirebase = async (deviceId) => {
  const snapshot = await firebaseRef.child(deviceId).once('value');
  const snapshotVal = snapshot.val();

  let data = {};
  switch(snapshotVal.type){
    case 'action.devices.types.LIGHT':
      data = {
        on: snapshotVal.traits.OnOff.on,
        brightness: snapshotVal.traits.Brightness.brightness,
        type: snapshotVal.type,
      };
      break;
    case 'action.devices.types.SWITCH':
      data = {
        on: snapshotVal.traits.OnOff.on,
        type: snapshotVal.type,
      };
        break;
  }

  return data;
};

// Handle return data formated
const queryDevice = async (deviceId) => {
  const data = await queryFirebase(deviceId);

  let dataDevice = {};
  switch(data.type){
    case 'action.devices.types.LIGHT':
      dataDevice = {
        on: data.on,
        brightness: data.brightness,
      };
      break;
    case 'action.devices.types.SWITCH':
      dataDevice = {
        on: data.on,
      };
      break;
  }

  return dataDevice;
};

/**
 * Handler to query devices from user logged
 */
app.onQuery(async (body) => {
  functions.logger.info(`onQuery`);
  const {requestId} = body;
  const payload = {
    devices: {},
  };
  const queryPromises = [];
  for (const input of body.inputs) {
    for (const device of input.payload.devices) {
      const deviceId = device.id;
      queryPromises.push(queryDevice(deviceId)
        .then((data) => {
          // Add response to device payload
          payload.devices[deviceId] = data;
          return payload;
        }
        ));
    }
  }
  // Wait for all promises to resolve
  await Promise.all(queryPromises);
  return {
    requestId: requestId,
    payload: payload,
  };
});

// Update database with information from device
const updateDevice = async (execution, deviceId) => {
  const {params, command} = execution;
  let state; let ref;
  switch (command) {
    case 'action.devices.commands.OnOff':
      state = {on: params.on};
      ref = firebaseRef.child(deviceId+"/traits").child('OnOff');
      break;
    case 'action.devices.commands.BrightnessAbsolute':
      state = {brightness: params.brightness};
      ref = firebaseRef.child(deviceId+"/traits").child('Brightness');
      break;
    case 'action.devices.commands.StartStop':
      state = {isRunning: params.start};
      ref = firebaseRef.child(deviceId+"/traits").child('StartStop');
      break;
    case 'action.devices.commands.PauseUnpause':
      state = {isPaused: params.pause};
      ref = firebaseRef.child(deviceId+"/traits").child('StartStop');
      break;
  }

  return await ref.update(state)
      .then(() => state);
};

/**
 * Handler to execute action from a devices
 */
app.onExecute(async (body) => {
  // Execution results are grouped by status
  functions.logger.info(`OnExecute`,);
  const result = {
    ids: [],
    status: 'SUCCESS',
    states: {
      online: true,
    },
  };

  const executePromises = [];
  const intent = body.inputs[0];
  for (const command of intent.payload.commands) {
    for (const device of command.devices) {
      for (const execution of command.execution) {
        executePromises.push(
            updateDevice(execution, device.id)
                .then((data) => {
                  result.ids.push(device.id);
                  Object.assign(result.states, data);
                  return data;
                })
                .catch((error) => functions.logger.error('EXECUTE', device.id, "error: ", error)));
      }
    }
  }

  await Promise.all(executePromises);
  return {
    requestId: body.requestId,
    payload: {
      commands: [result],
    },
  };
});

/**
 * Handler to disconnect user
 */
app.onDisconnect((body, headers) => {
  functions.logger.log('User account unlinked from Google Assistant');
  // Return empty response
  return {};
});

exports.smarthome = functions.https.onRequest(app);

/**
 * Handler to request a sync for new devices
 */
exports.requestsync = functions.https.onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  functions.logger.info(`Request`, request);
  
  const userId = validateCredentials(headers);
  try {
    const res = await homegraph.requestSync(userId);

    functions.logger.info('Request sync response:', res.status, res.data);
    response.json(res.data);
  } catch (err) {
    functions.logger.error(err);
    response.status(500).send(`Error requesting sync: ${err}`);
  }
});

/*
 * Cloud Function: Report device state changes to Assistant HomeGraph
 */
exports.reportstate = functions.database.ref('{deviceId}').onWrite(async (change, context) => {
  functions.logger.info('Firebase write event triggered Report State');
  const deviceId = context.params.device;
      
  const data = await queryDevice(deviceId);
  // Send a state report
  const report = {};
  report[deviceId] = data;
  console.log('Sending state report', report);
  await homegraph.reportState({
    requestId: uuid(),
    agentUserId: device.owner,
    payload: {
      devices: {
        states: report
      }
    }
  });
});