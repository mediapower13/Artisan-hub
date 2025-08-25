-- Seed data for Unilorin Artisan Platform
-- Insert sample data for development and testing

-- Insert categories
INSERT INTO categories (name, description, icon, skill_count) VALUES
('Fashion Design', 'Learn clothing design, pattern making, and garment construction', '👗', 5),
('Carpentry', 'Woodworking, furniture making, and construction skills', '🔨', 3),
('Photography', 'Portrait, event, and commercial photography techniques', '📸', 4),
('Graphic Design', 'Digital design, branding, and visual communication', '🎨', 6),
('Cooking', 'Traditional and modern cooking techniques and recipes', '👨‍🍳', 4),
('Electrical Work', 'Electrical installation, maintenance, and repair', '⚡', 3),
('Plumbing', 'Pipe installation, repair, and water system maintenance', '🔧', 2),
('Hairdressing', 'Hair styling, cutting, and beauty treatments', '💇‍♀️', 5),
('Tailoring', 'Custom clothing alteration and creation', '✂️', 4),
('Auto Mechanics', 'Vehicle repair, maintenance, and diagnostics', '🚗', 3);

-- Insert sample users
INSERT INTO users (id, email, password, first_name, last_name, full_name, phone, role, student_id, department, level) VALUES
-- Students
('550e8400-e29b-41d4-a716-446655440001', 'student1@unilorin.edu.ng', '$2b$10$hash1', 'Fatima', 'Ibrahim', 'Fatima Ibrahim', '+2348123456789', 'student', 'UNI/SCI/001', 'Computer Science', '300'),
('550e8400-e29b-41d4-a716-446655440002', 'student2@unilorin.edu.ng', '$2b$10$hash2', 'Ahmed', 'Musa', 'Ahmed Musa', '+2348123456790', 'student', 'UNI/ENG/002', 'Electrical Engineering', '200'),
('550e8400-e29b-41d4-a716-446655440003', 'student3@unilorin.edu.ng', '$2b$10$hash3', 'Blessing', 'Okon', 'Blessing Okon', '+2348123456791', 'student', 'UNI/ART/003', 'Fine Arts', '400'),

-- Artisan/Provider users
('550e8400-e29b-41d4-a716-446655440010', 'tailor@gmail.com', '$2b$10$hash10', 'Adebayo', 'Fashola', 'Adebayo Fashola', '+2348134567890', 'artisan', NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440011', 'carpenter@gmail.com', '$2b$10$hash11', 'Emeka', 'Okafor', 'Emeka Okafor', '+2348134567891', 'artisan', NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440012', 'photographer@gmail.com', '$2b$10$hash12', 'Kemi', 'Adeyemi', 'Kemi Adeyemi', '+2348134567892', 'artisan', NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440013', 'hairdresser@gmail.com', '$2b$10$hash13', 'Grace', 'Okoro', 'Grace Okoro', '+2348134567893', 'artisan', NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440014', 'electrician@gmail.com', '$2b$10$hash14', 'Yakubu', 'Hassan', 'Yakubu Hassan', '+2348134567894', 'artisan', NULL, NULL, NULL),

-- Admin user
('550e8400-e29b-41d4-a716-446655440020', 'admin@unilorin.edu.ng', '$2b$10$hash20', 'Admin', 'User', 'Admin User', '+2348145678901', 'admin', NULL, NULL, NULL);

-- Insert providers (artisan profiles)
INSERT INTO providers (id, user_id, business_name, description, specialization, experience, location, rating, total_reviews, verified, verification_status, whatsapp_number, pricing_base_rate, pricing_learning_rate) VALUES
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 'Fashola Fashion House', 'Expert tailor specializing in traditional Nigerian attire and modern fashion. Over 15 years of experience in creating beautiful, well-fitted garments.', ARRAY['Fashion Design', 'Tailoring', 'Pattern Making'], 15, 'Tanke, Ilorin', 4.8, 127, true, 'approved', '+2348134567890', 15000, 8000),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 'Okafor Carpentry Works', 'Professional carpenter and furniture maker. Specializes in custom furniture, doors, windows, and interior woodwork.', ARRAY['Carpentry', 'Furniture Making', 'Wood Carving'], 12, 'Fate, Ilorin', 4.6, 89, true, 'approved', '+2348134567891', 25000, 12000),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 'Kemi Photography Studio', 'Professional photographer with expertise in portraits, events, and commercial photography. Modern equipment and creative vision.', ARRAY['Photography', 'Photo Editing', 'Event Coverage'], 8, 'GRA, Ilorin', 4.9, 156, true, 'approved', '+2348134567892', 30000, 15000),
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 'Grace Hair & Beauty', 'Professional hairdresser and beauty specialist. Offers hair styling, cutting, treatment, and beauty services for all occasions.', ARRAY['Hairdressing', 'Hair Styling', 'Beauty Treatments'], 10, 'Challenge, Ilorin', 4.7, 203, true, 'approved', '+2348134567893', 8000, 5000),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', 'Hassan Electrical Services', 'Licensed electrician with expertise in residential and commercial electrical work. Safety-first approach with quality materials.', ARRAY['Electrical Work', 'Wiring', 'Installation'], 18, 'Adewole, Ilorin', 4.5, 94, true, 'approved', '+2348134567894', 20000, 10000);

