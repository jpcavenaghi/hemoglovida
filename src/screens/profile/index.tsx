import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from "firebase/auth";
import { auth } from '../../services/firebase/config';
import { useAuth } from '../../context/authContext';

type StatusInfo = {
    status: 'Apto para Doar' | 'Inapto Temporariamente' | 'Inapto Cronicamente' | 'Triagem não realizada';
    icon: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
    bgColor: string;
};

const chronicKeys = ['doencasInfecciosas', 'usoDrogasIlicitas', 'doencasGraves'];
const temporaryKeys = [
    'gripeResfriado', 'gravidezAmamentacao', 'tatuagemMaquiagem', 'tratamentoDentario',
    'cirurgias', 'endoscopia', 'vacinas', 'medicamentos', 'transfusao',
    'parceirosSexuais', 'drogasNaoInjetaveis', 'bebidaAlcoolica', 'viagem'
];

const getDonorStatus = (formData: Record<string, any>): StatusInfo => {
    if (!formData || Object.keys(formData).length === 0) {
        return { status: 'Triagem não realizada', icon: 'help-circle-outline', color: 'text-gray-800', bgColor: 'bg-gray-200' };
    }
    for (const key of chronicKeys) {
        if (formData[key] === 'sim') {
            return { status: 'Inapto Cronicamente', icon: 'close-circle', color: 'text-red-800', bgColor: 'bg-red-200' };
        }
    }
    for (const key of temporaryKeys) {
        if (formData[key] === 'sim') {
            return { status: 'Inapto Temporariamente', icon: 'alert-circle', color: 'text-yellow-800', bgColor: 'bg-yellow-200' };
        }
    }
    return { status: 'Apto para Doar', icon: 'checkmark-circle', color: 'text-green-800', bgColor: 'bg-green-200' };
};

export default function ProfileScreen() {
    const router = useRouter();
    const { userData, isLoading } = useAuth();

    const donorStatus = getDonorStatus(userData?.respostasFormulario || {});

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
                    <View className={`p-4 rounded-lg flex-row items-center ${donorStatus.bgColor}`}>
                        <Ionicons name={donorStatus.icon} size={28} className={donorStatus.color} />
                        <Text className={`text-base font-bold ml-3 ${donorStatus.color}`}>{donorStatus.status}</Text>
                    </View>
                </View>

                <View className="mb-8">
                    <Text className="text-lg font-bold text-red-600 mb-2">Informações Pessoais</Text>
                    <View className="bg-white rounded-lg p-4">
                        <InfoRow icon="person-outline" label="Nome Completo" value={userData.nome} />
                        <InfoRow icon="water-outline" label="Tipo Sanguíneo" value={userData.tipoSanguineo} />
                        <InfoRow icon="location-outline" label="Cidade" value={userData.cidade} />
                        <InfoRow icon="transgender-outline" label="Sexo" value={userData.sexo} />
                        <InfoRow icon="calendar-outline" label="Idade" value={`${userData.idade} anos`} isLast />
                    </View>
                </View>
                
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

// Componente auxiliar para as linhas de informação, para não repetir código
const InfoRow = ({ icon, label, value, isLast = false }: { icon: React.ComponentProps<typeof Ionicons>['name'], label: string, value: string | number, isLast?: boolean }) => (
    <TouchableOpacity className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
        <Ionicons name={icon} size={22} color="#6B7280" />
        <View className="flex-1 ml-4">
            <Text className="text-sm text-gray-500">{label}</Text>
            <Text className="text-base font-semibold text-gray-800">{value}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
    </TouchableOpacity>
);