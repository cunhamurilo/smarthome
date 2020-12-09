const signOut = document.querySelector('.sign-out');
const userImage = document.querySelector('.user-image');
const userName = document.querySelector('.user-name');
const authContent = document.querySelector('.content');

const requestModal = document.querySelector('.new-request');
const modal = document.querySelector('.modal');
const avatarDropdown = document.querySelector(".demo-avatar-dropdown");

const listRoom = ['Living Room', 'Garden', 'Office', 'Dinner Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Garage', 'Hall'];

let dev = [];
// Form add new device
const modalContentAddDevice = (values) => {
  return (`
  <h3>Add a new Device</h3>
  <form action="javascript:;" onsubmit="addDevice()" >
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" hidden type="text" value="${values[1]}" id="deviceId" >
      <label class="mdl-textfield__label" for="deviceId">Device Id: ${values[1]}</label>
    </div>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" hidden type="text" value="${values[2]}" id="type" >
      <label class="mdl-textfield__label" for="type">Type: ${values[2]}</label>
    </div>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="name" required>
      <label class="mdl-textfield__label" for="name">Name...</label>
    </div>
    <input class="mdl-textfield__input" hidden type="text" value="${values[0]}" id="devicePos" >
    
    <button id="btn" style="background-color:#777">Submit Device</button>
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

const layoutCity = `
  <h1>Dashboard</h1>
  <div class="mdl-layout-spacer"></div>
  <h4 style="padding-top: 20px;">
    <span id="cities_name" >No city</span>
    <button id="cities_btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
      <i class="material-icons" role="presentation">arrow_drop_down</i>
      <span class="visuallyhidden">Accounts</span>
    </button>
    <ul id="cities_btn_ul" class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="cities_btn">
      <li class="mdl-menu__item cities mdl-button" style="text-transform: none;><i class="material-icons">add</i> Add another city ...</li>
    </ul>
    <div class="mdl-tooltip" data-mdl-for="cities_btn">
      Options
    </div>
  </h4>
`;
avatarDropdown.innerHTML = layoutCity;

// Reference database
const db = firebase.database();

const click = function() {
  this.classList.toggle("activeColl");
  var content = this.nextElementSibling;
  if (content.style.maxHeight){
      content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight+"px";
  } 
}

// Set collapsible list itens
const listItem = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", click);
  }
};

const config = function() {
  let typeBtn = this.id.split("__");
  if(typeBtn[2] == "close"){
    removeHtml(this);
  }else if(typeBtn[2] == "config"){
    configHtml(this);
  }else if(typeBtn[2] == "addDevice"){
    layoutAddDevice();
  }else if(typeBtn[2] == "update"){
    updateState(`${typeBtn[0]}__${typeBtn[1]}`);
  }else if(typeBtn[0] == "city" || typeBtn[0] == "addCity" || typeBtn[0] == "removeCity"){
    listCityBtn(this);
  }else if(typeBtn[2] == "newRoom" || typeBtn[2] == "newCity" ){
    moveDevice(this);
  }else if(typeBtn[0] == "selectItem" ){
    requestModal.querySelector('.error').textContent = '';
    let btn = document.getElementById('btn')
    btn.style.backgroundColor = "#ee8905";
  }else if(typeBtn[0] == "name"){
    let btn = document.getElementById('btn')
    if(this.value == "")
      btn.style.backgroundColor = "#777";
    this.addEventListener("keydown", function(event) {
      if(event.key != ""){
        btn.style.backgroundColor = "#ee8905";
      }

      if(( this.value.length == 1 || this.value.length == 0) && event.key == "Backspace" ){
        btn.style.backgroundColor = "#777";
      }

     });
    
  }

};

// Set close list itens
const listConfig = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", config );
  }
};
 
// Set city list itens
const listCityBtn = (item) => {
      const cities_name = document.getElementById('cities_name');
      if(item.id == "city"){
        cities_name.innerText = item.innerHTML;
        // reference to database
        const user = firebase.auth().currentUser;
        homeContent.innerText = "";
        if(user){
          // get device Id
          db.ref('users/'+user.uid+'/actual_city').update({actual:item.innerHTML});
        }
        //setupHome(dev);
        componentHandler.upgradeAllRegistered();
      }else{
        requestModal.classList.add('open');

        let option = 'Enter a new City';
        let contentForm = `
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" id="name" required>
            <label class="mdl-textfield__label" for="name">Name...</label>
          </div>
        `;
        let styleBtn = `style="background-color:#777"`;

        if(item.id == "removeCity"){
          option = 'Remove City';
          contentForm = ``;
          styleBtn = `style="background-color:#ee8905"`;
        }

        modal.innerHTML = ` 
            <h3>${option}</h3>
            <form action="javascript:;" onsubmit="cityUpdate(this)" id="${item.id}">
              ${contentForm}
            <br><br><button id="btn" ${styleBtn}>${option}</button>
          </form>
          <p class="error"></p>
        `;
        let itens = modal.getElementsByClassName("mdl-textfield__input");
        listConfig(itens);

        componentHandler.upgradeAllRegistered();
      }
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
const layoutAddDevice = async() => {
  requestModal.classList.add('open');
  modal.innerHTML = modalContent;
  const item = document.getElementById('listDevices');

  let html = `<div class="radios">`;
  await db.ref('available-devices').once('value').then( snap => {
    if(snap.exists()){
      snap.forEach(device => {
        html += `
        <input type="radio" name="rGroup" value="${device.key+'/'+device.val().id+'/'+device.val().type}" id="${device.key}" />
        <label class="mdl-chip" for="${device.key}" id="selectItem">
            <span class="mdl-chip__text">${device.val().id}</span>
        </label>
        `;
      });
      html += `</div>`;
      item.innerHTML = html;
      modal.insertAdjacentHTML("beforeend",`<br><br><button style="background-color:#777" id="btn" onclick="selectedDevice()">Next</button><p class="error" style="margin-top:15px;"></p>`);
      componentHandler.upgradeAllRegistered();
    }else{
      item.innerHTML = `No available devices.`;
      modal.insertAdjacentHTML("beforeend",`<br><br><button onclick="requestModal.classList.remove('open');">Return</button><p class="error"></p>`);
      componentHandler.upgradeAllRegistered();
    }
  });

  let itens = item.getElementsByClassName("mdl-chip");
  listConfig(itens);
 
  
}

// Get selected device
const selectedDevice = () => {
  const radioChecked = document.querySelector('input[name="rGroup"]:checked');

  if(radioChecked){
    modal.querySelector('.error').textContent = '';

    var res = radioChecked.value.split("/");
    modal.innerHTML = modalContentAddDevice(res);   
    let itens = modal.getElementsByClassName("mdl-textfield__input");
    listConfig(itens);
    componentHandler.upgradeAllRegistered();
  }else{
    modal.querySelector('.error').textContent = 'Select a device to continue';
  }

};

window.onclick = function(event) {
  if (event.target == requestModal) {
    requestModal.classList.remove('open');
    modal.innerHTML = '';
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
  db.ref("users/"+user.uid+'/').on('value', snapshot =>{
      //setupHome(snapshot);
      dev = snapshot;
      setupHome(dev);
  });
}

// Handle add new city
const cityUpdate = (element) => {
  // reference to database
  const user = firebase.auth().currentUser;
  const reqModal = document.querySelector('.new-request');

  if(element.id == "removeCity"){
    const cities_name = document.getElementById('cities_name');
    
    homeContent.innerHTML = '';
    db.ref('users/'+user.uid+'/devices').once('value', snapshot => {
      snapshot.forEach(device => {
        if(device.val().city == cities_name.innerText)
          db.ref('users/'+user.uid+'/devices/'+device.key).update({city:"", roomHint:""})
      })
    })
    db.ref('users/'+user.uid+'/cities').once('value', snapshot => {
      snapshot.forEach(city => {
        if(city.val() == cities_name.innerText){
          db.ref('users/'+user.uid+'/cities/'+city.key).remove();
        }
      })
    })
    cities_name.innerText = "No City";
    db.ref('users/'+user.uid+'/cities').limitToFirst(1).once('value', snapshot => {
      if(snapshot.numChildren() == 0){
        db.ref('users/'+user.uid+'/actual_city').update({actual:""})
      }

      snapshot.forEach(city => {
        db.ref('users/'+user.uid+'/actual_city').update({actual:city.val()})
      })
    })
    

    componentHandler.upgradeAllRegistered();
  }else if(element.id == 'addCity'){
    const input = element.querySelector("input");
   
    let cityId = getId(user,'cities', input.value);
    if(cityId == "")
      cityId = db.ref('users/'+user.uid+'/cities/').push().key;

    let updates = {};
    updates[cityId] = input.value;
    db.ref('users/'+user.uid+'/cities').update(updates);
    db.ref('users/'+user.uid+'/actual_city').update({actual:input.value});
  } 
  reqModal.classList.remove('open');
  componentHandler.upgradeAllRegistered();
}

// Handle add new device
const addDevice = () => {
    const requestForm = document.querySelector('.new-request form');
    
    // reference to database
    const user = firebase.auth().currentUser;
  
    // check user is logged
    if(user){
      nameDevice = requestForm.name.value;
      typeDevice = requestForm.type.value;
      deviceId = requestForm.deviceId.value;
      devicePos = requestForm.devicePos.value;

      let pkg = {}, pkgPath = {}, traits = {};
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
      
      for (let i = 0; i < cont; i++ ){
        let id = db.ref('users/'+user.uid+'/devices/').push().key;
        
        let n = nameDevice;
        if(typeDevice == 'LINEFILTER'){
          n= n + i;
          pkg[id] = {traits,type:'action.devices.types.SWITCH',name:n,roomHint:"",city:""};
          let p = 'path'+i;
          pkgPath[p] = id
        }else{
          pkg[id] = {traits,type:'action.devices.types.'+typeDevice,name:n,roomHint:"",city:""};
          let p = 'path'+i;
          pkgPath[p] = id
        }
      }
      pkgPath["user"] = user.uid;
  
      // update path device to database
      db.ref('devices-path/'+deviceId).update(pkgPath);

      // add new device to database
      db.ref('users/'+user.uid+'/devices/').update(pkg);
  
      // remove device in available devices
      db.ref('available-devices/'+devicePos).remove();
      
      requestForm.reset();
      requestForm.querySelector('.error').textContent = "";
      requestModal.classList.remove('open');
  
    }else{
      requestForm.querySelector('.error').textContent = "Usuário não conectado!";
    }
  
  };

// Handle remove device
const removeDevice = (name) => {
 
  // reference to database
  const user = firebase.auth().currentUser;
  let deviceId = '';
  if(user){
    // get device Id
    deviceId = getId(user,'devices',name);
    db.ref('users/'+user.uid+'/devices/'+deviceId).update({roomHint:'',city: ""});
    requestModal.classList.remove('open');
  }
}

// Get id in database
const getId = (user, type, name) => {
  let id = '';
  db.ref("users/"+user.uid+"/"+type).once('value', snapshot =>{
    snapshot.forEach(item => {
      if(type == 'devices'){
        if(item.val().name == name){
          id = item.key;
        }
      }else{
        if(item.val() == name){
          id = item.key;
        }
      }
    })
  });
  return id;
}

// Handle update database with respective information
const updateState = (path) => {
  let fieldsets = document.querySelectorAll(`#${path}__field fieldset`);
  let name = document.getElementById(`${path}__title`);

  // loop of devices getting data 
    let traits = {};
    const elements = fieldsets.item(0).elements;
    for (j = 0; j < elements.length; j++) {
      const el = elements[j];
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
    let deviceId = "";
    // check user is logged
    if(user){
      // get device Id
      deviceId = getId(user,'devices',name.innerText);
      db.ref('users/'+user.uid+'/devices/'+deviceId).update({traits});
    }else
      console.log("Usuário desconectado.");
  
}

const renameDevice = (e) => {
  let newName = e.elements[0].value;
  const path = e.elements[0].id.split('__');
  let name = document.getElementById(`${path[0]}__${path[1]}__title`);

  // reference to database
  const user = firebase.auth().currentUser;
  let deviceId = "";

  // check user is logged
  if(user){
    // get device Id
    deviceId = getId(user,'devices',name.innerText);
    if (newName){
      db.ref('users/'+user.uid+'/devices/'+deviceId).update({name:newName});
      const reqModal = document.querySelector('.new-request');
      reqModal.classList.remove('open');
    }else
      console.log('error nome');
  }else
    console.log("Usuário desconectado.");
 
}

// Move device to another room
const moveDevice = (item) => {
  let values = item.id.split('__')

  // reference to database
  const user = firebase.auth().currentUser

  let collapsible = document.getElementsByClassName(`collapsible`);
  let collaps = document.getElementsByClassName(`contentColl`); 
  let name = document.getElementById(`${values[0]}__${values[1]}__title`);
  let index = 0;
  let itens = "";

  for ( let i =0; i < collapsible.length; i++ ){
    for (let j = 0; j < collaps[i].childElementCount; j++) {
      if(collaps[i].children[j].firstElementChild.firstElementChild.innerText == name.innerText){
        index = i;
      }
    }
  }

  // check user is logged
  if(user){
    let option = 'Enter a new City';
    let contentForm = `
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="name" required>
        <label class="mdl-textfield__label" for="name">Name...</label>
      </div>
    `;

    itens = modal.getElementsByClassName("mdl-textfield__input");
    if(values[2] == 'newRoom'){
      option = 'Choose a new Room';
      listRoom.sort();
      contentForm = ` <div class="radios">`;

      listRoom.forEach(room =>{
        if (room != collapsible[index].innerText){
          contentForm += ` <input type="radio" name="rGroup" id='${room}'/>
          <label  class="mdl-list2" for="${room}" id="selectItem">
              <span>${room}</span>
          </label>`;
        }
      });
             
      contentForm += `</div>`;
      itens = modal.getElementsByClassName("mdl-list2");
    }

    modal.innerHTML = ` 
        <h3>${option}</h3>
        <form action="javascript:;" onsubmit="updateMove(this)" id="${item.id}">
          ${contentForm}
        <br><br><button id="btn" style="background-color:#777">${option}</button>
      </form>
      <p class="error"></p>
    `;
    
    listConfig(itens);
  }else
    console.log("Usuário desconectado.")
  
    componentHandler.upgradeAllRegistered();
};

const updateMove = (element) => {
  const val = element.id.split('__');
  const user = firebase.auth().currentUser;

  let name = document.getElementById(`${val[0]}__${val[1]}__title`);
  let deviceId = "";
  // get device id
  deviceId = getId(user,'devices',name.innerText);

  let reqModal = document.querySelector(".new-request");
  // check user is logged
  if(user){
    if(val[2] == 'newCity'){
      const input = element.querySelector("input");
      db.ref('users/'+user.uid+'/devices/'+deviceId).update({city:input.value});
      db.ref('users/'+user.uid+'/actual_city').update({actual:input.value});
      let cityId = getId(user,'cities', input.value);
      if(cityId == "")
        cityId = db.ref('users/'+user.uid+'/cities/').push().key;
      
      let updates = {};
      updates[cityId] = input.value;
      db.ref('users/'+user.uid+'/cities').update(updates);
      reqModal.classList.remove('open');
    }else{
      const radioChecked = document.querySelector('input[name="rGroup"]:checked');
      if(radioChecked){
        let city_name = "";
        if (cities_name.innerText != "No city")
          city_name = cities_name.innerText;
        db.ref('users/'+user.uid+'/devices/'+deviceId).update({roomHint:radioChecked.id, city: city_name});
        reqModal.classList.remove('open');
      }else{
        reqModal.querySelector('.error').textContent = 'Select a room to continue';
      }
    }

    componentHandler.upgradeAllRegistered();
  }else
    console.log("Usuário desconectado.");
  
}