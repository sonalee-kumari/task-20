// Services Data
const availableServices = [
  { id: 1, name: "Wash & Fold", price: 15 },
  { id: 2, name: "Dry Cleaning", price: 25 },
  { id: 3, name: "Iron & Steam Press", price: 10 },
  { id: 4, name: "Bedding & Linen Care", price: 30 },
  { id: 5, name: "Stain Removal Treatment", price: 20 }
];

// Cart State (stores map of serviceId -> quantity)
const cart = {};

// DOM Elements
const serviceList = document.getElementById("serviceList");
const cartItemsList = document.getElementById("cartItemsList");
const totalAmountEl = document.getElementById("totalAmount");
const bookServiceBtn = document.getElementById("bookServiceBtn");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMsg = document.getElementById("newsletterMsg");

function renderServices() {
  serviceList.innerHTML = "";
  availableServices.forEach((service) => {
    const item = document.createElement("div");
    item.className = "service-item";
    item.innerHTML = `
      <div>
        <strong>${service.name}</strong>
        <p>$${service.price}</p>
      </div>
      <div class="service-item-actions">
        <button class="btn-add" onclick="addToCart(${service.id})">Add Items</button>
        <button class="btn-remove" onclick="removeFromCart(${service.id})">Remove Now</button>
      </div>
    `;
    serviceList.appendChild(item);
  });
}

function addToCart(serviceId) {
  cart[serviceId] = (cart[serviceId] || 0) + 1;
  updateCartUI();
}

function removeFromCart(serviceId) {
  if (cart[serviceId]) {
    cart[serviceId] -= 1;
    if (cart[serviceId] <= 0) {
      delete cart[serviceId];
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const itemKeys = Object.keys(cart);
  let total = 0;

  if (itemKeys.length === 0) {
    cartItemsList.innerHTML = `<li class="empty-cart-msg">No added items.</li>`;
    totalAmountEl.textContent = "0";
    return;
  }

  cartItemsList.innerHTML = "";

  itemKeys.forEach((id) => {
    const service = availableServices.find((s) => s.id === parseInt(id));
    const count = cart[id];
    const subtotal = service.price * count;
    total += subtotal;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${service.name} (x${count})</span>
      <span>$${subtotal}</span>
    `;
    cartItemsList.appendChild(li);
  });

  totalAmountEl.textContent = total;
}

bookServiceBtn.addEventListener("click", () => {
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
});

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const selectedCount = Object.keys(cart).length;
  if (selectedCount === 0) {
    alert("Please add at least one service to the cart before booking.");
    return;
  }

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const total = totalAmountEl.textContent;

  const emailParams = {
    to_name: fullName,
    to_email: email,
    phone_number: phone,
    total_amount: total
  };

  if (typeof emailjs !== "undefined" && window.emailjs) {
    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailParams)
      .catch((err) => console.log("EmailJS note:", err));
  }

  bookingMessage.classList.remove("hidden");

  bookingForm.reset();
  for (let key in cart) delete cart[key];
  updateCartUI();
});

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newsletterMsg.classList.remove("hidden");
  newsletterForm.reset();
});

renderServices();