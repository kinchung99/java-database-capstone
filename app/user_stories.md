# User Stories

## 1. Admin User Stories

### US-01: Admin Login
**Title:**
*As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely.*

**Acceptance Criteria:**
1. System displays a login form requiring a username and password.
2. Successful authentication redirects the admin to the Admin Dashboard.
3. Failed authentication displays an appropriate error message and prevents access.

**Priority:** High  
**Story Points:** 3  
**Notes:**
- Implement rate-limiting to prevent brute-force login attempts.

---

### US-02: Admin Logout
**Title:**
*As an admin, I want to log out of the portal, so that I can protect system access when not in use.*

**Acceptance Criteria:**
1. A clear "Logout" button is available on all admin pages.
2. Clicking logout terminates the current session and clears session tokens/cookies.
3. The user is redirected to the login page and cannot access protected admin pages using the browser's back button.

**Priority:** Medium  
**Story Points:** 1  
**Notes:**
- Ensure proper cleanup of Spring Security session context.

---

### US-03: Add Doctor Profile
**Title:**
*As an admin, I want to add new doctors to the portal, so that patients can discover and book appointments with them.*

**Acceptance Criteria:**
1. Form allows input of doctor details (Name, Specialization, Contact Info, Schedule).
2. Submitting the form persists the doctor entity in the MySQL database.
3. Newly added doctors immediately appear in the doctor directory.

**Priority:** High  
**Story Points:** 5  
**Notes:**
- Validate email uniqueness and enforce strong passwords for new doctor credentials.

---

### US-04: Delete Doctor Profile
**Title:**
*As an admin, I want to delete a doctor's profile from the portal, so that outdated or inactive doctor records are removed.*

**Acceptance Criteria:**
1. Admin can select a doctor profile and initiate a deletion request.
2. System prompts for confirmation before executing deletion or deactivation.
3. Associated upcoming appointments are flagged or handled appropriately.

**Priority:** Medium  
**Story Points:** 3  
**Notes:**
- Consider soft deletion (`is_active = false`) to maintain historical relational integrity in MySQL.

---

### US-05: Run Monthly Appointment Stored Procedure
**Title:**
*As an admin, I want to run a stored procedure in MySQL CLI, so that I can get the number of appointments per month and track usage statistics.*

**Acceptance Criteria:**
1. Stored procedure exists in the MySQL database to aggregate monthly appointment counts.
2. Executing the procedure in CLI returns aggregated counts grouped by month and year.
3. Query execution completes efficiently without locking active database tables.

**Priority:** Medium  
**Story Points:** 3  
**Notes:**
- Stored procedure logic should filter out canceled appointments if required by reporting rules.

---

## 2. Patient User Stories

### US-06: Guest View Doctor List
**Title:**
*As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering.*

**Acceptance Criteria:**
1. Unauthenticated users can navigate to the public Doctor List page.
2. Doctor names, specializations, and basic profiles are visible.
3. Booking an appointment prompts the user to register or log in.

**Priority:** High  
**Story Points:** 3  
**Notes:**
- Ensure endpoint is exposed through public Spring Security rules.

---

### US-07: Patient Sign Up
**Title:**
*As a patient, I want to sign up using my email and password, so that I can book appointments.*

**Acceptance Criteria:**
1. Registration page accepts email, password, and required patient information.
2. Email format validation and password complexity checks are enforced.
3. Upon successful sign-up, a patient record is created in MySQL and the user can log in.

**Priority:** High  
**Story Points:** 5  
**Notes:**
- Enforce unique constraint on the patient email field.

---

### US-08: Patient Login
**Title:**
*As a patient, I want to log into the portal, so that I can manage my bookings.*

**Acceptance Criteria:**
1. Patient can enter email and password on the login form.
2. Valid credentials authenticate the user and open the Patient Dashboard.
3. Invalid credentials display a user-friendly error message.

**Priority:** High  
**Story Points:** 2  
**Notes:**
- Uses REST API endpoint for patient authentication.

---

### US-09: Patient Logout
**Title:**
*As a patient, I want to log out of the portal, so that I can secure my account.*

