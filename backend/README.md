# 🎮 GameLibrary Backend API

Spring Boot backend for GameLibrary - A game store web application.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup

1. **Create Database**
```bash
mysql -u root -p
CREATE DATABASE gamelibrary;
USE gamelibrary;
SOURCE database/schema.sql;
```

2. **Configure Application**
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

3. **Build & Run**
```bash
mvn clean install
mvn spring-boot:run
```

4. **Verify**
Open: http://localhost:8080/api/auth/test

## 📚 Documentation

- **Setup Guide**: [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)
- **Implementation Status**: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/test` - Test endpoint

### Coming Soon
- Game management
- Library operations
- Shopping cart
- Admin panel

## 🛠️ Tech Stack

- Spring Boot 3.2.0
- Spring Security + JWT
- MySQL 8.0
- JPA/Hibernate
- Lombok
- Maven

## 📄 License

Educational/Thesis Project

