const signOut = document.querySelector('.sign-out');
const userImage = document.querySelector('.user-image');
const userName = document.querySelector('.user-name');
const authContent = document.querySelector('.content');

const requestLink = document.querySelector('.add-device');
const requestModal = document.querySelector('.new-request');
const modal = document.querySelector('.modal');
// Form add new device

const modalContent2 = (values) => {
  return (`
  <h3>Add a new Device</h3>
  <form>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" hidden type="text" value="${values[1]}" id="deviceId" >
      <label class="mdl-textfield__label" for="deviceId">Device Id: ${values[1]}</label>
    </div>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" hidden type="text" value="${values[2]}" id="type" >
      <label class="mdl-textfield__label" for="type">Type: ${values[2]}</label>
    </div>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="city" required >
      <label class="mdl-textfield__label" for="city">City...</label>
    </div>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="room" required>
      <label class="mdl-textfield__label" for="room">Room...</label>
    </div>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="name" required>
      <label class="mdl-textfield__label" for="name">Name...</label>
    </div>
    <input class="mdl-textfield__input" hidden type="text" value="${values[0]}" id="devicePos" >
    
    <button onclick="addDevice()">Submit Device</button>
    <p class="error"></p>
  </form>
  `);
}
// Form add new device
const modalContent = `
  <h3>Select a Device</h3>
  <form id="listDevices">
  </form>
`;

modal.innerHTML = modalContent;

// Reference database
const db = firebase.database();

// Set collapsible list itens
const listItem = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      this.classList.toggle("activeColl");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = "1080px";
      } 
    });
  }
};

// Set update list itens
const listUpdate = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      //console.log(item[i]);
      updateState(item[i].id);
    });
  }
};

// Set close list itens
const listClose = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      //console.log(item[i]);
      removeHtml(item[i]);
    });
  }
};

// Set close list itens
const listConfig = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      //console.log(item[i]);
      configHtml(item[i]);
    });
  }
};

// Move device to another room
const moveDevice = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      let values = item[i].id.split('__');
      // reference to database
      const user = firebase.auth().currentUser;

      // check user is logged
      if(user){
        const reqModal = document.querySelector('.new-request');
        
        let devicesItems = document.getElementById(`${values[0]}__${values[1]}__devices`);

        if(values[3] != 'newCity' && values[3] != 'newRoom' ){
          db.ref('users/'+user.uid+'/devices/'+values[2]).update({roomHint:values[3]});
          reqModal.classList.remove('open');
          
          if(devicesItems.childElementCount == 0){
            let card = document.getElementById(`${values[0]}__${values[1]}__field`);
            card.remove();
          }
        }else{
          let option = 'Enter a new City';
          let contentForm = `
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input class="mdl-textfield__input" type="text" id="name" required>
              <label class="mdl-textfield__label" for="name">Name...</label>
            </div>
          `;
          if(values[3] == 'newRoom'){
            option = 'Choose a new Room';
            const listRoom = ['Living Room', 'Garden', 'Office', 'Dinner Room', 'Kitcken', 'Bedroom', 'Bathroom', 'Garage', 'Hall'];
            listRoom.sort();

            contentForm = ` <div class="radios">`;
            listRoom.forEach(room =>{
              contentForm += ` <input type="radio" name="rGroup" id='${room}'/>
              <label  class="mdl-list2" for="${room}">
                  <span>${room}</span>
              </label>`;
            });
                   
            contentForm += `</div>`;
          }

          reqModal.innerHTML = ` <div class='modal'>
              <h3>${option}</h3>
              <form action="javascript:;" onsubmit="updateMove(this)" id="${item[i].id}">
                ${contentForm}
              <br><br><button >${option}</button>
            </form>
            <p class="error"></p>
            </div>`;
            
          componentHandler.upgradeAllRegistered();
        }
        // const reqModal = document.querySelector('.new-request');
        // reqModal.classList.remove('open');
      }else
        console.log("Usuário desconectado.");

    });
  }
};

