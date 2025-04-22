import { collection, addDoc, doc, deleteDoc, updateDoc, getDoc, getDocs, query, where, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Page, Component } from '@/types';

// Project Collection
const projectsCollection = 'projects';
const pagesCollection = 'pages';

// Helper function to recursively remove undefined values from an object or array
function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== undefined) {
          newObj[key] = sanitizeObject(value);
        } else {
          // Replace undefined with null for Firestore compatibility
          newObj[key] = null; 
        }
      }
    }
    return newObj;
  }
  return obj; // Return primitive values as is
}

// Project CRUD operations
export async function createProject(userId: string, name: string): Promise<Project> {
  const timestamp = Date.now();
  const projectData = {
    name,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const docRef = await addDoc(collection(db, projectsCollection), projectData);
  
  return {
    id: docRef.id,
    ...projectData
  };
}

export async function getProjects(userId: string): Promise<Project[]> {
  const q = query(collection(db, projectsCollection), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Project));
}

export async function getProject(projectId: string): Promise<Project | null> {
  console.log(`getProject (servis) çağrıldı, projectId: ${projectId}`); // Log start
  if (!projectId) {
    console.error("getProject (servis) boş projectId ile çağrıldı!");
    return null;
  }
  const docRef = doc(db, projectsCollection, projectId);
  try {
    const docSnap = await getDoc(docRef);
    console.log(`getProject (servis) Firestore yanıtı, exists: ${docSnap.exists()}, projectId: ${projectId}`); // Log Firestore response
    
    if (docSnap.exists()) {
      const projectData = {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
       console.log(`getProject (servis) Doküman bulundu, data:`, projectData); // Log found data
      // Güvenlik kuralları normalde burada kontrol edilmez, Firestore seviyesinde yapılır.
      // Ancak istemci tarafı kontrolü eklemek istersek (örn. AuthContext henüz yüklenmediyse), burada yapılabilir.
      return projectData;
    } else {
      console.warn(`getProject (servis) Doküman bulunamadı, projectId: ${projectId}`); // Log not found
      return null;
    }
  } catch (error) {
    console.error(`getProject (servis) içinde Firestore hatası! projectId: ${projectId}`, error); // Log any error during getDoc
    // Güvenlik kuralı ihlali genellikle burada bir hata olarak yakalanır.
    return null; // Hata durumunda null dönelim ki EditorPage bunu yakalasın
  }
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  const docRef = doc(db, projectsCollection, projectId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Date.now()
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  // First delete all pages in the project
  const pagesQuery = query(collection(db, pagesCollection), where('projectId', '==', projectId));
  const pagesSnapshot = await getDocs(pagesQuery);
  
  const deletePromises = pagesSnapshot.docs.map(pageDoc => 
    deleteDoc(doc(db, pagesCollection, pageDoc.id))
  );
  
  await Promise.all(deletePromises);
  
  // Then delete the project
  const docRef = doc(db, projectsCollection, projectId);
  await deleteDoc(docRef);
}

// Page CRUD operations
export async function createPage(projectId: string, name: string): Promise<Page> {
  const timestamp = Date.now();
  const pageData = {
    name,
    projectId,
    components: [],
    status: 'draft' as ('draft' | 'published'),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const docRef = await addDoc(collection(db, pagesCollection), pageData);
  
  return {
    id: docRef.id,
    ...pageData
  } as Page;
}

export async function getPages(projectId: string): Promise<Page[]> {
  const q = query(collection(db, pagesCollection), where('projectId', '==', projectId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Page));
}

export async function getPage(pageId: string): Promise<Page | null> {
  const docRef = doc(db, pagesCollection, pageId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Page;
  }
  
  return null;
}

export async function updatePage(pageId: string, data: Partial<Omit<Page, 'id' | 'projectId' | 'components'>>): Promise<void> {
  const docRef = doc(db, pagesCollection, pageId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Date.now()
  });
}

export async function updatePageComponents(pageId: string, components: Component[]): Promise<void> {
  const docRef = doc(db, pagesCollection, pageId);
  const sanitizedComponents = sanitizeObject(components);
  
  await updateDoc(docRef, {
    components: sanitizedComponents,
    updatedAt: Date.now()
  });
}

export async function publishPage(pageId: string): Promise<void> {
  const docRef = doc(db, pagesCollection, pageId);
  await updateDoc(docRef, {
    status: 'published',
    updatedAt: Date.now()
  });
}

export async function getPageComponentsByName(projectId: string, pageName: string): Promise<Component[] | null> {
  const q = query(
    collection(db, pagesCollection), 
    where('projectId', '==', projectId),
    where('name', '==', pageName),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const pageDoc = querySnapshot.docs[0];
  const pageData = pageDoc.data() as Page;
  
  return pageData.components || [];
}

export async function deletePage(pageId: string): Promise<void> {
  const docRef = doc(db, pagesCollection, pageId);
  await deleteDoc(docRef);
}