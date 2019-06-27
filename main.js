'use strict'

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
function getUserFromID(id, callbackDELcallback){
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
function allChecked(param1, order, user){
  setTimeout(()=>{
    var inputs = param1.parentElement.parentElement.querySelectorAll("input").length;
    var checked = param1.parentElement.parentElement.querySelectorAll("input:checked").length;
    var confirmExists = param1.parentElement.parentElement.parentElement.parentElement.querySelector(".title p button");

    if (inputs == checked) {
      var confirmButton = document.createElement("button");
          confirmButton.innerHTML = 'Completar';
          confirmButton.addEventListener("click",function(e){ confirmOrderPrepared(this, order, user); });
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
function confirmOrderPrepared(param1, order, user){
  var note = param1.parentElement.parentElement.parentElement.parentElement;
  note.style.transform = "scale(0)";
  setTimeout(()=>{
    note.remove();
  },200);
  generateFullOrder(order, user);
};

//Obtener Hora actual
function getTime() {
  var d = new Date();
  if (d.getMinutes() < 10) return d.getHours() + ':0' + d.getMinutes();
  return d.getHours() + ':' + d.getMinutes();
}

//Generar pedido
function generateOrder(json){
  var userOwner = getUserFromID(json.idUsuario);

  var element1 = document.querySelector("#element1");
  var pedido = document.createElement("div");
      pedido.classList.add("pedido");
      if(userOwner.troyano) pedido.classList.add("fac-info");
      else pedido.classList.add("default");

      var mainOptions = document.createElement("ul");
          mainOptions.classList.add("main-options");
          var mainOptionsP = document.createElement("p");
              mainOptionsP.innerHTML = '<span class="icon-clock2"></span> '+json.horaCreacion;
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
          confirm.addEventListener("click",function(){ confirmOrder(json, userOwner, this); });
      pedido.append(confirm);
  element1.append(pedido);
}

//Confirmar pedidos
function confirmOrder(order, user, param1){
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
function confirmOrderRecieved(param1, order){
  var pedidoFinish = param1.parentElement;
      pedidoFinish.style.transform = "scale(0)";
      setTimeout(()=>{
        pedidoFinish.remove();
      },200);
  console.log(order);
}

//Generar pedido completado
//Generar pedidos
function generateFullOrder(orderJSON, user){
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
              mainOptionsP.innerHTML = '<span class="icon-clock2"></span> '+order.horaCreacion+' <span class="icon-clock2"></span> '+order.horaTermino;
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
          confirm.addEventListener("click",function(){ confirmOrderRecieved(this, order); });
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
  function createOrderNote(order, user){
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
              var dots = document.createElement("span");
                  dots.classList.add("icon-dots-three-horizontal");
                  dots.setAttribute("tabindex","0");
                  dots.addEventListener("focus", function(e){mainOptionsPedidoFocus(this);});
                  dots.addEventListener("blur", function(e){mainOptionsPedidoBlur(this);});
              options.append(dots);
          var optionsCont = document.createElement("ul");
              optionsCont.classList.add("main-options-content");
              optionsCont.innerHTML = '<li><span class="icon-bin2"></span>Cancelar Pedido</li>';
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
                        checkLabel.addEventListener("click",function(e){allChecked(this, order, user)});
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
    var ordenPrueba = {
      idUsuario: 1,
      idPedido: 1,
      horaCreacion: getTime(),
      pagado: false,
      pedido: [
        {
          nombre: "Chilaquiles Rojos",
          tipo: "Chilaquiles",
          exceptions: "Con 3 huevos, sin mucho picante, y sin crema"
        },
        {
          nombre: "Chilaquiles Verdes",
          tipo: "Chilaquiles",
          exceptions: "Iguales que los rojos"
        }
      ]
    }
    generateOrder(ordenPrueba);

    //ajaxStart("js/menu.json");
});
