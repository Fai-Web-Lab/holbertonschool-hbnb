# HBnB Evolution - API Testing Report

## 1. Overview
This report documents the testing and validation phase for the HBnB API (Part 2). The objective was to ensure that all CRUD operations for Users, Places, Amenities, and Reviews work correctly and that the business logic layer enforces all defined validation rules.

## 2. Environment & Tools
- **Environment:** Local Development
- **Framework:** Flask-RESTx
- **Testing Tools:** cURL, Swagger UI, Python `unittest`
- **Execution Command:** `python3 -m unittest discover -s tests`

---

## 3. Swagger Documentation Verification
-------------------------------------

Swagger UI was accessed and verified at: `http://127.0.0.1:5000/api/v1/`



**Verification Results:**
- **Endpoint Accuracy:** All developed endpoints for Users, Places, Reviews, and Amenities are documented correctly.
- **Model Integrity:** API models appear with the correct fields and data types.
- **Validation Mapping:** Required vs. optional fields accurately match the implemented validation logic.
- **Developer Experience:** Example inputs and expected outputs are clearly displayed.
- **Manual Success:** Manual "Try it out" tests through Swagger were successful across all namespaces.

---

## 4. Automated Unit Tests
-----------------------

Automated tests were executed to ensure regression safety using the following command:
```bash
python3 -m unittest discover -s tests
