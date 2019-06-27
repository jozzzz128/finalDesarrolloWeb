'use strict'

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
          //window.removeEventListener('touchmove', ResizeTouch, false);
          //window.removeEventListener('touchend', stopResize, false);
      }
    }
    //------------------------------------------------------------------------------

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
    function createOrderNote(userName, globalExceptions, saucer){
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
                options.innerHTML = '<span class="icon-dots-three-horizontal"></span>';
            topOptions.append(options);
            //Title
            var title = document.createElement("div");
                title.classList.add("title");
                var globalE = "";
                if(globalExceptions.length != 0)globalE = '('+globalExceptions+')';
                title.innerHTML = '<p>'+userName+' <span>'+globalE+'</span></p>';
            topOptions.append(title);
        orderNote.append(topOptions);

       //OrderContent
       var orderContent = document.createElement("div");
           orderContent.classList.add("order-content");
           var ul = document.createElement("ul");
               for (var i = 0; i < saucer.length; i++) {
                 var li = document.createElement("li");
                     var exceptions = "";
                     if(saucer[i].exceptions.length != 0) exceptions = '<p>('+saucer[i].exceptions+')</p>';
                     li.innerHTML = '<input type="checkbox" id="'+noteCounters[1]+'-check-'+i+'"><label for="'+noteCounters[1]+'-check-'+i+'"><div class="check"><span class="icon-checkmark"></span></div>'+saucer[i].name+exceptions+'</label>';
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

    //PETICION AJAX
    function ajaxStart(url){
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
              console.log(JSON.parse(xhr.responseText));
          }
      };
      xhr.send();
    }

    //Prueba de las ordenes de notas
    var note = {
      userName:"José",
      globalExceptions: "Nada de picante, ni pepino",
      userOrder: [
        {
          name:"Hamburguesa Vegetaliana",
          exceptions:"Sin carne"
        },
        {
          name:"Boing de Manzana",
          exceptions:""
        }
      ]
    };
    var note2 = {
      userName:"José",
      globalExceptions: "",
      userOrder: [
        {
          name:"Hamburguesa Vegetaliana",
          exceptions:"Sin carne"
        },
        {
          name:"Boing de Manzana",
          exceptions:""
        },
        {
          name:"Boing de Manzana",
          exceptions:""
        },
        {
          name:"Hamburguesa Vegetaliana",
          exceptions:"Sin carne"
        },
        {
          name:"Boing de Manzana",
          exceptions:""
        },
        {
          name:"Boing de Manzana",
          exceptions:""
        }
      ]
    };
    createOrderNote(note.userName,note.globalExceptions,note.userOrder);
    createOrderNote(note.userName,note.globalExceptions,note.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note.userName,note.globalExceptions,note.userOrder);
    createOrderNote(note.userName,note.globalExceptions,note.userOrder);
    createOrderNote(note.userName,note.globalExceptions,note.userOrder);
    createOrderNote(note.userName,note.globalExceptions,note.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);
    createOrderNote(note2.userName,note2.globalExceptions,note2.userOrder);

    ajaxStart("js/menu.json");
});
