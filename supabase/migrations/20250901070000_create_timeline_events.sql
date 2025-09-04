-- Create timeline_events table for dynamic timeline functionality
CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('past', 'present', 'future')),
  icon text NOT NULL DEFAULT 'Brain',
  color text NOT NULL DEFAULT 'from-purple-600 to-blue-600',
  details text,
  achievements text[] DEFAULT '{}',
  impact text,
  sort_order integer NOT NULL DEFAULT 0,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own timeline events" ON timeline_events;
CREATE POLICY "Users can view their own timeline events" ON timeline_events
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = 'demo-user');

DROP POLICY IF EXISTS "Users can insert their own timeline events" ON timeline_events;
CREATE POLICY "Users can insert their own timeline events" ON timeline_events
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = 'demo-user');

DROP POLICY IF EXISTS "Users can update their own timeline events" ON timeline_events;
CREATE POLICY "Users can update their own timeline events" ON timeline_events
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = 'demo-user');

DROP POLICY IF EXISTS "Users can delete their own timeline events" ON timeline_events;
CREATE POLICY "Users can delete their own timeline events" ON timeline_events
  FOR DELETE USING (auth.uid()::text = user_id OR user_id = 'demo-user');

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_timeline_events_updated_at ON timeline_events;
CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demo-user
INSERT INTO timeline_events (date, title, description, category, icon, color, details, achievements, impact, sort_order, user_id) VALUES
('2023-2024', '🧠 ADHD Brain Awakening', 'Jaren van app ideeën en creatieve visie ontwikkelen', 'past', 'Brain', 'from-purple-600 to-blue-600', 'Twee jaar lang werk ik dagelijks met Perplexity.ai - brainstormen, kennis vergaren, mijn chaotische gedachten structureren. Het werd mijn digitale brein, mijn partner in crime voor innovatie.', ARRAY['Honderden app concepten ontwikkeld', 'Deep dive in AI en technologie', 'Creatieve visie verfijnd', 'Kennis opgebouwd over user experience'], 'Foundation gelegd voor revolutionaire app ecosystem', 1, 'demo-user'),
('Januari 2025', '⚡ Bolt.ai Discovery', 'Gamechanger - eindelijk bouwen met eigen woorden', 'present', 'Zap', 'from-blue-600 to-cyan-600', 'Bolt.ai werd mijn echte gamechanger. Eindelijk kan ik met eigen woorden mijn app ideeën bouwen. Geen gedoe meer met development teams die niet begrijpen wat ik wil.', ARRAY['Eerste app prototypes gebouwd', 'Directe controle over development', 'Snelle iteratie mogelijk', '100% brein power voor UX/UI'], 'Van idee naar werkende app in recordtijd', 2, 'demo-user'),
('Februari 2025', '🎯 ADHD Diagnose & Medicatie', 'Life-changing moment - eindelijk begrijpen en behandelen', 'present', 'Heart', 'from-green-600 to-emerald-600', '2025 wordt mijn speciale jaar door mijn ADHD diagnose en start van medicatie. Eindelijk begrijp ik waarom ik zo anders denk en kan ik mijn superpowers optimaal benutten.', ARRAY['Professionele ADHD diagnose', 'Start van effectieve medicatie', 'Begrip van neurodivergent denken', 'Acceptatie van unieke perspectief'], 'Van chaos naar gecontroleerde creativiteit', 3, 'demo-user'),
('Maart 2025', '🚀 MyMindVentures Central Hub', 'Complete ecosystem voor iedereen', 'present', 'Rocket', 'from-pink-600 to-rose-600', 'Revolutionaire centrale hub met mijn verhaal, interactieve timeline/roadmap, portfolio van te lanceren apps, app ecosysteem met co-ownership, transparantie, AI geautomatiseerde flow voor documentatie.', ARRAY['Complete app ecosystem gebouwd', 'NFT co-ownership systeem', 'AI-powered documentatie', 'Git management integratie'], 'Showcase van revolutionaire visie', 4, 'demo-user'),
('April 2025', '🤝 JointVenture Proposal', 'Revolutionaire samenwerking met Perplexity.ai & Bolt.ai', 'future', 'Users', 'from-purple-600 to-pink-600', 'NFT Contract voorbereid met proof of existence. Digitale ondertekening als voorcontract. Persoonlijke meeting gepland. Partnership terms onderhandeld.', ARRAY['Proof of existence blockchain', 'NFT smart contracts', 'Digital signing workflow', 'Partnership agreement'], 'Life-changing partnership opportunity', 5, 'demo-user'),
('Mei-Juni 2025', '📱 Portfolio Development', '4 revolutionaire apps volledig ontwikkeld', 'future', 'Smartphone', 'from-cyan-600 to-blue-600', 'Alle 4 apps volledig ontwikkeld en getest: MyMindVentures Central Hub, NeuroSphere, Nexio, en My2ndAIBrain. Functionaliteit gevalideerd en geoptimaliseerd.', ARRAY['NeuroSphere platform', 'Nexio community app', 'My2ndAIBrain knowledge base', 'Complete app portfolio'], 'Revolutionaire app ecosystem live', 6, 'demo-user'),
('Juli 2025', '💎 Proof of Existence', 'Blockchain registratie van complete portfolio', 'future', 'Shield', 'from-emerald-600 to-green-600', 'Complete codebase gehashed met SHA-256. Hash geüpload naar Proof of Existence blockchain. Permanent timestamped record gecreëerd. Verifiable proof of ownership vastgelegd.', ARRAY['SHA-256 codebase hashing', 'Blockchain registration', 'Immutable proof of creation', 'Public verification'], 'Intellectual property bescherming', 7, 'demo-user'),
('Augustus 2025', '🌟 JointVenture Launch', 'Revolutionaire samenwerking officieel gestart', 'future', 'Crown', 'from-yellow-600 to-orange-600', 'Final agreement ondertekend. Revolutionaire samenwerking officieel gestart. ADHD brain + AI + No-code development = Revolutionaire innovatie.', ARRAY['Partnership agreement', 'Co-ownership structure', 'Revenue sharing model', 'Innovation pipeline'], 'De app wereld voor altijd veranderen', 8, 'demo-user');
