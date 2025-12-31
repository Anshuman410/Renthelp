// ===============================
// FINAL CORRECTED TENANT CLIENT
// ===============================

// Standardized API_BASE to include /api to match server.js
const API_BASE = "https://renthelp.onrender.com/api"; 
const token = localStorage.getItem("token");

// -------------------------------
// AUTH CHECK (TENANT ONLY)
// -------------------------------
// Prevents dashboard access if the user is not a logged-in tenant
if (!token || localStorage.getItem("role") !== "tenant") {
  alert("Tenant login required");
  window.location.href = "login.html";
}

// -------------------------------
// LOAD AVAILABLE PROPERTIES
// -------------------------------
async function loadProperties() {
  const location = document.getElementById("location")?.value || "";
  const minPrice = document.getElementById("minPrice")?.value || "";
  const maxPrice = document.getElementById("maxPrice")?.value || "";

  // Fixed plural 'properties' to match backend property.routes.js
  let url = `${API_BASE}/properties?`;
  if (location) url += `location=${encodeURIComponent(location)}&`;
  if (minPrice) url += `minPrice=${minPrice}&`;
  if (maxPrice) url += `maxPrice=${maxPrice}&`;

  try {
    const res = await fetch(url, {
      headers: {
        // Required for auth.middleware.js
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      alert("Unable to load properties");
      return;
    }

    const properties = await res.json();
    renderProperties(properties);

  } catch (err) {
    console.error("TENANT LOAD ERROR:", err);
    alert("Server error: Could not fetch properties.");
  }
}

// -------------------------------
// RENDER PROPERTIES TO GRID
// -------------------------------
function renderProperties(properties) {
  const container = document.getElementById("properties");
  if (!container) return;
  
  container.innerHTML = "";

  if (!properties.length) {
    container.innerHTML = "<p>No available properties found.</p>";
    return;
  }

  properties.forEach(p => {
    const card = document.createElement("div");
    card.className = "property-card"; // Matches style.css

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p><b>Location:</b> ${p.location}</p>
      <p><b>Rent:</b> ₹${p.price}</p>
      <p>${p.description || ""}</p>
      <button onclick="viewDetails('${p._id}')">View Details</button>
    `;

    container.appendChild(card);
  });
}

// Navigates to the details page with the property ID
function viewDetails(id) {
  window.location.href = `property-details.html?id=${id}`;
}

// -------------------------------
// LOGOUT
// -------------------------------
function logout() {
  localStorage.clear(); // Clears token and role
  window.location.href = "login.html";
}

// Initial load for tenant dashboard upon script entry
loadProperties();