const homeContent = document.querySelector('.item-list');
const cities_name = document.getElementById('cities_name');
const cities_btn_ul = document.getElementById('cities_btn_ul');

/*
 * Handle create layout for home
 */
const setupHome = (data) => {
  let collapsible = document.getElementsByClassName(`collapsible`);

  for (let i = 0; i < collapsible.length; i++) { 
    let content = document.getElementsByClassName(`contentColl`);  
      if (collapsible[i].classList.contains('activeColl') == 1){ 
        content[i].style.maxHeight = "100%";
      }
      content[i].innerText = "";
  }

  let itens = data.child('devices');
  let actual_city = data.child('actual_city').val();
  let listCity =  data.child('cities');
  
  if(actual_city.actual != "")
    cities_name.innerText = actual_city.actual;
  cities_btn_ul.innerHTML = "";
  // add item menu for cities

  listCity.forEach( (city) => {
    let ci = `<li id="city" class="mdl-menu__item mdl-button" style="text-transform: none;">${city.val()}</li>`;
    if(cities_name.innerText != city.val() )
     cities_btn_ul.insertAdjacentHTML('afterbegin',ci) ;
  });
  if(cities_btn_ul.childElementCount > 0)
    cities_btn_ul.insertAdjacentHTML('beforeend',`<div style="height:1px;width:98%;margin-left:1%;background-color:black;"></div>`) ;
  cities_btn_ul.insertAdjacentHTML('beforeend', `<li id="addCity" class="mdl-menu__item mdl-button" style="text-transform: none;"><i class="material-icons">add</i> Add another city ...</li>`);
  
  if(actual_city.actual != "")
    cities_btn_ul.insertAdjacentHTML('beforeend', `<li id="removeCity" class="mdl-menu__item mdl-button" style="text-transform: none;"><i class="material-icons">close</i> Remove city</li>`);
  
  componentHandler.upgradeAllRegistered();

  itens.forEach((devices) => {
    const values = devices.val();

    // verify if device city if the same of item menu
    if(values.city == cities_name.innerText || values.city == ""){
      let html = ``;
      let exist = false;
      let indRoom = 0;
      let collaps = document.getElementsByClassName(`contentColl`); 

      // check index of room if already exist
      for (let i = 0; i < collapsible.length; i++) {
        if (collapsible[i].innerText == values.roomHint){
          exist = true
          indRoom = i;
        }else if ( collapsible[i].innerText == "Assign your device to city" && values.city == ""){
          exist = true
          indRoom = i;
        }else if ( collapsible[i].innerText == "Assign your device to room" && values.roomHint == "" && values.city != ""){
          exist = true
          indRoom = i;
        }
        for (let j = 0; j < collaps[i].childElementCount; j++) {
          if(collaps[i].children[j].firstElementChild.firstElementChild.innerText == values.name){
            collaps[i].children[j].remove();
          }
        }
      }
      
      // check if room already exist
      if(exist){;  
        collaps[indRoom].insertAdjacentHTML('beforeend',setHtml(indRoom, collaps[indRoom].childElementCount, values));
        
        componentHandler.upgradeAllRegistered();
      }else{
        if(values.city == "")
        values.roomHint = "Assign your device to city";
        else if(values.roomHint == "")
          values.roomHint = "Assign your device to room";
        html += `<div class="collapsible" id="collaps__title">${values.roomHint}</div>`;
        html += `<div class="contentColl request-list" id="collaps" >`;
        html += setHtml(collapsible.length, 0, values);
        html += `</div>`;
      }
     
      homeContent.insertAdjacentHTML('beforeend',html);
      componentHandler.upgradeAllRegistered();
        
    }

    componentHandler.upgradeAllRegistered();
  }); 

  let content = document.getElementsByClassName(`contentColl`); 

  for (let i = collapsible.length-1; i > -1; i--){
    if(content[i].children.length == 0){
      collapsible[i].remove();
      content[i].remove();
    }
  }

  // click casa item ou botao de atualizar os dados
  let collaps = document.getElementsByClassName(`collapsible`);
  listItem(collaps);
  let config = document.getElementsByClassName("mdl-button");
  listConfig(config);

}

