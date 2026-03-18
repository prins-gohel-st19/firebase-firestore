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
const verification = document.getElementById(
  "verification",
) as HTMLButtonElement;


// SignUp 

signupBtn.addEventListener("click", async () => {
  const email = (document.getElementById("signupEmail") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("signupPassword") as HTMLInputElement
  ).value;

  const userCredential = await createUserWithEmailAndPassword(
    importedAuth,
    email,
    password,
  );

  const user = userCredential.user;

  console.log("Sending verification...");
  await sendEmailVerification(user);
  console.log("Verification triggered");

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    createdAt: new Date(),
  });
  console.log("User Created");
});


// Login 

loginBtn.addEventListener("click", async () => {
  const email = (document.getElementById("loginEmail") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("loginPassword") as HTMLInputElement
  ).value;

  if(! email || ! password){
    console.log("Enter the valid details. ");
    alert("Enter valid datails.");
    return;
  }

  await signInWithEmailAndPassword(importedAuth, email, password);

  console.log("User Logged In");
});

import { addDoc, collection, doc } from "firebase/firestore";


//Add Task

addTaskBtn.addEventListener("click", async () => {
  const task = (document.getElementById("taskInput") as HTMLInputElement).value;

  await addDoc(collection(db, "tasks"), {
    title: task,
    userId: importedAuth.currentUser?.uid,
  });

  console.log("Task Added");
});


//Logout

logoutBtn.addEventListener("click", async () => {
  await signOut(importedAuth);
  console.log("User Logged Out");
});

// FIREBASE STORAGE / Upload Files

import { storage } from "./firebase.js";
import { ref, uploadBytes } from "firebase/storage";

const uploadBtn = document.getElementById("uploadBtn") as HTMLButtonElement;

uploadBtn.addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;

  if (!fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];

  const storageRef = ref(storage, "uploads/" + file.name + " " + Date() + "-");

  const start = performance.now();

  await uploadBytes(storageRef, file);

  const end = performance.now();

  console.log(`Upload tooks ${(end - start).toFixed(2)} ms`);
  const MAX_SIZE = 5 * 1024;

  if(file.size > MAX_SIZE) {
    alert("File size should be under 5 KB");
    return;
  }

  console.log("file uploaded");
});

// SOCIAL LOGIN

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

// email verification with link, get link from the TERMIMNAL   

import { sendEmailVerification } from "firebase/auth";

verification.addEventListener("click", async () => {
  if (importedAuth.currentUser) {
    await importedAuth.currentUser.reload();
    console.log(importedAuth.currentUser.emailVerified);
  } else {
    console.log("verification failed.");
  }
});

// password reset

import { getAuth, sendPasswordResetEmail} from "firebase/auth";

const auth = importedAuth;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

resetBtn.addEventListener("click", async() => {
  const email = (document.getElementById("signupEmail") as HTMLInputElement).value;

  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
    console.log("check your email for pasword reset");
  } catch (error:any) {
    console.error("Error ending password reset: ",error);
    alert(error.message);
  }
});


// file downloads --> Generate temporary URLs

// import { getStorage, getDownloadURL } from "firebase/storage";

// const something = getStorage();
// const fileRef = ref(something, "uploads/first.html");

// getDownloadURL(fileRef).then((url) => {
//   window.open(url);
// });

// file deletion


