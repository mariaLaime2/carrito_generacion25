// URL Base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/"
// Mostrar y ocultar carrito
const carToggle = document.querySelector(".cart__toggle");
const cartBlock = document.querySelector(".cart__block");
// Dibujar productos en la web
const productsList = document.querySelector("#products-container")
//carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//Vaciar el carrito
emptyCartButton = document.querySelector("#empty__cart")
//Array para recibir los elementos a introducir en el carrito de compras
let carProducts=[];
//Modal
const modalContainer= document.querySelector("#modal-container")
const modalElement= document.querySelector("#modal")
let detailsModal= [];

//Logica para mostrar y ocultar el carrito
carToggle.addEventListener("click", () => {
    cartBlock.classList.toggle("nav__car__visible")
})
eventListenersLoader()
function eventListenersLoader(){
    // cuando se presione el boton "Add to car ""
    productsList.addEventListener("click",addProduct)
    //Cuando se presione el boton "delete"
    car.addEventListener("click",deleteProduct)
    //Cuando se presione el boton "Empty cart"
    emptyCartButton.addEventListener("click" , emptyCart)
    //Se Ejecuta cuando carga la pagina
    document.addEventListener("DOMContentLoaded", ()=> {
        carProducts= JSON.parse(localStorage.getItem("cart")) || []
        carElementsHTML()
    } )
    //Cuando se presiona el boton view details
    productsList.addEventListener("click" , modal)
    //Cuando se presione sobre el icono para cerrar modal
    modalContainer.addEventListener("click",closeModal)
}
function getProducts() {
    axios.get(baseUrl)
    .then(function (response){
        const products = response.data
        printProducts(products)
    })
    .catch(function(error){
        console.log(error)
    })
}
getProducts()
function printProducts(products){
    let html = "";
    for (let i = 0; i < products.length; i++) {
        html += `
        <div class= "product__container">
           <div class= "product__container__img">
               <img src ="${products[i].image}" alt="image">
            </div>
            <div class= "product__container__name">
                <p>${products[i].name}</p>
            </div>
            <div class="circle__colors">
                <div class=" circle circle-1"></div>
                <div class=" circle circle-2"></div>
            </div>

            <div class= "product__container__price">
                <p>$ ${products[i].price.toFixed(2)}</p>
            </div>
            <div class= "product__container__button">
                <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}"> Add to cart </button>  
                <button class="product__details"> View Details </button>
            </div>
        </div>
        `
    }
    productsList.innerHTML = html
}
//Agregar productos al carrito
function addProduct(event){
    if (event.target.classList.contains("add__to__car")) {
        const product = event.target.parentElement.parentElement
        //console.log(product)
        carProductsElements(product)
    }
}
function carProductsElements(product){
    const infoProduct = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector(".product__container__name p").textContent,
        price: product.querySelector(".product__container__price p").textContent,
        quantity: 1
    }
   if(carProducts.some(product => product.id === infoProduct.id)){
       const product = carProducts.map(product => {
           if(product.id === infoProduct.id){
               product.quantity ++;
               return product;
            } else {
            return product;
            }
       })
      carProducts = [...product]
    } else {
        carProducts = [...carProducts, infoProduct]
    }
    console.log(carProducts)
    carElementsHTML()
}
// Productos del carrito mostrados en pantalla
function carElementsHTML(){
    carList.innerHTML= "";
    carProducts.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="car__product">
               <div class="car__product__image">
                    <img src="${product.image}">
                </div>
                <div class="car__product__description">
                    <p>${product.name}</p>
                    <p>Precio: ${product.price}</p>
                    <p>Cantidad: ${product.quantity}</p>
                </div>
                <div class="car__product__button">
                    <button class="delete__product" data-id="${product.id}">
                        Delete
                    </button>
                </div>
            </div>
            <hr>
        `;
        carList.appendChild(div)  
    })
    productStorage()
}
//localStorage
function productStorage() {
    localStorage.setItem("cart", JSON.stringify(carProducts))
}
//Eliminar productos del carrito
function deleteProduct(event){
    if(event.target.classList.contains("delete__product")){
        const productId = event.target.getAttribute("data-id")
        carProducts = carProducts.filter(product=> product.id !== productId)
        carElementsHTML()
    }
}
// Vaciar el carrito completo
function emptyCart(){
    carProducts = [];
    carElementsHTML();
}
// Ventana modal 
function modal(event){
    if(event.target.classList.contains("product__details")){
       modalContainer.classList.add("show__modal")
       const product = event.target.parentElement.parentElement
       modalDetails(product)
    }
}

function closeModal (event){
    if(event.target.classList.contains("icon__close__modal")){
        modalContainer.classList.remove("show__modal")
       // detailsModal=[]
    }
}
function modalDetails(product){
    const infoDetailsModal = [{
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector(".product__container__name p").textContent,
        price: product.querySelector(".product__container__price p").textContent,
    }]
    detailsModal = [...infoDetailsModal]
    console.log(detailsModal)
    modalElementsHTML()
}  
//Producto mostrado en la ventna modal
function modalElementsHTML(){
    modalElement.innerHTML="";
    detailsModal.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="items__modal">
            <div class="modal__image">
                <img src="${product.image}" alt="${product.name}" >
            </div>
            <div class="modal__description">
               <h2>${product.name}</h2>
               <p> ${product.price}</p>
               <h3>Tallas:</h3>
               <ul>
                    <li>S</li>
                    <li>M</li>
                    <li>L</li>
                    <li>XL</li>
                    <li>2XL</li> 
                </ul>
            </div>   
         </div> 
        `
      modalElement.appendChild(div)  
    })
}
