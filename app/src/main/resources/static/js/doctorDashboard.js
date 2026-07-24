// doctorDashboard.js
import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const tableBody = document.getElementById('patientTableBody');
let selectedDate = new Date().toISOString().split('T')[0]; // today YYYY-MM-DD
const token = localStorage.getItem('token');
let patientName = null;

// Search bar: filter by patient name
document.getElementById('searchBar')?.addEventListener('input', (e) => {
  const val = e.target.value.trim();
  patientName = val.length > 0 ? val : 'null';
  loadAppointments();
});

// Today button: reset to today's date
document.getElementById('todayButton')?.addEventListener('click', () => {
  selectedDate = new Date().toISOString().split('T')[0];
  const datePicker = document.getElementById('datePicker');
  if (datePicker) datePicker.value = selectedDate;
  loadAppointments();
});

// Date picker: update selected date
document.getElementById('datePicker')?.addEventListener('change', (e) => {
  selectedDate = e.target.value;
  loadAppointments();
});

// Fetch and display appointments
async function loadAppointments() {
  try {
    const appointments = await getAllAppointments(selectedDate, patientName || 'null', token);
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `<tr><td class="noPatientRecord" colspan="5">No Appointments found for today.</td></tr>`;
      return;
    }

    appointments.forEach(appointment => {
      const patient = {
        id: appointment.patientId,
        name: appointment.patientName,
        phone: appointment.patientPhone,
        email: appointment.patientEmail
      };
      const row = createPatientRow(patient, appointment.id, appointment.doctorId);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading appointments:', error);
    if (tableBody) {
      tableBody.innerHTML = `<tr><td class="noPatientRecord" colspan="5">Error loading appointments. Try again later.</td></tr>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAppointments();
});
