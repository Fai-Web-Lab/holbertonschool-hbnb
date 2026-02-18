# HBnB

## Table of Contents
- [Overview](#overview)
- [Project Stages](#project-stages)
- [Authors](#authors)

## Overview
        HBnB Evolution is a simplified AirBnB-like backend application focused on system design and architecture. While the initial phase emphasized creating UML-based technical documentation to define core entities and business rules, the project has now evolved into a fully functional modular implementation. 
        The current phase bridges the gap between theoretical design and practical application, ensuring that the software remains maintainable, scalable, and robust.

## Project Stages  
### **1. UML**
- **High-Level Package Diagram:** 

create a high-level package diagram that illustrates the three-layer architecture of the HBnB application and shows how these layers interact using the Facade Pattern.

- **Class Diagram for Business Logic Layer:**

Show the main business entities, the data they contain, and how they relate to each other.

- **Sequence Diagrams:**  

Visualize how core API requests flow through the Presentation, Business Logic, and Persistence layers in the HBnB application. The diagrams clarify component interactions and data flow for key use cases, serving as a blueprint for implementation.

### **2. BL and API**
- **Business Logic Layer:**

Implemented OOP-based models (User, Place, Review, Amenity) inheriting from a unified BaseModel for UUID and timestamp management.

- **Facade Pattern Integration:**

Integrated a Facade Pattern to decouple the API from business logic, ensuring a single entry point for all operations.

- **In-Memory Persistence:**

Deployed an In-Memory Repository to manage data storage and entity relationships without database overhead.

- **RESTful API Development:**

Developed RESTful endpoints via Flask-RESTx, supporting full CRUD operations and complex entity linking.

- **Validation & Data Integrity:**

Applied strict validation rules (e.g., email formats, rating scales) across models and API layers.

## Authors

**Fai AlSharekh** - [GitHub](https://github.com/Fai-Web-Lab)  
**Layla Alshehri** - [GitHub](https://github.com/Laja99)  
**Mohammed Aloufi** - [GitHub](https://github.com/MohammedError)
