/* adminDashboard.js */
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';
import { openModal } from './components/modals.js';

// Attach click listener to "Add Doctor" button
document.addEventListener('DOMContentLoaded', () => {
  loadDoctorCards();

  const addDocBtn = document.getElementById('addDocBtn');
  if (addDocBtn) {
    addDocBtn.addEventListener('click', () => openModal('addDoctor'));
  }

  // Attach filter listeners
  const searchBar = document.getElementById('searchBar');
  const filterTime = document.getElementById('filterTime');
  const filterSpecialty = document.getElementById('filterSpecialty');

  if (searchBar) searchBar.addEventListener('input', filterDoctorsOnChange);
  if (filterTime) filterTime.addEventListener('change', filterDoctorsOnChange);
  if (filterSpecialty) filterSpecialty.addEventListener('change', filterDoctorsOnChange);
});

// Fetch all doctors and display them as cards
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error('Failed to load doctors:', error);
  }
}

// Filter doctors based on name, available time, and specialty
async function filterDoctorsOnChange() {
  const name = document.getElementById('searchBar')?.value.trim() || null;
  const time = document.getElementById('filterTime')?.value || null;
  const specialty = document.getElementById('filterSpecialty')?.value || null;

  try {
    const response = await filterDoctors(
      name?.length > 0 ? name : null,
      time?.length > 0 ? time : null,
      specialty?.length > 0 ? specialty : null
    );
    const doctors = response.doctors;
    if (doctors && doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      const contentDiv = document.getElementById('content');
      if (contentDiv) contentDiv.innerHTML = '<p>No doctors found with the given filters.</p>';
    }
  } catch (error) {
    console.error('Filter error:', error);
    alert('❌ An error occurred while filtering doctors.');
  }
}

// Render a list of doctor cards into the content div
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;
  contentDiv.innerHTML = '';
  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Collect form data and add a new doctor
window.adminAddDoctor = async function () {
  const name = document.getElementById('doctorName')?.value;
  const email = document.getElementById('doctorEmail')?.value;
  const phone = document.getElementById('doctorPhone')?.value;
  const password = document.getElementById('doctorPassword')?.value;
  const specialty = document.getElementById('specialization')?.value;
  const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
  const availableTimes = Array.from(availabilityCheckboxes).map(cb => cb.value);

  const token = localStorage.getItem('token');
  if (!token) {
    alert('No authentication token found. Please log in again.');
    return;
  }

  const doctor = { name, email, phone, password, specialty, availableTimes };

  const { success, message } = await saveDoctor(doctor, token);
  if (success) {
    alert('✅ Doctor added successfully.');
    document.getElementById('modal').style.display = 'none';
    window.location.reload();
  } else {
    alert('❌ Failed to add doctor: ' + message);
  }
};
