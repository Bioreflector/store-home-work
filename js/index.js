const chance = new Chance()
const urlReg = 'https://fakestoreapi.com/users'
const urlLogin = 'https://fakestoreapi.com/auth/login'
const urlProducts = 'https://fakestoreapi.com/products'

function checkAuth() {
  let isAuth = !!localStorage.getItem('token')
  if (isAuth) {
    $('#auth').addClass('none')
    $('#store').removeClass('none')
    getProducts()
  } else {
    $('#auth').removeClass('none')
    $('#store').addClass('none')
  }
}

checkAuth()

$('#gen').click(() => {
  $('#email').val(chance.email())
  $('#username').val(chance.string({ length: 6, alpha: true }))
  $('#password').val(
    chance.string({
      length: 8,
      pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]',
    })
  )
})

$('#authForm').submit((e) => {
  $('#loader').removeClass('none')
  e.preventDefault()
  const body = {
    email: $('#email').val(),
    username: $('#username').val(),
    password: $('#password').val(),
  }
  reg(body)
  log({
    username: 'mor_2314',
    password: '83r5^_',
  })
})

function reg(body) {
  console.log(body)
  $.ajax({
    url: urlReg,
    method: 'post',
    data: body,
  })
    .done(function (response) {
      localStorage.setItem('id', response.id)
    })
    .fail(function () {
      console.log('error')
    })
    .always(function () {
      console.log('complete')
    })
}

function log(body) {
  $.ajax({
    url: urlLogin,
    method: 'post',
    data: body,
  })
    .done(function (response) {
      localStorage.setItem('token', response.token)
      checkAuth()
    })
    .fail(function () {
      console.log('error')
    })
    .always(function () {
      $('#loader').addClass('none')
    })
}

$('#logout').click(() => {
  localStorage.removeItem('token')
  localStorage.removeItem('id')
  checkAuth()
})
$('#homeBtn').click(()=>{
  $('#products').empty()
  getProducts()
})

function getProducts() {
  $.ajax({
    url: urlProducts,
  })
    .done(function (response) {
      console.log(response)
      response.map((item) => {
        $('#products').append(createProducrCard(item))
      })
    })
    .fail(function () {
      console.log('error')
    })
    .always(function () {
      console.log('complete')
    })
}

function getProductByID(id) {
  console.log(id)

  $.ajax({
    url: urlProducts + '/' + id,
  })
    .done(function (response) {
      console.log(response)
      $('#products').empty()
      $('#products').append(`<div class="card">
            <img src=${response.image} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${response.title}</h5>
              <p class="card-text">${response.description}</p>
              
            </div>
          </div>`)
    })
    .fail(function () {
      console.log('error')
    })
    .always(function () {
      console.log('complete')
    })
}

function createProducrCard(item) {
  let isFulText = true
  const card = $("<div class ='card'></div>")
  const cardContent = $("<div class ='card-content'></div>")
  cardContent.html(
    `<div class = "card-img-box"><img src=${item.image} class="card-img-top" alt="..."></div>`
  )
  const cardBody = $('<div class="card-body"></div>')
  cardBody.html(`<div class = "card-price">${item.price}$</div>
  <h5 class="card-title">${item.title}</h5>
  <button class="btn btn-primary " onClick="getProductByID(${item.id})">Show more</button></div>`)
  const textCard = $(`<p class ="card-text">${item.description.slice(0 , 40)}...</p>`)
  cardBody.append(textCard)
  cardContent.append(cardBody)
  textCard .click(()=>{
    isFulText ? textCard.text(item.description) : textCard.text(`${item.description.slice(0 , 40)}...`)
    isFulText = !isFulText
    textCard .toggleClass('show-text')
    cardContent.toggleClass("absolute")
  })
  card.append(cardContent)
  return card
}
