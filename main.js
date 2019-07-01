'use strict'

var tempJSON = {
  pedidos: [
    {
      idUsuario: 2,
      idPedido: 1,
      horaCreacion: getTime(),
      fechaCreacion: getLittleDate(),
      pagado: false,
      paraLlevar: true,
      programado: "14:20",
      pedido: [
        {
          nombre: "Chilaquiles Rojos",
          exceptions: "Con 3 huevos, sin mucho picante, y sin crema"
        },
        {
          nombre: "Chilaquiles Verdes",
          exceptions: "Iguales que los rojos"
        },
        {
          nombre: "El cereal del tigre",
          exceptions: "Sin leche"
        },
        {
          nombre: "Coctel de Papaya",
          exceptions: "Con extra papaya"
        }
      ]
    }
  ],
  comandas: [],
  recibidos: [],
  finalizados: [],
  cancelados: []
};
var local = JSON.parse(localStorage.getItem("systemOrders"));
if(local == null){
  localStorage.setItem("systemOrders", JSON.stringify(tempJSON));
  local = JSON.parse(localStorage.getItem("systemOrders"));
}
tempJSON = local;

//Actualizar localStorage
function actualizarLocal(){
  localStorage.setItem("systemOrders", JSON.stringify(tempJSON));
}

//POP UP
function closePop(param1){
  var noteContent = param1.parentElement.parentElement;
  noteContent.style.transform = "scale(0)";
  setTimeout(()=>{
    noteContent.parentElement.style.opacity = "0";
    setTimeout(()=>{
      noteContent.parentElement.remove();
    },200);
  },200);
}

//Generar Pedido Form
function generatePedidoForm(param1){
  var popUp = document.querySelector("#pop-up");
  var popContent = param1.parentElement.parentElement;
      popContent.style.transform = "scale(0)";
  setTimeout(()=>{
    popContent.remove();
    var newContent = document.createElement("div");
        newContent.classList.add("pop-content");
        var newContentOptions = document.createElement("div");
            newContentOptions.classList.add("options");
            var iconX = document.createElement("span");
                iconX.classList.add("icon-x");
                iconX.addEventListener("click",function(e){ closePop(this); });

            var label1 = document.createElement("label");
                label1.setAttribute("for","input1");
                label1.innerHTML = 'Nombre:';
            var input1 = document.createElement("input");
                input1.setAttribute("type","text");
                input1.id = "input1";

            var label1_2 = document.createElement("label");
                label1_2.setAttribute("for","input2");
                label1_2.innerHTML = "Programado a las: ";
            var label2 = document.createElement("label");
                label2.setAttribute("for","input2");
                label2.innerHTML = '<span>0</span><span>0</span>:<span>0</span><span>0</span>';
                label2.classList.add("digital");
            var input2 = document.createElement("input");
                input2.setAttribute("type","number");
                input2.id = "input2";
                input2.addEventListener("keyup",function(e){
                  if(e.which < 48 && e.which != 8 || e.which > 57 && e.which != 8){
                    removeLast(this);
                  }
                  else if(this.value.length > 4){
                    removeLast(this);
                    transformToClock(this);
                  }
                  else transformToClock(this);
                });

            var label3 = document.createElement("label");
                label3.setAttribute("for","input3");
                label3.innerHTML = 'Buscar platillo del menú:';
            var input3 = document.createElement("input");
                input3.setAttribute("type","text");
                input3.id = "input3";
                input3.addEventListener("keyup",function(e){
                  displaySearchResults(this);
                });

            newContentOptions.append(iconX);
            newContentOptions.append(label1);
            newContentOptions.append(input1);
            newContentOptions.append(label1_2);
            newContentOptions.append(label2);
            newContentOptions.append(input2);
            newContentOptions.append(label3);
            newContentOptions.append(input3);
        newContent.append(newContentOptions);
    popUp.append(newContent);
  },200);
}

