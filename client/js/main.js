let editentodo=-1;

function todoModel(todoText,CompleteStatus){
    var self=this;
    self.todoText=todoText;
    self.isActive = ko.observable(true);
    self.isComplete = ko.observable(CompleteStatus);
    self.isVisible= ko.observable(true);
}
const inputTodoText=document.querySelector('.inputTodoText');
function todoappViewModel(){
    var self=this;
    self.menus=['All','Active','Completed'];
    self.chosenMenuId = ko.observable();
    self.chosenMenuData = ko.observable();
    self.todoList=ko.observableArray([]);
    self.addFunction=function(){
        if(inputTodoText.value){
            self.todoList.push(new todoModel(inputTodoText.value,false));
            addToLocalStorageArray(inputTodoText.value,false)
            inputTodoText.value='';

            // fetch("/")
            //     .then(res => res.json())
            //     .then((json) => json.forEach((el)=>{
            //         console.log(el);
            //         self.todoList.push(new todoModel(el.todo,el.completed))
            //         localStorage.setItem("todo",JSON.stringify(json));
            //         addToLocalStorageArray(inputTodoText.value,false)
            //     })  
            //     )
            //     .catch(err=>console.warn(err))
            };
        }
    
        
    self.inputVisible=ko.observable(true);
    self.goToMenu = function(menu){
        
        self.chosenMenuId(menu); 
        if(menu=='All'){
            self.inputVisible(true);
            self.todoList().forEach(function (todo) {
                todo.isVisible(true);
        })
        }
        if(menu=='Active'){
            self.inputVisible(false);
            self.todoList().forEach(function (todo) {
                todo.isVisible(todo.isComplete()==false);
            });
        }
        if(menu=='Completed'){
            self.inputVisible(false);
            self.todoList().forEach(function (todo) {
                todo.isVisible(todo.isComplete()==true);
            });
        }
    }
    self.goToMenu('All');

    self.deleteTodo=function(todo){
        localStorage.removeItem(todo.todoText);
        self.todoList.remove(todo);
        const tasks = JSON.parse(localStorage.getItem("todo"));
        const Objindex = tasks.findIndex(obj =>(obj.todo == todo.todoText));
        tasks.splice(Objindex, 1);
        localStorage.setItem("todo",JSON.stringify(tasks));
        console.log(JSON.parse(localStorage.getItem('todo')).length)
    }
    self.editable=function(todo){
        this.isActive(false);
        todo.isComplete(false);
        const tasks = JSON.parse(localStorage.getItem("todo"));
        const newtasks = tasks.filter(function (word) {
            return word.todo == todo.todoText;
        });
        //console.log(tasks)
        //tasks.splice(objIndex, 1);
        editentodo=newtasks[0].todo;
        localStorage.setItem("todo",JSON.stringify(tasks));
    }
    self.saveItem=function(todosave){
        this.isActive(true);
        addToLocalStorageArray(todosave.todoText,false)
        //localStorage.setItem(todo.todoText,todo.isComplete())
        const tasks = JSON.parse(localStorage.getItem("todo"));
        const finaltasks = tasks.filter(function (word) {
            return word.todo != editentodo;
        });
        //objIndex = tasks.findIndex(obj =>(obj.todo == todosave.todoText));
        // //(tasks[objIndex]).todo=(todo.todoText);
        //console.log(finaltasks)
        // console.log(todosave.todoText)
        localStorage.setItem("todo",JSON.stringify(finaltasks));
        
            
        
    }
    self.makeComplete=function(){
        this.isComplete(true);
        self.todoList().forEach(function (todo) {
            if(todo.isComplete()==true){
                const tasks = JSON.parse(localStorage.getItem("todo"));
                tasks.forEach((task)=>{
                    if(task.todo == todo.todoText){
                        objIndex = tasks.findIndex(obj =>(obj.todo == todo.todoText));
                        tasks[objIndex].completed = true;
                        localStorage.setItem("todo",JSON.stringify(tasks));
                    }
                })
            };
        });
    }
    self.Reloadevent =document.addEventListener('DOMContentLoaded', function(e){
        e.preventDefault();
        const tasks=JSON.parse(localStorage.getItem('todo') || '[]');
        if(localStorage.getItem('todo') == '{}'){
            console.log("az inja")
        } else{
        tasks.forEach((el)=>{
            self.todoList.push(new todoModel(el.todo,el.completed))

        })       
    } 
    })
    self.downloadfunction=function(){
        const response=fetch(`http://localhost:5500/download`)
        .then(res => res.json())
        .then((json) => json.forEach((el)=>{
            self.todoList.push(new todoModel(el.todo,el.completed))
            localStorage.setItem("todo",JSON.stringify(json));
        })  
        )
        .catch(err=>console.warn(err))
        
    }
        //localStorage.setItem("todo",JSON.stringify(response));
    self.uploadfunction=function(){
        fetch('/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            // body: JSON.stringify({id:Math.floor(Math.random()*1000000),
            //                     todo:inputTodoText.value,
            //                     completed:false}), // Assuming todoData is a JSON object
            body: JSON.stringify(JSON.parse(localStorage.getItem("todo")))
        })
        //todo:this.todoList()[].todoText
        .then(response => response.text())
        .then(data => {
        console.log('Server response:', data);
        // Handle the server response as needed
        })
        
    }
}
ko.applyBindings(new todoappViewModel());

var addToLocalStorageArray = function (todo, value) {
    var id;
    var tasks;
    if(localStorage.getItem('todo')=== null || localStorage.getItem('todo') == '{}'){
        id=1;
        tasks='[]';
    }
    else{
        id=Math.floor(Math.random()*10000);
        tasks=localStorage.getItem('todo');
    }
        const todos=JSON.parse(tasks)
        todos.push(
            {
                id:generateUniqueId(),
                todo:todo,
                completed:value
            }
        );
        localStorage.setItem("todo",JSON.stringify(todos));
    // }
};
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 10);
}
const signin= document.getElementById('signin-link')
const signup= document.getElementById('signup-link')
const signout= document.getElementById('signout-link')
signin.addEventListener('click', function(e) {
    localStorage.clear();
})
signup.addEventListener('click', function(e) {
    localStorage.clear();
})
signout.addEventListener('click', function(e) {
    localStorage.clear();
})