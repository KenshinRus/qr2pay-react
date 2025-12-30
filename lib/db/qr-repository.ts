import { getDatabase } from './database';

export interface SavedQRCode {
  id: number;
  user_id: string;
  encrypted_payload: string;
  nickname: string | null;
  created_at: number;
  view_count: number;
  last_accessed: number | null;
}

/**
 * Save a new QR code for a user
 */
export function saveQRCode(
  userId: string,
  encryptedPayload: string,
  nickname?: string
): SavedQRCode {
  const db = getDatabase();
  const now = Date.now();

  const stmt = db.prepare(`
    INSERT INTO saved_qr_codes (user_id, encrypted_payload, nickname, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, encrypted_payload) DO UPDATE SET
      nickname = excluded.nickname,
      view_count = view_count + 1,
      last_accessed = ?
    RETURNING id, user_id, encrypted_payload, nickname, created_at, view_count, last_accessed
  `);

  const result = stmt.get(userId, encryptedPayload, nickname || null, now, now) as SavedQRCode;
  return result;
}

/**
 * Get all QR codes for a specific user
 */
export function getUserQRCodes(userId: string): SavedQRCode[] {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT id, user_id, encrypted_payload, nickname, created_at, view_count, last_accessed
    FROM saved_qr_codes
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);

  return stmt.all(userId) as SavedQRCode[];
}

/**
 * Get a single QR code by ID (with ownership verification)
 */
export function getQRCodeById(id: number, userId: string): SavedQRCode | null {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT id, user_id, encrypted_payload, nickname, created_at, view_count, last_accessed
    FROM saved_qr_codes
    WHERE id = ? AND user_id = ?
  `);

  return (stmt.get(id, userId) as SavedQRCode) || null;
}

/**
 * Delete a QR code (with ownership verification)
 */
export function deleteQRCode(id: number, userId: string): boolean {
  const db = getDatabase();

  const stmt = db.prepare(`
    DELETE FROM saved_qr_codes
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(id, userId);
  return result.changes > 0;
}

/**
 * Update the nickname of a QR code (with ownership verification)
 */
export function updateNickname(id: number, userId: string, nickname: string): boolean {
  const db = getDatabase();

  const stmt = db.prepare(`
    UPDATE saved_qr_codes
    SET nickname = ?
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(nickname, id, userId);
  return result.changes > 0;
}

/**
 * Increment view count and update last accessed timestamp
 */
export function incrementViewCount(id: number, userId: string): boolean {
  const db = getDatabase();
  const now = Date.now();

  const stmt = db.prepare(`
    UPDATE saved_qr_codes
    SET view_count = view_count + 1,
        last_accessed = ?
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(now, id, userId);
  return result.changes > 0;
}
