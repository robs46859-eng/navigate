import { collection, addDoc, getDocs, query, limit, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Place, Service } from '../types';
import { MOCK_PLACES, MOCK_SERVICES, MOCK_REVIEWS } from '../constants/mockData';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function seedDatabase() {
  const placesRef = collection(db, 'places');
  const servicesRef = collection(db, 'services');
  
  let existing;
  try {
    existing = await getDocs(query(placesRef, limit(1)));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'places');
    return;
  }
  
  if (!existing.empty) {
    console.log('Database already seeded.');
    return;
  }

  console.log('Seeding database...');
  
  // Seed Places
  for (const place of MOCK_PLACES) {
    try {
      const { id, ...data } = place;
      await setDoc(doc(db, 'places', id), data);
      
      // Seed Reviews for this place if any in MOCK_REVIEWS
      const reviews = MOCK_REVIEWS.filter(r => r.placeId === id);
      for (const review of reviews) {
        const { id: rid, ...rdata } = review;
        await setDoc(doc(db, 'places', id, 'reviews', rid), rdata);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `places/${place.id}`);
    }
  }

  // Seed Services
  for (const service of MOCK_SERVICES) {
    try {
      const { id, ...data } = service;
      await setDoc(doc(db, 'services', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `services/${service.id}`);
    }
  }

  console.log('Seeding complete.');
}
