// ==========================================
// LANDLORD CLIENT LOGIC (Cloudinary Version)
// ==========================================

const API_BASE = "https://renthelp.onrender.com/api"; 
const token = localStorage.getItem("token");

// -------------------------------
// 1. AUTH & ROLE PROTECTION
// -------------------------------
if (!token || localStorage.getItem("role") !== "landlord") {
    alert("Unauthorized! Landlord login required.");
    window.location.href = "login.html";
}

// -------------------------------
// 2. LOAD LANDLORD'S PROPERTIES
// -------------------------------
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
            container.innerHTML = "<p style='color: #ccc;'>No properties listed yet. Add your first one above!</p>";
            return;
        }

        properties.forEach(p => {
            const card = document.createElement("div");
            card.className = "property-card";
            
            // Note: Using imageUrl from Cloudinary
            card.innerHTML = `
                <img src="${p.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image+Available'}" 
                     alt="Property" 
                     style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
                <h3 style="color: #ffd479; margin-bottom: 8px;">${p.title}</h3>
                <p><b>📍 Location:</b> ${p.location}</p>
                <p><b>💰 Rent:</b> ₹${p.price} / month</p>
                <p><b>📊 Status:</b> ${p.isOccupied ? '<span style="color: #ff4d4d;">Occupied</span>' : '<span style="color: #4dfb4d;">Available</span>'}</p>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="viewInterested('${p._id}')" style="flex:1; padding: 8px; font-size: 0.8rem;">Interests</button>
                    <button onclick="deleteProperty('${p._id}')" style="flex:1; background: #ff4d4d; color: #fff; padding: 8px; font-size: 0.8rem; border: none; border-radius: 4px;">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

// -------------------------------
// 3. ADD PROPERTY (WITH IMAGE)
// -------------------------------
async function addProperty() {
    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("propertyImage");

    if (!title || !location || !price) {
        alert("Please fill Title, Location, and Price.");
        return;
    }

    // ✨ FormData is used to handle file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("description", description);
    
    if (imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    try {
        // Show loading state
        const btn = document.querySelector(".btn-primary");
        const originalText = btn.innerText;
        btn.innerText = "Uploading to Cloud...";
        btn.disabled = true;

        const res = await fetch(`${API_BASE}/properties`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
                // NOTE: Content-Type header is NOT set when using FormData
            },
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            alert("Property listed successfully with image!");
            window.location.reload(); 
        } else {
            alert(data.message || "Failed to upload property");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        console.error("UPLOAD ERROR:", err);
        alert("Server error. Check if your backend is running.");
    }
}

// -------------------------------
// 4. VIEW INTERESTED TENANTS
// -------------------------------
async function viewInterested(propertyId) {
    try {
        const res = await fetch(`${API_BASE}/interests/property/${propertyId}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();

        if (data.length === 0) {
            alert("No one has shown interest in this property yet.");
            return;
        }

        let list = "Interested Tenants:\n\n";
        data.forEach((item, idx) => {
            if (item.tenant) {
                list += `${idx + 1}. ${item.tenant.name} (${item.tenant.email})\n`;
            }
        });
        alert(list);
    } catch (err) {
        console.error("INTEREST FETCH ERROR:", err);
    }
}

// -------------------------------
// 5. DELETE PROPERTY
// -------------------------------
async function deleteProperty(id) {
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;

    try {
        const res = await fetch(`${API_BASE}/properties/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            alert("Listing removed.");
            loadMyProperties();
        }
    } catch (err) {
        console.error("DELETE ERROR:", err);
    }
}

// -------------------------------
// 6. LOGOUT
// -------------------------------
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Initial load
window.onload = loadMyProperties;
