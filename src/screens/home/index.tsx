import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
// Apenas importando o Ionicons agora
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const router = useRouter();

    // Dados de exemplo que viriam de uma API ou estado
    const impacto = {
        vidasSalvas: 4,
        tempo: 15,
        diasEntreDoacoes: 60,
    };

    const campanhas = [
        {
            id: 1,
            // Ícone ajustado para Ionicons
            icon: 'medical-outline',
            title: 'Hemocentro Campinas',
            description: 'Estoque crítico O-',
        },
        {
            id: 2,
            icon: 'medkit-outline',
            title: 'Unidade Móvel - Itapira',
            description: 'Coletando qualquer tipo sanguíneo',
        },
    ] as const;

    return (
        <ScrollView className="flex-1 bg-gray-50">
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
                        {/* Card Vidas */}
                        <View className="flex-1 bg-red-100 p-4 rounded-xl items-center">
                            <Ionicons name="people-outline" size={24} color="#DC2626" />
                            <Text className="text-red-700 font-bold mt-2 text-center">{impacto.vidasSalvas} vidas salvas</Text>
                        </View>
                        {/* Card Tempo */}
                        <View className="flex-1 bg-red-100 p-4 rounded-xl items-center ">
                            <Ionicons name="time-outline" size={24} color="#DC2626" />
                            <Text className="text-red-700 font-bold mt-2 text-center">{impacto.tempo} min do seu tempo</Text>
                        </View>
                        {/* Card Dias */}
                        <View className="flex-1 bg-red-100 p-4 rounded-xl items-center">
                            <Ionicons name="calendar-outline" size={24} color="#DC2626" />
                            <Text className="text-red-700 font-bold mt-2 text-center">{impacto.diasEntreDoacoes} dias entre doações</Text>
                        </View>
                    </View>
                </View>

                {/* SEÇÃO DE CAMPANHAS */}
                <View className="mt-8">
                    <Text className="text-xl font-bold text-gray-800 mb-4">Campanhas ativas!</Text>
                    <View className="gap-4">
                        {campanhas.map((campanha) => (
                            <TouchableOpacity key={campanha.id} className="bg-white p-4 rounded-xl flex-row items-center shadow-sm">
                                <View className="bg-red-100 p-3 rounded-lg mr-4">
                                    <Ionicons name={campanha.icon} size={24} color="#DC2626" />
                                </View>
                                <View>
                                    <Text className="font-bold text-base text-gray-800">{campanha.title}</Text>
                                    <Text className="text-sm text-gray-500">{campanha.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}