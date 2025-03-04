document.addEventListener("DOMContentLoaded", async () => {
	let cartId = localStorage.getItem("cartId");

	// Si no hay carrito, crearlo
	if (!cartId) {
		const response = await fetch("/api/carts", { method: "POST" });
		const data = await response.json();
		cartId = data.cart._id; // Guardar el nuevo ID
		localStorage.setItem("cartId", cartId);
	}

	document.querySelectorAll(".add-to-cart").forEach((button) => {
		button.addEventListener("click", async () => {
			const productId = button.getAttribute("data-id");

			const response = await fetch(
				`/api/carts/${cartId}/products/${productId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
				}
			);

			const result = await response.json();
			console.log("Respuesta del servidor:", result);

			if (response.ok) {
				alert("Producto agregado al carrito");
			} else {
				alert("Error al agregar producto: " + result.message);
			}
		});
	});
});
