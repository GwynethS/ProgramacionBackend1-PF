document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();

    if (data.status === "success") {
      renderProducts(data.payload);
      // renderPagination(data);
    } else {
      console.error("No products found");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

function renderProducts(products) {
  const productContainer = document.getElementById("product-list");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("col-lg-3");

    productElement.innerHTML = `
      <div class="card text-center" data-id=${product._id}>
      ${
        product.thumbnails && product.thumbnails.length > 0
          ? `<img src="${product.thumbnails[0]}" class="card-img-top" alt="${product.title}">`
          : ""
      }
        <div class="card-body">
          <div>
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>Price: $${product.price}</strong></p>
          </div>
          <button class="btn btn-primary add-to-cart-btn" data-id=${
            product._id
          }>Add to cart <i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    `;

    productElement.querySelector(".card").addEventListener("click", () => {
      window.location.href = `/products/${product._id}`;
    });

    productElement
      .querySelector(".add-to-cart-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();

        const productId = e.target.getAttribute("data-id");

        if (productId) addCartProduct(productId);
      });
    productContainer.appendChild(productElement);
  });
}

async function addCartProduct(productId) {
  let cartId = sessionStorage.getItem("cartId");

  if (!cartId) {
    try {
      const response = await fetch(`/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        cartId = data.payload._id;

        sessionStorage.setItem("cartId", cartId);

        try {
          const responseAdd = await fetch(
            `/api/carts/${cartId}/products/${productId}`,
            {
              method: "POST",
            }
          );

          if (responseAdd.ok) {
            Toastify({
              text: "Product added to the cart!",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              backgroundColor: " #bd8cff",
            }).showToast();
          } else {
            const errorData = await responseAdd.json();
            alert("Error al añadir el producto: " + errorData.message);
          }
        } catch (error) {
          console.log("Error al añadir el producto:", error);
        }
      } else {
        const errorData = await response.json();
        alert("Error al crear el carrito: " + errorData.message);
      }
    } catch (error) {
      console.log("Error al crear el carrito:", error);
    }
  } else {
    try {
      const responseAdd = await fetch(
        `/api/carts/${cartId}/products/${productId}`,
        {
          method: "POST",
        }
      );

      if (responseAdd.ok) {
        Toastify({
          text: "Product added to the cart!",
          duration: 3000,
          close: true,
          offset: {
            x: 0,
            y: 80,
          },
          gravity: "top",
          position: "right",
          backgroundColor: " #bd8cff",
        }).showToast();
      } else {
        const errorData = await responseAdd.json();
        alert("Error al añadir el producto: " + errorData.message);
      }
    } catch (error) {
      console.log("Error al añadir el producto:", error);
    }
  }
}

async function goToCart() {
  let cartId = sessionStorage.getItem("cartId");

  console.log("click");

  if (!cartId) {
    try {
      const response = await fetch(`/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        cartId = data.payload._id;

        sessionStorage.setItem("cartId", cartId);

        return (window.location.href = `/carts/${cartId}`);
      }
    } catch (error) {
      console.log("Error al crear el carrito:", error);
    }
  }

  return (window.location.href = `/carts/${cartId}`);
}
