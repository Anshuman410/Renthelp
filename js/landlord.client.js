// =========================================================
// LANDLORD CLIENT: Handles Property Management & Interests
// =========================================================

const API_BASE = "https://renthelp.onrender.com/api"; 
const token = localStorage.getItem("token");

// ---------------------------------------------------------
// 1. AUTH PROTECTION
// ---------------------------------------------------------
if (!token || localStorage.getItem("role") !== "landlord") {
    alert("Unauthorized access. Please login as a Landlord.");
    window.location.href = "login.html";
}

// ---------------------------------------------------------
// 2. LOAD LANDLORD PROPERTIES
// ---------------------------------------------------------
async function loadMyProperties() {
    try {
        const res = await fetch(`${API_BASE}/properties/landlord/my-properties`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) {
            alert("Session expired. Please login again.");
            logout();
            return;
        }

        const properties = await res.json();
        const container = document.getElementById("myProperties");
        if (!container) return;
        
        container.innerHTML = "";

        if (properties.length === 0) {
            container.innerHTML = "<p style='color: #ccc;'>You haven't listed any properties yet.</p>";
            return;
        }

        properties.forEach(p => {
            const card = document.createElement("div");
            card.className = "property-card";
            
            card.innerHTML = `
                <img src="${p.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'}" 
                     style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
                <h3 style="color: #ffd479; margin-bottom: 8px;">${p.title}</h3>
                <p><b>📍 Location:</b> ${p.location}</p>
                <p><b>💰 Rent:</b> ₹${p.price} / month</p>
                <p><b>📊 Status:</b> ${p.isOccupied ? '<span style="color: #ff4d4d;">Occupied</span>' : '<span style="color: #4dfb4d;">Available</span>'}</p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="viewInterested('${p._id}')" style="flex:1; padding: 10px; font-weight: bold; cursor: pointer;">View Interests</button>
                    <button onclick="deleteProperty('${p._id}')" style="flex:1; background: #ff4d4d; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("LOAD PROPERTIES ERROR:", err);
    }
}

// ---------------------------------------------------------
// 3. VIEW INTERESTED TENANTS (Updated for Contact Info)
// ---------------------------------------------------------
async function viewInterested(propertyId) {
    try {
        const res = await fetch(`${API_BASE}/interests/property/${propertyId}`, {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Could not fetch interests.");
            return;
        }

        if (data.length === 0) {
            alert("No tenants have expressed interest yet.");
            return;
        }

        // ✨ Building the list with Tenant's Name, Email, and Contact Number
        let list = "Interested Tenants List:\n\n";
        data.forEach((item, idx) => {
            if (item.tenant) {
                list += `--- Tenant #${idx + 1} ---\n`;
                list += `👤 Name: ${item.tenant.name}\n`;
                list += `📧 Email: ${item.tenant.email}\n`;
                list += `📞 Contact: ${item.tenant.contact || 'Not available'}\n\n`; // ✨ Showing contact
            }
        });

        alert(list);
    } catch (err) {
        console.error("VIEW INTEREST ERROR:", err);
        alert("Failed to load interested tenants.");
    }
}

// ---------------------------------------------------------
// 4. ADD PROPERTY WITH IMAGE UPLOAD
// ---------------------------------------------------------
async function addProperty() {
    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("propertyImage");

    if (!title || !location || !price) {
        alert("Title, Location, and Price are required.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("description", description);
    
    if (imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    try {
        const btn = document.querySelector(".btn-primary") || { innerText: "" };
        const originalText = btn.innerText;
        btn.innerText = "Uploading...";
        btn.disabled = true;

        const res = await fetch(`${API_BASE}/properties`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + token },
            body: formData
        });

        if (res.ok) {
            alert("Property listed successfully!");
            window.location.reload(); 
        } else {
            const errorData = await res.json();
            alert(errorData.message || "Failed to add property.");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        console.error("ADD PROPERTY ERROR:", err);
        alert("Server error. Please try again.");
    }
}

// ---------------------------------------------------------
// 5. DELETE PROPERTY
// ---------------------------------------------------------
async function deleteProperty(id) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
        const res = await fetch(`${API_BASE}/properties/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            alert("Property deleted.");
            loadMyProperties();
        }
    } catch (err) {
        console.error("DELETE ERROR:", err);
    }
}

// ---------------------------------------------------------
// 6. LOGOUT
// ---------------------------------------------------------
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Initial load on page entry
window.onload = loadMyProperties;
