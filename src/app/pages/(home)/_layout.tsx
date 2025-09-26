import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E53935', // Cor do ícone ativo (vermelho)
        tabBarInactiveTintColor: '#8E8E93', // Cor do ícone inativo (cinza)
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Fundo da barra de navegação
        },
      }}
    >
      <Tabs.Screen
        name="homePage" // Corresponde ao arquivo homePage.tsx
        options={{
          title: 'HemogloVida', // Título que aparece no cabeçalho!
          tabBarLabel: 'Início', // Texto embaixo do ícone
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
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
        }}
      />
      <Tabs.Screen
        name="formDonatePage" 
        options={{
          title: 'Formulário de Doação', 
          tabBarLabel: 'Formulário',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} /> 
          ),
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
        }}
      />
    </Tabs>
  );
}