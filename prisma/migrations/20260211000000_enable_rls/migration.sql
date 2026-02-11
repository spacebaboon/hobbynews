-- Enable Row Level Security on all tables

-- User table: users can only access their own row
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON "User" FOR SELECT
  USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING (auth.uid() = id::uuid);

-- UserPreferences: users can only access their own preferences
ALTER TABLE "UserPreferences" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON "UserPreferences" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own preferences"
  ON "UserPreferences" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own preferences"
  ON "UserPreferences" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own preferences"
  ON "UserPreferences" FOR DELETE
  USING (auth.uid()::text = "userId");

-- UserFeedSubscription: users can only access their own subscriptions
ALTER TABLE "UserFeedSubscription" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON "UserFeedSubscription" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own subscriptions"
  ON "UserFeedSubscription" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own subscriptions"
  ON "UserFeedSubscription" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own subscriptions"
  ON "UserFeedSubscription" FOR DELETE
  USING (auth.uid()::text = "userId");

-- UserCategory: users can only access their own categories
ALTER TABLE "UserCategory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON "UserCategory" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own categories"
  ON "UserCategory" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own categories"
  ON "UserCategory" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own categories"
  ON "UserCategory" FOR DELETE
  USING (auth.uid()::text = "userId");

-- UserCustomFeed: users can only access their own custom feeds
ALTER TABLE "UserCustomFeed" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom feeds"
  ON "UserCustomFeed" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own custom feeds"
  ON "UserCustomFeed" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own custom feeds"
  ON "UserCustomFeed" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own custom feeds"
  ON "UserCustomFeed" FOR DELETE
  USING (auth.uid()::text = "userId");

-- FeedSource: public read, admin write
ALTER TABLE "FeedSource" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved feeds"
  ON "FeedSource" FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert feeds"
  ON "FeedSource" FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

CREATE POLICY "Admins can update feeds"
  ON "FeedSource" FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

CREATE POLICY "Admins can delete feeds"
  ON "FeedSource" FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

-- Topic: public read, admin write
ALTER TABLE "Topic" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view topics"
  ON "Topic" FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert topics"
  ON "Topic" FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

CREATE POLICY "Admins can update topics"
  ON "Topic" FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

CREATE POLICY "Admins can delete topics"
  ON "Topic" FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

-- FeedTopic: public read, admin write
ALTER TABLE "FeedTopic" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feed topics"
  ON "FeedTopic" FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert feed topics"
  ON "FeedTopic" FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

CREATE POLICY "Admins can update feed topics"
  ON "FeedTopic" FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );

CREATE POLICY "Admins can delete feed topics"
  ON "FeedTopic" FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );
