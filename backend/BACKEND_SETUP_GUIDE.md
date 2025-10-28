# 🚀 Backend Setup Guide - GameLibrary

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

2. **Maven 3.6 or higher**
   - Download: https://maven.apache.org/download.cgi
   - Verify: `mvn -version`

3. **MySQL 8.0 or higher**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/

4. **IDE (Optional but Recommended)**
   - IntelliJ IDEA: https://www.jetbrains.com/idea/download/
   - Eclipse: https://www.eclipse.org/downloads/
   - VS Code with Java Extension Pack

---

## 🗄️ Step 1: Set Up MySQL Database

### Option A: Using MySQL Command Line

```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE gamelibrary;

# Use the database
USE gamelibrary;

# Run schema
SOURCE C:/Users/YourName/Desktop/Thesis/backend/database/schema.sql;

# (Optional) Run seed data
SOURCE C:/Users/YourName/Desktop/Thesis/backend/database/seed_data.sql;

# Verify tables
SHOW TABLES;

# Exit
EXIT;
```

### Option B: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click **Create New Schema** (database icon)
4. Name it: `gamelibrary`
5. Right-click `gamelibrary` → **Run SQL Script**
6. Select: `backend/database/schema.sql`
7. Execute

### Option C: Using XAMPP

1. Start XAMPP Control Panel
2. Start **Apache** and **MySQL**
3. Open http://localhost/phpmyadmin
4. Click **New** → Database name: `gamelibrary`
5. Click **Import** → Choose `schema.sql`
6. Execute

---

## ⚙️ Step 2: Configure Application Properties

Edit `backend/src/main/resources/application.properties`:

```properties
# Update MySQL password (if you set one)
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Update Google OAuth (optional for now)
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

---

## 🔨 Step 3: Build the Project

### Using Command Line

```bash
# Navigate to backend folder
cd C:\Users\Abdul Basit Afzal\Desktop\Thesis\backend

# Clean and install dependencies
mvn clean install

# Skip tests if needed (first time)
mvn clean install -DskipTests
```

### Using IntelliJ IDEA

1. Open IntelliJ IDEA
2. **File** → **Open** → Select `backend` folder
3. Wait for Maven to import dependencies
4. Right-click `pom.xml` → **Maven** → **Reload Project**

### Using Eclipse

1. Open Eclipse
2. **File** → **Import** → **Maven** → **Existing Maven Projects**
3. Browse to `backend` folder
4. Click **Finish**

---

## ▶️ Step 4: Run the Backend

### Option A: Using Maven Command

```bash
cd backend
mvn spring-boot:run
```

### Option B: Using IDE

**IntelliJ IDEA:**
1. Find `GameLibraryApplication.java`
2. Right-click → **Run 'GameLibraryApplication'**

**Eclipse:**
1. Find `GameLibraryApplication.java`
2. Right-click → **Run As** → **Spring Boot App**

### Expected Output

```
===========================================
🎮 GameLibrary Backend API Started!
📍 Server running at: http://localhost:8080/api
📚 API Documentation: http://localhost:8080/api/swagger-ui.html
===========================================
```

---

## ✅ Step 5: Test the Backend

### Test with Browser

Open: http://localhost:8080/api/games

You should see an empty array `[]` or error (authentication required)

### Test with Postman/Thunder Client

#### 1. Register a New User

**POST** `http://localhost:8080/api/auth/register`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully!"
}
```

#### 2. Login

**POST** `http://localhost:8080/api/auth/login`

Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "username": "john",
  "email": "john@example.com",
  "role": "USER"
}
```

#### 3. Access Protected Route

**GET** `http://localhost:8080/api/library/my-games`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🔐 Step 6: Create Admin User

### Using MySQL

```sql
USE gamelibrary;

-- Insert admin user
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@gamelibrary.com', '$2a$10$...BCRYPT_HASH...', 'ADMIN');

-- Get the user_id
SELECT user_id FROM users WHERE email = 'admin@gamelibrary.com';

-- Add to admin_users table
INSERT INTO admin_users (user_id, permissions) VALUES 
(1, '{"manageUsers": true, "manageGames": true, "viewOrders": true}');
```

### Generate BCrypt Password Hash

Use online tool: https://bcrypt-generator.com/
- Input: `admin123`
- Rounds: 10
- Copy the hash

Or use Java code:
```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("admin123");
System.out.println(hash);
```

---

## 📊 Step 7: Verify Database

### Check Tables

```sql
USE gamelibrary;
SHOW TABLES;
```

Expected tables:
- `users`
- `games`
- `game_library`
- `shopping_cart`
- `orders`
- `order_items`
- `admin_users`
- `game_logs`
- `platforms`

### Check Data

```sql
-- View users
SELECT * FROM users;

-- View games
SELECT * FROM games;

-- View game library
SELECT * FROM game_library;
```

---

## 🔄 Step 8: Connect Frontend to Backend

### Update Frontend API Configuration

Edit `Thesis/src/services/api.js`:

```javascript
// Change this:
const BASE_URL = 'https://api.rawg.io/api';

// To this for authentication:
const AUTH_URL = 'http://localhost:8080/api';

// Add axios instance for backend
export const backendAPI = axios.create({
  baseURL: AUTH_URL,
});

// Add interceptor to include JWT token
backendAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: Port 8080 Already in Use

**Solution:**
```properties
# In application.properties, change port:
server.port=8081
```

### Issue 2: Cannot Connect to MySQL

**Check MySQL is running:**
```bash
# Windows
net start MySQL80

# Or check XAMPP Control Panel
```

**Check credentials:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gamelibrary
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Issue 3: Table Not Found

**Run schema again:**
```bash
mysql -u root -p gamelibrary < backend/database/schema.sql
```

### Issue 4: Dependencies Not Downloaded

**Clear Maven cache:**
```bash
mvn dependency:purge-local-repository
mvn clean install
```

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Games
- `GET /api/games` - Get all games
- `GET /api/games/{id}` - Get game by ID
- `POST /api/games` - Create game (ADMIN only)

### Library
- `GET /api/library/my-games` - Get user's library
- `POST /api/library/add/{gameId}` - Add game to library
- `DELETE /api/library/remove/{gameId}` - Remove from library

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add/{gameId}` - Add to cart
- `DELETE /api/cart/remove/{gameId}` - Remove from cart
- `POST /api/cart/checkout` - Checkout cart

### Admin
- `GET /api/admin/users` - Get all users (ADMIN)
- `GET /api/admin/orders` - Get all orders (ADMIN)
- `DELETE /api/admin/users/{id}` - Delete user (ADMIN)

---

## 🎯 Next Steps

1. ✅ Backend is running
2. ✅ Database is set up
3. ✅ Can register/login users
4. ✅ JWT authentication working

**Now update your frontend:**
- Replace mock authentication with real API calls
- Store JWT token in localStorage
- Add Authorization header to requests
- Create admin dashboard

---

## 📞 Need Help?

### Logs

Check logs in terminal where backend is running

### Enable Debug Logging

```properties
logging.level.com.gamelibrary=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Database GUI Tools

- **MySQL Workbench**: Visual database management
- **DBeaver**: Universal database tool
- **phpMyAdmin**: Web-based (comes with XAMPP)

---

## 🎉 Success!

Your backend is now running! 🚀

**Backend:** http://localhost:8080/api
**Frontend:** http://localhost:5174
**Database:** MySQL on localhost:3306

You're ready to build a complete full-stack application!

