PharmaCompare: Medicine Price Comparison Platform
PharmaCompare is a web application designed to help users compare the prices of medicines across different pharmacies. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), it provides an easy-to-use platform where users can search for medicines, compare prices, and save their favorite medicines.

Key Features

Frontend (React)
	1.	Home Page:
	•	Search bar to look for medicines.
	•	Displays a list of popular medicines.
	2.	Search Results Page:
	•	Shows medicines based on the search query with prices from different pharmacies.
	•	Option to sort medicines by price.
	3.	Medicine Details Page:
	•	Displays detailed information about each medicine.
	•	Shows pharmacies that stock the medicine, including prices.
	•	Allows users to add or remove medicines from their favorites (for logged-in users).
	4.	User Authentication:
	•	Users can sign up, log in, and view their profile.
	•	Users can manage their favorite medicines.

Backend (Node.js + Express)
	1.	Medicine API:
	•	GET /medicines?name=xyz: Fetches a list of medicines based on the search query.
	•	GET /medicines/:id: Provides detailed information about a specific medicine.
	2.	Pharmacy API:
	•	GET /pharmacies?medicineId=xyz: Lists pharmacies that offer a specific medicine and their prices.
	3.	User API:
	•	POST /signup: Registers a new user.
	•	POST /login: Authenticates the user and returns a JWT.
	•	GET /favorites: Retrieves the user’s favorite medicines (protected route).
	•	POST /favorites: Allows a logged-in user to add a medicine to their favorites.
	•	DELETE /favorites/:id: Removes a medicine from the user’s favorites.

Database (MongoDB)
	1.	Users Collection:
	•	Stores user details (username, email) and their favorite medicines.
	2.	Medicines Collection:
	•	Stores medicine details (name, description, price, etc.).
	3.	Pharmacies Collection:
	•	Stores pharmacy details along with associated medicines and their prices.

Installation Guide

Prerequisites
	•	Node.js
	•	MongoDB
	•	npm (or yarn) 
Backend Setup
1.	Clone the repository: 
 git clone https://github.com/sonipratham001/PharmaCompare
 cd PharmaCompareBackend
2.	Install the required dependencies:
  npm install
3.	Create a .env file in the PharmaCompareBackend directory and add the following variables:
  MONGO_URI=your_mongo_db_uri
  JWT_SECRET=your_jwt_secret
4.	Run the backend:
   npm run dev
Frontend Setup
 1.	Navigate to the frontend directory:
    cd pharma-compare-frontend
 2.	Install the required dependencies:
    npm install
 3.	Start the frontend:
    npm run dev
API Endpoints

Medicine Routes
	•	GET /medicines?name=xyz: Fetches medicines based on the search query.
	•	GET /medicines/:id: Fetches details of a specific medicine.

Pharmacy Routes
	•	GET /pharmacies?medicineId=xyz: Fetches pharmacies offering a specific medicine along with prices.

User Routes
	•	POST /signup: Registers a new user.
	•	POST /login: Authenticates the user and returns a JWT token.
	•	GET /favorites: Retrieves the user’s favorite medicines.
	•	POST /favorites: Adds a medicine to the user’s favorites.
	•	DELETE /favorites/:id: Removes a medicine from the user’s favorites.
Screenshots
 Home Page<img width="1393" alt="Screenshot 2024-12-31 at 3 33 22 PM" src="https://github.com/user-attachments/assets/87184d52-9e75-4254-8298-d9e59c617346" />
 Dashboard<img width="1393" alt="Screenshot 2024-12-31 at 3 33 35 PM" src="https://github.com/user-attachments/assets/7cb497cc-bc4a-4828-829f-5c674615fb82" />
 Search Results<img width="1393" alt="Screenshot 2024-12-31 at 3 33 49 PM" src="https://github.com/user-attachments/assets/b77313dc-6e87-4e36-9208-dbc82d518935" />
 Medicine Details<img width="1393" alt="Screenshot 2024-12-31 at 3 33 56 PM" src="https://github.com/user-attachments/assets/86002708-f723-4238-917f-69f09b64632c" />
 Profile Page<img width="1393" alt="Screenshot 2024-12-31 at 3 36 47 PM" src="https://github.com/user-attachments/assets/3c4a75d2-81a9-4674-9f31-13e0be6d5ddf" />

 Additional Features
	•	Responsive Design: The application is fully responsive, ensuring a seamless experience across devices (desktop, tablet, mobile).
	•	Error Handling: Friendly error messages for invalid actions, such as logging in with an invalid token.
