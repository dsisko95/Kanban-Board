// import '../styles/index.scss';

// Variables
const btn = document.getElementById('add-btn');
const inputFieldTask = document.getElementById('task');
const inputFieldSet = document.getElementById('number');
const toDo = document.getElementById('to-do-wrapper');
const doing = document.getElementById('doing-wrapper');
const empties = document.querySelectorAll('.empty');
const info = document.getElementById('info');
const setBtn = document.getElementById('set-btn');
const chip = document.getElementById('chip');
const clear = document.getElementById('clear');
let fills;
let id;
let limit = 0;
// Methods

// return arr of local storage
function initStorageArr() {
  let arrOfTasks;
  if (localStorage.getItem('tasks') === null) {
    arrOfTasks = [];
  } else {
    arrOfTasks = JSON.parse(localStorage.getItem('tasks'));
  }
  return arrOfTasks;
}
// what happens on drag start event
function dragStart(e) {
  // fix mozilla drag item problem
  e.dataTransfer.setData('text', '');
  this.classList.remove('blue');
  this.classList.add('hold');
  setTimeout(() => {
    this.classList.add('invinsible');
  }, 0);
  id = Number.parseInt(this.getAttribute('data-id'), 0);
}
// what happens on drag end event
function dragEnd() {
  this.classList.remove('hold', 'invinsible');
  this.classList.add('blue');
}
// init doing counter
function initCounter() {
  info.innerHTML = `(${doing.childElementCount})`;
}
// drag event function
function dragOver(e) {
  e.preventDefault();
  initCounter();
}

function dragEnter(e) {
  e.preventDefault();
  initCounter();
}

function dragLeave() {
  initCounter();
}
function dragDrop() {
  if (this.id === 'doing-wrapper') {
    if (limit !== doing.childElementCount) {
      this.className = 'empty';
      this.append(fills[id]);
      initCounter();
    } else {
      M.toast({
        html: 'Limit is not set or it\'s reached. Set the limit or add more tasks!',
      });
    }
  } else {
    this.className = 'empty';
    this.append(fills[id]);
    initCounter();
  }
}
// set drag event listeners
function setDragEventListeners() {
  fills.forEach((item) => {
    item.addEventListener('dragstart', dragStart);
  });
  fills.forEach((item) => {
    item.addEventListener('dragend', dragEnd);
  });
  empties.forEach((item) => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
    item.addEventListener('drop', dragDrop);
  });
}
// add HTML presentation of task
function addTaskHTML(passedValue, index) {
  const card = document.createElement('div');
  card.setAttribute('draggable', 'true');
  card.dataset.id = index;
  card.className = 'card blue darken-1 item fill';
  card.innerHTML = `
  <div class="card-content white-text">
  <span class="card-title">${passedValue}</span>
  </div>
  `;
  toDo.appendChild(card);
}
// Init data on DOM load
function initData() {
  const arrOfTasks = initStorageArr();
  arrOfTasks.forEach((item, index) => {
    addTaskHTML(item, index);
  });
  fills = Array.from(document.querySelectorAll('.fill'));
  setDragEventListeners();
  initCounter();
  chip.innerHTML = '<b>not set</b>';
}
// add task on btn click
function addTask() {
  if (inputFieldTask.value.trim() === '') {
    M.toast({
      html: 'Please provide some data!',
    });
  } else {
    const arrOfTasks = initStorageArr();
    arrOfTasks.push(inputFieldTask.value);
    localStorage.setItem('tasks', JSON.stringify(arrOfTasks));
    addTaskHTML(inputFieldTask.value, arrOfTasks.length - 1);
    inputFieldTask.value = '';
    fills.push(toDo.lastChild);
    setDragEventListeners();
  }
}
function setLimit() {
  if (inputFieldSet.value.trim() === '') {
    M.toast({
      html: 'Please provide some valid data!',
    });
  } else if (Number.parseInt(inputFieldSet.value, 0) > fills.length) {
    M.toast({
      html: 'Choose a number which is less than number of all tasks!',
    });
    inputFieldSet.value = '';
    chip.innerHTML = '<b>not set</b>';
  } else if (inputFieldSet.value === '0') {
    M.toast({
      html: 'Set a value greater than zero!',
    });
  } else {
    chip.innerHTML = `<b>${inputFieldSet.value}</b>`;
    limit = Number.parseInt(inputFieldSet.value, 0);
    inputFieldSet.value = '';
  }
}

// Event listeners

btn.addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', initData);
setBtn.addEventListener('click', setLimit);
clear.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});
