import { collection, query, getDocs, addDoc, where, orderBy, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Review } from '../types';

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

export const reviewService = {
  getReviewsByPlace: async (placeId: string): Promise<Review[]> => {
    const path = `places/${placeId}/reviews`;
    const reviewsRef = collection(db, 'places', placeId, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  addReview: async (placeId: string, review: Omit<Review, 'id' | 'createdAt'>) => {
    const path = `places/${placeId}/reviews`;
    const reviewsRef = collection(db, 'places', placeId, 'reviews');
    try {
      const docRef = await addDoc(reviewsRef, {
        ...review,
        createdAt: new Date().toISOString()
      });
      
      // Update aggregate stats for the place
      await updatePlaceAggregates(placeId);
      
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};

async function updatePlaceAggregates(placeId: string) {
  const path = `places/${placeId}/reviews`;
  const reviewsRef = collection(db, 'places', placeId, 'reviews');
  try {
    const querySnapshot = await getDocs(reviewsRef);
    const reviews = querySnapshot.docs.map(doc => doc.data() as Review);
    
    if (reviews.length === 0) return;
    
    const avgCleanliness = reviews.reduce((acc, r) => acc + r.cleanliness, 0) / reviews.length;
    const avgPrivacy = reviews.reduce((acc, r) => acc + r.privacy, 0) / reviews.length;
    const strollerAccessCount = reviews.filter(r => r.strollerAccess).length;
    const strollerAccessRate = strollerAccessCount / reviews.length;
    
    const placeRef = doc(db, 'places', placeId);
    await updateDoc(placeRef, {
      aggregateStats: {
        avgCleanliness,
        avgPrivacy,
        strollerAccessRate,
        reviewCount: reviews.length
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `places/${placeId}`);
  }
}
