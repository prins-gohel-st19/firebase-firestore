import * as admin from "firebase-admin";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();
const db = getFirestore();

type CreateUserBody = {
	name?: string;
	email?: string;
	age?: number;
};

export const createUser = onRequest(async (req, res) => {
	try {
		if (req.method !== "POST") {
			res.status(405).send("Method Not Allowed");
			return;
		}

		const { name, email, age } = req.body as CreateUserBody;
		if (!name || !email) {
			res.status(400).json({ success: false, error: "name and email are required" });
			return;
		}

		const userDoc: {
			name: string;
			email: string;
			createdAt: FieldValue;
			age?: number;
		} = {
			name,
			email,
			createdAt: FieldValue.serverTimestamp(),
		};

		// Only include age when provided to avoid undefined Firestore values.
		if (typeof age === "number") {
			userDoc.age = age;
		}

		const docRef = await db.collection("users").add(userDoc);
		res.status(200).json({ success: true, id: docRef.id });
	} catch (error) {
		console.error("Error creating user:", error);
		const message = error instanceof Error ? error.message : String(error);
		const stack = error instanceof Error ? error.stack : undefined;
		res.status(500).json({ success: false, error: message, stack });
	}
});
