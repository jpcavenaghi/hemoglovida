import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from "firebase/auth";
import { auth, db } from '../../services/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';

type StatusInfo = {
  status: 'Apto para Doar' | 'Inapto Temporariamente' | 'Inapto Cronicamente' | 'Triagem não realizada';
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bgColor: string;
  message?: string; 
};

const chronicKeys = ['doencasInfecciosas', 'usoDrogasIlicitas', 'doencasGraves'];
const temporaryKeys = [
  'gripeResfriado', 'gravidezAmamentacao', 'tatuagemMaquiagem', 'tratamentoDentario',
  'cirurgias', 'endoscopia', 'vacinas', 'medicamentos', 'transfusao',
  'parceirosSexuais', 'drogasNaoInjetaveis', 'bebidaAlcoolica', 'viagem'
];

const getDonorStatus = (userData: any): StatusInfo => {
  const formData = userData || {};

  // 1. Checar Inaptidão Crônica
  for (const key of chronicKeys) {
    if (formData[key] === 'sim') {
      return { status: 'Inapto Cronicamente', icon: 'close-circle', color: 'text-red-800', bgColor: 'bg-red-200' };
    }
  }

  // 2. Checar Inaptidão Temporária (Formulário)
  for (const key of temporaryKeys) {
    if (formData[key] === 'sim') {
      return { status: 'Inapto Temporariamente', icon: 'alert-circle', color: 'text-yellow-800', bgColor: 'bg-yellow-200' };
    }
  }

  // 3. Checar Intervalo de Doação (Data)
  if (userData.proximaDoacao) {
    const today = new Date();
    const nextDate = new Date(userData.proximaDoacao);
    
    today.setHours(0,0,0,0);
    if (today < nextDate) {
      const dateParts = userData.proximaDoacao.split('-');
      const dateStr = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      
      return { 
        status: 'Inapto Temporariamente', 
        icon: 'time', 
        color: 'text-blue-800', 
        bgColor: 'bg-blue-200',
        message: `Aguarde até ${dateStr}`
      };
    }
  }

  // 4. Se não tem dados suficientes
  if (!formData || Object.keys(formData).length <= 6) {
     return { status: 'Triagem não realizada', icon: 'help-circle-outline', color: 'text-gray-800', bgColor: 'bg-gray-200' };
  }

  // 5. Tudo OK
  return { status: 'Apto para Doar', icon: 'checkmark-circle', color: 'text-green-800', bgColor: 'bg-green-200' };
};


// --- COMPONENTE PRINCIPAL ---
export default function ProfileScreen() {
  const router = useRouter();
  const { userData, isLoading } = useAuth();

  const donorStatus = getDonorStatus(userData || {});

  useEffect(() => {
    const syncStatusWithFirebase = async () => {
      if (userData && userData.uid) {
        if (donorStatus.status !== userData.status) {
          console.log(`Sincronizando status: ${userData.status} -> ${donorStatus.status}`);
          
          try {
            const userRef = doc(db, "users", userData.uid);
            await updateDoc(userRef, {
              status: donorStatus.status
            });
          } catch (error) {
            console.error("Erro ao sincronizar status automaticamente:", error);
          }
        }
      }
    };

    syncStatusWithFirebase();
  }, [userData, donorStatus.status]); 


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/pages/(auth)/signinPage'); 
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }
  
  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text>Usuário não encontrado.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-3xl font-extrabold text-red-600 mb-6">Meu Perfil</Text>

        <View className="mb-8">
          <Text className="text-lg font-bold text-red-600 mb-2">Status de Doador</Text>
          <View className={`p-4 rounded-lg ${donorStatus.bgColor}`}>
            <View className="flex-row items-center">
                <Ionicons name={donorStatus.icon} size={28} className={donorStatus.color} />
                <Text className={`text-base font-bold ml-3 ${donorStatus.color}`}>{donorStatus.status}</Text>
            </View>
            {donorStatus.message && (
                <Text className={`text-sm mt-2 ml-10 font-medium ${donorStatus.color}`}>
                    {donorStatus.message}
                </Text>
            )}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-red-600 mb-2">Informações Pessoais</Text>
          <View className="bg-white rounded-lg p-4">
            <InfoRow icon="person-outline" label="Nome Completo" value={userData.nome} />
            <InfoRow icon="water-outline" label="Tipo Sanguíneo" value={userData.tipoSanguineo} />
            <InfoRow icon="location-outline" label="Cidade" value={userData.cidade} />
            <InfoRow icon="transgender-outline" label="Sexo" value={userData.sexo} />
            <InfoRow icon="calendar-outline" label="Idade" value={`${userData.idade} anos`} isLast />
          </View>
        </View>
        
        {/* Seção "Alterar Dados" */}
        <View className="mb-8">
            <TouchableOpacity 
                onPress={() => router.push('/pages/(home)/formDonatePage')}
                className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center justify-between shadow-sm"
            >
                <View className="flex-1 mr-4">
                    <Text className="text-sm font-bold text-gray-800">Quer alterar alguma informação?</Text>
                    <Text className="text-xs text-gray-500 mt-1">Preencha o formulário novamente.</Text>
                </View>
                <View className="bg-gray-100 p-2 rounded-full">
                    <Ionicons name="create-outline" size={20} color="#4B5563" />
                </View>
            </TouchableOpacity>
        </View>

        {/* Botão Sair */}
        <View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white border border-red-200 py-4 rounded-full flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={22} color="#E53935" />
            <Text className="text-red-600 font-bold text-base ml-2">Sair</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value, isLast = false }: { icon: React.ComponentProps<typeof Ionicons>['name'], label: string, value: string | number, isLast?: boolean }) => (
  <View className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <Ionicons name={icon} size={22} color="#6B7280" />
    <View className="flex-1 ml-4">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-base font-semibold text-gray-800">{value}</Text>
    </View>
  </View>
);