**Acceptance Criteria:**
1. Logout button is accessible on the Patient Dashboard.
2. Clicking logout invalidates the user's auth token/session.
3. User is redirected to the home/login page.

**Priority:** Low  
**Story Points:** 1  
**Notes:**
- Standard JWT/session invalidation logic.

---

### US-10: Book 1-Hour Appointment
**Title:**
*As a patient, I want to log in and book an hour-long appointment, so that I can consult with a doctor.*

**Acceptance Criteria:**
1. Authenticated patient can select an available doctor, date, and 1-hour time slot.
2. System verifies time slot availability and prevents double-booking.
3. Appointment entry is successfully saved to the MySQL database.

**Priority:** High  
**Story Points:** 5  
**Notes:**
- Backend must enforce strict concurrency locks when writing appointment slots.

---

### US-11: View Upcoming Appointments
**Title:**
*As a patient, I want to view my upcoming appointments, so that I can prepare accordingly.*

**Acceptance Criteria:**
1. Patient Dashboard lists all scheduled future appointments.
2. Output displays doctor name, specialization, date, time, and location/link.
3. Past or canceled appointments are visually separated or filtered out.

**Priority:** Medium  
**Story Points:** 3  
**Notes:**
- Query should sort upcoming dates chronologically.

---

## 3. Doctor User Stories

### US-12: Doctor Login
**Title:**
*As a doctor, I want to log into the portal, so that I can manage my appointments.*

**Acceptance Criteria:**
1. Doctor inputs credentials on the login screen.
2. System routes successful login to the Doctor Dashboard (Thymeleaf MVC view).
3. Unauthenticated access attempts to doctor views are blocked.

**Priority:** High  
**Story Points:** 2  
**Notes:**
- Integrated with Spring MVC security configuration.

---

### US-13: Doctor Logout
**Title:**
*As a doctor, I want to log out of the portal, so that I can protect my data.*

**Acceptance Criteria:**
1. Logout option is available on the Doctor navigation bar.
2. Executing logout destroys session state.
3. Browser redirection returns to the public home or login screen.

**Priority:** Medium  
**Story Points:** 1  
**Notes:**
- Clean up active session cookies.

---

### US-14: View Appointment Calendar
**Title:**
*As a doctor, I want to view my appointment calendar, so that I can stay organized.*

**Acceptance Criteria:**
1. Calendar view displays daily, weekly, or monthly scheduled appointments.
2. Clicking an appointment shows patient details and time slot info.
3. Calendar updates dynamically as new bookings occur.

**Priority:** High  
**Story Points:** 5  
**Notes:**
- Can integrate FullCalendar UI library rendered via Thymeleaf.

---

### US-15: Mark Unavailability
**Title:**
*As a doctor, I want to mark my unavailability, so that patients are informed only of available slots.*

**Acceptance Criteria:**
1. Doctor can select dates or specific hourly slots and flag them as unavailable.
2. Flagged unavailable times are hidden or disabled on the patient booking screen.
3. Existing appointments on newly marked unavailable times trigger an alert.

**Priority:** High  
**Story Points:** 5  
**Notes:**
- Prevents booking overlaps.

---

### US-16: Update Profile Information
**Title:**
*As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information.*

**Acceptance Criteria:**
1. Profile editing page allows updates to contact details, specialization, and bio.
2. Form submission updates doctor entity attributes in MySQL.
3. Updated information reflects immediately across public doctor listings.

**Priority:** Medium  
**Story Points:** 3  
**Notes:**
- Add server-side validation for phone numbers and professional details.

---

### US-17: View Patient Details
**Title:**
*As a doctor, I want to view the patient details for upcoming appointments, so that I can be prepared.*

**Acceptance Criteria:**
1. Selecting an upcoming appointment displays patient demographic data and past medical record references.
2. Doctor can view associated prescription histories fetched from MongoDB.
3. Non-authorized doctors cannot view patients outside their booked slots.

**Priority:** High  
**Story Points:** 5  
**Notes:**
- Requires cross-referencing MySQL Patient data with MongoDB Prescription documents.

---