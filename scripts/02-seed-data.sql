-- Seeding initial data for UNILORIN Artisan Platform
-- Insert sample skills/categories
INSERT INTO skills (id, name, description, category, difficulty_level, duration_weeks, price, image_url) VALUES
('skill_1', 'Traditional Tailoring', 'Learn the art of traditional Nigerian garment making including Agbada, Dashiki, and Kaftan', 'Fashion & Textiles', 'intermediate', 8, 25000.00, '/traditional-agbada.png'),
('skill_2', 'Modern Fashion Design', 'Contemporary fashion design techniques and pattern making', 'Fashion & Textiles', 'intermediate', 12, 35000.00, '/professional-woman-tailor.png'),
('skill_3', 'Electronics Repair', 'Mobile phone, laptop, and electronic device repair', 'Technology', 'beginner', 6, 20000.00, '/young-man-technician.png'),
('skill_4', 'Web Development', 'Learn HTML, CSS, JavaScript and modern web frameworks', 'Technology', 'beginner', 16, 50000.00, '/placeholder.svg?height=300&width=400'),
('skill_5', 'Hairdressing & Styling', 'Professional hair cutting, styling, and treatment techniques', 'Beauty & Wellness', 'beginner', 10, 30000.00, '/placeholder.svg?height=300&width=400'),
('skill_6', 'Carpentry & Woodwork', 'Furniture making and wood crafting techniques', 'Crafts & Arts', 'intermediate', 14, 40000.00, '/placeholder.svg?height=300&width=400'),
('skill_7', 'Photography', 'Digital photography and photo editing skills', 'Creative Arts', 'beginner', 8, 25000.00, '/placeholder.svg?height=300&width=400'),
('skill_8', 'Catering & Cooking', 'Professional cooking and catering business skills', 'Food & Hospitality', 'beginner', 6, 22000.00, '/placeholder.svg?height=300&width=400');

-- Insert sample users (students and artisans)
INSERT INTO users (id, email, name, password_hash, role, phone, location, bio) VALUES
('user_1', 'adebayo.student@unilorin.edu.ng', 'Adebayo Olamide', '$2b$10$example_hash_1', 'student', '+234-801-234-5678', 'Ilorin, Kwara State', 'Computer Science student interested in learning practical skills'),
('user_2', 'fatima.student@unilorin.edu.ng', 'Fatima Ibrahim', '$2b$10$example_hash_2', 'student', '+234-802-345-6789', 'Ilorin, Kwara State', 'Business Administration student passionate about fashion'),
('user_3', 'kemi.artisan@gmail.com', 'Kemi Adebisi', '$2b$10$example_hash_3', 'artisan', '+234-803-456-7890', 'Ilorin, Kwara State', 'Master tailor with 15 years experience in traditional and modern fashion'),
('user_4', 'tunde.tech@gmail.com', 'Tunde Ogundimu', '$2b$10$example_hash_4', 'artisan', '+234-804-567-8901', 'Ilorin, Kwara State', 'Electronics repair specialist and tech trainer'),
('user_5', 'aisha.beauty@gmail.com', 'Aisha Mohammed', '$2b$10$example_hash_5', 'artisan', '+234-805-678-9012', 'Ilorin, Kwara State', 'Professional hairstylist and beauty consultant'),
('user_6', 'ibrahim.carpenter@gmail.com', 'Ibrahim Suleiman', '$2b$10$example_hash_6', 'artisan', '+234-806-789-0123', 'Ilorin, Kwara State', 'Master carpenter specializing in custom furniture');

-- Insert artisan profiles
INSERT INTO artisan_profiles (id, user_id, business_name, years_experience, hourly_rate, is_verified, rating, total_reviews, availability_status) VALUES
('artisan_1', 'user_3', 'Kemi Fashion House', 15, 3000.00, true, 4.8, 127, 'available'),
('artisan_2', 'user_4', 'TechFix Solutions', 8, 2500.00, true, 4.6, 89, 'available'),
('artisan_3', 'user_5', 'Aisha Beauty Lounge', 10, 2000.00, true, 4.9, 156, 'busy'),
('artisan_4', 'user_6', 'Ibrahim Woodworks', 12, 3500.00, true, 4.7, 73, 'available');

-- Link artisans to their skills
INSERT INTO artisan_skills (artisan_id, skill_id, proficiency_level) VALUES
('artisan_1', 'skill_1', 'expert'),
('artisan_1', 'skill_2', 'expert'),
('artisan_2', 'skill_3', 'expert'),
('artisan_2', 'skill_4', 'intermediate'),
('artisan_3', 'skill_5', 'expert'),
('artisan_4', 'skill_6', 'expert');

-- Insert sample enrollments
INSERT INTO enrollments (id, student_id, artisan_id, skill_id, status, progress_percentage, payment_status) VALUES
('enrollment_1', 'user_1', 'artisan_2', 'skill_3', 'active', 65, 'paid'),
('enrollment_2', 'user_2', 'artisan_1', 'skill_1', 'active', 30, 'paid'),
('enrollment_3', 'user_1', 'artisan_2', 'skill_4', 'completed', 100, 'paid');

-- Insert sample reviews
INSERT INTO reviews (enrollment_id, reviewer_id, artisan_id, rating, comment) VALUES
('enrollment_3', 'user_1', 'artisan_2', 5, 'Excellent teacher! Tunde made electronics repair easy to understand and provided hands-on practice.'),
('enrollment_2', 'user_2', 'artisan_1', 5, 'Kemi is amazing! Her traditional tailoring techniques are authentic and she is very patient with beginners.');
