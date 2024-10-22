import React, { useState, useEffect } from "react";

const BIN_ID = import.meta.env.VITE_BIN_ID;
const BIN_API_KEY = import.meta.env.VITE_BIN_API_KEY;

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    getJSONbin();
  }, []);

  const getJSONbin = async () => {
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
        {
          headers: {
            "X-Master-Key": `$2a$10$${BIN_API_KEY}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodoList(data.record);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateJSONbin = async (updatedList) => {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": `$2a$10$${BIN_API_KEY}`,
        },
        body: JSON.stringify(updatedList),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const deleteTodo = (index) => {
    const updatedList = todoList.filter((_, i) => i !== index);
    setTodoList(updatedList);
    updateJSONbin(updatedList);
  };

  const addTodo = (e) => {
    e.preventDefault();
    const newTodo = {
      title: e.target.inputTitle.value,
      description: e.target.inputDescription.value,
      place: e.target.inputPlace.value,
      category: "",
      dueDate: new Date(e.target.inputDate.value).toISOString(),
    };
    const updatedList = [...todoList, newTodo];
    setTodoList(updatedList);
    updateJSONbin(updatedList);
  };

  const filteredTodoList = todoList?.filter(
    (todo) =>
      filterInput === "" ||
      todo.title.toLowerCase().includes(filterInput.toLowerCase()) ||
      todo.description.toLowerCase().includes(filterInput.toLowerCase())
  );

  return (
    <div>
      <h1>My Todo App</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Place</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodoList?.map((todo, index) => (
            <tr key={index}>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>{todo.place}</td>
              <td>{new Date(todo.dueDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteTodo(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={addTodo}>
        <input id="inputTitle" placeholder="Title" required />
        <input id="inputDescription" placeholder="Description" required />
        <input id="inputPlace" placeholder="Place" required />
        <input id="inputDate" type="date" required />
        <button type="submit">Add Todo</button>
      </form>
      <input
        id="inputSearch"
        placeholder="Search"
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
      />
    </div>
  );
};

export default App;
