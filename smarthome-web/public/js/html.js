const homeContent = document.querySelector('.item-list');

let rooms = [];
let cities = [];

/*
 * Handle create layout for home
 */
const setupHome = data => {
      data.forEach((devices) => {
        const values = devices.val();

        if (!cities.includes(values.city)){
          cities.push(values.city);
          rooms.push([]);
        }
        
        if(!rooms[cities.indexOf(values.city)].includes(values.roomHint)){
          rooms[cities.indexOf(values.city)].push(values.roomHint);
        }
        
        let home = document.getElementById(`collaps${cities.indexOf(values.city)}__title`);
        let check = false;
        let r = rooms[cities.indexOf(values.city)];
        let devicesItems = document.getElementById(`collaps${cities.indexOf(values.city)}__card${r.indexOf(values.roomHint)}__devices`);

        // check home is true
        if (home){  
          check = home.classList.contains("activeColl");
        
          let content = document.getElementById(`collaps${cities.indexOf(values.city)}`);
          let room = document.getElementById(`collaps${cities.indexOf(values.city)}__card${r.indexOf(values.roomHint)}__field`);

          if (check){
            content.style.maxHeight = "100%";
          }

          let item = document.getElementById(devices.key);
          if (item){  
            item.remove();
          }

          // check room is true
          if (room){
            devicesItems.insertAdjacentHTML('beforeend',setupField(cities.indexOf(values.city),r.indexOf(values.roomHint), values, devices.key));
            componentHandler.upgradeAllRegistered();
          }else{
            content.insertAdjacentHTML('beforeend',setHtml(cities, r, values, devices.key));
            componentHandler.upgradeAllRegistered();
          }

        }else{
          let html = setNullHome(cities, r, values, devices);

          homeContent.insertAdjacentHTML('beforeend',html);
          componentHandler.upgradeAllRegistered();
        }

      });

      // click casa item ou botao de atualizar os dados
      let homes = document.getElementsByClassName("collapsible");
      listItem(homes);
      let updateButton = document.getElementsByClassName("update");
      listUpdate(updateButton);
      let close = document.getElementsByClassName("close");
      listClose(close);
      let config = document.getElementsByClassName("config");
      listConfig(config);
      
      componentHandler.upgradeAllRegistered();
 
};

const setNullHome = (cities, rooms, values, devices) => {
  let html =``;
  html += `<div class="collapsible" id="collaps${cities.indexOf(values.city)}__title">${values.city}</div>`;
  html += `<div class="contentColl request-list" id="collaps${cities.indexOf(values.city)}" >`;
  html += setHtml(cities, rooms, values, devices.key);
  html += `</div>`;
  return html;
}

// Create cards for devices in home
const setHtml = (cities, rooms, values, key ) =>{
  let html = ``;
  html += `<li class="mdl-card mdl-shadow--2dp" style="max-width:370px;text-align:left;" id="collaps${cities.indexOf(values.city)}__card${rooms.indexOf(values.roomHint)}__field">`; 
  html += title(`collaps${cities.indexOf(values.city)}__card${rooms.indexOf(values.roomHint)}`,values.roomHint);
  html += `<div class="mdl-card__supporting-text" id="collaps${cities.indexOf(values.city)}__card${rooms.indexOf(values.roomHint)}__devices">`;
  html += setupField(cities.indexOf(values.city),rooms.indexOf(values.roomHint), values, key);
  html += `</div>`; 
  html += update(`collaps${cities.indexOf(values.city)}__card${rooms.indexOf(values.roomHint)}`);
  html += setupClose(cities.indexOf(values.city),rooms.indexOf(values.roomHint));
  html += setupConfig(cities.indexOf(values.city),rooms.indexOf(values.roomHint));
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
        <a id="${path}" class="update mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Update</a>
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
    <span class="mdl-list__item-sub-title" style="float:right;display: flex; margin-right: 20px;">
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
  <span class="mdl-list__item-sub-title" style="float:right;display: flex;">                 
        <input class="mdl-slider mdl-js-slider" type="range" id="${name}" name="${name}" min="0" max="100" value="${value}" step="1">
        ${value}
  </span>
  `;
  return b;
}

// Handle remove data from database
const removeHtml = (button) => {
  let p = button.id.split("__");
  let fieldsets = document.querySelectorAll(`#${p[0]}__${p[1]}__field fieldset`);
  let modal = document.querySelector(".modal");
  let html = `
    <h3>Remove Device</h3>
    <form>
    <ul class="demo-list-control mdl-list">
  `;
  fieldsets.forEach( (item,index) => {
    let name = document.getElementById(`${p[0]}__${p[1]}__${item.id}__title`);
    html+= `
    <fieldset id="${item.id}">
      <div class="mdl-list__item mdl-list__item--two-line"  style="margin: 0px;">
        <span class="mdl-list__item-primary-content" style="max-width:350px;text-align:left;">
          ${name.textContent}
        </span>
        <span class="mdl-list__item-secondary-content" style="float:right;">
          <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="list-switch-${index}">
            <input type="checkbox" id="list-switch-${index}" class="mdl-switch__input" />
          </label>
        </span>
      </div>
    </fieldset>
    `;
  });

  html+= `
    </ul>
    <p class="error"></p>
    </form>
    <button onclick="removeDevice(${p[0]}__${p[1]})">Remove Device</button>
  `;

  modal.innerHTML = html;
  let request = document.querySelector(".new-request");
  request.classList.add("open");

  componentHandler.upgradeAllRegistered();

}

