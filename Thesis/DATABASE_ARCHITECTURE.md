# 🗄️ Database Architecture Explained

## 🎯 Current State: NO DATABASE YET!

Your application is currently **100% frontend-only**. Here's what's happening:

---

## 📊 Current Data Sources

### 1. **RAWG API (External)** 🌐
**What it provides:**
- All game data (titles, images, descriptions, ratings, etc.)
- Game details, screenshots, genres, platforms
- Search results

**Where it is:**
- External service at `https://api.rawg.io/api`
- You're using API key: `9bb25de7001443d096ea366e1e990de1`
- **You don't control this data** - it's read-only from RAWG

**Code location:**
```
Thesis/src/services/api.js
```

---

### 2. **Browser localStorage (Temporary)** 💾
**What it stores:**
- User authentication data (mock)
- Shopping cart items
- User's game library (purchased games)

**Where it is:**
- **In your browser only!**
- Path: Browser → DevTools → Application → Local Storage
- **NOT a real database** - clears if you clear browser data

**What's stored:**
```json
// game-auth-storage
{
  "state": {
    "user": { "userId": 1, "username": "john", "email": "john@example.com" },
    "isAuthenticated": true,
    "library": [/* games you "purchased" */]
  }
}

// game-cart-storage
{
  "state": {
    "cartItems": [/* games in cart */]
  }
}
```

**Code location:**
```
Thesis/src/store/useAuthStore.js
Thesis/src/store/useCartStore.js
```

---

## 🔍 How to View Your Current "Data"

### Option 1: Browser DevTools (See localStorage)
1. Open your app in browser (http://localhost:5174)
2. Press `F12` to open DevTools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Local Storage** → `http://localhost:5174`
5. You'll see:
   - `game-auth-storage` - User data
   - `game-cart-storage` - Cart data

### Option 2: Browser Console
Open DevTools Console (`F12` → Console) and type:
```javascript
// View all localStorage
console.log(localStorage);

// View user data
console.log(localStorage.getItem('game-auth-storage'));

// View cart data
console.log(localStorage.getItem('game-cart-storage'));

// Clear all data
localStorage.clear();
```

---

## ⚠️ Current Limitations

### What's NOT Working (Because No Backend)
❌ No real user authentication - anyone can "login"
❌ No real user accounts - data clears when browser clears
❌ No persistent storage - close browser = lose data (unless cached)
❌ No admin panel - nowhere to manage users/orders
❌ No payment processing - it's simulated
❌ No real prices - all games are $59.99
❌ No order history - clears with browser
❌ Can't share library across devices - it's local only
❌ Can't have multiple users - localStorage is per-browser

---

## 🎯 What You NEED: Real Backend + Database

### Architecture You Should Build

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   FRONTEND  │ ◄────► │   BACKEND   │ ◄────► │  DATABASE   │
│  (React)    │  HTTP  │ (Spring     │  JDBC  │  (MySQL/    │
│             │  APIs  │  Boot)      │        │   MongoDB)  │
└─────────────┘         └─────────────┘         └─────────────┘
       │                                               │
       │                                               │
       └──────────► RAWG API (Game Data)              │
                                                       │
                                    ┌──────────────────┴──────────────────┐
                                    │                                     │
                                    │  Tables:                            │
                                    │  - users                            │
                                    │  - games                            │
                                    │  - game_library                     │
                                    │  - shopping_cart                    │
                                    │  - orders                           │
                                    │  - reviews                          │
                                    └─────────────────────────────────────┘
```

---

## 🏗️ Next Steps: Building the Backend

### Phase 1: Set Up Database

#### Option A: MySQL (Recommended for your UML diagram)
```sql
-- Install MySQL
-- Download from: https://dev.mysql.com/downloads/mysql/

-- Create database
CREATE DATABASE gamelibrary;

-- Create tables (based on your UML diagram)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    game_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    release_date DATE,
    genre VARCHAR(100),
    platform VARCHAR(100),
    rating DECIMAL(3,2)
);

