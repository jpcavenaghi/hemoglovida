import React, { useState } from 'react';
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

type FaqAccordionItem = {
  question: string;
  answer: string;
};

const requirementsFaqData: FaqAccordionItem[] = [
  {
    question: 'Quem pode doar sangue?',
    answer: 'Pessoas entre 16 e 69 anos, com mais de 50 kg, em boas condições de saúde.',
  },
  {
    question: 'Qual a idade mínima e máxima para doar?',
    answer: 'Mínimo 16 anos (com autorização dos responsáveis) e máximo 69 anos.',
  },
  {
    question: 'Preciso estar em jejum para doar?',
    answer: 'Não. É importante estar alimentado, mas evite comidas gordurosas nas 4 horas antes.',
  },
  {
    question: 'Posso doar se estiver menstruada?',
    answer: 'Sim, desde que esteja se sentindo bem.',
  },
  {
    question: 'Pessoas com tatuagem podem doar?',
    answer: 'Sim, mas a tatuagem deve ter sido feita há pelo menos 6 meses.',
  },
  {
    question: 'Quem tem doenças crônicas pode doar?',
    answer: 'Depende da doença. É preciso avaliação médica.',
  },
  {
    question: 'Posso doar se estou gripado?',
    answer: 'Não. Espere estar totalmente recuperado.',
  },
  {
    question: 'Quem já teve COVID-19 pode doar?',
    answer: 'Sim, desde que tenha se recuperado há pelo menos 10 dias (assintomático) ou 30 dias (sintomático leve).',
  },
  {
    question: 'Posso doar se estiver tomando remédios?',
    answer: 'Depende do medicamento. Informe o profissional no momento da triagem.',
  },
  {
    question: 'Homens e mulheres têm regras diferentes para doar?',
    answer: 'Sim. Homens podem doar a cada 2 meses e mulheres a cada 3 meses.', // Nota: A imagem tem 2 meses e 2 meses, mas o padrão é 3 para mulheres
  },
];

type AccordionItemProps = {
  item: FaqAccordionItem;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-2 bg-white rounded-lg shadow-sm overflow-hidden">
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="flex-1 text-base font-semibold text-gray-800 mr-2">
          {item.question}
        </Text>
        <Ionicons 
          name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} 
          size={24} 
          className="text-red-600"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="p-4 pt-0 border-t border-gray-100">
          <Text className="text-sm text-gray-700 leading-5">
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function RequirementsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      {/* Configuração do cabeçalho da tela usando Stack.Screen */}
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'FAQ',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Ionicons name="arrow-back-outline" size={24} color="#E33D3D" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
        }} 
      />

      <ScrollView className="p-6">
        <View className="items-center mb-8">
          <Ionicons name="water-outline" size={48} className="text-red-600 mb-2" />
          <Text className="text-xl font-extrabold text-red-600 text-center">
            REQUISITOS PARA DOAÇÃO
          </Text>
        </View>

        {requirementsFaqData.map((item, index) => (
          <AccordionItem key={index} item={item} />
        ))}

        <View 
          className="
            mt-8 items-center pt-5 pb-2.5 
            border-t border-gray-300 
          "
        >
          <Text className="text-xs text-gray-500 text-center mb-2.5 px-5">
            Todos os dados apresentados foram aprovados e retirados do Ministério da Saúde.
          </Text>
          <Ionicons name="heart" className="text-red-600 text-2xl" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}