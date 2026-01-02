const API_BASE = "https://renthelp.onrender.com/api"; 
const token = localStorage.getItem("token");

if (!token || localStorage.getItem("role") !== "admin") {
    window.location.href = "login.html";
}

async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/admin/users`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const users = await res.json();
        
        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = "";

        users.forEach(user => {
            // Admin khud ko delete na kar sake isliye check
            const deleteBtn = user.role !== 'admin' 
                ? `<button onclick="deleteUser('${user._id}')" style="background:red; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>` 
                : `<span style="color:gray;">Protected</span>`;

            tableBody.innerHTML += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 15px;">${user.name}</td>
                    <td style="padding: 15px;">${user.email}</td>
                    <td style="padding: 15px;">${user.contact || 'N/A'}</td>
                    <td style="padding: 15px;">
                        <span style="color:${user.role === 'landlord' ? '#ffd479' : '#4dfb4d'}">${user.role.toUpperCase()}</span>
                    </td>
                    <td style="padding: 15px;">${deleteBtn}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

async function deleteUser(userId) {
    if (!confirm("Are you sure? User ka saara data delete ho jayega!")) return;

    try {
        const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            alert("User removed successfully");
            loadUsers(); // Refresh table
        }
    } catch (err) {
        alert("Delete failed");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

window.onload = loadUsers;
