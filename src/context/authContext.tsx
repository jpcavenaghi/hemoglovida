import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';

interface UserData extends DocumentData {
  nome: string;
  idade: number;
  tipoSanguineo: string;
  cidade: string;
  sexo: string;
  email: string;
  doacoes?: number;
  vidasSalvas?: number;
  proximaDoacao?: string;
  ultimaDoacao?: string;
  appointment?: {
    id?: string;
    status: string;
    data: string;
    hora: string;
    local: string;
    hemocentroId: string;
  };
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
  refreshUserData: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    if (!uid) return;
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as UserData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados (fetch manual):", error);
    }
  };

  useEffect(() => {
    let unsubscribeFirestore = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setUserData(data);
          } else {
            console.log("Documento do usuário não encontrado!");
            setUserData(null);
          }
          setIsLoading(false)
        }, (error) => {
          console.error("Erro no listener do Firestore:", error);
          setIsLoading(false);
        });

      } else {
        setUserData(null);
        setIsLoading(false);
        unsubscribeFirestore();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, isLoading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};