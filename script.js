const BASE_URL = "https://stackblitz-starters-wmvq2hq6-iligan.onrender.com";

/* =========================
   TOAST
========================= */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "> " + message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

/* =========================
   SUMMARY
========================= */
function updateSummary(products, customers, orders) {
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalCustomers").textContent = customers.length;
  document.getElementById("totalOrders").textContent = orders.length;
}

/* =========================
   PRODUCTS
========================= */
async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  const products = await res.json();

  const list = document.getElementById("productsList");
  list.innerHTML = "";

  products.forEach(product => {
    const li = document.createElement("li");
    li.classList.add("product-card");

    const img = document.createElement("img");
    img.src = product.image ||
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400";
    img.classList.add("product-img");

    const info = document.createElement("div");
    info.classList.add("product-info");
    info.innerHTML = `
      <strong>${product.name}</strong><br>
      ₱${product.price.toLocaleString()}<br>
      Stock: ${product.stock}<br>
      ${product.specs ? `<small>${product.specs}</small>` : ""}
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      renderInlineProductEdit(li, product);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteProduct(product.id);
    };

    // ✅ Focus effect
    li.addEventListener("click", () => {
      document.querySelectorAll(".product-card")
        .forEach(card => card.classList.remove("focused"));

      li.classList.add("focused");

      const overlay = document.getElementById("focusOverlay");
      if (overlay) overlay.classList.add("active");
    });

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

  return products;
}

/* =========================
   INLINE EDIT PRODUCT
========================= */
function renderInlineProductEdit(li, product) {
  li.innerHTML = "";

  const container = document.createElement("div");
  container.style.flex = "1";

  container.innerHTML = `
    <input id="editName" value="${product.name}">
    <input id="editPrice" type="number" value="${product.price}">
    <input id="editStock" type="number" value="${product.stock}">
    <input id="editImage" value="${product.image || ""}">
    <textarea id="editSpecs">${product.specs || ""}</textarea>
  `;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.onclick = async () => {
    await fetch(`${BASE_URL}/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("editName").value,
        price: Number(document.getElementById("editPrice").value),
        stock: Number(document.getElementById("editStock").value),
        image: document.getElementById("editImage").value || null,
        specs: document.getElementById("editSpecs").value || null
      })
    });
    showToast("Product updated ✅");
    refreshAll();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = refreshAll;

  li.appendChild(container);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);
}

/* =========================
   ADD PRODUCT
========================= */
async function addProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const specs = document.getElementById("productSpecs").value;

  if (!name || !price || !stock) {
    showToast("Fill required fields");
    return;
  }

  await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      price: Number(price),
      stock: Number(stock),
      image: imageUrl || null,
      specs: specs || null
    })
  });

  showToast("Product added ✅");
  refreshAll();
}

/* =========================
   DELETE PRODUCT
========================= */
async function deleteProduct(id) {
  await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
  showToast("Product deleted");
  refreshAll();
}

/* =========================
   CUSTOMERS
========================= */
async function getCustomers() {
  const res = await fetch(`${BASE_URL}/customers`);
  const customers = await res.json();

  const list = document.getElementById("customersList");
  list.innerHTML = "";

  customers.forEach(customer => {
    const li = document.createElement("li");
    li.classList.add("customer-card");

    const info = document.createElement("div");
    info.style.flex = "1";
    info.innerHTML = `
      <strong>${customer.name}</strong><br>
      ${customer.email}
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteCustomer(customer.id);

    li.appendChild(info);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

  return customers;
}

async function addCustomer() {
  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;

  if (!name || !email) {
    showToast("Fill required fields");
    return;
  }

  await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  showToast("Customer added ✅");
  refreshAll();
}

async function deleteCustomer(id) {
  await fetch(`${BASE_URL}/customers/${id}`, { method: "DELETE" });
  showToast("Customer deleted");
  refreshAll();
}

/* =========================
   ORDERS
========================= */
async function getOrders() {
  const res = await fetch(`${BASE_URL}/orders`);
  const orders = await res.json();

  const list = document.getElementById("ordersList");
  list.innerHTML = "";

  orders.forEach(order => {
    const li = document.createElement("li");
    li.textContent = `Order ID: ${order.id} | Qty: ${order.quantity}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteOrder(order.id);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  return orders;
}

async function createOrder() {
  const customerId = document.getElementById("orderCustomerId").value;
  const productId = document.getElementById("orderProductId").value;
  const quantity = document.getElementById("quantity").value;

  if (!customerId || !productId || !quantity) {
    showToast("Complete all fields");
    return;
  }

  await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId,
      productId,
      quantity: Number(quantity)
    })
  });

  showToast("Order created ✅");
  refreshAll();
}

async function deleteOrder(id) {
  await fetch(`${BASE_URL}/orders/${id}`, { method: "DELETE" });
  showToast("Order deleted");
  refreshAll();
}

/* =========================
   DROPDOWNS
========================= */
function loadDropdowns(products, customers) {
  const customerSelect = document.getElementById("orderCustomerId");
  const productSelect = document.getElementById("orderProductId");

  customerSelect.innerHTML = "";
  productSelect.innerHTML = "";

  customers.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    customerSelect.appendChild(option);
  });

  products.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.name} (Stock: ${p.stock})`;
    productSelect.appendChild(option);
  });
}

/* =========================
   OVERLAY CLOSE
========================= */
document.addEventListener("click", function (e) {
  const overlay = document.getElementById("focusOverlay");
  if (overlay && e.target.id === "focusOverlay") {
    overlay.classList.remove("active");
    document.querySelectorAll(".product-card")
      .forEach(card => card.classList.remove("focused"));
  }
});

/* =========================
   REFRESH
========================= */
async function refreshAll() {
  const products = await getProducts();
  const customers = await getCustomers();
  const orders = await getOrders();

  updateSummary(products, customers, orders);
  loadDropdowns(products, customers);
}

/* =========================
   LOAD
========================= */
window.onload = refreshAll;
