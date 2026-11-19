// lib/db.ts
import { getDb } from './mongodb';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  tasteMood: string;
  createdAt: string;
}

export interface OtpRecord {
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
}

let indexesReady = false;

async function ensureIndexes() {
  if (indexesReady) return;
  const db = await getDb();
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  indexesReady = true;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<UserRecord>('users')
    .findOne({ email: email.trim().toLowerCase() });
}

export async function createUser(user: UserRecord): Promise<UserRecord> {
  await ensureIndexes();
  const db = await getDb();
  const doc: UserRecord = {
    ...user,
    email: user.email.trim().toLowerCase(),
  };
  await db.collection<UserRecord>('users').insertOne(doc);
  return doc;
}

export async function saveOtp(record: OtpRecord) {
  await ensureIndexes();
  const db = await getDb();
  const normalized = record.email.trim().toLowerCase();
  await db.collection<OtpRecord>('otps').updateOne(
    { email: normalized },
    {
      $set: {
        email: normalized,
        otpHash: record.otpHash,
        expiresAt: record.expiresAt,
        attempts: 0,
      },
    },
    { upsert: true }
  );
}

export async function getOtp(email: string): Promise<OtpRecord | null> {
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<OtpRecord>('otps')
    .findOne({ email: email.trim().toLowerCase() });
}

export async function incrementOtpAttempts(email: string) {
  const db = await getDb();
  await db
    .collection<OtpRecord>('otps')
    .updateOne({ email: email.trim().toLowerCase() }, { $inc: { attempts: 1 } });
}

export async function deleteOtp(email: string) {
  const db = await getDb();
  await db
    .collection<OtpRecord>('otps')
    .deleteOne({ email: email.trim().toLowerCase() });
}