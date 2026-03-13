import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// ============= CREATE OPERATIONS =============

// Sign up a user via HTTP POST
// Body: { "email": "user@example.com", "password": "yourpassword" }
export const signUp = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await admin.auth().createUser({ email, password });
    
    // Create user document in Firestore
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      createdAt: admin.firestore.Timestamp.now(),
    });

    res.status(201).json({ uid: user.uid, email: user.email });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Create a new document in a collection
// Body: { "collection": "users", "data": {...} }
export const createDocument = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { collection, data } = req.body;

  if (!collection || !data) {
    res.status(400).json({ error: "Collection and data are required" });
    return;
  }

  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: admin.firestore.Timestamp.now(),
    });

    res.status(201).json({ id: docRef.id, data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// ============= READ OPERATIONS =============

// Get all documents from a collection
// Query: ?collection=users
export const getAllDocuments = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const collection = req.query.collection as string;

  if (!collection) {
    res.status(400).json({ error: "Collection parameter is required" });
    return;
  }

  try {
    const snapshot = await db.collection(collection).get();
    const documents = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ count: documents.length, documents });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Get a single document by ID
// Query: ?collection=users&docId=user123
export const getDocument = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const collection = req.query.collection as string;
  const docId = req.query.docId as string;

  if (!collection || !docId) {
    res.status(400).json({ error: "Collection and docId parameters are required" });
    return;
  }

  try {
    const doc = await db.collection(collection).doc(docId).get();

    if (!doc.exists) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// ============= UPDATE OPERATIONS =============

// Update a document
// Body: { "collection": "users", "docId": "user123", "data": {...} }
export const updateDocument = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { collection, docId, data } = req.body;

  if (!collection || !docId || !data) {
    res.status(400).json({ error: "Collection, docId, and data are required" });
    return;
  }

  try {
    await db.collection(collection).doc(docId).update({
      ...data,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    res.status(200).json({ message: "Document updated", id: docId });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// ============= DELETE OPERATIONS =============

// Delete a document
// Body: { "collection": "users", "docId": "user123" }
export const deleteDocument = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { collection, docId } = req.body;

  if (!collection || !docId) {
    res.status(400).json({ error: "Collection and docId are required" });
    return;
  }

  try {
    await db.collection(collection).doc(docId).delete();
    res.status(200).json({ message: "Document deleted", id: docId });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});
