const homeContent = document.querySelector('.item-list');

// consiguração do item collapsible from informação das casas
const setupHome = data =>{

  let test = ``;
  let index = 0;
  data.forEach( (element) => {
    let home = document.getElementById(`collaps${index}__title`);
    let check = false;

    // verifica se a página foi atualizada ou apenas os dados
    if(home)
      check = home.classList.contains("activeColl");
    
    if(check){
      test += `<div class="collapsible activeColl" id="collaps${index}__title">${element.key}</div>`;
      test += `<div class="contentColl request-list" style="max-height:100%;" >`;
    }else{
      test += `<div class="collapsible" id="collaps${index}__title">${element.key}</div>`;
      test += `<div class="contentColl request-list" >`;
    }

    test += setupStructure(element,"collaps"+index);
    test += `</div>`;
    index++;
  });

  homeContent.innerHTML = test;
  componentHandler.upgradeAllRegistered();

  // click casa item ou botao de atualizar os dados
  let homes = document.getElementsByClassName("collapsible");
  listItem(homes);
  let update = document.getElementsByClassName("update");
  listUpdate(update);
  let close = document.getElementsByClassName("close");
  listClose(close);
  
}

// verifica se a estrutura da casa ou historico
const setupStructure = (data,path) =>{
  
  let structure = "";
  data.forEach( (element) => {
    structure += setupRoom(element,path);
  });
  return structure;
}
  
// verifica a quantidade de lugares na casa e cria card para cada uma
const setupRoom = (data,path)  =>{
    
  let index = 0;
  let card = '';
  data.forEach(element => {
    // define o titulo do lugar
    card += `<li class="mdl-card mdl-shadow--2dp" style="max-width:370px;text-align:left;" id="${path+"__card"+index}__field">`; 
    card += title(path+"__card"+index,element.key);
    card += `<div class="mdl-card__supporting-text" >`;

    // chama função com os dispositivo em cada lugar
    card += setupDevices(element,path+"__card"+index);
    card += '</div>';

    // botao de atualizar para cada lugar
    card += update(path+"__card"+index);
    card += `<div class="mdl-card__menu">
    <button id='${path+"__card"+index+"__close"}' class="close mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
      <i class="material-icons">close</i>
    </button>
  </div>`;
  card += `</li>`;
    index++;
  });
  return card;
}
  
// verifica a quantidade de dispositivos de um lugar
const setupDevices = (data,path)  =>{
    
    let devices = ``;
    let index = 0;
    data.forEach(element => {
      
      devices += setupTypeTraits(element.key,element.val(),path+"__item"+index);
      index++;
    });

    return devices;
}
  
// verifica o tipo de cada dispositivo e cria o layout para cada
const setupTypeTraits = (device,data,path)  =>{
  
  let listItem =`
  <fieldset class="${data.type}" id="${path}";">
    <div class="mdl-list__item mdl-list__item--two-line" style="margin: 0px;">
      <span class="mdl-list__item-primary-content"  style="max-width: 350px;">
        <p id="${path}__title">${device}</p>
      </span>
      <span class="mdl-list__item-secondary-content" style="float:right;">
    `;

    // verifica o tipo e insere as caracteristica de cada dispositivo
    switch(data.type) {
      case "Light":
        listItem += Brightness(path+"__Brightness",data.traits.Brightness.brightness);
        listItem += OnOff(path+"__OnOff",data.traits.OnOff.on );
        break;
      case "Powerplug":
      case "Sprinkler":
        listItem += OnOff(path+"__OnOff",data.traits.OnOff.on);
        break;
    }

  listItem+= `
      </span>
    </div>
  </fieldset>
  `;
  return listItem;
}  

// adiciona o campo de titulo do card
const title = (path, name) =>{
    const t = `
        <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text" id="${path}__title">${name}</h2>
        </div>
    `;
    return t;
}

// adiciona o campo de update
const update = (path) =>{
  const up = `
    <div class="mdl-card__actions mdl-card--border"  >
        <a id="${path}" class="update mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Update</a>
    </div>
  `;
  return up;
}

// adiciona o item de energia para cada dispostivo
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

// adiciona o item de brilho para uma lampada
const Brightness = (name,value) => {
  const b = `
  <span class="mdl-list__item-sub-title" style="float:right;display: flex;">                 
        <input class="mdl-slider mdl-js-slider" type="range" id="${name}" name="${name}" min="0" max="10" value="${value}" step="1">
        ${value}
  </span>
  `;
  return b;
}

// função que exclui item do banco

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
    let name = document.getElementById(item.id+"__title");
    html+= `
    <fieldset class="mdl-list__item">
      <span class="mdl-list__item-primary-content">
        ${name.textContent}
      </span>
      <span class="mdl-list__item-secondary-action">
        <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="list-switch-${index}">
          <input type="checkbox" id="list-switch-${index}" class="mdl-switch__input" />
        </label>
      </span>
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
