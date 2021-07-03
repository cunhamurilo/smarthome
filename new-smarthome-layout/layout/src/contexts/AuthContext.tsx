import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

import ProfileImg from '../assets/images/profile_placeholder.png';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<string>;
  signInWithEmailAndPassword: (email: string, password:string) => Promise<string>;
  logout: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect( () => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        let { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
            // throw new Error('Missing information from auth.');
            displayName = "User wihtout name"
            photoURL = ProfileImg
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })

        localStorage.setItem('logged', 'true');
      }
    })
    
    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const resp = await auth.signInWithPopup(provider)
    .then((result) => {

      if (result.user) {
        const { displayName, photoURL, uid } = result.user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
        return "Logged"
      }})
      .catch((error) => {
        // var errorCode = error.code;
        var errorMessage = error.message;
        return errorMessage;
      });
      return resp
  }

  async function signInWithEmailAndPassword(email:string, password:string) {
    const resp = auth.signInWithEmailAndPassword(email, password)
    .then((result) => {
      if (result.user) {
        let { displayName, photoURL, uid } = result.user
    
        if (!displayName || !photoURL) {
          // throw new Error('Missing information from Google Account.');
          displayName = "User"
          photoURL = ProfileImg
        }
        
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
        return "Logged"
      }
    })
    .catch((error) => {
      // var errorCode = error.code;
      var errorMessage = error.message;
      return errorMessage;
    });
    return resp
  }

  async function logout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
  
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmailAndPassword, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}