CREATE TABLE game_library (
    library_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    permissions JSON,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### Option B: MongoDB (NoSQL - More flexible)
```javascript
// Collections structure
users: {
    _id: ObjectId,
    username: String,
    email: String,
    passwordHash: String,
    role: String,
    createdAt: Date
}

games: {
    _id: Number (RAWG game_id),
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    releaseDate: Date,
    genres: [String],
    platforms: [String],
    rating: Number
}

gameLibrary: {
    _id: ObjectId,
    userId: ObjectId,
    gameId: Number,
    purchasedAt: Date
}

// ... similar for other collections
```

---

### Phase 2: Create Spring Boot Backend

#### Project Structure
```
backend/
├── src/main/java/com/gamelibrary/
│   ├── controller/
│   │   ├── UserController.java
│   │   ├── GameController.java
│   │   ├── CartController.java
│   │   └── LibraryController.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Game.java
│   │   ├── GameLibrary.java
│   │   └── ShoppingCart.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── GameRepository.java
│   │   └── ...
│   ├── service/
│   │   ├── UserService.java
│   │   ├── GameService.java
│   │   └── ...
│   └── GameLibraryApplication.java
├── application.properties
└── pom.xml
```

#### Key Files

**application.properties**
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gamelibrary
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Google OAuth
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_SECRET

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000
```

**Example User Model**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    private String role;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Getters and setters
}
```

---

### Phase 3: Connect Frontend to Backend

Update your frontend to use real API calls:

**Current (Mock):**
```javascript
// Thesis/src/store/useAuthStore.js
login: (userData) => {
  set({ user: userData, isAuthenticated: true });
}
```

**Future (Real API):**
```javascript
login: async (email, password) => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email, password
    });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true });
  } catch (error) {
    // Handle error
  }
}
```

---

## 🔑 Admin Access - How to Build It

### 1. **Create Admin User in Database**
```sql
-- Create admin user
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@gamelibrary.com', 'hashed_password', 'admin');

-- Add to admin_users table
INSERT INTO admin_users (user_id, permissions) 
VALUES (1, '{"manageUsers": true, "manageGames": true, "viewOrders": true}');
```

### 2. **Create Admin Dashboard (Frontend)**
```
Thesis/src/pages/admin/
├── AdminDashboard.jsx
├── UserManagement.jsx
├── GameManagement.jsx
├── OrderManagement.jsx
└── Analytics.jsx
```

### 3. **Protected Admin Routes**
```javascript
// Check if user is admin
const isAdmin = user?.role === 'admin';

// Protect routes
<Route 
  path="/admin" 
  element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
/>
```

### 4. **Admin API Endpoints (Backend)**
```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
    
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }
}
```

---

## 📊 Database Access Tools

### For MySQL:
1. **MySQL Workbench** (GUI)
   - Download: https://dev.mysql.com/downloads/workbench/
   - Visual interface to view/edit tables
   - Can run SQL queries directly

2. **phpMyAdmin** (Web-based)
   - Install with XAMPP
   - Access via browser: http://localhost/phpmyadmin

3. **DBeaver** (Universal)
   - Works with MySQL, MongoDB, PostgreSQL
   - Download: https://dbeaver.io/

### For MongoDB:
1. **MongoDB Compass** (GUI)
   - Download: https://www.mongodb.com/products/compass
   - Visual interface for MongoDB

2. **Mongo Shell** (CLI)
   ```bash
   mongosh
   use gamelibrary
   db.users.find()
   ```

---

## 🎯 Quick Start Guide

### To Set Up Your Database NOW:

1. **Install MySQL**
   ```bash
   # Download from: https://dev.mysql.com/downloads/mysql/
   # Or use XAMPP (includes MySQL + phpMyAdmin)
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE gamelibrary;
   ```

3. **Create First Table**
   ```sql
   USE gamelibrary;
   CREATE TABLE users (
       user_id INT PRIMARY KEY AUTO_INCREMENT,
       username VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       role VARCHAR(50) DEFAULT 'user'
   );
   ```

4. **Insert Admin User**
   ```sql
   INSERT INTO users (username, email, password_hash, role) 
   VALUES ('admin', 'admin@example.com', 'temp_password', 'admin');
   ```

5. **View Data**
   ```sql
   SELECT * FROM users;
   ```

---

## 📚 Summary

### Current State:
✅ Frontend working (React app)
✅ RAWG API providing game data
✅ localStorage storing temporary data
❌ **NO REAL DATABASE**
❌ **NO BACKEND**
❌ **NO ADMIN PANEL**

### What You Need to Build:
1. **Database** (MySQL or MongoDB)
2. **Backend** (Java Spring Boot)
3. **REST APIs** (for frontend to communicate with backend)
4. **Authentication** (Google OAuth + JWT)
5. **Admin Dashboard** (frontend + backend endpoints)

### Current "Database":
📍 **Location:** Your browser's localStorage
🔍 **View it:** F12 → Application → Local Storage
⚠️ **Warning:** Clears when you clear browser cache!

---

Need help setting up the real database and backend? Let me know and I'll guide you through it! 🚀

