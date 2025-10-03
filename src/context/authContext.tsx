import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config'; // Confirme se o caminho para sua config do Firebase está correto

// Define o formato dos dados que esperamos do Firestore
interface UserData extends DocumentData {
  nome: string;
  idade: number;
  tipoSanguineo: string;
  cidade: string;
  sexo: string;
  email: string;
}

// Define o que o nosso contexto irá fornecer
interface AuthContextType {
  user: User | null; 
  userData: UserData | null; 
  isLoading: boolean; 
}

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
});

// componente "Provedor" que vai envolver nosso app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged é o "ouvinte" do Firebase. Ele roda sempre que o status de login/logout muda.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); 

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        } else {
          console.log("Documento do usuário não encontrado no Firestore!");
          setUserData(null);
        }
      } else {
        // Se não houver usuário logado (logout), limpa os dados
        setUserData(null);
      }
      setIsLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};