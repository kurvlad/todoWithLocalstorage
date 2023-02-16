// массив, который будет наполняться объктами при создании дела
let todoArray = [];

// функция создания заголовка
const createAppTitle = (title) => {
  const appTitle = document.createElement('h1');
  appTitle.innerHTML = title;

  return appTitle;
}

// функция создания формы
const createTodoForm = () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const addButton = document.createElement('button');
  const wrapper = document.createElement('div');

  addButton.disabled = !input.value.length;

  input.addEventListener('input', () => {
    addButton.disabled = !input.value.length;
  })

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название дела';
  addButton.classList.add('btn', 'btn-primary');
  wrapper.classList.add('input-group-append');
  addButton.textContent = 'Добавить дело';

  wrapper.append(addButton);
  form.append(input);
  form.append(wrapper);

  return {
    form,
    input,
    addButton
  }
}
// функция создания листа
const createTodoList = () => {
  const list = document.createElement('ul');
  list.classList.add('list-group');

  return list;
}
// функция создания элементов списка
// добавить потом переменную выполнено или нет
const createTodoItem = (name) => {
  const todoItem = document.createElement('li');
  const btnWrapper = document.createElement('div');
  const doneBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  const randomId = Math.random(2) * 100;
  todoItem.id = randomId.toFixed(3);

  todoItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  doneBtn.classList.add('btn', 'btn-success');
  deleteBtn.classList.add('btn', 'btn-danger');
  todoItem.textContent = name;
  doneBtn.textContent = 'Готово';
  deleteBtn.textContent = 'Удалить';

  btnWrapper.append(doneBtn, deleteBtn);
  todoItem.append(btnWrapper);

  return {
    todoItem,
    doneBtn,
    deleteBtn,
    btnWrapper
  }

}
// событие изменения локалсторейдж по нажатию кнопок готово и удалить
const changeItemDone = (arr, item) => {
  arr.map(obj => {
    if (obj.id === item.id & obj.done === false) {
      obj.done = true;
    } else if (obj.id === item.id & obj.done === true) {
      obj.done = false;
    }
  })
}


const completeTodoItem = (item, btn, key) => {
  btn.addEventListener('click', () => {
    todoArray = JSON.parse(localStorage.getItem(key));
    item.classList.toggle('list-group-item-success');
    changeItemDone(todoArray, item);

    localStorage.setItem(key, JSON.stringify(todoArray));
  })
}

const deleteTododItem = (item, btn, key) => {
  btn.addEventListener('click', () => {
    if (confirm('Вы уверены?')) {
      todoArray = JSON.parse(localStorage.getItem(key));

      const newList = todoArray.filter(obj => obj.id !== item.id);

      localStorage.setItem(key, JSON.stringify(newList));
      item.remove();
    }
  })
}

// функция для отрисовки всего
function createTodoApp(container, title, key) {
  const appTitle = createAppTitle(title);
  const appForm = createTodoForm();
  const appList = createTodoList();

  container.append(appTitle, appForm.form, appList);

  if (localStorage.getItem(key)) {
    todoArray = JSON.parse(localStorage.getItem(key));

    for (let obj of todoArray) {
      const todoItem = createTodoItem(appForm.input.value);

      todoItem.todoItem.textContent = obj.name;
      todoItem.todoItem.id = obj.id;

      if (obj.done == true) {
        todoItem.todoItem.classList.add('list-group-item-success')
      } else {
        todoItem.todoItem.classList.remove('list-group-item-succes')
      }
      completeTodoItem(todoItem.todoItem, todoItem.doneBtn, key);
      deleteTododItem(todoItem.todoItem, todoItem.deleteBtn, key);

      appList.append(todoItem.todoItem);
      todoItem.todoItem.append(todoItem.btnWrapper);
    }
  }

  appForm.form.addEventListener('submit', e => {
    e.preventDefault();
    // создаем элемент item
    const todoItem = createTodoItem(appForm.input.value);
    // проверяем пустое ли поле ввода
    if (!appForm.input.value) {
      return;
    }
    // ставим событие на кнопки готово и удалить
    completeTodoItem(todoItem.todoItem, todoItem.doneBtn, key);
    deleteTododItem(todoItem.todoItem, todoItem.deleteBtn, key);


    let localStorageData = localStorage.getItem(key);

    if (localStorageData == null) {
      todoArray = [];
    } else {
      todoArray = JSON.parse(localStorageData);
    }

    //  функция изменения объекта
    const createItemObj = (arr) => {
      const itemObj = {};
      itemObj.name = appForm.input.value;
      itemObj.id = todoItem.todoItem.id;
      itemObj.done = false;
      //  запушим в объект новое значение
      arr.push(itemObj);
    }
    // добавляем в наш объект
    createItemObj(todoArray);
    // отправляем в локалсторейдж
    localStorage.setItem(key, JSON.stringify(todoArray));


    // добавляем в appList  item
    appList.append(todoItem.todoItem);
    // обнуляем значение поля ввода
    appForm.input.value = '';
    appForm.addButton.disabled = !appForm.addButton.disabled;
  })
}

export { createTodoApp };
