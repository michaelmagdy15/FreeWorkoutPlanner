-- Database Schema for FreeWorkoutPlanner (Production PostgreSQL Schema)
-- This schema supports multi-user tracking, offline-sync metadata, progressive overload logging,
-- and public template sharing.

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS & PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    avatar_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user retrieval by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================
-- 2. EXERCISE LIBRARY
-- ==========================================
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    target_muscle VARCHAR(50) NOT NULL, -- e.g., 'Quads', 'Chest', 'Lats'
    alternative_names VARCHAR(150)[],
    image_url VARCHAR(512),
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(target_muscle);

-- ==========================================
-- 3. WORKOUT TEMPLATES (Public & Private Splits)
-- ==========================================
CREATE TABLE IF NOT EXISTS workout_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL indicates official/public templates
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    import_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workout_templates_user ON workout_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_public ON workout_templates(is_public) WHERE is_public = TRUE;

-- ==========================================
-- 4. TEMPLATE EXERCISES (Relation map with ordering and defaults)
-- ==========================================
CREATE TABLE IF NOT EXISTS template_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
    order_index INT NOT NULL,
    default_sets INT DEFAULT 3,
    default_reps_range VARCHAR(20) DEFAULT '8-12',
    default_rest_seconds INT DEFAULT 90,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (template_id, order_index)
);

-- ==========================================
-- 5. WORKOUT SESSIONS (Logged Workouts)
-- ==========================================
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    client_sync_id VARCHAR(100), -- For offline-sync comparison
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_sync ON workouts(client_sync_id);

-- ==========================================
-- 6. LOGGED EXERCISES IN A SESSION
-- ==========================================
CREATE TABLE IF NOT EXISTS workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
    order_index INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workout_id, order_index)
);

-- ==========================================
-- 7. SETS LOGGED (For Progressive Overload Analysis)
-- ==========================================
CREATE TABLE IF NOT EXISTS sets_logged (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    reps INT NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    rpe INT CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion (1 to 10 scale)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workout_exercise_id, set_number)
);

-- ==========================================
-- 8. NUTRITION LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_name VARCHAR(150) NOT NULL,
    calories INT NOT NULL,
    protein_grams NUMERIC(5, 1) DEFAULT 0.0,
    carbs_grams NUMERIC(5, 1) DEFAULT 0.0,
    fats_grams NUMERIC(5, 1) DEFAULT 0.0,
    logged_date DATE NOT NULL,
    client_sync_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON nutrition_logs(user_id, logged_date DESC);

-- ==========================================
-- 9. USER METRICS & TARGETS
-- ==========================================
CREATE TABLE IF NOT EXISTS user_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    weight_kg NUMERIC(5, 2),
    body_fat_percentage NUMERIC(4, 2),
    daily_calorie_target INT DEFAULT 2000,
    daily_protein_target INT DEFAULT 150,
    daily_steps_target INT DEFAULT 10000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, recorded_date)
);

CREATE INDEX IF NOT EXISTS idx_user_metrics_history ON user_metrics(user_id, recorded_date DESC);
