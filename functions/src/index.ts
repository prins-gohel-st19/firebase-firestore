import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();
const db = getFirestore();

export const createUser = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { name, email, age } = req.body as { name?: string; email?: string; age?: number };

    if (!name || !email) {
      res.status(400).json({ success: false, error: "name and email are required" });
      return;
    }

    const docRef = await db.collection("users").add({
      name,
      email,
      age,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creating user:", error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    res.status(500).json({
      success: false,
      error: message,
      stack,
    });
  }
});


//Snapshot Learning 

// export const userCreated = onDocumentCreated("users/{userId}", (event) => {
//     const data = event.data?.data();

//     const name = data?.name;
//     const age = data?.age;

//     console.log("New user added");
//     console.log("Name :", name);
//     console.log("Age :", age);

//     return null;
// });