//Mostrar resultados de busqueda
function displaySearchResults(param1){
  var searchText = param1.value;
  var searchResults = searchInJSON(searchText,"menu.js");
  for (var i = 0; i < searchResults.length; i++) {
    var result = document.createElement("li");
    result.innerHTML = '<span class="icon-forkandknife"></span><p>'+searchResults[i].nombre+'<span>'+searchResults[i].descripcion+'</span></p>'+'<span class="precio">'+searchResults[i].precio+'</span>';
  }
}

//RANDOM NUMBER
function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

//Convertir a reloj
function transformToClock(param1){
    var label = param1.parentElement.querySelector('label.digital');
    var text = '';
    var paramValue = param1.value;
    for (var i = 0; i < paramValue.length; i++){
      if(i == 2) text += ":";
      text += '<span>'+paramValue[i]+'</span>';
    }
    if(paramValue.length == 0){
      text += '<span>0</span><span>0</span>:<span>0</span><span>0</span>';
    }else if(paramValue.length == 1) {
      text += '<span>0</span>:<span>0</span><span>0</span>';
    }else if (paramValue.length == 2 && i == 2) {
      text += ':<span>0</span><span>0</span>';
    }else if (paramValue.length == 3) {
        text += '<span>0</span>';
    }
    label.innerHTML = text;
}

//Remover ultimo caracter
function removeLast(param1){
  var newText = '';
  var text = param1.value;
  //if(e.which < 48 && e.which != 8 || e.which > 57 && e.which != 8){
  if(text.length > 4){
    newText = text[0]+text[1]+text[2]+text[3];
  }else{
    for (var i = 0; i < (text.length - 1); i++) {
      newText += text[i];
    }
  }
  param1.value = newText;
}


//RECHAZAR ORDEN
function rejectOrder(param1, type, pos){
  //Borrar pedido del localStorage
  if(type == "pedido"){
    tempJSON.pedidos[pos]["cancelado"] = type;
    tempJSON.cancelados.push(tempJSON.pedidos[pos]);
    tempJSON.pedidos.splice(pos, 1);
  }else{
    tempJSON.recibidos[pos]["cancelado"] = type;
    tempJSON.cancelados.push(tempJSON.recibidos[pos]);
    tempJSON.recibidos.splice(pos, 1);
  }
  actualizarLocal();

  var note = param1.parentElement.parentElement;
  note.style.transform = "scale(0)";
  setTimeout(()=>{
    note.remove();
  },200);
}
function rejectOrderPrepare(param1, pos){
  //Borrar pedido del localStorage
  tempJSON.comandas[pos]["cancelado"] = "comanda";
  tempJSON.cancelados.push(tempJSON.comandas[pos]);
  tempJSON.comandas.splice(pos, 1);
  actualizarLocal();

  var note = param1.parentElement.parentElement.parentElement;
  note.style.transform = "scale(0)";
  setTimeout(()=>{
    note.remove();
  },200);
}

//PETICION AJAX
function ajaxStart(url){
  var jsonReturn = {};
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200){
          jsonReturn = JSON.parse(xhr.responseText);
      }
  };
  xhr.send();

  return jsonReturn;
}

//MAIN options
function mainOptionsPedidoFocus(param1){
  param1.parentElement.style.top = "-32px";
  param1.parentElement.parentElement.querySelector(".main-options-content").style.top = "0px";
}
function mainOptionsPedidoBlur(param1){
  param1.parentElement.style.top = "0px";
  param1.parentElement.parentElement.querySelector(".main-options-content").style.top = "-100%";
}

//Obtener informacion de un usuario
function getUserFromID(id){
  var userJsons = ajaxStart("js/users.json");
    var bandera = false;
    var temp = 0;
    for (var i = 0; i < userJsons.length; i++) {
      if(userJsons[i].id == id){
        bandera = true;
        temp = i;
      }
    }
    if(bandera) return userJsons[temp];
    return null;
}

