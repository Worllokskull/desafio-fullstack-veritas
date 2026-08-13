package main

import (
	"fmt"
	"net/http"
	"strconv"
)
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
func main() {
	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		switch r.Method {
			case http.MethodGet:
				getTasks(w, r)

			case http.MethodPost:
				createTask(w, r)

			default:
				http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		idString := r.URL.Path[len("/tasks/"):]

		id, err := strconv.Atoi(idString)
		if err != nil {
			http.Error(w, "ID inválido", http.StatusBadRequest)
			return
		}

		switch r.Method {
			case http.MethodPut:
				updateTask(w, r, id)

			case http.MethodDelete:
				deleteTask(w, r, id)

			default:
				http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	})
	fmt.Println("Servidor iniciado em http://localhost:8080")

	http.ListenAndServe(":8080", nil)
}