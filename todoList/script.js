const url = 'http://localhost:3001/todos';

const list = document.querySelector('.list');
const addBtn = document.querySelector('.add-btn');
const addInp = document.querySelector('.add-inp');

// todo Ui
const createTodoUi = (todoData) => {
    const $li = document.createElement('li');
    const $todoText = document.createElement('span');
    const $delBtn = document.createElement('button');
    $delBtn.textContent = 'delete';
    const $editBtn = document.createElement('button');
    $editBtn.textContent = 'edit';
    const $checkbox = document.createElement('input');
    $checkbox.setAttribute('type', 'checkbox');
    $checkbox.classList.add('edit-checkbox');
    $checkbox.checked = todoData.done;

    $todoText.textContent = todoData.todo;
    list.appendChild($li);
    $li.appendChild($todoText);
    $li.appendChild($delBtn);
    $li.appendChild($editBtn);
    $li.appendChild($checkbox);
};

// 첫 화면 불러오기
const getTodos = async () => {
    const res = await fetch(url);
    const todoDatas = await res.json();
    return todoDatas;
};
const initTodo = async function () {
    const todoDatas = await getTodos();
    todoDatas.forEach((todoData) => {
        createTodoUi(todoData);
    });
};
initTodo();
