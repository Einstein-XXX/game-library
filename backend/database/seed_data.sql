-- Seed Data for GameLibrary Database

-- Insert default platform
INSERT INTO platforms (name, description) VALUES 
('PC', 'Windows, Mac, Linux'),
('PlayStation', 'PlayStation 4, PlayStation 5'),
('Xbox', 'Xbox One, Xbox Series X/S'),
('Nintendo', 'Nintendo Switch');

-- Insert admin user (password: admin123 - CHANGE THIS!)
-- Note: Password should be hashed with BCrypt in production
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@gamelibrary.com', '$2a$10$XYZ...', 'ADMIN'),
('testuser', 'test@example.com', '$2a$10$ABC...', 'USER');

INSERT INTO admin_users (user_id, permissions) VALUES 
(1, '{"manageUsers": true, "manageGames": true, "viewOrders": true, "manageOrders": true}');

INSERT INTO games (game_id, title, description, price, genre, release_date, developer, rating, image_url) VALUES 
(3498, 'Grand Theft Auto V', 'An open world action-adventure game', 29.99, 'Action', '2013-09-17', 'Rockstar North', 4.47, 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg'),
(4200, 'Portal 2', 'A puzzle-platform game', 9.99, 'Puzzle', '2011-04-19', 'Valve', 4.61, 'https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg'),
(5286, 'Tomb Raider (2013)', 'Action-adventure game', 19.99, 'Adventure', '2013-03-05', 'Crystal Dynamics', 4.05, 'https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg');


