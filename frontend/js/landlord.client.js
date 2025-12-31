// ===============================
// FINAL CORRECTED LANDLORD CLIENT
// ===============================

const API_BASE = "https://renthelp.onrender.com/api"; 
const token = localStorage.getItem("token");

// -------------------------------
// AUTH CHECK
// -------------------------------
if (!token || localStorage.getItem("role") !== "landlord") {
    alert("Landlord login required");
    window.location.href = "login.html";
}

// -------------------------------
// LOAD MY PROPERTIES
// -------------------------------
async function loadMyProperties() {
    try {
        const res = await fetch(`${API_BASE}/properties/landlord/my-properties`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) {
            alert("Unable to load properties.");
            return;
        }

        const properties = await res.json();
        const container = document.getElementById("myProperties");
        if (!container) return;
        container.innerHTML = "";

        if (properties.length === 0) {
            container.innerHTML = "<p>No properties added yet.</p>";
            return;
        }

        properties.forEach(p => {
            const card = document.createElement("div");
            card.className = "property-card";
            card.innerHTML = `
                <h3>${p.title}</h3>
                <p><b>Location:</b> ${p.location}</p>
                <p><b>Rent:</b> ₹${p.price}</p>
                <p><b>Status:</b> ${p.isOccupied ? "Occupied" : "Available"}</p>
                <button onclick="viewInterested('${p._id}')">View Interested</button>
                <button onclick="markOccupied('${p._id}')">Mark Occupied</button>
                <button onclick="deleteProperty('${p._id}')">Delete</button>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

// -------------------------------
// VIEW INTERESTED TENANTS (FIXED)
// -------------------------------
async function viewInterested(propertyId) {
    console.log("Fetching interest for property:", propertyId);
    try {
        const res = await fetch(`${API_BASE}/interests/property/${propertyId}`, {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Could not fetch interested tenants");
            return;
        }

        if (!data || data.length === 0) {
            alert("No tenants have shown interest yet.");
            return;
        }

        let list = "Interested Tenants:\n\n";
        data.forEach((item, index) => {
            if (item.tenant) {
                list += `${index + 1}. ${item.tenant.name} (${item.tenant.email})\n`;
            }
        });
        alert(list);
    } catch (err) {
        console.error("VIEW INTEREST ERROR:", err);
        alert("Server error.");
    }
}

// -------------------------------
// ADD NEW PROPERTY
// -------------------------------
async function addProperty() {
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;

    try {
        const res = await fetch(`${API_BASE}/properties`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ title, location, price, description })
        });

        if (res.ok) {
            alert("Property added!");
            loadMyProperties();
        }
    } catch (err) {
        console.error("ADD ERROR:", err);
    }
}

// -------------------------------
// MARK OCCUPIED / DELETE / LOGOUT
// -------------------------------
async function markOccupied(id) {
    await fetch(`${API_BASE}/properties/${id}/occupy`, {
        method: "PATCH",
        headers: { "Authorization": "Bearer " + token }
    });
    loadMyProperties();
}

async function deleteProperty(id) {
    if (!confirm("Delete property?")) return;
    await fetch(`${API_BASE}/properties/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    loadMyProperties();
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Global initialization
window.onload = loadMyProperties;