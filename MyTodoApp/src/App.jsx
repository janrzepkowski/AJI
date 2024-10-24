import React, { useState, useEffect } from "react";

const BIN_ID = import.meta.env.VITE_BIN_ID;
const BIN_API_KEY = import.meta.env.VITE_BIN_API_KEY;

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const filteredTodoList = todoList?.filter((todo) => {
    const todoDate = new Date(todo.dueDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (filterInput === "" ||
        todo.title.toLowerCase().includes(filterInput.toLowerCase()) ||
        todo.description.toLowerCase().includes(filterInput.toLowerCase())) &&
      (!start || todoDate >= start) &&
      (!end || todoDate <= end)
    );
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">My Todo App</h1>
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={addTodo}>
            <div className="mb-3">
              <input
                id="inputTitle"
                className="form-control"
                placeholder="Title"
                required
              />
            </div>
            <div className="mb-3">
              <input
                id="inputDescription"
                className="form-control"
                placeholder="Description"
                required
              />
            </div>
            <div className="mb-3">
              <input
                id="inputPlace"
                className="form-control"
                placeholder="Place"
                required
              />
            </div>
            <div className="mb-3">
              <input
                id="inputDate"
                className="form-control"
                type="date"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Add Todo
            </button>
          </form>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <input
            id="inputSearch"
            className="form-control mb-3"
            placeholder="Search"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              id="startDate"
              className="form-control"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <input
              id="endDate"
              className="form-control"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <table className="table table-hover">
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
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTodo(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
