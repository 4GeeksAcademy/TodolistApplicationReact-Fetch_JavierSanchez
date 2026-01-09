import React, { useEffect, useState } from "react";
import "../../styles/todolist.css"

//create your first component
const Todolist = () => {
	const [user, setUser] = useState(null)
	const [input, setInput] = useState("")

	// Check if user exists, if not create it
	async function checkUser() {
		try {
			let response = await fetch("https://playground.4geeks.com/todo/users/javi")

			if (response.ok) {
				// User exists, get their data
				let data = await response.json()
				setUser(data)
			} else if (response.status === 404) {
				// User doesn't exist, create it
				let createResponse = await fetch("https://playground.4geeks.com/todo/users/javi", {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
				// Get the newly created user data
				if (createResponse.ok) {
					let newUserData = await createResponse.json()
					setUser(newUserData)
				}
			}
		}
		catch (error) {
			console.log("Error in checkUser:", error);
		}
	}

	// Fetch initial data from API
	async function getData() {
		try {
			let response = await fetch("https://playground.4geeks.com/todo/users/javi")
			if (response.ok) {
				let data = await response.json()
				setUser(data)
			}
		}
		catch (error) {
			console.log("Error in getData:", error);
		}
	}

	// Post new task to API
	async function postTask(event) {
		event.preventDefault();

		if (!input.trim()) return; // Don't add empty tasks

		const newTast = {
			"label": input,
			"is_done": false
		}

		try {
			let response = await fetch("https://playground.4geeks.com/todo/todos/javi", {
				method: "POST",
				body: JSON.stringify(newTast),
				headers: { "Content-Type": "application/json" }
			})

			if (response.ok) {
				// Clear input field
				setInput("")
				// Refresh tasks
				await getData()
			} else {
				console.log("Error creating task:", response.status)
			}
		} catch (error) {
			console.log("Error in postTask:", error)
		}
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
		checkUser()
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