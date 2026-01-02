// ==========================================
// AUTH CLIENT LOGIC (Updated for Contact & T&C)
// ==========================================

const API_BASE = "https://renthelp.onrender.com/api"; 

// ---------------------------------------------------------
// REGISTER FUNCTION: Validates and sends data to backend
// ---------------------------------------------------------
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const contact = document.getElementById("contact").value.trim(); // ✨ New Contact Field
  const role = document.getElementById("role").value;
  const termsAccepted = document.getElementById("termsCheck").checked; // ✨ T&C Validation

  // Basic Validation
  if (!name || !email || !password || !contact) {
    alert("Please fill in all fields.");
    return;
  }

  // 10-digit mobile number validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(contact)) {
    alert("Please enter a valid 10-digit contact number.");
    return;
  }

  // Terms & Conditions Check
  if (!termsAccepted) {
    alert("You must agree to the Terms & Conditions to register.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, contact, role }) // ✨ Sending contact to backend
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    alert("Server error. Please try again later.");
  }
}

// ---------------------------------------------------------
// LOGIN FUNCTION: Handles session and role redirection
// ---------------------------------------------------------
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Store user session info in LocalStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userId", data.userId);

      // Redirect based on user role
      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else if (data.role === "landlord") {
        window.location.href = "landlord-dashboard.html";
      } else {
        window.location.href = "tenant-dashboard.html";
      }
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server error. Please try again later.");
  }
}
