// doctorCard.js
import { showBookingOverlay } from '../loggedPatient.js';
import { deleteDoctor } from '../services/doctorServices.js';
import { getPatientData } from '../services/patientServices.js';

export function createDoctorCard(doctor) {
  const card = document.createElement('div');
  card.classList.add('doctor-card');

  const role = localStorage.getItem('userRole');

  // Doctor info section
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('doctor-info');

  const name = document.createElement('h3');
  name.textContent = doctor.name;

  const specialty = document.createElement('p');
  specialty.textContent = `Specialty: ${doctor.specialty}`;

  const email = document.createElement('p');
  email.textContent = `Email: ${doctor.email}`;

  const timesLabel = document.createElement('p');
  timesLabel.textContent = 'Available Times:';

  const timesList = document.createElement('ul');
  (doctor.availableTimes || []).forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    timesList.appendChild(li);
  });

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialty);
  infoDiv.appendChild(email);
  infoDiv.appendChild(timesLabel);
  infoDiv.appendChild(timesList);

  // Action buttons
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('card-actions');

  if (role === 'admin') {
    // Admin: Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Doctor';
    deleteBtn.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      const { success, message } = await deleteDoctor(doctor.id, token);
      if (success) {
        alert('✅ Doctor deleted successfully.');
        card.remove();
      } else {
        alert('❌ Failed to delete doctor: ' + message);
      }
    });
    actionsDiv.appendChild(deleteBtn);

  } else if (role === 'patient') {
    // Non-logged-in patient: prompt to log in
    const bookBtn = document.createElement('button');
    bookBtn.textContent = 'Book Now';
    bookBtn.addEventListener('click', () => {
      alert('Please log in to book an appointment.');
    });
    actionsDiv.appendChild(bookBtn);

  } else if (role === 'loggedPatient') {
    // Logged-in patient: booking flow
    const bookBtn = document.createElement('button');
    bookBtn.textContent = 'Book Now';
    bookBtn.addEventListener('click', async (e) => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please log in again.');
        window.location.href = '/pages/patientDashboard.html';
        return;
      }
      const patient = await getPatientData(token);
      if (!patient) {
        alert('Could not retrieve patient data. Please try again.');
        return;
      }
      showBookingOverlay(e, doctor, patient);
    });
    actionsDiv.appendChild(bookBtn);
  }

  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);
  return card;
}
