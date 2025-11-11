// Arquivo: src/app/pages/(home)/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';
import { LocaleConfig } from 'react-native-calendars'; 

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

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
        name="faq" 
        options={{
          title: 'Perguntas Frequentes',
          tabBarLabel: 'Faq',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
          headerTitle: () => <CustomHeader title="FAQ" />,
          headerShown: false,
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