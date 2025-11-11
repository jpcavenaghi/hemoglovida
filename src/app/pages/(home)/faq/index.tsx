import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

type FaqItem = {
    id: number;
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    path: string;
};

const faqItems: FaqItem[] = [
    {
        id: 1,
        title: 'Requisitos para Doação',
        icon: 'document-text-outline',
        path: '/pages/(home)/faq/requirements'
    },
    {
        id: 2,
        title: 'Frequência e Tempo',
        icon: 'time-outline',
        path: '/pages/(home)/faq/time'
    },
    {
        id: 3,
        title: 'Instruções Gerais',
        icon: 'help-circle-outline',
        path: '/pages/(home)/faq/doubt'
    },
    {
        id: 4,
        title: 'Saúde e Restrições',
        icon: 'medkit-outline',
        path: '/pages/(home)/faq/restrictions'
    },
];

type FaqCardProps = {
    item: FaqItem;
    onPress: (path: string) => void;
};

const FaqCard: React.FC<FaqCardProps> = ({ item, onPress }) => (
    <TouchableOpacity
        onPress={() => onPress(item.path)}
        className="
      w-[48%] bg-white rounded-lg shadow-sm 
      p-4 mb-4 items-center justify-center min-h-[150px]
    "
    >
        <Ionicons name={item.icon} size={40} className="text-red-600 mb-3" />
        <Text className="text-base font-semibold text-gray-800 text-center">
            {item.title}
        </Text>
    </TouchableOpacity>
);

const CustomHeader = ({ title }: { title: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('../../../../../assets/images/icon2.png')}
      style={{ width: 24, height: 24, marginRight: 8 }}
      resizeMode="contain"
    />
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4B5563' }}>
      {title}
    </Text>
  </View>
);

export default function FaqScreen() {
    const router = useRouter();

    const handleCardPress = (path: string) => {
        console.log('Navegando para:', path);
        router.push(path as any);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="dark-content" backgroundColor="#f3f6f6" />
            
            <Stack.Screen
              options={{
                headerShown: true, 
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#fff' },
                headerTitle: () => <CustomHeader title="FAQ" />,
              }}
            />

            <ScrollView className="p-6">

                <Text className="text-2xl font-extrabold text-red-600 mb-2">
                    PERGUNTAS FREQUENTES
                </Text>

                <Text className="text-base text-gray-600 mb-8 leading-6">
                    Tire suas dúvidas e entenda tudo sobre o processo de doação de sangue.
                </Text>

                <View className="flex-row flex-wrap justify-between">
                    {faqItems.map((item) => (
                        <FaqCard
                            key={item.id}
                            item={item}
                            onPress={handleCardPress}
                        />
                    ))}
                </View>

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