//Comprobar todas las notas marcadas
function allChecked(param1, order, user, pos){
  setTimeout(()=>{
    var inputs = param1.parentElement.parentElement.querySelectorAll("input").length;
    var checked = param1.parentElement.parentElement.querySelectorAll("input:checked").length;
    var confirmExists = param1.parentElement.parentElement.parentElement.parentElement.querySelector(".title p button");

    if (inputs == checked) {
      var confirmButton = document.createElement("button");
          confirmButton.innerHTML = 'Completar';
          confirmButton.addEventListener("click",function(e){ confirmOrderPrepared(this, order, user, pos); });
      param1.parentElement.parentElement.parentElement.parentElement.querySelector(".title p").append(confirmButton);
    }else if(confirmExists != null){
      confirmExists.style.transform = "scale(0)";
      confirmExists.style.opacity = "0";
      setTimeout(function(){
        confirmExists.remove();
      },100);
    }
  },0);
}

//Confirmar orden preparada
function confirmOrderPrepared(param1, order, user, pos){
  var posInArray = tempJSON.recibidos.length;
    tempJSON.comandas.splice(pos, 1);
    tempJSON.recibidos.push(order);
    actualizarLocal();

  var note = param1.parentElement.parentElement.parentElement.parentElement;
  note.style.transform = "scale(0)";
  setTimeout(()=>{
    note.remove();
  },200);
  generateFullOrder(order, user, posInArray);
};

//Obtener Hora actual
function getTime() {
  var d = new Date();
  if (d.getMinutes() < 10) return d.getHours() + ':0' + d.getMinutes();
  return d.getHours() + ':' + d.getMinutes();
}

//Obtener Fecha actual
function getLittleDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

//Generar pedido
function generateOrder(json, fromLocal = false, pos = 0){
  var posInArray = pos;
  if(!fromLocal){
    posInArray = tempJSON.pedidos.length;
    tempJSON.pedidos.push(json);
    actualizarLocal();
  }
  var userOwner = getUserFromID(json.idUsuario);
  //console.log(userOwner);
  var element1 = document.querySelector("#element1");
  var pedido = document.createElement("div");
      pedido.classList.add("pedido");
      if(userOwner.troyano) pedido.classList.add("fac-info");
      else pedido.classList.add("default");

      var mainOptions = document.createElement("ul");
          mainOptions.classList.add("main-options");
          var mainOptionsP = document.createElement("p");
              var horaEntrega = "";
              var lugar = '<span class="icon-forkandknife"></span>';
              if(json.programado != "now") horaEntrega = '<span class="icon-stopwatch"></span> '+json.programado;
              if(json.paraLlevar) lugar = '<span class="icon-shopping-bag"></span>';
              mainOptionsP.innerHTML = '<span class="icon-clock2"></span> '+json.horaCreacion + horaEntrega + lugar;
          mainOptions.append(mainOptionsP);
          var mainOptionsLi = document.createElement("li");
              mainOptionsLi.classList.add("icon-dots-three-horizontal");
              mainOptionsLi.setAttribute("tabindex","0");
              mainOptionsLi.addEventListener("focus",function(e){mainOptionsPedidoFocus(this);});
              mainOptionsLi.addEventListener("blur",function(e){mainOptionsPedidoBlur(this);});
          mainOptions.append(mainOptionsLi);
      pedido.append(mainOptions);

      var mainOptionsContent = document.createElement("ul");
          mainOptionsContent.classList.add("main-options-content");
          var mainOptionsContentLi1 = document.createElement("li");
              mainOptionsContentLi1.innerHTML = '<span class="icon-info"></span>Mas información del Pedido';
          mainOptionsContent.append(mainOptionsContentLi1);
          var mainOptionsContentLi2 = document.createElement("li");
              mainOptionsContentLi2.addEventListener("click",function(e){rejectOrder(this, 'pedido', posInArray);});
              mainOptionsContentLi2.innerHTML = '<span class="icon-bin2"></span>Rechazar Pedido';
          mainOptionsContent.append(mainOptionsContentLi2);
      pedido.append(mainOptionsContent);

      for (var i = 0; i < json.pedido.length; i++) {
        var topContainer = document.createElement("div");
            topContainer.classList.add("top-container");
            topContainer.innerHTML = '<div class="thumb"><span class="icon-forkandknife"></span></div><h2>'+json.pedido[i].nombre+'<span>Especificaciones:</span></h2>';
        pedido.append(topContainer);

        var content = document.createElement("p");
            content.classList.add("content");
            content.innerHTML = json.pedido[i].exceptions;
        pedido.append(content);
      }

      var confirm = document.createElement("button");
          confirm.classList.add("confirm");
          confirm.innerHTML = '<span class="icon-checkmark2"></span>Confirmar Pedido';
          confirm.addEventListener("click",function(){ confirmOrder(json, userOwner, this, posInArray); });
      pedido.append(confirm);
  element1.append(pedido);
}

