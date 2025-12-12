import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Cart from './pages/Cart';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Statistics from './pages/Statistics';
import GameComparison from './pages/GameComparison';
import Achievements from './pages/Achievements';
import OAuth2Redirect from './pages/OAuth2Redirect';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="game/:id" element={<GameDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="library" element={<Library />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="compare" element={<GameComparison />} />
          <Route path="achievements" element={<Achievements />} />
          {/* Admin routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/orders" element={<OrderManagement />} />
        </Route>
        {/* Auth routes without layout */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="oauth2/redirect" element={<OAuth2Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;
