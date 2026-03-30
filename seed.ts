
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { MOCK_PLACES, MOCK_SERVICES, MOCK_REVIEWS } from './src/constants/mockData';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  console.log('Starting seed...');

  // Seed Places
  console.log('Seeding places...');
  for (const place of MOCK_PLACES) {
    const { id, ...data } = place;
    await setDoc(doc(db, 'places', id), data);
  }

  // Seed Services
  console.log('Seeding services...');
  for (const service of MOCK_SERVICES) {
    const { id, ...data } = service;
    await setDoc(doc(db, 'services', id), data);
  }

  // Seed Reviews
  console.log('Seeding reviews...');
  for (const review of MOCK_REVIEWS) {
    const { id, placeId, ...data } = review;
    await setDoc(doc(db, 'places', placeId, 'reviews', id), {
      placeId,
      ...data
    });
  }

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
