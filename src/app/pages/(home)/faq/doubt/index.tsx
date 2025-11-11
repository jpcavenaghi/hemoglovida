import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const generalDoubtsData: string[] = [
  'Ter entre 16 e 69 anos (menores de 18 com autorização e maiores de 60 só se já tiverem doado antes dos 60).',
  'Pesar no mínimo 50 kg.',
  'Estar em boas condições de saúde.',
  'Estar descansado (mínimo de 5 horas de sono na noite anterior).',
  'Estar alimentado, evitando alimentos gordurosos nas 4 horas anteriores.',
  'Apresentar documento oficial com foto (RG, CNH, Passaporte etc.).',
  'Não estar em jejum.',
  'Não ter ingerido bebidas alcoólicas nas últimas 12 horas.',
  'Não fumar até 2 horas antes e 2 horas após a doação.',
  'Não estar gripado ou com febre no momento da doação.',
  'Não ter feito tatuagem, piercing ou micropigmentação nos últimos 6 a 12 meses.',
  'Não ter realizado endoscopia ou colonoscopia nos últimos 6 meses.',
  'Não estar grávida ou em período de amamentação (até 12 meses após o parto).',
  'Não ter feito cirurgia de grande porte nos últimos 6 meses.',
  'Não ter tido hepatite após os 11 anos de idade.',
  'Não ter comportamento de risco para doenças transmissíveis pelo sangue.',
  'Não usar drogas injetáveis.',
  'Aguardar 30 dias após vacinação recente (dependendo do tipo da vacina).',
  'Intervalo entre doações:\nHomens: mínimo de 2 meses (até 4 vezes ao ano)\nMulheres: mínimo de 3 meses (até 3 vezes ao ano)',
  'Aguardar 30 dias após sintomas de COVID-19 (ou conforme orientação médica).'
];

type ListItemProps = {
  text: string;
};

const DoubtListItem: React.FC<ListItemProps> = ({ text }) => (
  <View className="bg-white rounded-lg shadow-sm p-4 flex-row items-start mb-2">
    <Ionicons name="ellipse" size={14} className="text-red-500 mr-3 mt-1" />
    <Text className="flex-1 text-base text-gray-700 leading-6">{text}</Text>
  </View>
);

export default function DoubtScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      <Stack.Screen 
        options={{
          headerShown: true, 
          headerTitle: '', 
          headerStyle: { backgroundColor: '#fff' }, 
          headerShadowVisible: false, 

          headerLeft: () => ( 
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <Ionicons name="arrow-back-outline" size={24} color="#E33D3D" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-zinc-800 ml-2">
                FAQ
              </Text>
            </View>
          ),
        }} 
      />

      <ScrollView className="p-6"> 
        <View className="items-center mb-8">
          <Ionicons name="help-circle-outline" size={48} className="text-red-600 mb-2" />
          <Text className="text-xl font-extrabold text-red-600 text-center">
            DÚVIDAS GERAIS
          </Text>
        </View>
        {generalDoubtsData.map((item, index) => (
          <DoubtListItem key={index} text={item} />
        ))}

        <View 
          className="
            mt-8 items-center pt-5 pb-2.5 
          "
        >
          <Ionicons name="heart" className="text-red-600 text-3xl mb-2" />
          <Text className="text-sm text-gray-600 text-center leading-5">
            Uma doação pode salvar até 4 vidas. Faça parte dessa corrente de solidariedade!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}