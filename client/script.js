const baseUrl = 'http://localhost:3000'
const btn_register = $('.btn-register')
const btn_login = $('.btn-login')
const btn_logout = $('.btn-logout')
const btn_add_todo = $('#btn-add-todo')
const btn_cancel_add = $('#cancel-add')
const btn_cancel_edit = $('#cancel-edit')
const page_home = $('#home')
const page_register = $('#register')
const page_login = $('#login')
const page_todo = $('#todo')
const modal_add = $('#modal-add')
const modal_edit = $('#modal-edit')
const search_task = $("#search-task")
let dataTodo = []

$(document).ready(function () {
  checkLogin()
})

btn_register.click(function () {
  registerPage()
})

btn_login.click(function () {
  loginPage()
})

btn_logout.on('click', function () {
  logout()
})

btn_add_todo.on('click', function () {
  modal_add.show()
})

btn_cancel_add.on('click', function () {
  modal_add.hide()
})

btn_cancel_edit.on('click', function () {
  modal_edit.hide()
})

search_task.on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $(".todo").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$('fieldset').each(function () {
  $(this).sortable({
    connectWith: 'fieldset',
    cursor: 'pointer',
    revert: true,
    remove: function (event, ui) {
      event.preventDefault()
      let id = ui.item.attr('id')
      patchTodo(id)
    }
  })
})

function checkLogin() {
  if (localStorage.getItem('access_token')) {
    let username = localStorage.getItem('username')
    $('#user-account').text(username)
    todoPage()
  } else {
    $('#user-account').text("")
    loginPage()
  }
}

function hideAll() {
  btn_register.hide()
  btn_login.hide()
  btn_logout.hide()
  page_home.hide()
  page_register.hide()
  page_login.hide()
  page_todo.hide()
  modal_add.hide()
  modal_edit.hide()
}

function registerPage() {
  hideAll()
  page_home.show()
  page_register.show()
  btn_login.show()

  $('#submit-register').off('click').on('click', function (event) {
    event.preventDefault()
    data = {
      email: $('#email').val(),
      username: $('#username').val(),
      password: $('#password').val()
    }
    handleRegister(data)
  })
}

