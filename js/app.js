const formularioContactos = document.querySelector("#contacto");
const listadoContactos = document.querySelector("#listado-contactos tbody");
const inputBuscador = document.querySelector("#buscar");


eventListeners();

function eventListeners(){
     //Cuando el formulario de crear o editar se ejcuta
     formularioContactos.addEventListener("submit", leerFormulario)

     //Listener para eliminar el contacto
     if (listadoContactos) {
           listadoContactos.addEventListener("click", eliminarContacto)
     }

     //Buscador
     inputBuscador.addEventListener("input",buscarContactos)

     numeroContactos()
}

function leerFormulario(e){
     e.preventDefault();
     //Leer los datos de los inputs
     const nombre = document.querySelector("#nombre").value;
     const empresa = document.querySelector("#empresa").value;
     const telefono = document.querySelector("#telefono").value;
     const accion = document.querySelector("#accion").value;

     if (nombre === "" || empresa === "" || telefono === "") {
          //Dos parametros texto y clase
          mostrarNotificacion("Todos los campos son obligatorios", "error")
     }
     else{
          
          //Pasa la validacion, crear llamada a Ajax
          const infoContacto = new FormData();
          infoContacto.append("nombre", nombre);
          infoContacto.append("empresa", empresa);
          infoContacto.append("telefono", telefono);
          infoContacto.append("accion", accion);

          if (accion === "crear") {
               //creamos un nuevo contacto
               insertarBD(infoContacto);
          }
          else{
               //editar el contacto
               //Leer el id
               const idRegistro = document.querySelector("#id").value;
               infoContacto.append("id", idRegistro);
               actualizarRegistro(infoContacto);
          }

     }
}
function actualizarRegistro(datos) {
     //Llamado a ajax
     //Crear el objeto
     const xhr = new XMLHttpRequest();

     //Abrir la conexion
     xhr.open("POST","inc/modelos/modelo-contactos.php", true)

     //Leer respuesta
     xhr.onload = function () {
          if(xhr.status == 200){
               //Leemos la respuesta de php
               console.log(xhr.responseText);
               const respuesta = JSON.parse(xhr.responseText);
               if (respuesta.respuesta === "correcto"){
                    //Mostrar notificacion
                    mostrarNotificacion("Contacto editado correctamente","correcto");
               }else{
                    mostrarNotificacion("Hubo un error...", "error");
               }
               //Despues de 3 seconds redireccionar 
               setTimeout(() => {
                    window.location.href = "index.php";
               }, 3000);
          }
     }

     xhr.send(datos);
}

/**Inserta en la base de datos via ajax */
function insertarBD(datos) {
     //Llamado a ajax
     //Crear el objeto
     const xhr = new XMLHttpRequest();

     //Abrir la conexion
     xhr.open("POST","inc/modelos/modelo-contactos.php", true)

     //Pasa los datos
     xhr.onload = function () {
          if (xhr.status === 200) {
               //Leemos la respuesta de php
               console.log(xhr.responseText);

               const respuesta = JSON.parse(xhr.responseText);

               //Inserta un nuevo elemento a la tabla
               const nuevoContacto = document.createElement("tr");

               nuevoContacto.innerHTML = `
                    <td>${respuesta.datos.nombre}</td>
                    <td>${respuesta.datos.empresa}</td>
                    <td>${respuesta.datos.telefono}</td>
               `;

               //Crear Contenedor para los botones
               const contenedorAcciones = document.createElement("td")

               //Crear el icono de editar
               const iconoEditar = document.createElement("i")
               iconoEditar.classList.add("fas", "fa-pen-square")

               //Crear el enlace para editar
               const btnEditar = document.createElement("a")
               btnEditar.appendChild(iconoEditar)
               btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
               btnEditar.classList.add("btn", "btn-editar");

               //Agregarlo al padre
               contenedorAcciones.appendChild(btnEditar)

               //Crear el icono de eliminar
               const iconoEliminar = document.createElement("i")
               iconoEliminar.classList.add("fas", "fa-trash-alt")

               //Crear el boton de Eliminar
               const btnEliminar = document.createElement("button")
               btnEliminar.appendChild(iconoEliminar)
               btnEliminar.setAttribute("data-id", respuesta.datos.id_insertado)
               
               btnEliminar.classList.add("btn", "btn-borrar");

               //Agregarlo al padre
               contenedorAcciones.appendChild(btnEliminar)

               //Agragarlo al tr
               nuevoContacto.appendChild(contenedorAcciones)

               //Agregando a los contactos
               listadoContactos.appendChild(nuevoContacto)

               //Resetear el formulario
               document.querySelector("form").reset();

               //Mostrar la notificacion
               mostrarNotificacion("Contacto creado correctamente", "correcto")

               //Actualizamos el numero
               numeroContactos()

          }
     }

     //Enviar los datos
     xhr.send(datos);
}

function eliminarContacto(e) {
     if (e.target.parentElement.classList.contains("btn-borrar")) {
          //Tomar el id
          const id = e.target.parentElement.getAttribute("data-id");

          //Preguntar al usuario si estan seguros
          const respuesta = confirm("Estas seguro?")

          if (respuesta) {
               //Llamado a ajax
               //Crear el objeto
               const xhr = new XMLHttpRequest();

               //Abrir la conexion
               xhr.open("GET",`inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true)

               //Leer la respuesta
               xhr.onload = function () {
                    if (xhr.status === 200) {
                         //Leemos la respuesta de php
                         console.log(xhr.responseText);
                         const resultado = JSON.parse(xhr.responseText);
                         if (resultado.respuesta === "correcto") {
                              //Eliminar el registro del DOM
                              e.target.parentElement.parentElement.parentElement.remove();


                              //Mostrar notificación
                              mostrarNotificacion("Contacto eliminado","correcto")
                              //Actualizamos el numero
                              numeroContactos()
                         }
                         else{
                              //Mostramos una notificación
                              mostrarNotificacion("Hubo un error...", "error")

                         }


                         //console.log(resultado);
                    }
               }
               xhr.send();
          }
     }
     
}

//Notificacion en pantalla
function mostrarNotificacion(mensaje, clase) {
     const notificacion = document.createElement("div");
     notificacion.classList.add(clase, "notificacion", "sombra");
     notificacion.textContent = mensaje;

     /* Formulario*/
     formularioContactos.insertBefore(notificacion, document.querySelector("form legend"));

     //Ocultar y mostrar la notificacion
     setTimeout(() => {
          notificacion.classList.add("visible");
          setTimeout(() => {
               notificacion.classList.remove("visible");  
               setTimeout(() => {
                    notificacion.remove();
               
               }, 500);
          }, 2000);

     }, 100);

}

//Buscador de registros
function buscarContactos(e){
     const expresion = new RegExp(e.target.value, "i")
     const registros = document.querySelectorAll("tbody tr");

     registros.forEach(registro => {
          registro.style.display = "none";

          if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
               registro.style.display = "table-row";
          }
          numeroContactos();
     })
}

//Muestra el numero de contactos
function numeroContactos(){
     const totalContactos = document.querySelectorAll("tbody tr");
     const contenedorNumero = document.querySelector(".total-contactos span");

     let total = 0;
     totalContactos.forEach(contacto =>{
          if (contacto.style.display === "" || contacto.style.display === "table-row") {
               total++;
          }
     })

     contenedorNumero.textContent = total;


}
