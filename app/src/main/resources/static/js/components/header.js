// header.js — Dynamically renders the page header based on user role

function renderHeader() {
  const headerDiv = document.getElementById('header');
  if (!headerDiv) return;

  // Root page: clear role and show plain logo header
  if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
    localStorage.removeItem('userRole');
    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>`;
    return;
  }

  const role = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  // Session guard: if logged-in role but no token, expire session
  if ((role === 'loggedPatient' || role === 'admin' || role === 'doctor') && !token) {
    localStorage.removeItem('userRole');
    alert('Session expired or invalid login. Please log in again.');
    window.location.href = '/';
    return;
  }

  let headerContent = `<header class="header">
    <div class="logo-section">
      <a class="logo-link" href="/">
        <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
        <span class="logo-title">Hospital CMS</span>
      </a>
    </div>
    <nav>`;

  if (role === 'admin') {
    headerContent += `
      <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
      <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === 'doctor') {
    headerContent += `
      <button class="adminBtn" onclick="selectRole('doctor')">Home</button>
      <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === 'patient') {
    headerContent += `
      <button id="patientLogin" class="adminBtn">Login</button>
      <button id="patientSignup" class="adminBtn">Sign Up</button>`;
  } else if (role === 'loggedPatient') {
    headerContent += `
      <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
      <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
      <a href="#" onclick="logoutPatient()">Logout</a>`;
  }

  headerContent += `</nav></header>`;
  headerDiv.innerHTML = headerContent;

  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const adminLoginBtn = document.getElementById('adminLogin');
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => openModal('adminLogin'));
  }
  const doctorLoginBtn = document.getElementById('doctorLogin');
  if (doctorLoginBtn) {
    doctorLoginBtn.addEventListener('click', () => openModal('doctorLogin'));
  }
}

function logout() {
  localStorage.removeItem('userRole');
  localStorage.removeItem('token');
  window.location.href = '/';
}

function logoutPatient() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  window.location.href = '/pages/patientDashboard.html';
}

renderHeader();
