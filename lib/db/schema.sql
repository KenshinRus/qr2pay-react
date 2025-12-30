CREATE TABLE IF NOT EXISTS saved_qr_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  encrypted_payload TEXT NOT NULL,
  nickname TEXT,
  created_at INTEGER NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_accessed INTEGER,
  UNIQUE(user_id, encrypted_payload)
);

CREATE INDEX IF NOT EXISTS idx_user_id ON saved_qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON saved_qr_codes(created_at);
