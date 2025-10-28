# GameLibrary - Game Store Web Application

A modern game library and store application built with React, Vite, and Tailwind CSS. Browse, search, and purchase games from the extensive RAWG game database.

## 🚀 Features

- **Browse Games**: Explore thousands of games with beautiful card layouts
- **Search & Filter**: Find games by name, genre, platform, and rating
- **Game Details**: View comprehensive information about each game
- **Shopping Cart**: Add games to cart and checkout
- **User Library**: Access your purchased games
- **User Authentication**: Login/Register functionality (mock for now)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client

### API
- **RAWG API** - Game data provider

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Thesis
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
VITE_RAWG_API_KEY=your_api_key_here
```

4. **Start the development server**
```bash
pnpm run dev
```

The application will open at `http://localhost:5173`

## 📁 Project Structure

```
Thesis/
├── src/
│   ├── assets/           # Images, icons, and static files
│   ├── components/       # React components
│   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   └── ui/          # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Public assets
└── package.json         # Project dependencies
```

## 🎮 Available Pages

- **Home** (`/`) - Browse and search games
- **Game Detail** (`/game/:id`) - Detailed game information
- **Cart** (`/cart`) - Shopping cart
- **Library** (`/library`) - User's game library
- **Profile** (`/profile`) - User profile settings
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

## 🔐 Authentication

Currently, the authentication is mocked for frontend development. The app uses:
- Local state management with Zustand
- Persistent storage using localStorage
- Mock login/register flows

**Future Implementation**: Will integrate with Java Spring Boot backend with Google OAuth and JWT.

## 🎨 Styling

The application uses Tailwind CSS with a custom dark theme:
- Primary color: Blue (`primary-600`)
- Background: Dark gray (`gray-900`)
- Cards: Gray (`gray-800`)

## 📝 Scripts

```bash
pnpm run dev        # Start development server
pnpm run build      # Build for production
pnpm run preview    # Preview production build
pnpm run lint       # Run ESLint
```

## 🔮 Future Enhancements

### Backend Integration
- [ ] Connect to Java Spring Boot backend
- [ ] Implement real authentication with Google OAuth
- [ ] Set up MySQL/MongoDB database
- [ ] Add real payment processing
- [ ] Implement user reviews and ratings

### Features
- [ ] Advanced filtering options
- [ ] Game recommendations
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Social features (friends, sharing)
- [ ] Achievement system
- [ ] Email notifications

### UI/UX
- [ ] Dark/Light theme toggle
- [ ] Advanced animations
- [ ] Skeleton loading states
- [ ] Pagination for game lists
- [ ] Infinite scroll

## 📄 License

This project is for educational purposes (thesis project).

## 🙏 Credits

- Game data provided by [RAWG API](https://rawg.io/apidocs)
- Built with ❤️ using React and Vite