// Handle configuration device 
const configHtml = (button) => {
  let p = button.id.split("__");
  let fieldsets = document.querySelectorAll(`#${p[0]}__${p[1]}__field fieldset`);
  let modal = document.querySelector(".modal");
  let place = document.getElementById(`${p[0]}__${p[1]}__title`).textContent;
  let city = document.getElementById(`${p[0]}__title`).textContent;

  let html = `
    <h3>Configuration ${place}</h3>
    <ul class="demo-list-control mdl-list">
  `;
  fieldsets.forEach( (item,index) => {
    let name = document.getElementById(`${p[0]}__${p[1]}__${item.id}__title`);

    // create html rooms for move device
    let moveButton = ``;
    let r = rooms[cities.indexOf(city)];
    r.forEach( (room, i) =>{
        if(room != place){
          if (i == r.length-2)
            if(r[r.length-1] == place)
              moveButton+= `<li class="mdl-menu__item mdl-menu__item--full-bleed-divider" id='${p[0]}__${p[1]}__${item.id}__${room}'>${room} </li>`;
            else
              moveButton+=`<li class="mdl-menu__item" id='${p[0]}__${p[1]}__${item.id}__${room}'>${room} </li>`;
          
          else if (i == r.length-1)
            moveButton+= `<li class="mdl-menu__item mdl-menu__item--full-bleed-divider" id='${p[0]}__${p[1]}__${item.id}__${room}'>${room} </li>`;
          else
            moveButton+=`<li class="mdl-menu__item" id='${p[0]}__${p[1]}__${item.id}__${room}'>${room} </li>`;
      }

    });
    moveButton+= `<li class="mdl-menu__item" id='${p[0]}__${p[1]}__${item.id}__newCity'>Add new City</li>`;
    moveButton+=`<li class="mdl-menu__item" id='${p[0]}__${p[1]}__${item.id}__newRoom'>Add new Room </li>`;

    html+= `
    <fieldset id="${item.id}">
      <div class="mdl-list__item mdl-list__item--two-line"  style="margin: 0px;">
        <span class="mdl-list__item-primary-content" style="max-width:350px;text-align:left;">
          ${name.textContent}
        </span>
        <span class="mdl-list__item-secondary-content">
          <form  action="javascript:;" onsubmit="renameDevice(this)">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable" >
              <label class="mdl-button mdl-js-button mdl-button--icon" for="${p[0]}__${p[1]}__${item.id}__rename" id='${p[0]}__${p[1]}__${item.id}__rename_id'>
                <i class="material-icons">create</i>
              </label>
              <div class="mdl-textfield__expandable-holder">
                <input class="mdl-textfield__input" type="text" id="${p[0]}__${p[1]}__${item.id}__rename">
                <label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
              </div>
              <div class="mdl-tooltip" data-mdl-for="${p[0]}__${p[1]}__${item.id}__rename_id">
                Rename
              </div>
            </div>
          </form>
        </span>
        <span class="mdl-list__item-secondary-content">
          <button id="${p[0]}__${p[1]}__${item.id}__forward"
                  class="mdl-button mdl-js-button mdl-button--icon">
            <i class="material-icons">forward</i>
          </button>
          <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
              for="${p[0]}__${p[1]}__${item.id}__forward">
              ${moveButton}
          </ul>
          <div class="mdl-tooltip" data-mdl-for="${p[0]}__${p[1]}__${item.id}__forward">
            Move
          </div>
        </span>
      </div>
    </fieldset>
    `;
  });
  html+= `
    </ul>
  `;

  modal.innerHTML = html;
  let request = document.querySelector(".new-request");
  request.classList.add("open");

  componentHandler.upgradeAllRegistered();
  
  let menuItem = document.getElementsByClassName("mdl-menu__item");
  moveDevice(menuItem);
}