//Confirmar pedidos
function confirmOrder(order, user, param1, posInArray){
  //Borrar pedido del localStorage
  tempJSON.pedidos.splice(posInArray, 1);
  actualizarLocal();

  param1.parentElement.style.transform = "scale(0)";
  setTimeout(()=>{
    param1.parentElement.remove();
  },200);
  createOrderNote(order, user);
}

//Obtener precio total de la orden
function getTotalPrice(order){
  var menu = ajaxStart("js/menu.json");
  var total = 0;
  for (var i = 0; i < order.length; i++){
    var nombreConst = order[i].nombre;
    for (var j = 0; j < menu.length; j++){
      for (var k = 0; k < menu[j].clase.length; k++) {
        if(menu[j].clase[k].nombre == nombreConst){
            total += menu[j].clase[k].precioIndividual;
            break;
        }
      }
    }

  }
  return total;
}

//confirmar orden recibida por el cliente
function confirmOrderReceived(param1, order, pos){
  //Actualizar Local
  tempJSON.recibidos.splice(pos, 1);
  tempJSON.finalizados.push(order);
  actualizarLocal();

  var pedidoFinish = param1.parentElement;
      pedidoFinish.style.transform = "scale(0)";
      setTimeout(()=>{
        pedidoFinish.remove();
      },200);
  //console.log(order);
}

//Generar pedido completado
//Generar pedidos
function generateFullOrder(orderJSON, user, pos){
    var order = orderJSON;
    order["horaTermino"] = getTime();
    order["totalPagado"] = getTotalPrice(order.pedido);

    var element1 = document.querySelector("#element2");
    var pedido = document.createElement("div");
        pedido.classList.add("pedido");
        if(user.troyano) pedido.classList.add("fac-info");
        else pedido.classList.add("default");

        var mainOptions = document.createElement("ul");
            mainOptions.classList.add("main-options");
            var mainOptionsP = document.createElement("p");
                var horaEncargo = "";
                var lugar = '<span class="icon-forkandknife"></span>';
                if(order.programado != "now") horaEncargo = '<span class="icon-stopwatch"></span> '+order.programado;
                if(order.paraLlevar) lugar = '<span class="icon-shopping-bag"></span>';
                mainOptionsP.innerHTML = '<span class="icon-clock2"></span> '+order.horaCreacion+' <span class="icon-clock2"></span> '+order.horaTermino+horaEncargo+lugar;
            mainOptions.append(mainOptionsP);
            var mainOptionsLi = document.createElement("li");
                mainOptionsLi.classList.add("icon-dots-three-horizontal");
                mainOptionsLi.setAttribute("tabindex","0");
                mainOptionsLi.addEventListener("focus",function(e){mainOptionsPedidoFocus(this);});
                mainOptionsLi.addEventListener("blur",function(e){mainOptionsPedidoBlur(this);});
            mainOptions.append(mainOptionsLi);
        pedido.append(mainOptions);

        var mainOptionsContent = document.createElement("ul");
            mainOptionsContent.classList.add("main-options-content");
            var mainOptionsContentLi1 = document.createElement("li");
                mainOptionsContentLi1.innerHTML = '<span class="icon-info"></span>Mas información del Pedido';
            mainOptionsContent.append(mainOptionsContentLi1);
            var mainOptionsContentLi2 = document.createElement("li");
                mainOptionsContentLi2.addEventListener("click", function(e){rejectOrder(this, 'recibido', pos);} );
                mainOptionsContentLi2.innerHTML = '<span class="icon-bin2"></span>Cancelar Pedido';
            mainOptionsContent.append(mainOptionsContentLi2);
        pedido.append(mainOptionsContent);

        var userInfo = document.createElement("div");
            userInfo.classList.add("user-info");
            var userInfoP = document.createElement("p");
                var payment = '';
                    if(order.pagado) payment = 'PAGADO';
                    else payment = 'TOTAL A PAGAR: $'+order.totalPagado;
                var span = payment;
                    if(user.expediente != null) span = 'EXP: '+user.expediente+' - '+payment;
                userInfoP.innerHTML = user.nombre+' '+user.apellidos+'<span>'+span+'</span>';

            var userInfoThumb = document.createElement("div");
                userInfoThumb.classList.add("thumb");
                userInfoThumb.style.background = 'url('+user.foto+')';
            userInfo.append(userInfoP);
            userInfo.append(userInfoThumb);
        pedido.append(userInfo);

        for (var i = 0; i < order.pedido.length; i++) {
          var topContainer = document.createElement("div");
              topContainer.classList.add("top-container");
              topContainer.innerHTML = '<h2>'+order.pedido[i].nombre+'<span>:Especificaciones</span></h2><div class="thumb"><span class="icon-forkandknife"></span></div>';
          pedido.append(topContainer);

          var content = document.createElement("p");
              content.classList.add("content");
              content.innerHTML = order.pedido[i].exceptions;
          pedido.append(content);
        }

        var confirm = document.createElement("button");
            confirm.classList.add("confirm");
            confirm.innerHTML = '<span class="icon-checkmark2"></span>Confirmar Recogido';
            confirm.addEventListener("click",function(){ confirmOrderReceived(this, order, pos); });
        pedido.append(confirm);
    element1.append(pedido);
}

