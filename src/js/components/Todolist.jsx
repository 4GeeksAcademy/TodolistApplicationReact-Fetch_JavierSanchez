import React, { useEffect, useState } from "react";
import "../../styles/todolist.css"

//create your first component
const Todolist = () => {
	const [user, setUser] = useState(null)
	const [input, setInput] = useState("")

	// Fetch initial data from API
	async function getData() {
		try {
			let response = await fetch("https://playground.4geeks.com/todo/users/javi")
			let data = await response.json()
			setUser(data)
		}
		catch {
			console.log(error);
		}
	}

	// Post new task to API
	async function postTask(event) {
		event.preventDefault();

		const newTast = {
			"label": input,
			"done": false
		}

		await fetch("https://playground.4geeks.com/todo/todos/javi", {
			method: "POST",
			body: JSON.stringify(newTast),
			headers: { "Content-Type": "application/json" }
		})

		getData();

		// Clear input field
		setInput("")
	}

	// Delete task from API
	async function deleteTask(id) {
		await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
		})

		getData()
	}

	// Delete all tasks from API
	async function deleteAllTasks() {
		if (!user || !user.todos) return;

		// Delete each task individually
		for (const task of user.todos) {
			await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
				method: "DELETE",
			})
		}

		getData()
	}

	// Load data on component mount
	useEffect(() => {
		getData()
	}, [])

	return (
		<div className="text-center">
			<h1>ToDo List</h1>

			{/* Form to add new task */}
			<form onSubmit={(e) => postTask(e)}>
				<label htmlFor="">Task:</label>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button type="submit">Add</button>
				<button type="button" className="delete-all-btn" onClick={() => deleteAllTasks()}>Delete All</button>
			</form>

			{/* List of tasks */}
			{!user ? (
				<p>Loading...</p>
			) : user.todos.length === 0 ? (
				<p>No tasks</p>
			) : (
				user.todos.map((task) => (
					<div className="task-item" key={task.id}>
						<span>{task.label}</span>
						<button className="delete-btn" onClick={() => deleteTask(task.id)}>
							❌
						</button>
					</div>
				))
			)}
		</div>
	);
}
export default Todolist;