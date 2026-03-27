import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/firebase";
import {signOut as firebaseSignOut} from "@firebase/auth";

export const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
}

export const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
}

export const logout = async () => {
    await firebaseSignOut(auth)
}