import { collection, addDoc, doc, deleteDoc, getDocs, query, where, serverTimestamp, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Firestore collection path: users/{userId}/apiKeys
const getApiKeysCollection = (userId: string) => collection(db, 'users', userId, 'apiKeys');

export interface ApiKeyData {
  id: string;
  name?: string;
  maskedKey: string; // e.g., paddy_sk_test_****1234
  createdAt: Timestamp; // Use Firestore Timestamp
  lastUsed?: Timestamp | null;
  // keyHash: string; // Store a hash of the full key for validation (optional, requires backend)
}

// --- Service Functions --- 

/**
 * Fetches API keys for a given user.
 */
export async function getApiKeys(userId: string): Promise<ApiKeyData[]> {
  if (!userId) throw new Error("User ID is required to fetch API keys.");
  
  const keysCollection = getApiKeysCollection(userId);
  // Order by creation date, newest first
  const q = query(keysCollection, orderBy('createdAt', 'desc')); 
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ApiKeyData));
}

/**
 * Generates a new API key for the user and returns the FULL key (only once).
 * Stores a masked version in Firestore.
 */
export async function generateApiKey(userId: string, name?: string): Promise<{ newKeyData: ApiKeyData, fullKey: string }> {
  if (!userId) throw new Error("User ID is required to generate an API key.");

  // **IMPORTANT: Key Generation Logic**
  // In a real app, this key generation should likely happen on a secure backend (e.g., Cloud Function).
  // Never generate truly sensitive keys directly on the client-side.
  // This is a simplified example:
  const prefix = "paddy_sk_live_"; // Or _test_ based on environment
  const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const fullKey = prefix + randomPart;
  
  // Mask the key for storage (e.g., show prefix and last 4 chars)
  const maskedKey = `${prefix}************************${fullKey.slice(-4)}`;
  // const keyHash = await hashKey(fullKey); // Use a secure hashing library (e.g., bcrypt in backend)

  const apiKeyDocData = {
    name: name || null, // Store null if empty for easier querying
    maskedKey,
    // keyHash, 
    createdAt: Timestamp.now(), // Use Firestore Timestamp
    lastUsed: null
  };

  const keysCollection = getApiKeysCollection(userId);
  const docRef = await addDoc(keysCollection, apiKeyDocData);

  const newKeyData: ApiKeyData = {
    id: docRef.id,
    ...apiKeyDocData
  } as ApiKeyData; // Type assertion might be needed depending on exact types

  return { newKeyData, fullKey };
}

/**
 * Deletes an API key.
 */
export async function deleteApiKey(userId: string, apiKeyId: string): Promise<void> {
  if (!userId) throw new Error("User ID is required.");
  if (!apiKeyId) throw new Error("API Key ID is required.");

  const docRef = doc(db, 'users', userId, 'apiKeys', apiKeyId);
  await deleteDoc(docRef);
} 