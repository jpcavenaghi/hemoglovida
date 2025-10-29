import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';

interface UserData extends DocumentData {
  nome: string;
  idade: number;
  tipoSanguineo: string;
  cidade: string;
  sexo: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

// Cria o contexto com um valor padrão
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
    if (!uid) {
      setUserData(null);
      return;
    }
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as UserData);
      } else {
        console.log("Documento do usuário não encontrado no Firestore!");
        setUserData(null);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário no context:", error);
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
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

// Hook (não muda)
export const useAuth = () => {
  return useContext(AuthContext);
};