import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc,
  where,
  limit
} from "firebase/firestore";
import { db } from "../firebase";
import { Place } from "../types";

export const placeService = {
  async getPlaces(category?: string): Promise<Place[]> {
    try {
      let q = query(collection(db, "places"), limit(100));
      if (category) {
        q = query(collection(db, "places"), where("category", "==", category), limit(100));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Place[];
    } catch (error) {
      console.error("Error fetching places:", error);
      return [];
    }
  },

  async getPlaceById(id: string): Promise<Place | null> {
    try {
      const docSnap = await getDoc(doc(db, "places", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Place;
      }
      return null;
    } catch (error) {
      console.error("Error fetching place by id:", error);
      return null;
    }
  },

  async suggestPlace(place: Omit<Place, 'id' | 'aggregateStats' | 'source'>) {
    try {
      const docRef = await addDoc(collection(db, "places"), {
        ...place,
        source: "Crowdsourced",
        aggregateStats: {
          avgCleanliness: 0,
          avgPrivacy: 0,
          strollerAccessRate: 0,
          reviewCount: 0
        }
      });
      return docRef.id;
    } catch (error) {
      console.error("Error suggesting place:", error);
      throw error;
    }
  }
};
