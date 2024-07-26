const url = 'http://localhost:3000/todos';

const list = document.querySelector('.list');
const addInp = document.querySelector('.add-inp');
const form = document.querySelector('form');

const modal = document.querySelector('.edit-modal');
const editInp = document.getElementById('edit-inp');
const editForm = document.getElementById('edit-form');

// todo Ui
const createTodoUi = (todoData) => {
    const $li = document.createElement('li');
    $li.classList.add('todo');
    $li.id = todoData.id;
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

// todo 삭제하기
const delTodo = async (id) => {
    try {
        const res = await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });
        return res.status === 200;
    } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
        return null;
    }
};

list.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delBtn')) {
        const parentNode = event.target.parentNode;
        const isDel = await delTodo(parentNode.id);
        if (isDel) {
            parentNode.remove();
        } else {
            alert('삭제 중 오류가 발생했습니다.');
        }
    }
});

// todo 수정하기
const updateTodo = async (id, newTodoText) => {
    try {
        const res = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: newTodoText }),
        });
        if (res.status === 200) {
            return await res.json();
        } else {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        alert('수정 중 오류가 발생했습니다.');
        return null;
    }
};

let currentEditingId = null;

list.addEventListener('click', (event) => {
    if (event.target.classList.contains('editBtn')) {
        const parentNode = event.target.parentNode;
        const todoText = parentNode.querySelector('.todoText').textContent;
        currentEditingId = parentNode.id;

        modal.style.display = 'block';
        editInp.value = todoText;
        editInp.focus();
    }
});

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newTodoText = editInp.value.trim();
    if (newTodoText && currentEditingId) {
        const updatedTodo = await updateTodo(currentEditingId, newTodoText);
        if (updatedTodo) {
            const todoElement = document.getElementById(currentEditingId);
            todoElement.querySelector('.todoText').textContent = newTodoText;
            modal.style.display = 'none';
        }
    }
});

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
