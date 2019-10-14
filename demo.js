
// The model will ONLY store and manipulate data, nothing else:
class Model {
  constructor() {
      // The state of the model, an array of todo objects, prepopulated with some data
      this.todos = [
        { id: 1,
          text: 'Run a marathon',
          complete: false
         },
        { id: 2,
          text: 'Plant a garden',
          complete: false
         },
      ]
    }
    //add appends a new todo to the array,

    addTodo(todoText) {
      const todo = {
        id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
        text: todoText,
        complete: false,
      }

      this.todos.push(todo)
    }

    // edit finds the id of the todo to edit and replaces it,
    // Map through all todos, and replace the text of the todo with the specified id
    editTodo(id, updatedText) {
      this.todos = this.todos.map(todo =>
        todo.id === id ? { id: todo.id, text: updatedText, complete: todo.complete } : todo
      )
    }

    // Filter a todo out of the array by id
    deleteTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id)
    }

    //   and toggle switches the complete boolean property.
    // Flip the complete boolean on the specified todo
    toggleTodo(id) {
      this.todos = this.todos.map(todo =>
        todo.id === id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo
      )
    }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
}

const app = new Controller(new Model(), new View());


// add a new todo to test:
app.model.addTodo('Grocery Shopping')
console.log(app.model.todos)
