"use strict";
let todoList = [];

let getJSONbin = function () {
  let req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://api.jsonbin.io/v3/b/6717c651ad19ca34f8bcc484/latest",
    true
  );
  req.setRequestHeader(
    "X-Master-Key",
    "$2a$10$oTCsN1in9u9Sgxq6r9ZwZO343y3lbu8229JdBHC.HrWXD1SXG2rwS"
  );
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      todoList = JSON.parse(req.responseText).record;
      updateTodoList();
    }
  };
  req.send();
};

let updateJSONbin = function () {
  let req = new XMLHttpRequest();
  req.open("PUT", "https://api.jsonbin.io/v3/b/6717c651ad19ca34f8bcc484", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader(
    "X-Master-Key",
    "$2a$10$oTCsN1in9u9Sgxq6r9ZwZO343y3lbu8229JdBHC.HrWXD1SXG2rwS"
  );
  req.send(JSON.stringify(todoList));
};

let updateTodoList = function () {
  let todoListDiv = document.getElementById("todoListView");

  // remove all elements
  while (todoListDiv.firstChild) {
    todoListDiv.removeChild(todoListDiv.firstChild);
  }

  // add all elements
  let filterInput = document.getElementById("inputSearch").value.toLowerCase();
  for (let i = 0; i < todoList.length; i++) {
    if (
      filterInput === "" ||
      todoList[i].title.toLowerCase().includes(filterInput) ||
      todoList[i].description.toLowerCase().includes(filterInput)
    ) {
      let newElement = document.createElement("p");
      let newContent = document.createTextNode(
        todoList[i].title + " " + todoList[i].description
      );
      newElement.appendChild(newContent);

      let newDeleteButton = document.createElement("input");
      newDeleteButton.type = "button";
      newDeleteButton.value = "x";
      newDeleteButton.addEventListener("click", function () {
        deleteTodo(i);
      });

      newElement.appendChild(newDeleteButton);
      todoListDiv.appendChild(newElement);
    }
  }
};

setInterval(updateTodoList, 1000);

let deleteTodo = function (index) {
  todoList.splice(index, 1);
  updateJSONbin();
  updateTodoList();
};

let addTodo = function () {
  // get the elements in the form
  let inputTitle = document.getElementById("inputTitle");
  let inputDescription = document.getElementById("inputDescription");
  let inputPlace = document.getElementById("inputPlace");
  let inputDate = document.getElementById("inputDate");
  // get the values from the form
  let newTitle = inputTitle.value;
  let newDescription = inputDescription.value;
  let newPlace = inputPlace.value;
  let newDate = new Date(inputDate.value);
  // create new item
  let newTodo = {
    title: newTitle,
    description: newDescription,
    place: newPlace,
    category: "",
    dueDate: newDate,
  };
  // add item to the list
  todoList.push(newTodo);
  updateJSONbin();
  updateTodoList();
};

getJSONbin();
