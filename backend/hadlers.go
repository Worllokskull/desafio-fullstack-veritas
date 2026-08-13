package main

import (
	"encoding/json"
	"net/http"
	"strings"
)
var nextID = 1

var tasks = []Task{}
func getTasks(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(tasks)
}
func createTask(w http.ResponseWriter, r *http.Request) {
	var newTask Task

	err := json.NewDecoder(r.Body).Decode(&newTask)
	if err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(newTask.Title) == "" {
		http.Error(w, "Título é obrigatório", http.StatusBadRequest)
		return
	}
	if newTask.Status != "todo" &&
		newTask.Status != "in_progress" &&
		newTask.Status != "done" {

		http.Error(w, "Status inválido", http.StatusBadRequest)
		return
	}
	newTask.Title = strings.TrimSpace(newTask.Title)
	newTask.Description = strings.TrimSpace(newTask.Description)
	newTask.ID = nextID
	nextID++	

	tasks = append(tasks, newTask)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTask)
}
func updateTask(w http.ResponseWriter, r *http.Request, id int) {
	var updatedTask Task

	err := json.NewDecoder(r.Body).Decode(&updatedTask)
	if err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(updatedTask.Title) == "" {
		http.Error(w, "Título é obrigatório", http.StatusBadRequest)
		return
	}

	if updatedTask.Status != "todo" &&
		updatedTask.Status != "in_progress" &&
		updatedTask.Status != "done" {

		http.Error(w, "Status inválido", http.StatusBadRequest)
		return
	}
	updatedTask.Title = strings.TrimSpace(updatedTask.Title)
	updatedTask.Description = strings.TrimSpace(updatedTask.Description)	
	for i, task := range tasks {
		if task.ID == id {
			updatedTask.ID = id
			tasks[i] = updatedTask

			json.NewEncoder(w).Encode(updatedTask)
			return
		}
	}

	http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
}
func deleteTask(w http.ResponseWriter, r *http.Request, id int) {
	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)

			w.WriteHeader(http.StatusNoContent)
			return
		}
	}

	http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
}