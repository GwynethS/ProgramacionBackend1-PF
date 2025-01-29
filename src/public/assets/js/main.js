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
