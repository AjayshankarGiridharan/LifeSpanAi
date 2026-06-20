-- Create buildings table
CREATE TABLE IF NOT EXISTS public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  year_built INTEGER NOT NULL,
  square_feet DECIMAL(12, 2),
  construction_type TEXT NOT NULL,
  roof_type TEXT,
  foundation_type TEXT,
  hvac_system TEXT,
  electrical_system TEXT,
  plumbing_system TEXT,
  exterior_condition TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assessment results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  predicted_lifespan_years INTEGER,
  overall_health_score DECIMAL(5, 2),
  maintenance_cost_estimate DECIMAL(15, 2),
  risk_level TEXT,
  component_scores JSONB,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create maintenance schedule table
CREATE TABLE IF NOT EXISTS public.maintenance_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT,
  estimated_cost DECIMAL(12, 2),
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies for buildings
CREATE POLICY "Users can view their own buildings" ON public.buildings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buildings" ON public.buildings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buildings" ON public.buildings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own buildings" ON public.buildings
  FOR DELETE USING (auth.uid() = user_id);

-- Row Level Security Policies for assessment_results
CREATE POLICY "Users can view their own assessments" ON public.assessment_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.assessment_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON public.assessment_results
  FOR DELETE USING (auth.uid() = user_id);

-- Row Level Security Policies for maintenance_schedule
CREATE POLICY "Users can view their own maintenance schedules" ON public.maintenance_schedule
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maintenance schedules" ON public.maintenance_schedule
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance schedules" ON public.maintenance_schedule
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance schedules" ON public.maintenance_schedule
  FOR DELETE USING (auth.uid() = user_id);

-- Row Level Security Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