function handleRegister(data) {
  $.ajax({
      method: 'POST',
      url: `${baseUrl}/register`,
      data
    })
    .done(() => {
      $('#form-register').trigger('reset')
      loginPage()
    })
    .fail(xhr => {
      $('#password').val('')
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message[0],
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}


function loginPage() {
  hideAll()
  btn_register.show()
  page_home.show()
  page_login.show()

  $('#submit-login').off('click').on('click', function (event) {
    event.preventDefault()
    data = {
      email: $('#email-login').val(),
      password: $('#password-login').val()
    }
    handleLogin(data)
  })
}

function handleLogin(data) {
  $.ajax({
      method: 'POST',
      url: `${baseUrl}/login`,
      data
    })
    .done(res => {
      localStorage.setItem('username', res.username)
      localStorage.setItem('access_token', res.access_token)
      $('#form-login').trigger('reset')
      checkLogin()
    })
    .fail(xhr => {
      // console.log(xhr);
      $('#password-login').val('')
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
      method: 'POST',
      url: `${baseUrl}/google-login`,
      data: {
        id_token
      }
    })
    .done(res => {
      localStorage.setItem('username', res.username)
      localStorage.setItem('access_token', res.access_token)
      checkLogin()
    })
    .fail(xhr => {
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function logout() {
  localStorage.clear()
  const auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function () {
    console.log('User signed out.')
  });
  checkLogin()
  //loginPage()
 }


function todoPage() {
  hideAll()
  btn_logout.show()
  page_todo.show()
  $('#submit-add').off('click').on('click', function (event) {
    event.preventDefault()
    let data = {
      title: $('#add-title').val(),
      description: $('#add-description').val(),
      due_date: $('#add-date').val(),
      status: false
    }
    handleAddTodo(data)
  })
  getWeather()
  getTodo()
}

function getTodo() {
  $.ajax({
      method: 'GET',
      url: `${baseUrl}/todos`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })

    .done(res => {
      console.log("wertgg");
      dataTodo = res
      $('#task-backlog').empty()
      $('#task-done').empty()
      dataTodo.forEach(data => {
        if (data.status) {
          $('#task-done').append(
            `
          <div id="${data.id}" class="todo card-body bg-white shadow-sm rounded mt-3 p-0 overflow-hidden">
            <div class="d-flex justify-content-start">
              <div class="p-1 bg-success"></div>
              <div class="pb-3 position-relative w-100"
                style="padding-top: 1.5rem;padding-right: 1.5rem;padding-left: 1rem;">
                <svg type="button" onclick="deleteTodo(${data.id})" 
                  class="close position-absolute text-success" id-parent="1"
                  style="width: 1.25rem; height: 1.25rem; top: .7rem; right: .7rem;"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h5 class="card-title overflow-hidden mb-0" style="max-height: 3rem;">${data.title}</h5>
                <p class="card-text overflow-hidden mt-1" style="max-height: 3rem;">${data.description}</p>
                <div class="d-flex justify-content-between text-muted position-relative">
                  <small class="text-muted">${data.due_date.slice(0,10)}</small>
                  <small><a class="edit text-decoration-none text-success position-absolute" style="right: -.4rem;"  type="button" onclick="editTodo(${data.id})">edit</a></small>
                </div>
              </div>
            </div>
          </div>
          `
          )
        } else {
          $('#task-backlog').append(
            `
          <div id="${data.id}" class="todo card-body bg-white shadow-sm rounded mt-3 p-0 overflow-hidden">
            <div class="d-flex justify-content-start">
              <div class="p-1 bg-info"></div>
              <div class="pb-3 position-relative w-100"
                style="padding-top: 1.5rem;padding-right: 1.5rem;padding-left: 1rem;">
                <svg type="button" onclick="deleteTodo(${data.id})" 
                  class="close position-absolute text-info" id-parent="1"
                  style="width: 1.25rem; height: 1.25rem; top: .7rem; right: .7rem;"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h5 class="card-title overflow-hidden mb-0" style="max-height: 3rem;">${data.title}</h5>
                <p class="card-text overflow-hidden mt-1" style="max-height: 3rem;">${data.description}</p>
                <div class="d-flex justify-content-between text-muted position-relative">
                    <small class="text-muted">${data.due_date.slice(0,10)}</small>
                    <small><a class="edit text-decoration-none text-info" type="button" onclick="patchTodo(${data.id})">mark as done</a></small>
                    <small><a class="edit text-decoration-none text-info position-absolute" style="right: -.4rem;"  type="button" onclick="editTodo(${data.id})">edit</a></small>
                </div>
              </div>
            </div>
          </div>
          `
          )
        }
      })
    })
    .fail(xhr => {
      console.log("ini fail beda");
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function handleAddTodo(data) {
  $.ajax({
      method: 'POST',
      url: `${baseUrl}/todos`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data
    })
    .done(() => {
      $('#form-add').trigger('reset')
      checkLogin()
    })
    .fail(xhr => {
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message[0],
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function editTodo(id) {
  $.ajax({
      method: 'GET',
      url: `${baseUrl}/todos/${id}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(res => {
      $('#modal-edit').show()
      $('#edit-title').val(res.title)
      $('#edit-description').val(res.description)
      $('#edit-date').val(res.due_date.slice(0, 10))
      $(`input[name="edit-status"][value="${res.status}"]`).prop('checked', true)
      handleEdit(res.id)
    })
    .fail(xhr => {
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function handleEdit(id) {
  $('#submit-edit').off('click').on('click', function (event) {
    event.preventDefault()
    const data = {
      title: $('#edit-title').val(),
      description: $('#edit-description').val(),
      due_date: $('#edit-date').val(),
      status: $('input[name="edit-status"]:checked').val()
    }
    $.ajax({
        method: 'PUT',
        url: `${baseUrl}/todos/${id}`,
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data
      })
      .done(() => {
        checkLogin()
      })
      .fail(xhr => {
        Swal.fire({
          title: 'Something Error!',
          text: xhr.responseJSON.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      })
  })
}

function patchTodo(id) {
  let value = dataTodo.filter(data => data.id == id)
  $.ajax({
      method: 'PATCH',
      url: `${baseUrl}/todos/${id}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        status: !value[0].status
      }
    })
    .done(res => {
      checkLogin()
    })
    .fail(xhr => {
      checkLogin()
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function deleteTodo(id) {
  Swal.fire({
      title: 'Confirm Delete?',
      text: 'It will permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes !',
      cancelButtonText: 'No !'
    })
    .then(result => {
      if (result.value) {
        handleDelete(id)
      }
    })
}

function handleDelete(id) {
  $.ajax({
      method: 'DELETE',
      url: `${baseUrl}/todos/${id}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(() => {
      checkLogin()
    })
    .fail(xhr => {
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}

function getWeather() {
  $.ajax({
      method: 'GET',
      url: `${baseUrl}/todos/weather`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(res => {
      $('#weather').empty()
      $('#weather').append(
        `
      <div class="card-body">
        <small class="text-warning">${new Date().toLocaleString()}</small>
        <h4 class="card-title">${res.name}</h4>
        <div>
          <img src="http://openweathermap.org/img/wn/${res.icon}@2x.png" "alt="">
          <span class="fs-1 text-muted">${(res.temp).toFixed()}&deg C</span>
        </div>
        <p>Feel like ${res.feels_like}&deg C, ${res.description}</p><hr>
        <small>pressure:</small>
        <small class="text-muted">${res.pressure}hPa </small>
        <small>humidity:</small>
        <small class="text-muted">${res.humidity}%</small><br>
        <small>visibility:</small>
        <small class="text-muted">${res.visibility / 1000}km</small>
        <small>max-temp:</small>
        <small class="text-muted">${res.temp_max}&deg C</small>
      </div>
      `
      )
    })
    .fail(xhr => {
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
}