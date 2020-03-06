//define ui variables

const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

//load all event listeners, so that they are not in the global scope
loadEventListeners();

//function to load all event listeners
function loadEventListeners(){
    //DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    //Add task event
    form.addEventListener('submit', addTask);
    //remove task event
    taskList.addEventListener('click', removeTask);
    //removes all events with clear tasks button
    clearBtn.addEventListener('click', clearTasks);
    filter.addEventListener('keyup', filterTasks);
}

//getTasks from localStorage
function getTasks(){
    let tasks;

    //check to see if local storage has anything in it
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task){
        //create LI element
        const li = document.createElement('li');
        //create class for this element
        li.className = 'collection-item'; //this matches the rest of the html 
        //create text node and append to to list
        li.appendChild(document.createTextNode(task));
        //Create new link element
        const link = document.createElement('a');  //this will be the delete link
        //create class for this element
        link.className = 'delete-item secondary-content';
        //add icon html
        link.innerHTML = '<i class = "fa fa-remove"></i>';
        //apendf link to li
        li.appendChild(link);

        //Append Li to UL - we defined this as taskList at start!
        taskList.appendChild(li);
    });
}

//Add task
function addTask(event){
    //if there is nothing entered in the value
    if(taskInput.value === ''){
        alert('Add a task first!');
    }
    else{
        //create LI element
        const li = document.createElement('li');
        //create class for this element
        li.className = 'collection-item'; //this matches the rest of the html 
        //create text node and append to to list
        li.appendChild(document.createTextNode(taskInput.value));
        //Create new link element
        const link = document.createElement('a');  //this will be the delete link
        //create class for this element
        link.className = 'delete-item secondary-content';
        //add icon html
        link.innerHTML = '<i class = "fa fa-remove"></i>';
        //apendf link to li
        li.appendChild(link);

        //Append Li to UL - we defined this as taskList at start!
        taskList.appendChild(li);

        //Sore entry in local storage
        storeTaskInLocalStorage(taskInput.value);


        //clear input
        taskInput.value = '';
    }
    event.preventDefault();
}

//store the entry in local storage

function storeTaskInLocalStorage(task){
    let tasks;

    //check to see if local storage has anything in it
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Remove Task
function removeTask(event){
    if(event.target.parentElement.classList.contains('delete-item')){
        if(confirm('Are you sure you want to delete this task?')){
            event.target.parentElement.parentElement.remove();

            //remove from local storage
            removeTaskFromLocalStorage(event.target.parentElement.parentElement);
        }   
    }
}

//remove from local storage
function removeTaskFromLocalStorage(taskItem){
    let tasks;

    //check to see if local storage has anything in it
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//clear all tasks with task button
function clearTasks(){
    console.log('Clear Tasks clicked!');
    //taskList.innerHTML = '';    //this approach is a little slow though

    //Faster method -> difference between the two: 
    // https://jsperf.com/innerhtml-vs-removechild
    if(confirm('Are you sure you want to delete the entire list?')){
        while(taskList.firstChild){
            taskList.removeChild(taskList.firstChild);
        }

        //clear all from local storage
        clearTasksFromLocalStorage();
    }
}

//clear all from local storage - function, called in clearTasks()
function clearTasksFromLocalStorage(){
    localStorage.clear();
}


//Filter tasks
function filterTasks(event){
    //lowercase to prevent errors
    const text = event.target.value.toLowerCase();
    document.querySelectorAll('.collection-item').forEach(function(task){
        
        const item = task.firstChild.textContent;
        //if empty will return -1, so if not equal to -1, then you know there are entries in task list
        if(item.toLowerCase().indexOf(text) != -1){
            task.style.display = 'block';
        }else{
            task.style.display = 'none';
        }
    });
}