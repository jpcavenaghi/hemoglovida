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

const restrictionsFaqData: FaqAccordionItem[] = [
  {
    question: 'Doar sangue dói?',
    answer: 'Pode haver leve desconforto no momento da punção.',
  },
  {
    question: 'Posso sentir fraqueza após doar?',
    answer: 'É possível sentir fraqueza leve, mas é temporária.',
  },
  {
    question: 'Quais os riscos da doação de sangue?',
    answer: 'Os riscos são mínimos e pouco frequentes.',
  },
  {
    question: 'Posso doar se tiver pressão alta?',
    answer: 'Pode doar se a pressão arterial estiver controlada.',
  },
  {
    question: 'A doação de sangue pode causar anemia?',
    answer: 'A doação não causa anemia.',
  },
  {
    question: 'Posso doar se estiver com alguma alergia?',
    answer: 'Alergias leves, em geral, não impedem a doação.',
  },
  {
    question: 'Posso doar sangue se tiver diabetes?',
    answer: 'Diabéticos que não usam insulina podem doar.',
  },
  {
    question: 'Quais cuidados devo ter depois de doar?',
    answer: 'Após doar, descanse, hidrate-se e evite esforço físico.',
  },
  {
    question: 'Posso doar sangue se tiver tatuagem recente?',
    answer: 'Após tatuagem, é necessário aguardar de 6 a 12 meses.',
  },
  {
    question: 'O que acontece se eu me sentir mal durante a doação?',
    answer: 'Em caso de mal-estar, a equipe prestará assistência imediata.',
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

export default function RestrictionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      {/* Header (Idêntico) */}
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
          <Ionicons name="medkit-outline" size={48} className="text-red-600 mb-2" />
          <Text className="text-xl font-extrabold text-red-600 text-center">
            SAÚDE E RESTRIÇÕES
          </Text>
        </View>

        {restrictionsFaqData.map((item, index) => (
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