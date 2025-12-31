const API_BASE = "https://renthelp.onrender.com/api";

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

/* ================= ADD PROPERTY ================= */
async function addProperty() {
  const title = document.getElementById("title").value;
  const location = document.getElementById("location").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  try {
    const res = await fetch(`${API_BASE}/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ title, location, price, description })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add property");
      return;
    }

    alert("Property added successfully");
    loadMyProperties();
  } catch (err) {
    alert("Server error");
  }
}

/* ================= LOAD MY PROPERTIES ================= */
async function loadMyProperties() {
  try {
    const res = await fetch(`${API_BASE}/property/landlord/my-properties`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const properties = await res.json();

    if (!res.ok) {
      alert("Unable to load properties");
      return;
    }

    const container = document.getElementById("myProperties");
    container.innerHTML = "";

    if (properties.length === 0) {
      container.innerHTML = "<p>No properties added yet.</p>";
      return;
    }

    properties.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${p.title}</h3>
        <p><b>Location:</b> ${p.location}</p>
        <p><b>Rent:</b> ₹${p.price}</p>
        <p>${p.description || ""}</p>
        <p>Status: ${p.isOccupied ? "Occupied" : "Available"}</p>
        <button onclick="markOccupied('${p._id}')">Mark Occupied</button>
        <button onclick="deleteProperty('${p._id}')">Delete</button>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    alert("Unable to load properties");
  }
}

/* ================= MARK OCCUPIED ================= */
async function markOccupied(id) {
  await fetch(`${API_BASE}/property/${id}/occupy`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  loadMyProperties();
}

/* ================= DELETE ================= */
async function deleteProperty(id) {
  await fetch(`${API_BASE}/property/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  loadMyProperties();
}

/* ================= INIT ================= */
loadMyProperties();
