document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".add-to-cart").forEach((button) => {
		button.addEventListener("click", async () => {
			const productId = button.getAttribute("data-id");

			const response = await fetch(
				`/api/carts/662fa1b54f1aef0012d3e8b7/products/${productId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
				}
			);

			if (response.ok) {
				alert("Producto agregado al carrito");
			} else {
				alert("Error al agregar producto");
			}
		});
	});

	document.querySelectorAll(".remove-from-cart").forEach((button) => {
		button.addEventListener("click", async () => {
			const productId = button.getAttribute("data-id");

			const response = await fetch(
				`/api/carts/662fa1b54f1aef0012d3e8b7/products/${productId}`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				alert("Producto eliminado del carrito");
				window.location.reload();
			} else {
				alert("Error al eliminar producto");
			}
		});
	});
});