// Create cards for devices in home
const setHtml = (indexRoom, indexDevice, values) =>{
  let html = ``;
  html += `<li class="mdl-card mdl-shadow--2dp" style="text-align:left;" id="collaps${indexRoom}__card${indexDevice}__field">`; 
      html += title(`collaps${indexRoom}__card${indexDevice}`,values.name);
      html += `<div class="mdl-card__supporting-text" id="collaps${indexRoom}__card${indexDevice}__devices">`;
      html += `<fieldset class="${values.type}" style="display: flex; flex-direction: column; justify-content: space-between";> `;
              for( a in values.traits){
                // verify type and add caracteristics of each device
                switch(a) {
                  case "OnOff":
                    html += OnOff(`collaps${indexRoom}__card${indexDevice}__OnOff`,values.traits.OnOff.on );
                    break;
                  case "Brightness":
                    html += Brightness(`collaps${indexRoom}__card${indexDevice}__Brightness`,values.traits.Brightness.brightness);
                    break;
                }
            }
             html += `
          </fieldset>
        `;
      html += `</div>`; 
      html += update(`collaps${indexRoom}__card${indexDevice}`);
      html += setupClose(indexRoom,indexDevice);
      html += setupConfig(indexRoom,indexDevice);
      html += `</li>`;

  return html;
}

// Create button remove device
const setupClose = (indexColl, indexCard) =>{
  let html = ``;
  html += `<div class="mdl-card__menu">
    <button id='collaps${indexColl}__card${indexCard}__close' class="close mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
      <i class="material-icons">close</i>
    </button>
    <div class="mdl-tooltip" data-mdl-for="collaps${indexColl}__card${indexCard}__close">
      Remove
    </div>
  </div>`;
  return html;
}

// Create button config device
const setupConfig = (indexColl, indexCard) =>{
  let html = ``;
  html += `<div class="mdl-card__menu" style="margin-right:40px" >
    <button id='collaps${indexColl}__card${indexCard}__config' class="config mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
      <i class="material-icons">settings</i>
    </button>
    <div class="mdl-tooltip" data-mdl-for="collaps${indexColl}__card${indexCard}__config">
      Configuration
    </div>
  </div>`;
  return html;
}

// Create field for device in a card
const setupField = (indexColl, indexCard, values, key) =>{
  let listItem =`
    <fieldset class="${values.type}" id="${key}">
      <div class="mdl-list__item mdl-list__item--two-line"  style="margin: 0px;">
        <span class="mdl-list__item-primary-content"  style="max-width: 350px;">
          <p id="collaps${indexColl}__card${indexCard}__${key}__title">${values.name}</p>
        </span>
        <span class="mdl-list__item-secondary-content" style="float:right;">
  `;

  for( a in values.traits){
      // verify type and add caracteristics of each device
      switch(a) {
        case "OnOff":
          listItem += OnOff(`collaps${indexColl}__card${indexCard}__${key}__OnOff`,values.traits.OnOff.on );
          break;
        case "Brightness":
          listItem += Brightness(`collaps${indexColl}__card${indexCard}__${key}__Brightness`,values.traits.Brightness.brightness);
          break;
      }
  }
  listItem+= `
        </span>
      </div>
    </fieldset>
  `;
  return listItem;
}

// Add title of card
const title = (path, name) =>{
    const t = `
        <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text" id="${path}__title">${name}</h2>
        </div>
    `;
    return t;
}

// Add update button
const update = (path) =>{
  const up = `
    <div class="mdl-card__actions mdl-card--border"  >
        <a id="${path}__update" class="update mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Update</a>
    </div>
  `;
  return up;
}

// Add item energy device
const OnOff = (name,value) => {
  let checked = '';
  if (value == true) { 
    checked = 'checked';
    value = "On";
  }else
    value = "Off";

  const l = `
    <span class="mdl-list__item-sub-title" style="margin-top: 10px;">
        <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="${name}" style="width: 50px;"> 
          <input type="checkbox" id="${name}" name="${name}" class="mdl-switch__input" ${checked}>
          <span class="mdl-switch__label">${value}</span>
        </label>
    </span>
  `;
  return l;
}