const updateMove = (element) => {
  const val = element.id.split('__');
  const user = firebase.auth().currentUser;

  let devicesItems = document.getElementById(`${val[0]}__${val[1]}__devices`);
  let collapsTitle = document.getElementById(`${val[0]}__title`);
  let collaps = document.getElementById(`${val[0]}`);
  let item = document.getElementById(val[2]);

  // check user is logged
  if(user){
    const reqModal = document.querySelector('.new-request');
    if(val[3] != 'newRoom'){
      const input = element.querySelector("input");

      console.log('cities: ',cities);
      if(collaps.childElementCount == 1){
        collaps.remove();
        cities.splice(cities.indexOf(collapsTitle.innerText), 1) 
        collapsTitle.remove();
      }
      console.log('cities: ',cities);

      if (item){  
        item.remove();
      }

      db.ref('users/'+user.uid+'/devices/'+val[2]).update({city:input.value});
      reqModal.classList.remove('open');
      componentHandler.upgradeAllRegistered();
    }else{
      const radioChecked = document.querySelector('input[name="rGroup"]:checked');
      if(radioChecked){

        if(devicesItems.childElementCount == 1){
          let card = document.getElementById(`${val[0]}__${val[1]}__field`);
          card.remove();
        }

        db.ref('users/'+user.uid+'/devices/'+val[2]).update({roomHint:radioChecked.id});
        reqModal.classList.remove('open');
        componentHandler.upgradeAllRegistered();

      }else{
        reqModal.querySelector('.error').textContent = 'Select a room to continue';
      }
    }
    

  }else
    console.log("Usuário desconectado.");
  
}

// Sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => console.log('signed out'));
      
  });

// Auth listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('connected');
    // Set the user's profile name.
    userImage.src = addSizeToGoogleProfilePic(getProfilePicUrl()) ;
    userName.textContent = user.email;

    authContent.classList.add('active'); 
    getDataFirebase(user);
  
  } else {
    console.log('disconnected');
    userImage.src = '../profile_placeholder.png'; 
    userName.textContent = ""; 
    authContent.classList.remove('active');
    window.location.replace("index.html"); 
    
  }
});

// Open request modal
requestLink.addEventListener('click', (e) => {
  e.preventDefault();
  requestModal.classList.add('open');

  modal.innerHTML = modalContent;
  const item = document.getElementById('listDevices');

  let html = `<div class="radios">`;
  db.ref('available-devices').once('value').then( snap => {
    if(snap.exists()){
      snap.forEach(device => {
        html += `
        <input type="radio" name="rGroup" value="${device.key+'/'+device.val().id+'/'+device.val().type}" id="${device.val().id}" />
        <label class="mdl-chip" for="${device.val().id}">
            <span class="mdl-chip__text">${device.val().id}</span>
        </label>
        `;
      });
      html += `</div>`;
      item.innerHTML = html;
      modal.insertAdjacentHTML("beforeend",`<br><br><button onclick="selectedDevice()">Next</button><p class="error"></p>`);
      componentHandler.upgradeAllRegistered();
    }else{
      item.innerHTML = `No available devices.`;
      modal.insertAdjacentHTML("beforeend",`<br><br><button onclick="requestModal.classList.remove('open');">Return</button><p class="error"></p>`);
      componentHandler.upgradeAllRegistered();
    }
  });

});

const selectedDevice = () => {
  const radioChecked = document.querySelector('input[name="rGroup"]:checked');

  if(radioChecked){
    modal.querySelector('.error').textContent = '';

    var res = radioChecked.value.split("/");
    modal.innerHTML = modalContent2(res);   
    componentHandler.upgradeAllRegistered();
  }else{
    modal.querySelector('.error').textContent = 'Select a device to continue';
  }

};

window.onclick = function(event) {
  if (event.target == requestModal) {
    requestModal.classList.remove('open');
    modal.innerHTML = modalContent;
  }
}

// Add Image to url
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// Get image from user
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '../profile_placeholder.png'; 
}

