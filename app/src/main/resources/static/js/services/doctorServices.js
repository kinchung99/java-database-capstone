// doctorServices.js
import { API_BASE_URL } from '../config/config.js';

const DOCTOR_API = `${API_BASE_URL}/doctor`;

// Fetch list of all doctors
export async function getDoctors() {
  try {
    const response = await fetch(`${DOCTOR_API}`);
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

// Delete a doctor by ID with admin token
export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || 'Something went wrong'
    };
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

// Save (create) a new doctor with admin token
export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor)
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || 'Something went wrong'
    };
  } catch (error) {
    console.error('Error saving doctor:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

// Filter doctors by name, time, and specialty
export async function filterDoctors(name, time, specialty) {
  try {
    const response = await fetch(`${DOCTOR_API}/filter/${name}/${time}/${specialty}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to filter doctors:', response.statusText);
      return { doctors: [] };
    }
  } catch (error) {
    console.error('Error filtering doctors:', error);
    alert('❌ Something went wrong while filtering doctors.');
    return { doctors: [] };
  }
}
