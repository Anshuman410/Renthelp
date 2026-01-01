// ==========================================
// TENANT CLIENT LOGIC (Cloudinary Image Version)
// ==========================================

const API_BASE = "https://renthelp.onrender.com/api"; 
const token = localStorage.getItem("token");

// -------------------------------
// 1. AUTH PROTECTION
// -------------------------------
if (!token || localStorage.getItem("role") !== "tenant") {
  alert("Tenant login required");
  window.location.href = "login.html";
}

// -------------------------------
// 2. LOAD PROPERTIES WITH IMAGES
// -------------------------------
async function loadProperties() {
  const location = document.getElementById("location")?.value || "";
  const minPrice = document.getElementById("minPrice")?.value || "";
  const maxPrice = document.getElementById("maxPrice")?.value || "";

  let url = `${API_BASE}/properties?`;
  if (location) url += `location=${encodeURIComponent(location)}&`;
  if (minPrice) url += `minPrice=${minPrice}&`;
  if (maxPrice) url += `maxPrice=${maxPrice}&`;

  try {
    const res = await fetch(url, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      alert("Unable to load properties");
      return;
    }

    const properties = await res.json();
    renderProperties(properties);

  } catch (err) {
    console.error("TENANT LOAD ERROR:", err);
  }
}

// -------------------------------
// 3. RENDER PROPERTY CARDS
// -------------------------------
function renderProperties(properties) {
  const container = document.getElementById("properties");
  if (!container) return;
  
  container.innerHTML = "";

  if (!properties.length) {
    container.innerHTML = "<p>No available properties found matching your criteria.</p>";
    return;
  }

  properties.forEach(p => {
    const card = document.createElement("div");
    card.className = "property-card";

    // ✨ Displaying the Real Image from Cloudinary
    card.innerHTML = `
      <img src="${p.imageUrl || 'https://via.placeholder.com/400x250?text=Property+Image'}" 
           alt="Property" 
           style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;">
      
      <div style="padding: 15px;">
        <h3 style="color: #ffd479; margin-bottom: 10px;">${p.title}</h3>
        <p><b>📍 Location:</b> ${p.location}</p>
        <p><b>💰 Rent:</b> ₹${p.price} / month</p>
        <p style="font-size: 0.9rem; color: #ccc; margin-top: 5px;">${p.description ? p.description.substring(0, 60) + '...' : 'No description.'}</p>
        
        <button onclick="viewDetails('${p._id}')" style="width: 100%; margin-top: 15px; background: #c9a24d; color: #000; font-weight: bold; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
            View Details
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function viewDetails(id) {
  window.location.href = `property-details.html?id=${id}`;
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Initial load
loadProperties();
