const BASE_URL = 'https://stackblitz-starters-wmvq2hq6-iligan.onrender.com';

/* =========================
   PRODUCTS
========================= */

async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  const data = await res.json();

  const list = document.getElementById('productsList');
  list.innerHTML = '';

  data.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = `${product.name} - ₱${product.price} (Stock: ${product.stock})`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.onclick = () => deleteProduct(product.id);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addProduct() {
  const name = document.getElementById('productName').value;
  const price = document.getElementById('price').value;
  const stock = document.getElementById('stock').value;

  if (!name || !price || !stock) {
    alert('Fill all product fields');
    return;
  }

  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      price: Number(price),
      stock: Number(stock),
    }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  document.getElementById('productName').value = '';
  document.getElementById('price').value = '';
  document.getElementById('stock').value = '';

  getProducts();
  loadDropdowns();
}

async function deleteProduct(productId) {
  await fetch(`${BASE_URL}/products/${productId}`, { method: 'DELETE' });
  getProducts();
  loadDropdowns();
  getOrders();
}

/* =========================
   CUSTOMERS
========================= */

async function getCustomers() {
  const res = await fetch(`${BASE_URL}/customers`);
  const data = await res.json();

  const list = document.getElementById('customersList');
  list.innerHTML = '';

  data.forEach((customer) => {
    const li = document.createElement('li');
    li.textContent = `${customer.name} (${customer.email})`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.onclick = () => deleteCustomer(customer.id);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addCustomer() {
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;

  if (!name || !email) {
    alert('Fill all customer fields');
    return;
  }

  const res = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  document.getElementById('customerName').value = '';
  document.getElementById('customerEmail').value = '';

  getCustomers();
  loadDropdowns();
}

async function deleteCustomer(customerId) {
  await fetch(`${BASE_URL}/customers/${customerId}`, { method: 'DELETE' });
  getCustomers();
  loadDropdowns();
  getOrders();
}

/* =========================
   ORDERS
========================= */

async function getOrders() {
  const [ordersRes, customersRes, productsRes] = await Promise.all([
    fetch(`${BASE_URL}/orders`),
    fetch(`${BASE_URL}/customers`),
    fetch(`${BASE_URL}/products`),
  ]);

  const orders = await ordersRes.json();
  const customers = await customersRes.json();
  const products = await productsRes.json();

  const list = document.getElementById('ordersList');
  list.innerHTML = '';

  orders.forEach((order) => {
    const customer = customers.find((c) => c.id === order.customerId);
    const product = products.find((p) => p.id === order.productId);

    const li = document.createElement('li');

    li.innerHTML = `
      <strong>${customer ? customer.name : 'Unknown'}</strong>
      ordered
      <strong>${product ? product.name : 'Unknown'}</strong>
      (Qty: ${order.quantity})
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.onclick = () => deleteOrder(order.id);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function createOrder() {
  const customerId = document.getElementById('orderCustomerId').value;
  const productId = document.getElementById('orderProductId').value;
  const quantity = document.getElementById('quantity').value;

  if (!customerId || !productId || !quantity) {
    return alert('Complete all fields');
  }

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId,
      productId,
      quantity: Number(quantity),
    }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  document.getElementById('quantity').value = '';

  getOrders();
  loadDropdowns();
}

async function deleteOrder(orderId) {
  await fetch(`${BASE_URL}/orders/${orderId}`, { method: 'DELETE' });
  getOrders();
  loadDropdowns();
}

async function loadDropdowns() {
  const [customersRes, productsRes] = await Promise.all([
    fetch(`${BASE_URL}/customers`),
    fetch(`${BASE_URL}/products`),
  ]);

  const customers = await customersRes.json();
  const products = await productsRes.json();

  const customerSelect = document.getElementById('orderCustomerId');
  const productSelect = document.getElementById('orderProductId');

  customerSelect.innerHTML = '';
  productSelect.innerHTML = '';

  customers.forEach((c) => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `${c.name} (${c.email})`;
    customerSelect.appendChild(option);
  });

  products.forEach((p) => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.name} - ₱${p.price}`;
    option.dataset.stock = p.stock;
    productSelect.appendChild(option);
  });

  updateStockInfo();
}

function updateStockInfo() {
  const productSelect = document.getElementById('orderProductId');
  const selected = productSelect.options[productSelect.selectedIndex];

  if (selected) {
    document.getElementById(
      'stockInfo'
    ).textContent = `Available Stock: ${selected.dataset.stock}`;
  }
}

window.onload = () => {
  getProducts();
  getCustomers();
  getOrders();
  loadDropdowns();
};
