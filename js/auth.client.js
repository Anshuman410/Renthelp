// ===============================
// FINAL CORRECTED AUTH CLIENT LOGIC
// ===============================

const API_BASE = "https://renthelp.onrender.com"; 

/* ===============================
   LOGIN
=============================== */
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    /* ✅ DATA MAPPING ADJUSTED:
       Your console log confirms the response is: { token: '...', role: '...' }
       Accessing data.role directly is the correct way for your current backend response.
    */
    if (data.role) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect based on the role directly from 'data'
      if (data.role === "tenant") {
        window.location.href = "tenant-dashboard.html";
      } else if (data.role === "landlord") {
        window.location.href = "landlord-dashboard.html";
      } else if (data.role === "admin") {
        window.location.href = "admin.html";
      }
    } else {
      console.error("Role missing in response:", data);
      alert("Login error: User role not received from server");
    }

  } catch (err) {
    console.error("LOGIN FETCH ERROR:", err);
    alert("Server error: Unable to connect to backend.");
  }
}

/* ===============================
   LOGOUT
=============================== */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

/* ===============================
   PROTECT PAGES
=============================== */
function requireAuth(requiredRole = null) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    alert("Please login");
    window.location.href = "login.html";
    return;
  }

  if (requiredRole && role !== requiredRole) {
    alert("Unauthorized access");
    window.location.href = "login.html";
  }
}