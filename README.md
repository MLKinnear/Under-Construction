# UnderConstruction

A full-stack web application built with React, Express, and MongoDB for managing your client information, work orders, and worker tasks. It features user authentication, protected routes, and a modern UI styled with Tailwind CSS. This functional work order and task system helps your startup company stay organized. A built-in notes feature lets managers organize and communicate directly with workers via their dashboards.

https://underconstruction-client.onrender.com

## 🚀 Features

- **User authentication** with JWT (register, login, logout)
- **Protected routes** on the server (Express middleware) and client (React Router)
- **Role-based access control** (Admin, User)
- **Responsive UI** built with React, Vite, and Tailwind CSS
- **RESTful API** powered by Express.js and Mongoose
- **Unit testing** with Jest, Supertest, React Testing Library

## 🛠️ Tech Stack

- **Front-end:** React, Vite, Tailwind CSS  
- **Back-end:** Node.js, Express, MongoDB, Mongoose  
- **Testing:** Jest, Supertest, React Testing Library  

## 🎯 Getting Started Locally

1. **Clone & install**  
   ```bash
   git clone https://github.com/<you>/UnderConstruction.git
   cd UnderConstruction
   ```

2. **Server**  
   ```bash
   cd server
   npm install
   cp .env.example .env   # set MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, PRODUCT_KEY, PORT
   npm run dev            # or \`npm start\`
   ```

3. **Client**  
   ```bash
   cd client
   npm install
   cp .env.example .env   # VITE_API_URL
   npm run dev
   ```

4. **Run Tests**  
   ```bash
   # In /server
   npm test

   # In /client
   npm test
   ```

## 📦 Deployment

Click here to navigate to UnderConstruction

https://underconstruction-client.onrender.com


## How to Use the Application

### Manager Registration & Product Key

- Register as a **Manager** with name, email, password, and your unique **Product Key** (provided by app developer).
- Only one manager account is active at a time (future updates will support multiple managers).
- Your **Manager Key** is shown on your **Profile** page and can be rotated to maintain security.

### Worker Registration

- From the registration dropdown, select **Worker**.
- Enter name, email, password, and the Manager’s Key to register.

### Dashboard

- Add, edit, and delete **Notes** to organize tasks.
- **Pin** important notes (pushpin icon) and mark them **visible to workers** (person icon).
- Workers only see visible notes on their dashboards. They cannot modify or remove them.

### Clients (Manager Only)

- View a searchable list of all clients by name, phone, or address.
- Toggle between **grid** and **list** views.
- Click **Add Client** to open the client form (all fields required; use "NA" if needed).
- Clients cannot be deleted; records are permanent but can be edited.
- Click a client card to view **Client Details** (edit info or start a new work order).

### Work Orders

1. On the **Client Details** page, review existing work orders or click **Create Work Order**.
2. Confirm client info or add alternative contact details.
3. Set start date/time, promised completion date/time, notes, and status (can be edited later).
4. Create the work order, then add **Tasks**:
   - Provide a description (recommended: estimate hours, detailed notes).
   - Assign a single worker (future updates will allow multiple assignees).
5. Workers can only update assigned task **status** and **notes**.

> **Warning:** Leaving the page before clicking **Create Work Order** will discard all progress.

### Work Orders List

- Access via the **Work Orders** nav bar.
- Filter by status or search by client name, order number, or assigned worker.
- Toggle between grid and list views.
- Click any work order card to view and edit details or tasks.
- Change work order status among **OPEN**, **ON HOLD**, **IN PROGRESS**, **IN REVIEW**, **COMPLETED**.

### Profile & Logout

- **Logout** triggers a confirmation and sessions expire after 8 hours.
- **Profile** page: view and edit name, email, and password.

### Responsive Design

- Fully responsive layouts; nav buttons become icons on smaller screens.

---
## Learning Moments & Obstacles

### Key Takeaways

- **Scope management:** As this was my largest project, I learned to balance feature ambition with delivery timelines.
- **Testing complexity:** Writing unit tests for routes, controllers, and authentication underscored the need to isolate logic for maintainable, reliable tests.

### Memorable Obstacle: Password Encryption

While implementing user updates, I encountered a bug where updating a password resulted in double encryption. I inspected middleware runs and realized that a second bcrypt hash occurred on updates—once during schema `pre('save')` and again in my update logic. Removing the redundant hash step fixed authentication and reinforced careful handling of encryption hooks.

---

## 📝 License

This project is licensed under the MIT License. Feel free to use and modify. Enjoy!
