const socket = io();

document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("code", document.getElementById("code").value);
    formData.append("price", parseFloat(document.getElementById("price").value));
    formData.append("stock", parseInt(document.getElementById("stock").value));
    formData.append("category", document.getElementById("category").value);

    const thumbnails = document.getElementById("thumbnails").files;
    for (let i = 0; i < thumbnails.length; i++) {
      formData.append("thumbnails", thumbnails[i]);
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newProduct = await response.json();

        socket.emit("productCreated", newProduct);

        e.target.reset();
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (error) {
      console.log("Error al crear el producto:", error);
    }
  });

socket.on("realTimeProductList", (productList) => {
  const productListElement = document.getElementById("productList");
  productListElement.innerHTML = "";

  productList.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-header">
        <button class="delete-btn" data-id="${product._id}" id="btn-delete-${
      product._id
    }" type="button">Eliminar</button>
      </div>

      <h2 class="card-title">${product.title}</h2>
      <p><strong>Descripción:</strong> ${product.description}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
      <p><strong>Stock:</strong> ${product.stock} unidades</p>
      <p><strong>Categoría:</strong> ${product.category}</p>
      <p><strong>Código:</strong> ${product.code}</p>

      <div class="card-images">
        <strong>Imágenes:</strong>
        <ul>
          ${product.thumbnails
            .map(
              (img) =>
                `<li><img src="${img}" alt="Imagen del producto" class="product-image" width="100"></li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    productListElement.appendChild(card);

    const btnDelete = document.getElementById(`btn-delete-${product._id}`);

    btnDelete.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      deleteProduct(productId);
    });
  });
});

async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const deletedProduct = await response.json();
      socket.emit("productDeleted", deletedProduct.id);
    } else {
      const errorData = await response.json();
      alert("Error al eliminar el producto: " + errorData.message);
    }
  } catch (error) {
    console.log("Error al eliminar el producto:", error);
  }
}
