import type { AccountProfile } from "@/platform/logic/domain/account/merge-profile";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

export interface ProfileRepository {
  getByUid(uid: string): Promise<AccountProfile | null>;
  getByEmail(email: string): Promise<AccountProfile | null>;
  update(uid: string, patch: Partial<AccountProfile>): Promise<void>;
}

export class FirestoreProfileRepository implements ProfileRepository {
  async getByUid(uid: string): Promise<AccountProfile | null> {
    const ref = doc(firestore, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as AccountProfile;
  }

  async getByEmail(email: string): Promise<AccountProfile | null> {
    const col = collection(firestore, "users");
    const q = query(col, where("email", "==", email.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0]?.data();
    return data as AccountProfile;
  }

  async update(uid: string, patch: Partial<AccountProfile>): Promise<void> {
    const { setDoc } = await import("firebase/firestore");
    const ref = doc(firestore, "users", uid);
    await setDoc(ref, patch, { merge: true });
  }
}

export const profileRepository = new FirestoreProfileRepository();
