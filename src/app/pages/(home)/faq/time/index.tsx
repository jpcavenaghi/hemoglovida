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

const timeFaqData: FaqAccordionItem[] = [
  {
    question: 'Com que frequência posso doar sangue?',
    answer: 'Homens: até 4 vezes por ano; mulheres: até 3 vezes por ano.',
  },
  {
    question: 'Quanto tempo dura a doação?',
    answer: 'A coleta leva cerca de 6 a 10 minutos; o processo todo, até 1 hora.',
  },
  {
    question: 'Quanto sangue é retirado na doação?',
    answer: 'Cerca de 450 ml.',
  },
  {
    question: 'Quanto tempo leva para meu corpo repor o sangue doado?',
    answer: 'O volume é reposto em até 24 horas; células levam algumas semanas.',
  },
  {
    question: 'Posso doar sangue antes de uma viagem?',
    answer: 'Sim, desde que esteja saudável e não haja restrições no local de destino.',
  },
  {
    question: 'Posso doar sangue após uma vacina?',
    answer: 'Depende da vacina. Informe-se no local de doação.',
  },
  {
    question: 'Quanto tempo devo esperar entre uma doação e outra?',
    answer: '2 meses para homens e 3 meses para mulheres.',
  },
  {
    question: 'A doação de sangue afeta meu peso?',
    answer: 'Não, a doação não altera seu peso corporal.',
  },
  {
    question: 'Posso doar sangue no mesmo dia que fiz atividade física?',
    answer: 'É melhor evitar exercícios intensos no dia da doação.',
  },
  {
    question: 'É possível doar sangue durante a gravidez?',
    answer: 'Não. A gravidez e o período de amamentação são impeditivos temporários. É preciso aguardar de 90 a 180 dias após o parto, dependendo do tipo.',
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

export default function TimeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
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
          <Ionicons name="alarm-outline" size={48} className="text-red-600 mb-2" />
          <Text className="text-xl font-extrabold text-red-600 text-center">
            FREQUÊNCIA E TEMPO
          </Text>
        </View>

        {timeFaqData.map((item, index) => (
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