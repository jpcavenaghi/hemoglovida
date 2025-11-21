import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../services/firebase/config'; 
import { collection, onSnapshot, query, limit } from 'firebase/firestore';

interface Campaign {
  id: string;
  name: string;
  institution: string;
  location: string;
  reason: string;
  startDate: string;
  endDate: string;
  bloodTypes: string[];
}

export default function HomeScreen() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const impacto = {
    vidasSalvas: 4,
    tempo: 15,
    diasEntreDoacoes: 60,
  };

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'campaigns'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];
      setCampaigns(campaignsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}`;
  };

  return (
    <View className="flex-1 bg-gray-50"> 
      <ScrollView className="flex-1">
        <View className="bg-red-600 p-6 rounded-b-3xl items-center shadow-lg">
          <Text className="text-white text-2xl font-bold text-center">
            Seu Sangue Pode Salvar Vidas!
          </Text>
          <Text className="text-white text-sm text-center mt-2">
            Faça parte dessa corrente do bem e salve vidas!
          </Text>
          <TouchableOpacity className="bg-white py-3 px-10 rounded-full mt-6 shadow-md"
            onPress={() => router.push('/pages/(home)/formDonatePage')}>
            <Text className="text-red-600 font-bold text-base">Preencha o Formulário</Text>
          </TouchableOpacity>
        </View>

        <View className="p-6">
          {/* SEÇÃO DE IMPACTO */}
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Impacto da sua Doação!</Text>
            <View className="flex-row justify-between gap-3">
              <View className="flex-1 bg-red-100 p-4 rounded-xl items-center">
                <Ionicons name="people-outline" size={24} color="#DC2626" />
                <Text className="text-red-700 font-bold mt-2 text-center">{impacto.vidasSalvas} vidas salvas</Text>
              </View>
              <View className="flex-1 bg-red-100 p-4 rounded-xl items-center ">
                <Ionicons name="time-outline" size={24} color="#DC2626" />
                <Text className="text-red-700 font-bold mt-2 text-center">{impacto.tempo} min do seu tempo</Text>
              </View>
              <View className="flex-1 bg-red-100 p-4 rounded-xl items-center">
                <Ionicons name="calendar-outline" size={24} color="#DC2626" />
                <Text className="text-red-700 font-bold mt-2 text-center">{impacto.diasEntreDoacoes} dias entre doações</Text>
              </View>
            </View>
          </View>

          {/* SEÇÃO DE CAMPANHAS */}
          <View className="mt-8">
            <Text className="text-xl font-bold text-gray-800 mb-4">Campanhas ativas!</Text>
            
            {isLoading ? (
              <ActivityIndicator size="large" color="#E53935" />
            ) : campaigns.length === 0 ? (
              <View className="bg-white p-4 rounded-xl items-center">
                <Text className="text-gray-500">Nenhuma campanha ativa no momento.</Text>
              </View>
            ) : (
              <View className="gap-4">
                {campaigns.map((campanha) => (
                  <TouchableOpacity 
                    key={campanha.id} 
                    className="bg-white p-4 rounded-xl flex-row items-center shadow-sm"

                    onPress={() => setSelectedCampaign(campanha)}
                  >
                    <View className="bg-red-100 p-3 rounded-lg mr-4">
                      <Ionicons name="megaphone-outline" size={24} color="#DC2626" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-base text-gray-800" numberOfLines={1}>
                        {campanha.name}
                      </Text>
                      <Text className="text-sm text-gray-500" numberOfLines={1}>
                        {campanha.institution}
                      </Text>
                      {campanha.location && (
                        <Text className="text-xs text-gray-400 mt-1">{campanha.location}</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedCampaign !== null}
        onRequestClose={() => setSelectedCampaign(null)}
      >

        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          
          {/* Container do Modal */}
          <View className="bg-white w-full rounded-2xl shadow-xl overflow-hidden max-h-[80%]">
            
            {selectedCampaign && (
              <>
                {/* Cabeçalho do Modal */}
                <View className="bg-red-600 p-4 flex-row justify-between items-start">
                  <View className="flex-1 mr-2">
                    <Text className="text-white text-xl font-bold">
                      {selectedCampaign.name}
                    </Text>
                    <Text className="text-red-100 text-sm mt-1">
                      {selectedCampaign.institution}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setSelectedCampaign(null)}
                    className="bg-white/20 p-1 rounded-full"
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <ScrollView className="p-5">
                  
                  <View className="flex-row mb-6 gap-4">
                    <View className="flex-1 bg-gray-50 p-3 rounded-lg">
                      <Text className="text-xs text-gray-400 uppercase font-bold mb-1">Local</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={16} color="#DC2626" />
                        <Text className="text-sm font-medium text-gray-700 ml-1" numberOfLines={2}>
                          {selectedCampaign.location}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-1 bg-gray-50 p-3 rounded-lg">
                      <Text className="text-xs text-gray-400 uppercase font-bold mb-1">Período</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color="#DC2626" />
                        <Text className="text-sm font-medium text-gray-700 ml-1">
                          {formatDate(selectedCampaign.startDate)} até {formatDate(selectedCampaign.endDate)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mb-6">
                    <Text className="text-base font-bold text-gray-800 mb-3">
                      Tipos Necessários
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {selectedCampaign.bloodTypes && selectedCampaign.bloodTypes.length > 0 ? (
                        selectedCampaign.bloodTypes.map((type) => (
                          <View key={type} className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-full flex-row items-center">
                            <Ionicons name="water" size={12} color="#DC2626" />
                            <Text className="text-red-700 font-bold ml-1">{type}</Text>
                          </View>
                        ))
                      ) : (
                        <Text className="text-gray-500 italic text-sm">Todos os tipos.</Text>
                      )}
                    </View>
                  </View>

                  <View className="mb-6">
                    <Text className="text-base font-bold text-gray-800 mb-2">
                      Motivo da Campanha
                    </Text>
                    <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <Text className="text-gray-700 text-sm leading-5">
                        {selectedCampaign.reason || "Campanha de rotina para manutenção dos estoques."}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    className="bg-red-600 py-3 rounded-full flex-row items-center justify-center shadow-md mb-2"
                    onPress={() => {
                      setSelectedCampaign(null); // Fecha o modal
                      router.push('/pages/(home)/appointmentsPage'); // Vai para doação
                    }}
                  >
                    <Text className="text-white font-bold text-base">Quero Doar Agora!</Text>
                  </TouchableOpacity>

                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}