-- Insert skills/courses
INSERT INTO skills (id, provider_id, title, description, category, difficulty, duration, price, max_students, images, syllabus, requirements) VALUES
-- Fashion Design Skills
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 'Traditional Agbada Making', 'Learn to create beautiful, authentic Agbada with proper measurements, cutting, and finishing techniques.', 'Fashion Design', 'intermediate', '4 weeks', 25000, 8, ARRAY['/images/agbada-class.jpg'], ARRAY['Pattern creation', 'Fabric selection', 'Cutting techniques', 'Hand sewing', 'Machine sewing', 'Finishing touches'], ARRAY['Basic sewing knowledge', 'Own sewing machine', 'Measuring tools']),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440010', 'Modern Dress Design', 'Create contemporary dresses with professional patterns and modern finishing techniques.', 'Fashion Design', 'advanced', '6 weeks', 35000, 6, ARRAY['/images/modern-dress.jpg'], ARRAY['Fashion sketching', 'Pattern drafting', 'Fabric manipulation', 'Professional finishing'], ARRAY['Intermediate sewing skills', 'Drawing materials', 'Pattern paper']),

-- Carpentry Skills  
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440011', 'Furniture Making Basics', 'Learn fundamental carpentry skills to create basic furniture pieces like stools, tables, and shelves.', 'Carpentry', 'beginner', '5 weeks', 30000, 10, ARRAY['/images/furniture-basics.jpg'], ARRAY['Wood selection', 'Basic joints', 'Tool usage', 'Safety practices', 'Finishing techniques'], ARRAY['No prior experience needed', 'Safety gear provided']),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440011', 'Advanced Joinery', 'Master complex joinery techniques for professional-quality furniture and cabinetry.', 'Carpentry', 'advanced', '8 weeks', 45000, 6, ARRAY['/images/advanced-joinery.jpg'], ARRAY['Mortise and tenon joints', 'Dovetail joints', 'Complex assemblies', 'Precision techniques'], ARRAY['Basic carpentry experience', 'Own hand tools']),

-- Photography Skills
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440012', 'Portrait Photography Masterclass', 'Learn professional portrait photography techniques, lighting, and post-processing.', 'Photography', 'intermediate', '4 weeks', 28000, 8, ARRAY['/images/portrait-class.jpg'], ARRAY['Camera settings', 'Lighting setup', 'Posing techniques', 'Photo editing'], ARRAY['DSLR camera', 'Basic photography knowledge']),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440012', 'Event Photography', 'Capture memorable moments at weddings, parties, and corporate events with professional techniques.', 'Photography', 'advanced', '3 weeks', 32000, 6, ARRAY['/images/event-photography.jpg'], ARRAY['Event planning', 'Low light photography', 'Candid shots', 'Quick editing'], ARRAY['Professional camera', 'Photography experience']),

-- Hairdressing Skills
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440013', 'Professional Hair Styling', 'Master various hair styling techniques for different occasions and hair types.', 'Hairdressing', 'beginner', '3 weeks', 18000, 12, ARRAY['/images/hair-styling.jpg'], ARRAY['Hair analysis', 'Cutting techniques', 'Styling tools', 'Product knowledge'], ARRAY['No prior experience needed']),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440013', 'Bridal Hair & Makeup', 'Specialize in bridal hair styling and makeup for weddings and special occasions.', 'Hairdressing', 'intermediate', '4 weeks', 25000, 8, ARRAY['/images/bridal-hair.jpg'], ARRAY['Bridal consultation', 'Updo techniques', 'Makeup application', 'Trial sessions'], ARRAY['Basic hairdressing skills', 'Makeup kit']),

-- Electrical Work Skills
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440014', 'Home Electrical Basics', 'Learn safe electrical installation and repair techniques for residential properties.', 'Electrical Work', 'beginner', '5 weeks', 35000, 10, ARRAY['/images/electrical-basics.jpg'], ARRAY['Electrical safety', 'Basic wiring', 'Circuit installation', 'Testing procedures'], ARRAY['No prior experience', 'Safety gear included']),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440014', 'Advanced Electrical Systems', 'Master complex electrical systems including three-phase power and industrial applications.', 'Electrical Work', 'advanced', '8 weeks', 50000, 6, ARRAY['/images/advanced-electrical.jpg'], ARRAY['Three-phase systems', 'Motor controls', 'PLC basics', 'Industrial safety'], ARRAY['Basic electrical knowledge', 'Certification preferred']);

-- Insert sample enrollments
INSERT INTO enrollments (student_id, skill_id, provider_id, status, progress) VALUES
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 'active', 60),
('550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440011', 'completed', 100),
('550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440012', 'active', 30),
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440013', 'pending', 0);

-- Insert sample contact requests
INSERT INTO contact_requests (student_id, provider_id, service_type, contact_method, message_preview, response_received, booking_completed, rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440010', 'direct_service', 'whatsapp', 'Hi, I need a custom agbada for my graduation...', true, true, 5),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440011', 'skill_learning', 'whatsapp', 'Interested in learning furniture making...', true, false, NULL),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440012', 'direct_service', 'phone', 'Need photographer for my final year project...', false, false, NULL);

-- Update skill counts in categories based on inserted skills
UPDATE categories SET skill_count = (
    SELECT COUNT(*) FROM skills WHERE skills.category = categories.name
);

-- Update current_students count in skills based on enrollments
UPDATE skills SET current_students = (
    SELECT COUNT(*) FROM enrollments 
    WHERE enrollments.skill_id = skills.id 
    AND enrollments.status IN ('active', 'completed')
);
