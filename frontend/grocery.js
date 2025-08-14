// frontend/grocery.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("grocery-form");
  const messageDiv = document.getElementById("message");
  const tableBody = document.querySelector("#grocery-table tbody");

  // Ensure table has an Actions header (safe if already present)
  const thead = document.querySelector("#grocery-table thead tr");
  if (thead && ![...thead.children].some(th => th.textContent.trim().toLowerCase() === "actions")) {
    const th = document.createElement("th");
    th.textContent = "Actions";
    thead.appendChild(th);
  }

  // Helpers
  const fmtMoney = (n) => `$${Number(n || 0).toFixed(2)}`;
  const iso = (d) => d ? new Date(d).toISOString().slice(0,10) : "";

  async function loadGroceries() {
    try {
      const res = await fetch("/api/groceries");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      tableBody.innerHTML = "";
      data.forEach(addRow);
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = '<tr><td colspan="7">Failed to load groceries.</td></tr>';
    }
  }

  function addRow(item) {
    const tr = document.createElement("tr");
    tr.dataset.id = item._id;
    tr.dataset.expiry = item.expiryDate || ""; // keep ISO for edit mode
    tr.innerHTML = `
      <td data-label="Name">${item.name || "N/A"}</td>
      <td data-label="Brand">${item.brand || "-"}</td>
      <td data-label="Quantity">${item.quantity ?? 0}</td>
      <td data-label="Price">${fmtMoney(item.price)}</td>
      <td data-label="Category">${item.category || "N/A"}</td>
      <td data-label="Expiry Date">${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
      <td data-label="Actions">
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  }

  // Add new item
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const item = {
      name: document.getElementById("name").value.trim(),
      brand: document.getElementById("brand").value.trim(),
      quantity: Number(document.getElementById("quantity").value || 0),
      price: Number(document.getElementById("price").value || 0),
      category: document.getElementById("category").value.trim(),
      expiryDate: document.getElementById("expiry").value
    };
    try {
      const res = await fetch("/api/groceries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      addRow(payload.item || item);
      messageDiv.textContent = payload?.budgetUpdate?.message || "✅ Item added!";
      messageDiv.style.color = "green";
      form.reset();
    } catch (err) {
      console.error(err);
      messageDiv.textContent = "❌ Failed to add item.";
      messageDiv.style.color = "red";
    }
  });

  // Row-level actions (edit/delete/save/cancel) via event delegation
  tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const tr = btn.closest("tr");
    const id = tr?.dataset.id;

    // DELETE
    if (btn.classList.contains("btn-delete")) {
      if (!confirm("Delete this item?")) return;
      try {
        const res = await fetch(`/api/groceries/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        tr.remove();
        messageDiv.textContent = data?.budgetUpdate?.message || "🗑️ Item deleted.";
        messageDiv.style.color = "green";
      } catch (err) {
        console.error(err);
        messageDiv.textContent = err.message || "Failed to delete.";
        messageDiv.style.color = "red";
      }
      return;
    }

    // ENTER EDIT MODE
    if (btn.classList.contains("btn-edit")) {
      if (tr.dataset.mode === "edit") return; // already editing

      const [nameCell, brandCell, qtyCell, priceCell, categoryCell, expiryCell, actionCell] = tr.children;
      const current = {
        name: nameCell.textContent.trim(),
        brand: brandCell.textContent.trim() === "-" ? "" : brandCell.textContent.trim(),
        quantity: Number(qtyCell.textContent.trim() || 0),
        price: Number((priceCell.textContent.trim() || "$0").replace("$", "")),
        category: categoryCell.textContent.trim() === "N/A" ? "" : categoryCell.textContent.trim(),
        expiryDate: tr.dataset.expiry ? iso(tr.dataset.expiry) : ""
      };
      tr.dataset.mode = "edit";
      nameCell.innerHTML     = `<input type="text" value="${current.name}">`;
      brandCell.innerHTML    = `<input type="text" value="${current.brand}">`;
      qtyCell.innerHTML      = `<input type="number" min="1" step="1" value="${current.quantity}">`;
      priceCell.innerHTML    = `<input type="number" min="0.01" step="0.01" value="${current.price}">`;
      categoryCell.innerHTML = `<input type="text" value="${current.category}">`;
      expiryCell.innerHTML   = `<input type="date" value="${current.expiryDate}">`;
      actionCell.innerHTML   = `
        <button class="btn btn-save">Save</button>
        <button class="btn btn-cancel">Cancel</button>
      `;
      return;
    }

    // SAVE EDITS
    if (btn.classList.contains("btn-save")) {
      const [nameCell, brandCell, qtyCell, priceCell, categoryCell, expiryCell, actionCell] = tr.children;
      const payload = {
        name: nameCell.querySelector("input").value.trim(),
        brand: brandCell.querySelector("input").value.trim(),
        quantity: Number(qtyCell.querySelector("input").value || 0),
        price: Number(priceCell.querySelector("input").value || 0),
        category: categoryCell.querySelector("input").value.trim(),
        expiryDate: expiryCell.querySelector("input").value
      };

      try {
        const res = await fetch(`/api/groceries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        const item = data.item || payload;

        // Re-render the row (view mode)
        tr.dataset.mode = "";
        tr.dataset.expiry = item.expiryDate || "";
        tr.innerHTML = `
          <td data-label="Name">${item.name || "N/A"}</td>
          <td data-label="Brand">${item.brand || "-"}</td>
          <td data-label="Quantity">${item.quantity ?? 0}</td>
          <td data-label="Price">${fmtMoney(item.price)}</td>
          <td data-label="Category">${item.category || "N/A"}</td>
          <td data-label="Expiry Date">${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
          <td data-label="Actions">
            <button class="btn btn-edit">Edit</button>
            <button class="btn btn-delete">Delete</button>
          </td>
        `;
        messageDiv.textContent = data?.budgetUpdate?.message || "✅ Item updated.";
        messageDiv.style.color = "green";
      } catch (err) {
        console.error(err);
        messageDiv.textContent = err.message || "Failed to save changes.";
        messageDiv.style.color = "red";
      }
      return;
    }

    // CANCEL EDIT
    if (btn.classList.contains("btn-cancel")) {
      // Reload list for simplicity (ensures we show latest from server)
      await loadGroceries();
      return;
    }
  });

  // Initial load
  loadGroceries();
});
