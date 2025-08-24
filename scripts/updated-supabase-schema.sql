-- Updated Supabase schema to support PRD requirements
-- This extends the existing schema with Provider model and verification workflow

-- Update users table to support PRD requirements
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS department TEXT;

-- Create updated provider_profiles table (replacing artisan_profiles)
DROP TABLE IF EXISTS provider_profiles CASCADE;

CREATE TABLE provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    description TEXT NOT NULL,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    
    -- Contact and availability
    whatsapp_number TEXT,
    availability JSONB NOT NULL DEFAULT '{
        "isAvailable": true,
        "availableForWork": true,
        "availableForLearning": true,
        "responseTime": "Usually responds within 24 hours"
    }',
    
    -- Pricing information
    pricing JSONB NOT NULL DEFAULT '{
        "baseRate": null,
        "learningRate": null,
        "currency": "NGN"
    }',
    
    -- Verification status
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_evidence JSONB NOT NULL DEFAULT '[]',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    -- Portfolio and experience
    portfolio_items JSONB NOT NULL DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_requests table
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    provider_email TEXT NOT NULL,
    student_id TEXT NOT NULL,
    department TEXT NOT NULL,
    
    -- Business information
    business_name TEXT NOT NULL,
    business_description TEXT NOT NULL,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    
    -- Evidence files
    evidence_files JSONB NOT NULL DEFAULT '[]',
    
    -- Review status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    
    -- Timestamps and reviewer
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id)
);

-- Create contact_requests table for WhatsApp CTA tracking
CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL CHECK (service_type IN ('direct_service', 'skill_learning')),
    contact_method TEXT NOT NULL DEFAULT 'whatsapp',
    message_preview TEXT,
    
    -- Tracking
    contacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_received BOOLEAN DEFAULT FALSE,
    response_time_hours INTEGER,
    
    -- Outcome tracking
    booking_completed BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Update skills table to reference providers instead of artisans
ALTER TABLE skills 
DROP CONSTRAINT IF EXISTS skills_artisan_id_fkey,
ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE;

-- Migrate existing artisan data to provider format (if needed)
-- This would be run as a separate migration script

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_verification_status ON provider_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_specializations ON provider_profiles USING GIN(specializations);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_provider_id ON verification_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_student_id ON contact_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_provider_id ON contact_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_skills_provider_id ON skills(provider_id);

-- Enable Row Level Security
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for provider_profiles
CREATE POLICY "Public providers are viewable by everyone" ON provider_profiles
    FOR SELECT USING (verification_status = 'approved');

CREATE POLICY "Users can view own provider profile" ON provider_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own provider profile" ON provider_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own provider profile" ON provider_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all provider profiles" ON provider_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update verification status" ON provider_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for verification_requests
CREATE POLICY "Providers can view own verification requests" ON verification_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM provider_profiles 
            WHERE id = provider_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Providers can insert own verification requests" ON verification_requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM provider_profiles 
            WHERE id = provider_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all verification requests" ON verification_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update verification requests" ON verification_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for contact_requests
CREATE POLICY "Students can view own contact requests" ON contact_requests
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert contact requests" ON contact_requests
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Providers can view contact requests for their services" ON contact_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM provider_profiles 
            WHERE id = provider_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Providers can update response status" ON contact_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM provider_profiles 
            WHERE id = provider_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all contact requests" ON contact_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_provider_profiles_updated_at 
    BEFORE UPDATE ON provider_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create verification request on profile creation
CREATE OR REPLACE FUNCTION create_verification_request()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO verification_requests (
        provider_id,
        provider_name,
        provider_email,
        student_id,
        department,
        business_name,
        business_description,
        specializations,
        experience_years,
        evidence_files
    )
    SELECT 
        NEW.id,
        u.full_name,
        u.email,
        u.student_id,
        u.department,
        NEW.business_name,
        NEW.description,
        NEW.specializations,
        NEW.experience_years,
        NEW.verification_evidence
    FROM users u
    WHERE u.id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_verification_request_trigger
    AFTER INSERT ON provider_profiles
    FOR EACH ROW EXECUTE FUNCTION create_verification_request();

-- Create analytics views for admin dashboard
CREATE OR REPLACE VIEW platform_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM provider_profiles) as total_providers,
    (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
    (SELECT COUNT(*) FROM verification_requests WHERE status = 'pending') as pending_verifications,
    (SELECT COUNT(*) FROM provider_profiles WHERE verification_status = 'approved') as approved_providers,
    (SELECT COUNT(*) FROM verification_requests WHERE status = 'rejected') as rejected_applications,
    (SELECT COUNT(*) FROM skills) as total_skills,
    (SELECT COUNT(*) FROM enrollments) as total_enrollments,
    (SELECT ROUND(AVG(rating), 2) FROM reviews) as average_rating;

-- Sample data for development
INSERT INTO users (id, email, role, full_name, student_id, department) VALUES 
('admin-1', 'admin@unilorin.edu.ng', 'admin', 'Admin User', NULL, 'Student Affairs'),
('student-1', 'adebayo.johnson@student.unilorin.edu.ng', 'student', 'Adebayo Johnson', 'UNILORIN/2020/123456', 'Fine Arts'),
('student-2', 'fatima.abdul@student.unilorin.edu.ng', 'student', 'Fatima Abdul', 'UNILORIN/2021/234567', 'Computer Science')
ON CONFLICT (email) DO NOTHING;
