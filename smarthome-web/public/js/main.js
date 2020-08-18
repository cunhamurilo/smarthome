const signOut = document.querySelector('.sign-out');
const userImage = document.querySelector('.user-image');
const userName = document.querySelector('.user-name');
const authContent = document.querySelector('.content');

const requestLink = document.querySelector('.add-device');
const requestModal = document.querySelector('.new-request');
const modal = document.querySelector('.modal');

const modalContent = `
  <h3>Add a new Device</h3>
  <form>
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

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <select class="mdl-textfield__input " id="type" name="type" required>
        <option></option>
        <option value="Sprinkler">Sprinkler</option>
        <option value="Powerplug">Powerplug</option>
        <option value="Light">Light</option>
      </select>
      <label class="mdl-textfield__label" for="type">Type Device</label>
    </div>
    <button onclick="addDevice()">Submit Device</button>
    <p class="error"></p>
  </form>
`;

modal.innerHTML = modalContent;

const db = firebase.database();

// set collapsible list itens
const listItem = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      this.classList.toggle("activeColl");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        //content.style.maxHeight = "100%";
        //content.style.maxHeight = content.scrollHeight + "px";
        content.style.maxHeight = "1080px";
      } 
    });
  }
};

// set update list itens
const listUpdate = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      //console.log(item[i]);
      updateState(item[i].id);
    });
  }
};

// set close list itens
const listClose = (item) => {
  for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", function() {
      //console.log(item[i]);
      removeHtml(item[i]);
    });
  }
};

// sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => console.log('signed out'));
      
  });

// auth listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('conectado');
    // Set the user's profile name.
    userImage.src = addSizeToGoogleProfilePic(getProfilePicUrl()) ;
    userName.textContent = user.email

    authContent.classList.add('active'); 
    getDataFirebase(user);
  
  } else {
    console.log('desconectado');
    userImage.src = '../profile_placeholder.png'; 
    userName.textContent = ""; 
    authContent.classList.remove('active');
    window.location.replace("index.html"); 
    
  }
});

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
  modal.innerHTML = modalContent;
  
  componentHandler.upgradeAllRegistered();

});

window.onclick = function(event) {
  if (event.target == requestModal) {
    requestModal.classList.remove('open');
    modal.innerHTML = modalContent;
  }
}

// add Image to url
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// get image from user
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '../profile_placeholder.png'; 
}

// get data drom database
function getDataFirebase(user){
  let dbChild = db.ref("users/"+user.uid).on('value', snapshot =>{
      setupHome(snapshot);
  });
}

// add device
const addDevice = () => {

  const requestForm = document.querySelector('.new-request form');
  const user = firebase.auth().currentUser;
  if(user){
    place = requestForm.room.value;
    name = requestForm.name.value;
    typeDevice = requestForm.type.value;
    city = requestForm.city.value;

    let pkg = {};
    let traits = {};
    switch(typeDevice){
      case 'Light':
        traits.OnOff = { on: false};
        traits.Brightness = { brightness: 0};
        break;
      case 'Sprinkler':
      case 'Powerplug':
        traits.OnOff = { on: false};
        break;
    }
    pkg[name] = {traits,type:typeDevice};

    db.ref("users/"+user.uid+"/"+city+"/structure/"+place).update(pkg);

    requestForm.reset();
    requestForm.querySelector('.error').textContent = "";
    requestModal.classList.remove('open');

  }else{
    requestForm.querySelector('.error').textContent = "Usuário não conectado!";

  }
}

// remove device
const removeDevice = (path) => {

  event.preventDefault();
  const requestForm = document.querySelectorAll('.new-request form fieldset');
 
  // referencia para o banco
  const ref = path.id.split("__");
  const user = firebase.auth().currentUser;
  const place = document.getElementById(path.id+"__title").textContent;
  const city = document.getElementById(ref[0]+"__title").textContent;
  
  if(user){
    requestForm.forEach( element => {
      // nome console.log(element.children.item(0).innerText);
      if(element.children.item(1).children.item(0).children.item(0).checked)
        db.ref("users/"+user.uid+"/"+city+"/structure/"+place+"/"+element.children.item(0).innerText).remove();

    });
    requestModal.classList.remove('open');

  }
}

// função que atualiza o banco com os valores de cada campo
const updateState = (path) => {
  let fieldsets = document.querySelectorAll(`#${path}__field fieldset`);
  let pkg = {}; 

  // percorre todos os dispositivos obtendo os seus respectivos valores 
  fieldsets.forEach( (item) => {
    let traits = {};
    let name = document.getElementById(item.id+"__title");
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
    pkg[name.textContent] = {traits,type:item.className};
  });
  
  // referencia para o banco
  const ref = path.split("__");
  const user = firebase.auth().currentUser;
  const place = document.getElementById(path+"__title").textContent;
  const city = document.getElementById(ref[0]+"__title").textContent;

  // verifica se o usuário está logado para atualizar o banco
  if(user)
    firebase.database().ref('/users/'+user.uid+"/"+city).child("/structure/"+place).set(pkg);
  else
    console.log("Usuário desconectado.");
}