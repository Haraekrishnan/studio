import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { USERS } from '@/lib/mock-data';

// IMPORTANT: This service account key is for temporary, one-time setup ONLY.
// It should be removed and secured properly in a real production environment.
// The key is provided here for the convenience of the seeding process.
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

export async function POST() {
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const user of USERS) {
    try {
      // Check if user exists
      let userRecord;
      try {
        userRecord = await getAuth().getUserByEmail(user.email);
        // User exists, update them
        await getAuth().updateUser(userRecord.uid, {
          email: user.email,
          password: user.password,
          displayName: user.name,
          photoURL: user.avatar,
        });
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // User doesn't exist, create them
          await getAuth().createUser({
            uid: user.id, // Use the ID from mock data
            email: user.email,
            password: user.password,
            displayName: user.name,
            photoURL: user.avatar,
          });
        } else {
          throw error; // Re-throw other errors
        }
      }
      successCount++;
    } catch (error: any) {
      errorCount++;
      errors.push(`Failed for ${user.email}: ${error.message}`);
      console.error(`Error seeding user ${user.email}:`, error);
    }
  }

  if (errorCount > 0) {
    return NextResponse.json({ success: false, error: 'Some users failed to seed.', details: errors, successCount, errorCount });
  }

  return NextResponse.json({ success: true, successCount, message: 'All users have been successfully seeded.' });
}
