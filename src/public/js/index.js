const socketClient = io();

const form = document.getElementById("realTimeProductForm");
const inputName = document.getElementById("productName");
const inputPrice = document.getElementById("productPrice");
const inputDescription = document.getElementById("productDescription");

form.onsubmit = (e) => {
    e.preventDefault();
    const name = inputName.value;
    const price = inputPrice.value;
    const description = inputDescription.value;

    // Enviar datos al servidor a través de WebSockets para agregar un producto
    socketClient.emit("newPrice", { name, price, description });

    // Limpiar los campos del formulario
    inputName.value = "";
    inputPrice.value = "";
    inputDescription.value = "";
};

// Agregar un manejador de clic para los botones de eliminación
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        const productId = event.target.dataset.productId;
        // Enviar una solicitud de eliminación al servidor
        socketClient.emit("deleteProduct", productId);
    }
});

// Escuchar el evento "priceUpdated" para recibir la lista de productos actualizada
socketClient.on("priceUpdated", (products) => {
    const productList = document.getElementById("realTimeProductList");
    productList.innerHTML = '';

    products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <button class="delete-button" data-product-id="${product.id}">Eliminar</button>
        `;
        productList.appendChild(productItem);
    });
});
