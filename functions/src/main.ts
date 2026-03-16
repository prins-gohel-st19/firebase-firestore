

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth as importedAuth, db } from "./firebase.js";

// async function testAuth() {
//     const email = `testuser+${Date.now()}@gmail.com`;
//     try {
//         const user = await createUserWithEmailAndPassword(auth, email, "Try123")
//         console.log("userr uid:", user.user.uid);
//     } catch (error) {
//         console.log("oops something went wrong:", error);
//     }
// }

// testAuth()

// create account / singUp

// import { doc, setDoc } from "firebase/firestore";
// export const signUp = async (email: string, password: string) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       importedAuth,
//       email,
//       password,
//     );

//     const user = userCredential.user;

//     await setDoc(doc(db, "users", user.uid), {
//       uid: user.uid,
//       email: user.email,
//       createdAt: new Date(),
//     });

//     return {
//       uid: user.uid,
//       email: user.email,
//     };
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };

// signUp("carry@gmail.com", "carry123");


// To create another user, change email and run again.
// await signUp("herry@gmail.com", "herry123");
// await signUp("rohit@gmail.com", "rohit123");



// login 

// import { signInWithEmailAndPassword } from "firebase/auth";

// export async function login(email : string, password: string) {
//     try {
//         const userCredential = await signInWithEmailAndPassword(importedAuth, email, password);

//         console.log("User logged in: ", userCredential.user);
//     } catch (error: any) {
//         console.error("Login Error: ",error.message);        
//     }
// }


// login("alex@gmail.com","alex123");



import { setDoc } from "firebase/firestore";
import { auth as importedAuth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";

const signupBtn = document.getElementById("signupBtn") as HTMLButtonElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;



signupBtn.addEventListener("click", async () => {
  const email = (document.getElementById("signupEmail") as HTMLInputElement).value;
  const password = (document.getElementById("signupPassword") as HTMLInputElement).value;

  const userCredential =  await createUserWithEmailAndPassword(importedAuth, email, password);

  const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
    });
  console.log("User Created");

});



loginBtn.addEventListener("click", async () => {
  const email = (document.getElementById("loginEmail") as HTMLInputElement).value;
  const password = (document.getElementById("loginPassword") as HTMLInputElement).value;  

  await signInWithEmailAndPassword(importedAuth, email, password);

  console.log("User Logged In");
});



import { addDoc, collection, doc } from "firebase/firestore";

addTaskBtn.addEventListener("click", async () => {
  const task = (document.getElementById("taskInput") as HTMLInputElement).value;

  await addDoc(collection(db, "tasks"), {
    title: task,
    userId: importedAuth.currentUser?.uid
  });

  console.log("Task Added");

});



logoutBtn.addEventListener("click", async () => {
  await signOut(importedAuth);
  console.log("User Logged Out");
});



// FIREBASE STORAGE

import { storage } from "./firebase.js";
import { ref, uploadBytes } from "firebase/storage";

const uploadBtn = document.getElementById("uploadBtn") as HTMLButtonElement;

uploadBtn.addEventListener("click", async() => {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;

  if(!fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];

const storageRef = ref(storage, "uploads/" + file.name + " " + Date() + "-");
  await uploadBytes(storageRef, file);

  console.log("file uploaded");
});


// SOCIAL LOGIN

import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";


const provider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("login") as HTMLButtonElement;

async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(importedAuth, provider);
    console.log("User info: ", result.user.email);
  } catch (error) {
    console.error(error);
  }
}

googleLoginBtn.addEventListener("click", loginWithGoogle);



