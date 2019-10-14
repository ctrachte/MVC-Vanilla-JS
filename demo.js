// This tutorial is from https://www.taniarascia.com/javascript-mvc-todo-app/


// The model will ONLY store and manipulate data, nothing else:
class Model {
  constructor() {
      // The state of the model, using local storage
      this.todos = JSON.parse(localStorage.getItem('todos')) || []
    }
    //private method to update the value of localStorage as well as the model state.
    _commit(todos) {
      this.onTodoListChanged(todos)
      localStorage.setItem('todos', JSON.stringify(todos))
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

      this.onTodoListChanged(this.todos)
    }

    //   and toggle switches the complete boolean property.
    // Flip the complete boolean on the specified todo
    toggleTodo(id) {
      this.todos = this.todos.map(todo =>
        todo.id === id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo
      )
    }
    bindTodoListChanged(callback) {
      this.onTodoListChanged = callback
    }
}


// create a VIEW by manipulating the DOM - document object model
class View {
  constructor() {
      // The root element
      this.app = this.getElement('#root')

      // The title of the app
      this.title = this.createElement('h1')
      this.title.textContent = 'Todos'

      // The form, with a [type="text"] input, and a submit button
      this.form = this.createElement('form')

      this.input = this.createElement('input')
      this.input.type = 'text'
      this.input.placeholder = 'Add todo'
      this.input.name = 'todo'

      this.submitButton = this.createElement('button')
      this.submitButton.textContent = 'Submit'

      // The visual representation of the todo list
      this.todoList = this.createElement('ul', 'todo-list')

      // Append the input and submit button to the form
      this.form.append(this.input, this.submitButton)

      // Append the title, form, and todo list to the app
      this.app.append(this.title, this.form, this.todoList)
  }
  // below are PRIVATE helpers to be used only inside this class
  get _todoText() {
    return this.input.value
  }

  _resetInput() {
    this.input.value = ''
  }
  // Create an element with an optional CSS class
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }

  // Retrieve an element from the DOM
  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }
  // The displayTodos method will create the ul and lis that the todo list consists of, and display them.
  // Every time a todo is changed, added, or removes, the displayTodos method will be called again with the todos from the model,
  //  resetting the list and redisplaying them. This will keep the view in sync with the model state.
  displayTodos (todos) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }
    // Show default message
    if (todos.length === 0) {
      const p = this.createElement('p')
      p.textContent = 'Nothing to do! Add a task?'
      this.todoList.append(p)
    } else {
      // loop through the todos and display a checkbox, span, and delete button for every existing todo.
        todos.forEach(todo => {
          const li = this.createElement('li')
          li.id = todo.id

          // Each todo item will have a checkbox you can toggle
          const checkbox = this.createElement('input')
          checkbox.type = 'checkbox'
          checkbox.checked = todo.complete

          // The todo item text will be in a contenteditable span
          const span = this.createElement('span')
          span.contentEditable = true
          span.classList.add('editable')

          // If the todo is complete, it will have a strikethrough
          if (todo.complete) {
            const strike = this.createElement('s')
            strike.textContent = todo.text
            span.append(strike)
          } else {
            // Otherwise just display the text
            span.textContent = todo.text
          }

          // The todos will also have a delete button
          const deleteButton = this.createElement('button', 'delete')
          deleteButton.textContent = 'Delete'
          li.append(checkbox, span, deleteButton)

          // Append nodes to the todo list
          this.todoList.append(li)
        })
    }
  }
}

// The controller will handle events after they're fired. When you submit a new todo,
 // or click the delete button, or click on the checkbox of a todo, an event will be fired.
 //  The view must listen for those events because they're user input of the view,
 // but it will dispatch the responsibility of what will happen in response to the event to the controller.
class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.view.bindAddTodo(this.handleAddTodo)
    this.view.bindDeleteTodo(this.handleDeleteTodo)
    this.view.bindToggleTodo(this.handleToggleTodo)
    this.model.bindTodoListChanged(this.onTodoListChanged)

    // Display initial todos if any
    this.onTodoListChanged(this.model.todos)
  }

  onTodoListChanged = todos => {
    this.view.displayTodos(todos)
  }
  handleAddTodo = todoText => {
    this.model.addTodo(todoText)
  }

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText)
  }

  handleDeleteTodo = id => {
    this.model.deleteTodo(id)
  }

  handleToggleTodo = id => {
    this.model.toggleTodo(id)
  }
  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if (this._todoText) {
        handler(this._todoText)
        this._resetInput()
      }
    })
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id)

        handler(id)
      }
    })
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener('change', event => {
      if (event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id)

        handler(id)
      }
    })
  }
}

const app = new Controller(new Model(), new View());


// add a new todo to test:
app.model.addTodo('Grocery Shopping')
console.log(app.model.todos)
