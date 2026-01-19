## 1. Project Objectives

The primary objective of PhysioFind is to develop a centralized, marketplace that connects patients in Ontario with allied health professionals by solving the fragmentation of discovery and booking.

Specifically, the project aims to:

- **Develop a Multi-Variable Matching Engine:** Build a search procccess that allows users to input a set of preferences—including medical needs and logistical constraints (location, specific time slots, price range, insurance coverage)—to identify the optimal provider match.
- **Streamline the "Search-to-Booking" Workflow:** Eliminate the friction of phone tag by integrating directly with provider schedules, allowing users to filter results by real-time availability and secure an appointment instantly within the platform.
- **Optimize for "Best Fit" over "Nearest Option":** Move beyond simple proximity-based results by ranking providers based on a weighted score of user preferences, ensuring the patient finds a specialist who meets their specific combination of clinical requirements and personal convenience.

## 2. Key Users

We have identified three distinct user groups who will interact with the system:

- **The "constrained" Patient (Primary):** An individual seeking care who has specific, non-negotiable limitations. This could be a student with a limited budget, a professional who can only do evening appointments, or a patient with a specific insurer. Their goal is to find a provider who satisfies _all_ their criteria simultaneously.
- **The Independent Practitioner (Secondary):** A physiotherapist, chiropractor, or RMT running a private practice. Their goal is to acquire high-quality leads that actually fit their practice model (e.g., patients who fit their specific expertise or availability gaps) without manual administrative effort.
- **The Clinic Manager (Tertiary):** The administrative staff responsible for optimizing the clinic’s calendar. They use the system to publish availability, manage intake forms, and ensure that incoming bookings align with the clinic’s operational hours and insurance capabilities.

## 3. Scenarios

**Scenario 1: The Complex Requirement (Patient Flow)**

> _User: "Sarah," a busy graphic designer with wrist pain._
>
> Sarah needs to see a specialist for her repetitive strain injury (RSI), but she has strict constraints: she acts as a caregiver during the day, so she can only attend appointments after 6:00 PM, and she needs a clinic that directly bills Sun Life. She logs into PhysioFind and inputs her medical need ("Wrist/Hand Pain") along with her logistical filters ("After 6 PM," "Direct Billing: Sun Life," "Within 10km"). The system ranks providers by how well they match this specific combination. She finds a clinic that fits all three criteria and books a 6:30 PM slot for the next day.

**Scenario 2: Optimizing the Schedule (Provider Flow)**

> _User: "Dr. Chen," a Physiotherapist._
>
> Dr. Chen has a gap in his schedule on Thursday afternoon and wants to fill it. He ensures his profile on PhysioFind is up to date, highlighting his specialization in "Sports Rehabilitation" and verifying his clinic's insurance partners. When a local user searches for a sports physio with Thursday availability, the algorithm prioritizes Dr. Chen's profile because he is a 100% match for the user's logistical and medical query. The user books the slot, and Dr. Chen receives a notification that a new patient matching his target demographic has been secured.

## 4. Principles

We will adhere to the following software engineering principles to ensure that PhysioFind is a robust, secure, and effective application:

- **Security & Privacy:**
  - Because we are handling sensitive medical data, we will not compromise on security. We will implement strict encryption for data storage and ensure that patient information is isolated from public access. By treating privacy as a core requirement rather than an afterthought, we ensure compliance with health regulations and protect our users' trust.

- **Modularity & Separation of Concerns:**
  - We will design the software so that distinct features—like the search engine, the user profile, and the booking system—are kept separate. This separation ensures that if we need to update or fix one part of the system, it does not negatively impact other unrelated areas. This approach reduces the complexity of the code and allows different team members to work on different modules simultaneously without conflict.

- **Usability:**
  - We aim to make the application intuitive and user-friendly, requiring no training to use. Since our users may be dealing with pain or stress, we will ensure the interface is simple, with clear navigation and helpful feedback during the booking process. This focus on usability ensures that users can achieve their goal of finding a doctor quickly and without frustration.

- **Testing & Quality Assurance:**
  - We will implement a consistent testing strategy to ensure the software works as expected before any code is released. We will focus on testing the critical paths, such as the symptom matching logic and the appointment booking flow, to catch errors early. This discipline ensures that we deliver a stable product and minimizes the risk of bugs affecting the user experience.

- **Clean Code & Simplicity:**
  - We will write code that is easy to read, simple to understand, and consistent across the team. We will use standard Git commit messages and conduct regular code reviews to ensure that everyone is following the same standards. This collaboration ensures that the project remains maintainable and that any team member can easily pick up and work on any part of the codebase.

- **Accessibility:**
  - We will consider the accessibility needs of our users, particularly those with physical injuries who may have difficulty using a mouse. We will ensure the site is navigable via keyboard and uses clear visual contrast. This adherence to accessibility standards ensures that our platform is inclusive and usable by the specific demographic we are trying to help.