//SLIDE 2
//----------------------------------------------------------------------------------
  //Calcular numero mas grande en un array
  function getHighNumber(numberArray){
    var high = 0;
    if(numberArray.length > 1){
      high = numberArray[0];
      for (var i = 1; i < numberArray.length; i++) {
        if(high < numberArray[i]) high = numberArray[i];
      }
    }else if(numberArray.length == 1)high = numberArray[0];
    return high;
  }
  //Obtener la cantidad de comandas que se pueden desplegar en pantalla por fila
  function getMaxDisplaySize(){
    return (window.innerWidth / 270);
  }

  //GENERAR ORDENES CON FORMA DE NOTA
  var notePaddingLeft = ((window.innerWidth - (parseInt(getMaxDisplaySize())*270))+20)/2;
  //totalLeft, totalNotes, tempNoteCounter
  var noteCounters = [notePaddingLeft,0,0];
  //Altura extra
  var alturaNotas = new Array(parseInt(getMaxDisplaySize())).fill(20);
  //Crear nota
  function createOrderNote(order, user, fromLocal = false, pos = 0){
    var posInArray = pos;
    if(!fromLocal){
      posInArray = tempJSON.comandas.length;
      tempJSON.comandas.push(order);
      actualizarLocal();
    }

    const maxDisplay = parseInt(getMaxDisplaySize());
    const contenedor = document.querySelector("#slide-2 .pedidos-container");
    //Generar array para almacenar la altura de cada fila
    //console.log(alturaNotas);
    if(noteCounters[2] > (maxDisplay - 1)){
      //Se resetea contador temporal
      noteCounters[2] = 0;
      //Se resetea totalLeft
      noteCounters[0] = notePaddingLeft;
    }
    //ORDER BLOCK
    var orderNote = document.createElement("div");
    orderNote.classList.add("recipe-block");
    orderNote.id = "id-temp";
    orderNote.style.top = alturaNotas[noteCounters[2]]+"px";
    orderNote.style.left = noteCounters[0]+"px";
      //TopOptions
      var topOptions = document.createElement("div");
          topOptions.classList.add("top-options");
          var options = document.createElement("div");
              options.classList.add("options");
              var place = document.createElement("span");
                  if(order.paraLlevar) place.classList.add("icon-shopping-bag");
                  else place.classList.add("icon-forkandknife");
              options.append(place);
              var dots = document.createElement("span");
                  dots.classList.add("icon-dots-three-horizontal");
                  dots.setAttribute("tabindex","0");
                  dots.addEventListener("focus", function(e){mainOptionsPedidoFocus(this);});
                  dots.addEventListener("blur", function(e){mainOptionsPedidoBlur(this);});
              options.append(dots);
          var optionsCont = document.createElement("ul");
              optionsCont.classList.add("main-options-content");
              var optionsContLi = document.createElement("li");
                  optionsContLi.innerHTML = '<span class="icon-bin2"></span>Cancelar Pedido';
                  optionsContLi.addEventListener("click",function(e){ rejectOrderPrepare(this, posInArray); });
              optionsCont.append(optionsContLi);
          topOptions.append(options);
          topOptions.append(optionsCont);
          //Title
          var title = document.createElement("div");
              title.classList.add("title");
              var globalE = "";
              if(user.globalExceptions.length != 0)globalE = '('+user.globalExceptions+')';
              title.innerHTML = '<p>'+user.nombre+' <span>'+globalE+'</span></p>';
          topOptions.append(title);
      orderNote.append(topOptions);

     //OrderContent
     var orderContent = document.createElement("div");
         orderContent.classList.add("order-content");
         var ul = document.createElement("ul");
             for (var i = 0; i < order.pedido.length; i++) {
               var li = document.createElement("li");
                   var exceptions = "";
                   if(order.pedido[i].exceptions.length != 0) exceptions = '<p>('+order.pedido[i].exceptions+')</p>';
                   var checkBox = document.createElement("input");
                       checkBox.setAttribute("type","checkbox");
                       checkBox.id = noteCounters[1]+'-check-'+i;
                    var checkLabel = document.createElement("label");
                        checkLabel.setAttribute("for",noteCounters[1]+'-check-'+i);
                        checkLabel.addEventListener("click",function(e){allChecked(this, order, user, posInArray)});
                        checkLabel.innerHTML = '<div class="check"><span class="icon-checkmark"></span></div>'+order.pedido[i].nombre+exceptions;
                   li.append(checkBox);
                   li.append(checkLabel);
               ul.append(li);
             }
         orderContent.append(ul);
     orderNote.append(orderContent);
    contenedor.append(orderNote);

    var idtemp = document.getElementById("id-temp");
        alturaNotas[noteCounters[2]] += idtemp.getBoundingClientRect().height + 20;
        idtemp.id = "";

    //Se incrementa espaciado a la izquierda
    noteCounters[0]+=270;
    //Se incrementa contador de notas total
    noteCounters[1]++;
    //Se incrementa contador de notas temporal
    noteCounters[2]++;
    //Ajustar altura contenedor
    document.querySelector("#slide-2 .pedidos-container").style.height = getHighNumber(alturaNotas)+"px";
  }
