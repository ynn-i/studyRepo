const url = 'http://localhost:3001/todos';

const list = document.querySelector('.list');
const addInp = document.querySelector('.add-inp');
const form = document.querySelector('form');

// todo Ui
const createTodoUi = (todoData) => {
    const $li = document.createElement('li');
    $li.classList.add('todo');
    const $todoText = document.createElement('span');
    $todoText.classList.add('todoText');
    const $delBtn = document.createElement('button');
    $delBtn.textContent = 'del';
    $delBtn.classList.add('delBtn');
    const $editBtn = document.createElement('button');
    $editBtn.textContent = 'edit';
    $editBtn.classList.add('editBtn');
    const $checkbox = document.createElement('input');
    $checkbox.setAttribute('type', 'checkbox');
    $checkbox.checked = todoData.done;
    $checkbox.classList.add('edit-checkbox');

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
const initTodo = async () => {
    const todoDatas = await getTodos();
    todoDatas.forEach((todoData) => {
        createTodoUi(todoData);
    });
};
initTodo();

// todo 추가하기
const addTodo = async (todoText) => {
    try {
        const req = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: todoText, status: false }),
        });
        const newTodoData = await req.json();
        return newTodoData;
    } catch (error) {
        alert('server error');
    }
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const todoText = addInp.value;
    const newTodoData = await addTodo(todoText);
    createTodoUi(newTodoData);
});
