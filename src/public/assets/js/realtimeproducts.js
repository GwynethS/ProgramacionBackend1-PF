const socket = io();

document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    event.preventDefault();

    const productData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      code: document.getElementById("code").value,
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
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
      console.error("Error al crear el producto:", error);
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
        <button class="delete-btn" data-id="${product.id}" id="btn-delete-${product.id}" type="button">Eliminar</button>
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

    const btnDelete = document.getElementById(`btn-delete-${product.id}`);

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
    console.error("Error al eliminar el producto:", error);
  }
}
