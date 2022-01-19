let toDolist = [];  // array de objetos para guardar los datos 

// buscamos en el DOM
const inputTextBox = document.getElementById("inputBox");   
const submitButton = document.getElementById("toDoButton");
const filterButton = document.getElementById("filterToDo");
const list = document.getElementById("toDoList");
const pending = document.getElementById("pendingTask");

// Agregamos los escuchadores de eventos

document.addEventListener("DOMContentLoaded", loadLocal); // cargamos la lista
submitButton.addEventListener("click", addToList);
filterButton.addEventListener("change", filterList);
document.addEventListener("click", deleteCheckItem);

// declaracion de variables
let _description = inputTextBox.value;
let _status = "uncompleted";
let pendingTask = 0;

// declaracion de objetos
let newTask = {
    Description: _description,
    Status: _status,
};


// funcion para agregar tareas a la lista
function addToList(e){

    e.preventDefault(); // evitamos de esta forma recargar la forma al tocar el boton submit del formulario    

    if (inputTextBox.value !== "" ){   // validamos que el campo no este vacio...
           
        _description = inputTextBox.value;
        _status = "uncompleted";

        newTask = {
            Description: _description,
            Status: _status,        
        };        
       
        toDolist.push(newTask);         // lo agregamos al array            
        console.log("se agrego un item");             

        // Guardamos la lista
        saveLocal(toDolist);   
        printList(toDolist);         // llamamos a la funcion para mostrarlo en pantalla
        inputTextBox.value = null;   // limpiamos el valor del input text
        console.log(newTask);
        showPendingTask();         // ejecutamos la funcion para mostrar la cantidad de tareas incompletas              
    }    
}


// funcion para borrar tareas o para marcar/desmarcar tareas como completadas
function deleteCheckItem(e){

    // podemos acceder a la propiedad id de los elementos que estamos clickeando

    if(e.target.id === "trashButton"){ 
    
        console.log("se elimino un item");
        console.log(e.target.parentElement.parentElement.attributes.key.value); 
         // accedemos al atributo key del padre del boton     
        const indexItem = e.target.parentElement.parentElement.attributes.key.value;       
            
        // Usamos el metodo de arrays Splice, pasamos por parametro el indice donde comenzamos a borrar 
        // elementos y la cantidad de elementos a eliminar
        toDolist.splice(indexItem, 1);
        showPendingTask();         // ejecutamos la funcion para mostrar la cantidad de tareas incompletas

        // Guardamos la lista
        saveLocal(toDolist);        
        
        printList(toDolist);
    }
   
    if(e.target.id === "checkButton"){ 
    
        const indexItem = e.target.parentElement.parentElement.attributes.key.value;    

        if(toDolist[indexItem].Status != "completed"){
            
            console.log("se marco una tarea como completada");      
    
            toDolist[indexItem].Status = "completed";    
            const element = e.target.parentElement.parentElement;        
            element.className = "completed";  
            showPendingTask();         // ejecutamos la funcion para mostrar la cantidad de tareas incompletas

            // Guardamos la lista
            saveLocal(toDolist);      
        }
        else{
            console.log("se desmarco una tarea como completada");      
    
            toDolist[indexItem].Status = "uncompleted";    
            const element = e.target.parentElement.parentElement;        
            element.className = "uncompleted";  
            showPendingTask();         // ejecutamos la funcion para mostrar la cantidad de tareas incompletas

            // Guardamos la lista
            saveLocal(toDolist);       
        }          
    }

    if(e.target.id === "clearAllButton"){ 
        toDolist.splice(0, toDolist.length);             
        
        removeLocal();              // eliminamos el contenido guardado en local storage
        showPendingTask();         // ejecutamos la funcion para mostrar la cantidad de tareas incompletas
        printList(toDolist);
    }    
}


// funcion para filtrar el listado
function filterList(e){

    const filterValue = e.target.value;
    console.log("buscando...");
    console.log(filterValue);

    const taskStatus = newTask.Status;
    
    if(filterValue === "completed"){
        completedList = toDolist.filter(valor => valor.Status === "completed");
        printList(completedList);
    }
     
    if(filterValue === "uncompleted"){
        uncompletedList = toDolist.filter(valor => valor.Status === "uncompleted");
        printList(uncompletedList);
    }
      
    if(filterValue === "all"){        
        printList(toDolist);
    } 
}

// funcion para mostrar en pantalla la lista
function printList(myArray){
    
    list.innerHTML = `${myArray.map((valor, index) =>
        `<div class=${valor.Status} key = ${index}>        
            <li class = "listItem">${valor.Description}</li>
            <div class = "checkButtonContainer">
                <button class="checkButton"  id = "checkButton" type = "submit"><i class='fas fa-check'></i></button>
            </div>
            <div class = "trashButtonContainer">
                <button class="trashButton" id="trashButton" type = "submit"><i class='fas fa-trash'></i></button>   
            </div>         
        </div>`        

        ).join("")}` 
}

// funcion para mostrar la cantidad de tareas pendientes
function showPendingTask(myArray){

    uncompletedList = toDolist.filter(valor => valor.Status === "uncompleted");
    pendingTasks = uncompletedList.length;
    pending.innerHTML = `<p id = "pending">You have ${pendingTasks} pending tasks</p>
                        <div class = "clearAllButtonContainer">
                            <button class="clearAllButton" id = "clearAllButton" type="submit">Clear All</button>
                        </div>`;
}



function saveLocal(myArray){
 
    // localStorage solo puede guardar strings, para guardar arrays u objetos usamos JSON.stringify()
    window.localStorage.setItem('todoList', JSON.stringify(toDolist));
}


function loadLocal(){
    if(localStorage.getItem("todoList") !== null){
        toDolist = JSON.parse(window.localStorage.getItem('todoList'));
        printList(toDolist);         // llamamos a la funcion para mostrarlo en pantalla
        showPendingTask();
    }           
}

function removeLocal(){

    window.localStorage.clear();
}


