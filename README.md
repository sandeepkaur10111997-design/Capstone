
# 🛒 Smart Grocery Planner

**Plan Smart. Eat Smart. Save Smart.**  
Smart Grocery Planner is a full-stack application that helps you **manage groceries, track budgets, and plan meals** — all in one place.  
It’s designed to make grocery shopping more organized, budget-friendly, and efficient.

---

## ✨ Features

- **Grocery Management** – Add, view, and track grocery items with quantity, price, category, and expiry date.
- **Budget Tracking** – Set a monthly budget and monitor spending in real time.
- **Meal Planning** – Plan meals based on available groceries to reduce waste.
- **Responsive UI** – Mobile-friendly interface for managing groceries on the go.
- **Data Persistence** – MongoDB backend for storing all your grocery, budget, and meal plan data.

---

## 🛠 Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript
- Responsive design with mobile-friendly tables
- Dynamic DOM manipulation for real-time updates

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- REST API for CRUD operations
- dotenv for environment variable management
- CORS for cross-origin requests

---

## 📂 Folder Structure

├── backend/<br>
│ ├── server.js # Main server file<br>
│ ├── GroceryItem.js # Grocery Mongoose model<br>
│ ├── Budget.js # Budget Mongoose model<br>
│ ├── mealplan.js # Meal Plan Mongoose model<br>
│ ├── budgetroutes.js # Routes for budget endpoints<br>
│ ├── mealroutes.js # Routes for meal endpoints<br>
│ ├── package.json<br>
| ├── package-lock.json<br>
|<br>
├── frontend/<br>
│ ├── index.html # Landing page<br>
│ ├── grocery.html # Grocery management page<br>
│ ├── budget.html # Budget tracking page<br>
│ ├── mealplanner.html # Meal planning page<br>
│ ├── grocery.js # Grocery page script<br>
│ ├── script.js # General scripts<br>
│ ├── style.css # Main styles<br>
│ └── assets/ # Images and media<br>
│<br>
└── README.md<br>


---

## ⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/yourusername/smart-grocery-planner.git
cd smart-grocery-planner


2️⃣Install Dependencies

npm install

3️⃣ Environment Variables
Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string
PORT=5000

4️⃣ Run the Server

npm start

Server runs at: http://localhost:5000

5️⃣ Access the Frontend
Open frontend/index.html in your browser, or serve it using a static hosting service.

🔌 API Endpoints
Grocery Routes
Method      |   Endpoint	     |   Description
GET	          /api/groceries	  Fetch all groceries
POST	        /api/groceries	  Add a new grocery item

Budget Routes
Method	    |   Endpoint	     |   Description
GET	          /api/budget	       Get budget info
POST	        /api/budget	       Set/update budget

Meal Plan Routes
Method	    |   Endpoint	     |   Description
GET	          /api/meals	       Fetch all meal plans
POST	        /api/meals	       Add a new meal plan


📸 Screenshots
<img width="1905" height="943" alt="Screenshot 2025-08-12 192415" src="https://github.com/user-attachments/assets/744d58c3-11ad-4886-8bbd-eeac9780cf0f" />

<img width="1902" height="946" alt="Screenshot 2025-08-12 192438" src="https://github.com/user-attachments/assets/4e000eae-8e3e-446e-8788-c67b65308c39" />


🚀 Future Improvements
Authentication & user accounts
Automatic expiry alerts
Shopping list generator
AI-powered meal recommendations

📜 License
This project is licensed under the MIT License.

