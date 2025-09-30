// Arquivo: src/app/pages/(home)/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

// 1. CRIAMOS UM COMPONENTE REUTILIZÁVEL PARA O CABEÇALHO
const CustomHeader = ({ title }: { title: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('../../../../assets/images/icon2.png')}
      style={{ width: 24, height: 24, marginRight: 8 }}
      resizeMode="contain"
    />
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4B5563' }}>
      {title}
    </Text>
  </View>
);

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="homePage"
        options={{
          title: 'HemogloVida',
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: () => <CustomHeader title="HemogloVida" />,
        }}
      />
      <Tabs.Screen
        name="faqPage"
        options={{
          title: 'Perguntas Frequentes',
          tabBarLabel: 'Faq',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
          headerTitle: () => <CustomHeader title="FAQ" />,
        }}
      />
      <Tabs.Screen
        name="appointmentsPage"
        options={{
          title: 'Agendamentos',
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          headerTitle: () => <CustomHeader title="Agendamentos" />,
        }}
      />
      <Tabs.Screen
        name="formDonatePage"
        options={{
          title: 'Formulário de Doação',
          tabBarLabel: 'Doar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          headerTitle: () => <CustomHeader title="Doação" />,
        }}
      />
      <Tabs.Screen
        name="profilePage"
        options={{
          title: 'Meu Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: () => <CustomHeader title="Meu Perfil" />,
        }}
      />
    </Tabs>
  );
}