//----------------------------------------------------------------------------------

window.addEventListener('load',()=>{

    //Comprobar informacion del LocalStorage
    if(tempJSON.pedidos.length != 0){
      for (var i = 0; i < tempJSON.pedidos.length; i++) {
        generateOrder(tempJSON.pedidos[i],true,i);
      }
    }
    if(tempJSON.comandas.length != 0){
      for (var i = 0; i < tempJSON.comandas.length; i++) {
        createOrderNote(tempJSON.comandas[i], getUserFromID(tempJSON.comandas[i].idUsuario), true, i);
      }
    }
    if(tempJSON.recibidos.length != 0){
      for (var i = 0; i < tempJSON.recibidos.length; i++) {
        generateFullOrder(tempJSON.recibidos[i], getUserFromID(tempJSON.recibidos[i].idUsuario), i);
      }
    }
    if(tempJSON.finalizados.length != 0){

    }
    if(tempJSON.cancelados.length != 0){

    }

    //SLIDE 1
    //------------------------------------------------------------------------------
    var element = document.getElementById('element1');
    var element2 = document.getElementById('element2');
    var resizer = document.getElementById('resizer');

    //Drag Touch y no Touch
    if(element != null && element2 != null && resizer != null){
      resizer.addEventListener('mousedown', initResize, false);
      //Touch en moviles
      resizer.addEventListener('touchstart', initResize, false);

      function initResize(e) {
         window.addEventListener('mousemove', Resize, false);
         window.addEventListener('mouseup', stopResize, false);
         //Touch en moviles
         window.addEventListener('touchmove', ResizeTouch, false);
         window.addEventListener('touchend', stopResize, false);
      }
      function Resize(e) {
        var limit = 480;
        var movement_size = e.clientX - 60 - element.offsetLeft;
         if(movement_size + 60 > limit && (window.innerWidth - movement_size) > limit){
           resizer.style.left = "calc("+movement_size + 'px - 25px)';
           element.style.width = movement_size + 'px';
           element2.style.width = "calc(100vw - 60px - "+movement_size+ "px)";
         }
         //element.style.height = (e.clientY - element.offsetTop) + 'px';
      }
      function ResizeTouch(e){
        var limit = 480;
        var movement_size = e.touches[0].clientX - 60 - element.offsetLeft;
         if(movement_size + 60 > limit && (window.innerWidth - movement_size) > limit){
           resizer.style.left = 'calc('+movement_size + 'px - 25px)';
           element.style.width = movement_size + 'px';
           element2.style.width = "calc(100vw - 60px - "+movement_size+ "px)";
         }
      }
      function stopResize(e) {
          window.removeEventListener('mousemove', Resize, false);
          window.removeEventListener('mouseup', stopResize, false);
          //
          window.removeEventListener('touchmove', ResizeTouch, false);
          window.removeEventListener('touchend', stopResize, false);
      }
    }
    //------------------------------------------------------------------------------

    /*function reAdjustOrders(){
      const contenedor = document.querySelectorAll("#slide-1 .pedidos-container .recipe-block");
      noteCounters = [20,0,0];
    }*/

    //FOOTER Botones
    var footerButtons = document.querySelectorAll("footer ul li");
    var slide1 = document.querySelector("#slide-1").style;
    var slide2 = document.querySelector("#slide-2").style;
    function showPrincipal(){
      slide1.left = "0px";
      slide2.left = "100vw";
      footerButtons[0].classList = "selected";
      footerButtons[1].classList = "";
    }
    function showSecond(){
      slide1.left = "-100vw";
      slide2.left = "0px";
      footerButtons[0].classList = "";
      footerButtons[1].classList = "selected";
    }
    footerButtons[0].addEventListener("click", showPrincipal);
    footerButtons[1].addEventListener("click", showSecond);

    //Prueba
    var ordenPrueba1 = {
      idUsuario: 2,
      idPedido: 1,
      horaCreacion: getTime(),
      pagado: false,
      paraLlevar: true,
      programado: "14:20",
      pedido: [
        {
          nombre: "Chilaquiles Rojos",
          exceptions: "Con 3 huevos, sin mucho picante, y sin crema"
        },
        {
          nombre: "Chilaquiles Verdes",
          exceptions: "Iguales que los rojos"
        },
        {
          nombre: "El cereal del tigre",
          exceptions: "Sin leche"
        },
        {
          nombre: "Coctel de Papaya",
          exceptions: "Con extra papaya"
        }
      ]
    }
    var ordenPrueba2 = {
      idUsuario: 3,
      idPedido: 3,
      horaCreacion: getTime(),
      pagado: false,
      paraLlevar: false,
      programado: "now",
      pedido: [
        {
          nombre: "Huevos Estrellados",
          exceptions: "Con 3 huevos"
        },
        {
          nombre: "Jugo de Naranja",
          exceptions: ""
        }
      ]
    }
    var randomInterval = randomIntFromInterval(0,40)+"000";
    setInterval(()=>{
      var ordenPru = [ordenPrueba1,ordenPrueba2];
      console.log(randomIntFromInterval(-0,1));
      generateOrder(ordenPru[randomIntFromInterval(-0,1)]);
      randomInterval = randomIntFromInterval(0,10)+"000";
    },randomInterval);
    //ajaxStart("js/menu.json");
});
