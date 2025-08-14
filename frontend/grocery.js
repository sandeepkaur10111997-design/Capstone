document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("grocery-form");
  const messageDiv = document.getElementById("message");
  const tableBody = document.querySelector("#grocery-table tbody");
  const API_BASE = 'https://capstone-backend-hl36.onrender.com';

  // Load existing grocery items on page load
  async function loadGroceries() {
    try {
      const res = await fetch(`${API_BASE}/api/groceries`);
      const data = await res.json();
      tableBody.innerHTML = "";
      data.forEach((item) => {
        const row = `
          <tr>
            <td data-label="Name">${item.name}</td>
            <td data-label="Brand">${item.brand || "-"}</td>
            <td data-label="Quantity">${item.quantity}</td>
            <td data-label="Price">$${item.price.toFixed(2)}</td>
            <td data-label="Category">${item.category}</td>
            <td data-label="Expiry Date">${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
          </tr>`;
        tableBody.innerHTML += row;
      });
    } catch (err) {
      console.error("Error loading groceries:", err);
      messageDiv.innerText = "Failed to load items.";
      messageDiv.style.color = "red";
    }
  }

  // Handle form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);
    const category = document.getElementById("category").value.trim();
    const expiryDate = document.getElementById("expiry").value;

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize for date-only comparison

    if (!name || !brand || !category || quantity <= 0 || price <= 0 || !expiryDate || expiry <= today) {
      messageDiv.innerText = "Please fill in all fields correctly. Expiry date must be a future date.";
      messageDiv.style.color = "red";
      return;
    }

    const data = { name, brand, quantity, price, category, expiryDate };

    try {
      const res = await fetch(`${API_BASE}/api/groceries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const savedItem = await res.json();
        messageDiv.innerText = "✅ Item added successfully!";
        messageDiv.style.color = "green";
        form.reset();
        addGroceryRow(savedItem);
      } else {
        messageDiv.innerText = "❌ Failed to add item.";
        messageDiv.style.color = "red";
      }
    } catch (err) {
      console.error("Server error:", err);
      messageDiv.innerText = "❌ Server error. Please try again.";
      messageDiv.style.color = "red";
    }
  });

  // Function to append a new row to the table
  function addGroceryRow(item) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Name">${item.name}</td>
      <td data-label="Brand">${item.brand || "-"}</td>
      <td data-label="Quantity">${item.quantity}</td>
      <td data-label="Price">$${item.price.toFixed(2)}</td>
      <td data-label="Category">${item.category}</td>
      <td data-label="Expiry Date">${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
    `;
    tableBody.appendChild(row);
  }

  // Load groceries when the page loads
  loadGroceries();
});


