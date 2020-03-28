render();

let tbody = $(".tbody");
$(".myForm .btn").on("click", function(e) {
  let firstName = $(".myForm  .firstName");
  let lastName = $(".myForm .lastName");
  let phoneNum = $(".myForm .phoneNum");
  let email = $(".myForm .email");
  e.preventDefault();
  let obj = {
    firstName: firstName.val(),
    lastName: lastName.val(),
    phoneNum: phoneNum.val(),
    email: email.val()
  };

  if (!firstName.val() || !lastName.val() || !phoneNum.val() || !email.val()) {
    return alert("Запоните все поля, пожалуйста!");
  }

  $.ajax({
    method: "post",
    url: "http://localhost:8000/contacts",
    data: obj,
    success: render,
    error: function(err) {
      console.log(err);
    }
  });

  firstName.val("");
  lastName.val("");
  phoneNum.val("");
  email.val("");
});

// УДАЛЕНИЕ

tbody.on("click", ".btn-del", e => {
  let id = $(e.target).attr("data-id");
  $.ajax({
    method: "delete",
    url: `http://localhost:8000/contacts/${id}`,
    success: render
  });
});

// ДОБАВЛЕНИЕ КОНТАКТА
function render() {
  $.ajax({
    method: "get",
    url: "http://localhost:8000/contacts",
    success: function(data) {
      tbody.html("");
      data.forEach(item => {
        tbody.append(`
                 <tr data-id="${item.id}">
                    <td class="item-info" data-about="firstName">${item.firstName}</td>
                    <td class="item-info" data-about="lastName">${item.lastName}</td>
                    <td class="item-info" data-about="phoneNum">${item.phoneNum}</td>
                    <td class="item-info email" data-about="email">${item.email}</td>
                    <td class="btn-del" data-id="${item.id}">X</td>
                    <td>
                        <button id="btn-edit" data-id="${item.id}" href="#">Редактировать</button>
                    </td>
                </tr>
                `);
      });
    }
  });
}

$(document).on("click", ".popup-fade", function(e) {
  if (e.target !== this) return;
  $(".popup-fade").toggle();
});

$(document).on("click", ".popup-close", function() {
  $(".popup-fade").toggle();
});

// РЕДАКТИРОВАНИЕ

tbody.on("click", "#btn-edit", function(e) {
  let id = $(e.target).attr("data-id");
  $(".popup-fade").toggle();
  $(".popup-fade").attr("data-id", id);
  $.ajax({
    method: "get",
    url: `http://localhost:8000/contacts/${id}`,
    success: function(data) {
      let i = 0;
      for (let key in data) {
        $(`.popup .${key}`).val(data[key]);
      }
    }
  });
});

$(".popup .btn").on("click", function(e) {
  e.preventDefault();
  let id = $(".popup-fade").attr("data-id");
  let data = $(".popup .inputs").serialize();
  console.log(id);
  $.ajax({
    method: "patch",
    url: `http://localhost:8000/contacts/${id}`,
    data,
    success: () => {
      $(".popup-fade").toggle();
      render();
    }
  });
});

// МОДАЛЬНОЕ С ИМЕНАМИ

$(".logo-decs").click(function() {
  $(".modal-fade").fadeIn();
  return false;
});

$(".modal-popup-close").click(function() {
  $(this)
    .parents(".modal-fade")
    .fadeOut();
  return false;
});

$(".modal-fade").click(function(e) {
  if ($(e.target).closest(".modal-popup").length == 0) {
    $(this).fadeOut();
  }
});

let page = 0;
let url;

function windowPage(api) {
  fetch(api)
    .then(result => result.json())
    .then(data => console.log(data));
}

$(".btn-next").on("click", function() {
  page += 5;
  // url = `http://localhost:8000/contacts/?offset=${page}&limit=5`;

  url = `http://localhost:8000/contacts?_page=${page}&_limit=5`;

  windowPage(url);
  $(".item-info").remove();
});

$(".btn-prev").on("click", function() {
  page -= 5;
  // url = `http://localhost:8000/contacts/?offset=${page}&limit=5`;

  url = `http://localhost:8000/contacts?_page=${page}&_limit=5`;

  windowPage(url);
  $(".item-info").remove();
});