// Add item brightness device
const Brightness = (name,value) => {
  const b = `
  <span class="mdl-list__item-sub-title" style="display: flex;margin-top: 10px;">                 
        <input class="mdl-slider mdl-js-slider" type="range" id="${name}" name="${name}" min="0" max="100" value="${value}" step="1">
        ${value}
  </span>
  `;
  return b;
}

// Handle remove data from database
const removeHtml = (button) => {
  let p = button.id.split("__");
  let name = document.getElementById(`${p[0]}__${p[1]}__title`);
  let modal = document.querySelector(".modal");
  let html = `
    <h3>Remove ${name.innerText}</h3>
    <button onclick="removeDevice('${name.innerText}')">Remove Device</button>
  `;

  modal.innerHTML = html;
  let request = document.querySelector(".new-request");
  request.classList.add("open");

  componentHandler.upgradeAllRegistered();

}

// Handle configuration device 
const configHtml = (button) => {
  let p = button.id.split("__");
  let modal = document.querySelector(".modal");

  let html = `
    <h3>Configuration </h3>
    <ul class="demo-list-control mdl-list">
  `;
  let collapsible = document.getElementsByClassName(`collapsible`);
  let collaps = document.getElementsByClassName(`contentColl`); 
  let name = document.getElementById(`${p[0]}__${p[1]}__title`);
  let index = 0;
    
    for ( let i =0; i < collapsible.length; i++ ){
      for (let j = 0; j < collaps[i].childElementCount; j++) {
        if(collaps[i].children[j].firstElementChild.firstElementChild.innerText == name.innerText){
          index = i;
        }
      }
    } 
    // create html rooms for move device
    let moveButton = ``;
    //if(collapsible[index].innerText != "Assign your device to room" ){
      moveButton+= `<li class="mdl-menu__item mdl-button" style="text-transform: none;" id='${p[0]}__${p[1]}__newCity'>Add new City</li>`;
    //}
    if(collapsible[index].innerText != "Assign your device to city"){
      moveButton+=`<li class="mdl-menu__item mdl-button" style="text-transform: none;" id='${p[0]}__${p[1]}__newRoom'>Add new Room </li>`;
    }
    html+= `
    <fieldset>
      <div class="mdl-list__item mdl-list__item--two-line mdl-layout__header--waterfall"  style="margin: 0px;">
        <span class="mdl-list__item-primary-content" style="max-width:350px;text-align:left;">
          ${name.textContent}
        </span>
        <span class="mdl-list__item-secondary-content">
          <form  action="javascript:;" onsubmit="renameDevice(this)">
          
            <div class="android-search-box mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right mdl-textfield--full-width">
              <label class="mdl-button mdl-js-button mdl-button--icon" for="${p[0]}__${p[1]}__rename" id='${p[0]}__${p[1]}__rename_id'>
                <i class="material-icons">create</i>
              </label>
              <div class="mdl-textfield__expandable-holder">
                <input class="mdl-textfield__input" type="text" id="${p[0]}__${p[1]}__rename">
                <label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
              </div>
              <div class="mdl-tooltip" data-mdl-for="${p[0]}__${p[1]}__rename_id">
                Rename
              </div>
            </div>
          </form>
        </span>
        <span class="mdl-list__item-secondary-content">
          <button id="${p[0]}__${p[1]}__forward"
                  class="mdl-button mdl-js-button mdl-button--icon">
            <i class="material-icons">forward</i>
          </button>
          <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
              for="${p[0]}__${p[1]}__forward">
              ${moveButton}
          </ul>
          <div class="mdl-tooltip" data-mdl-for="${p[0]}__${p[1]}__forward">
            Move
          </div>
        </span>
      </div>
    </fieldset>
    `;
  html+= `
    </ul>
  `;

  modal.innerHTML = html;
  let request = document.querySelector(".new-request");
  request.classList.add("open");

  componentHandler.upgradeAllRegistered();
  
  let config = document.getElementsByClassName("mdl-button");
  listConfig(config);
}
