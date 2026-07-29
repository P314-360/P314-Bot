-- P314 Database Functions
-- Auto-delete expired channel messages (ephemeral messaging)

CREATE OR REPLACE FUNCTION delete_expired_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM channel_messages
  WHERE expires_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update channel subscriber count
CREATE OR REPLACE FUNCTION update_channel_subscribers()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE channels
    SET subscribers = subscribers + 1
    WHERE id = NEW.channel_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE channels
    SET subscribers = subscribers - 1
    WHERE id = OLD.channel_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_channel_subscribers_trigger
AFTER INSERT OR DELETE ON joined_channels
FOR EACH ROW EXECUTE FUNCTION update_channel_subscribers();

-- Function to update trending questions
CREATE OR REPLACE FUNCTION increment_question_search(question_hash_param TEXT, category_param TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO trending_questions (question_hash, category, search_count, last_searched)
  VALUES (question_hash_param, category_param, 1, NOW())
  ON CONFLICT (question_hash)
  DO UPDATE SET
    search_count = trending_questions.search_count + 1,
    last_searched = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update helpful answers rating
CREATE OR REPLACE FUNCTION update_helpful_answer_rating(answer_id UUID, new_rating INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE helpful_answers
  SET
    rating_count = rating_count + 1,
    average_rating = ((average_rating * rating_count) + new_rating) / (rating_count + 1)
  WHERE id = answer_id;
END;
$$ LANGUAGE plpgsql;
