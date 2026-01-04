-- Enable RLS on app tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Todo" ENABLE ROW LEVEL SECURITY;

-- Add basic policies so the app still works
-- For now, allowing anyone to read Todos so the test page works
CREATE POLICY "Allow public read access on Todo" ON "Todo" FOR SELECT USING (true);