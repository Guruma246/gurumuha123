const CartItems = document.querySelector(".cart-items");

 function displayCartItems () {
    const items = JSON.parse(localStorage.getItem("cart"));
    item.forEach((item) => {
    const CartItem = document.createElement("div");
    cartItem.className = "cart_zainab"; 
    cartItem.innerHTML = `
      <p class="cart_id">${item.id}</p>
        <p class="cart_title">${item.title}</p>
        <img src="${item.image}" alt="${item.title}" class="cart_img">
        <p class="cart_price">${item.price}</p>
        <p class="cart_delete">${item.delete}</p>
    `;
    CartItems.appendChild(CartItem);
    });
 }

displayCartItems();
