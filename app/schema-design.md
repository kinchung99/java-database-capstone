# Database Schema Design Document

This document outlines the database design for the Clinic Management System, utilizing a hybrid persistence model:
* **MySQL** handles structured, transactional, and relational data (e.g., users, core schedules, operational entities).
* **MongoDB** manages semi-structured, highly variable, or dynamic documents (e.g., prescriptions, medical notes, metadata).

---

## MySQL Database Design

### Table: admin
* **id**: `INT`, Primary Key, AUTO_INCREMENT
* **username**: `VARCHAR(50)`, NOT NULL, UNIQUE
* **password_hash**: `VARCHAR(255)`, NOT NULL
* **email**: `VARCHAR(100)`, NOT NULL, UNIQUE
* **created_at**: `DATETIME`, DEFAULT `CURRENT_TIMESTAMP`

---

### Table: patients
* **id**: `INT`, Primary Key, AUTO_INCREMENT
* **first_name**: `VARCHAR(50)`, NOT NULL
* **last_name**: `VARCHAR(50)`, NOT NULL
* **email**: `VARCHAR(100)`, NOT NULL, UNIQUE
* **password_hash**: `VARCHAR(255)`, NOT NULL
* **phone**: `VARCHAR(20)`, NOT NULL
* **date_of_birth**: `DATE`, NOT NULL
* **gender**: `VARCHAR(10)`, NOT NULL
* **created_at**: `DATETIME`, DEFAULT `CURRENT_TIMESTAMP`

---

### Table: doctors
* **id**: `INT`, Primary Key, AUTO_INCREMENT
* **first_name**: `VARCHAR(50)`, NOT NULL
* **last_name**: `VARCHAR(50)`, NOT NULL
* **email**: `VARCHAR(100)`, NOT NULL, UNIQUE
* **password_hash**: `VARCHAR(255)`, NOT NULL
* **specialization**: `VARCHAR(100)`, NOT NULL
* **phone**: `VARCHAR(20)`, NOT NULL
* **is_active**: `BOOLEAN`, DEFAULT `TRUE`
* **created_at**: `DATETIME`, DEFAULT `CURRENT_TIMESTAMP`

---

### Table: doctor_schedules
* **id**: `INT`, Primary Key, AUTO_INCREMENT
* **doctor_id**: `INT`, Foreign Key → `doctors(id)` ON DELETE CASCADE
* **day_of_week**: `TINYINT`, NOT NULL (1 = Monday, ..., 7 = Sunday)
* **start_time**: `TIME`, NOT NULL
* **end_time**: `TIME`, NOT NULL
* **is_available**: `BOOLEAN`, DEFAULT `TRUE`

---

### Table: appointments
* **id**: `INT`, Primary Key, AUTO_INCREMENT
* **doctor_id**: `INT`, Foreign Key → `doctors(id)` ON DELETE RESTRICT
* **patient_id**: `INT`, Foreign Key → `patients(id)` ON DELETE RESTRICT
* **appointment_time**: `DATETIME`, NOT NULL
* **status**: `TINYINT`, DEFAULT 0 (0 = Scheduled, 1 = Completed, 2 = Cancelled)
* **created_at**: `DATETIME`, DEFAULT `CURRENT_TIMESTAMP`
* **CONSTRAINT**: `UNIQUE(doctor_id, appointment_time)` *(Prevents overlapping/double bookings for a doctor at the same time slot)*

---

### Key MySQL Design Considerations & Justifications

1. **Foreign Key Deletion Strategy (`ON DELETE RESTRICT`)**:
   * Patient and Doctor records use `RESTRICT` on the `appointments` table. Deleting a patient or doctor with active or past appointment history is blocked to prevent orphaned medical/billing records and maintain regulatory auditing integrity.
   * If a doctor leaves or a patient deactivates their account, we perform a soft delete (`is_active = FALSE` or status flags) rather than dropping the row from MySQL.

2. **Concurrency and Overlapping Appointments**:
   * A unique composite constraint `UNIQUE(doctor_id, appointment_time)` prevents double-booking a doctor at the database level, reinforcing application-level validations.

3. **Separate Doctor Schedule Table**:
   * Working hours and availability are decoupled into a dedicated `doctor_schedules` table to allow granular control over recurring available time slots without cluttering the core `doctors` entity.

---

## MongoDB Collection Design

### Collection: prescriptions

MongoDB stores detailed patient prescriptions created at the end of an appointment. Because medical details (medication lists, variable dosages, pharmacy details, dynamic attachments, and doctor notes) vary significantly, NoSQL document storage provides the required flexibility.

#### JSON Document Schema Example:

```json
{
  "_id": "64abc1234567890abcdef123",
  "appointmentId": 51,
  "patientId": 102,
  "doctorId": 12,
  "issuedAt": "2026-04-29T14:30:00Z",
  "diagnosis": "Acute Upper Respiratory Infection",
  "doctorNotes": "Patient reported mild fever and throat irritation for 3 days. Prescribed rest and standard medication round.",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Three times daily",
      "duration": "7 days",
      "refills": 0,
      "instructions": "Take after meals with water."
    },
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Every 6 hours as needed",
      "duration": "5 days",
      "refills": 1,
      "instructions": "Do not exceed 4000mg in 24 hours."
    }
  ],
  "pharmacy": {
    "name": "CVS Pharmacy #4821",
    "address": "123 Health Ave, San Francisco, CA",
    "phone": "555-0199"
  },
  "tags": ["antibiotic", "respiratory", "follow-up-required"],
  "attachments": [
    {
      "fileName": "lab_results_throat_swab.pdf",
      "fileUrl": "[https://storage.clinic.com/docs/lab_results_throat_swab_51.pdf](https://storage.clinic.com/docs/lab_results_throat_swab_51.pdf)",
      "uploadedAt": "2026-04-29T14:15:00Z"
    }
  ]
}