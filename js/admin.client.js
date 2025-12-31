// ===============================
// ADMIN CLIENT SIDE LOGIC
// ===============================

const API_BASE = "https://renthelp.onrender.com";
const token = localStorage.getItem("token");

// -------------------------------
// AUTH CHECK
// -------------------------------
if (!token) {
  alert("Admin login required");
  window.location.href = "login.html";
}

// -------------------------------
// FETCH ALL USERS
// -------------------------------
async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      alert("Unauthorized access");
      return;
    }

    const users = await res.json();
    const container = document.getElementById("users");
    container.innerHTML = "";

    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "property-card";

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
        <p>Status: ${user.isBlocked ? "Blocked" : "Active"}</p>
        <button onclick="toggleBlock('${user._id}')">
          ${user.isBlocked ? "Unblock" : "Block"}
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Server error while fetching users");
  }
}

// -------------------------------
// BLOCK / UNBLOCK USER
// -------------------------------
async function toggleBlock(userId) {
  try {
    await fetch(`${API_BASE}/api/admin/users/${userId}/block`, {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to update user status");
  }
}

// -------------------------------
// FETCH ALL PROPERTIES
// -------------------------------
async function fetchProperties() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/properties`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const properties = await res.json();
    const container = document.getElementById("properties");
    container.innerHTML = "";

    properties.forEach(p => {
      const card = document.createElement("div");
      card.className = "property-card";

      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>Location: ${p.location}</p>
        <p>Price: ₹${p.price}</p>
        <p>Owner: ${p.landlord?.name || "N/A"}</p>
        <p>Status: ${p.isOccupied ? "Occupied" : "Available"}</p>
        <button onclick="deleteProperty('${p._id}')">Delete</button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Server error while fetching properties");
  }
}

// -------------------------------
// DELETE PROPERTY
// -------------------------------
async function deleteProperty(propertyId) {
  if (!confirm("Are you sure you want to delete this property?")) return;

  try {
    await fetch(`${API_BASE}/api/admin/properties/${propertyId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    fetchProperties();
  } catch (err) {
    console.error(err);
    alert("Failed to delete property");
  }
}

// -------------------------------
// LOGOUT
// -------------------------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// -------------------------------
// INITIAL LOAD
// -------------------------------
fetchUsers();
fetchProperties();
