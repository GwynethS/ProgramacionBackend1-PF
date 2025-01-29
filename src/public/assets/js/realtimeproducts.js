const socket = io();

document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append(
      "description",
      document.getElementById("description").value
    );
    formData.append("code", document.getElementById("code").value);
    formData.append(
      "price",
      parseFloat(document.getElementById("price").value)
    );
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
    card.classList.add("col-lg-6");

    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h4 class="card-title text-center">${product.title}</h4>
          <div class="mt-3">
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock} units</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Code:</strong> ${product.code}</p>
            <p><strong>Status:</strong> ${
              product.status ? "Active" : "Inactive"
            }</p>
          </div>
          <div>
            <strong>Imágenes:</strong>
            <div class="d-flex flex-wrap justify-content-center gap-4 mt-3">
              ${product.thumbnails
                .map(
                  (img) =>
                    `<img src="${img}" alt="Product image" class="product-image" style="height:10rem; width: 10rem;" />`
                )
                .join("")}
            </div>
          </div>
          <button class="btn btn-danger w-100 mt-3 delete-btn" data-id="${
            product._id
          }" id="btn-delete-${product._id}" type="button">Eliminar</button>
        </div>
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