// Get data drom database
function getDataFirebase(user){
  let dbChild = db.ref("users/"+user.uid+'/devices').on('value', snapshot =>{
      setupHome(snapshot);
  });
}

// Handle add new device
const addDevice = () => {

    const requestForm = document.querySelector('.new-request form');
    
    // reference to database
    const user = firebase.auth().currentUser;
  
    // check user is logged
    if(user){
      place = requestForm.room.value;
      nameDevice = requestForm.name.value;
      typeDevice = requestForm.type.value;
      city = requestForm.city.value;
      deviceId = requestForm.deviceId.value;
      devicePos = requestForm.devicePos.value;
  
      let pkg = {};
      let traits = {};
      let cont = 1;
      switch(typeDevice){
        case 'LIGHT':
          traits.OnOff = { on: false};
          traits.Brightness = { brightness: 0};
          break;
        case 'LINEFILTER':
          cont = 4;
          traits.OnOff = { on: false};
          break;
        case 'SPRINKLER':
        case 'SWITCH':
          traits.OnOff = { on: false};
          break;
      }
  
      // get amount of devices in database
      let index = 0;
      db.ref("users/"+user.uid+"/devices/").on('value', snap => {
        snap.forEach((devices) => {
          index++;
        });
      });
  
      index++;
      
      let pkgPath = {
        numId: index,
        path: user.uid+'/devices/device'
      };
      
      db.ref('devices-path/'+deviceId).update(pkgPath);
  
      for (let i = 0; i < cont; i++ ){
        let n = nameDevice;
        if(typeDevice == 'LINEFILTER'){
          n= n + i;
          pkg['device'+index] = {traits,type:'action.devices.types.SWITCH',name:n,roomHint:place,city:city};
        }else
          pkg['device'+index] = {traits,type:'action.devices.types.'+typeDevice,name:n,roomHint:place,city:city};
        index++;
      }
  
      // add new device to database
      db.ref('users/'+user.uid+'/devices/').update(pkg);
  
      db.ref('available-devices/'+devicePos).remove();
      
      requestForm.reset();
      requestForm.querySelector('.error').textContent = "";
      requestModal.classList.remove('open');
  
    }else{
      requestForm.querySelector('.error').textContent = "Usuário não conectado!";
  
    }
  
  };

// Handle remove device
const removeDevice = (path) => {

  const requestForm = document.querySelectorAll('.new-request form fieldset');
 
  // reference to database
  const user = firebase.auth().currentUser;
  
  if(user){
    requestForm.forEach( element => {  
    console.log(element.children.item(0).innerText);
    
    // check checkbox is selected
    if(element.children.item(1).children.item(0).children.item(0).checked)
      db.ref("users/"+user.uid+"/devices/"+element.id).remove();
    });
    requestModal.classList.remove('open');
  }
}

// Handle update database with respective information
const updateState = (path) => {
  let fieldsets = document.querySelectorAll(`#${path}__field fieldset`);

  // loop of devices getting data 
  fieldsets.forEach( (item) => {
    let traits = {};
    for (j = 0; j < item.elements.length; j++) {
      const el = item.elements[j];
      switch(el.type){
        case 'checkbox':
          traits.OnOff = { on: el.checked};
          break;
        case 'range':
          traits.Brightness = { brightness: parseInt(el.value)};
          break;
      }
    }

    // reference to database
    const user = firebase.auth().currentUser;

    // check user is logged
    if(user){
      db.ref('users/'+user.uid+'/devices/'+item.id).update({traits});
    }else
      console.log("Usuário desconectado.");

  });
  
}

const renameDevice = (e) => {
  let newName = e.elements[0].value;
  const device = e.elements[0].id.split('__');
    
  // reference to database
  const user = firebase.auth().currentUser;

  // check user is logged
  if(user){
    if (newName){
      db.ref('users/'+user.uid+'/devices/'+device[2]).update({name:newName});
      const reqModal = document.querySelector('.new-request');
      reqModal.classList.remove('open');
    }else
      console.log('error nome');
  }else
    console.log("Usuário desconectado.");
 
}