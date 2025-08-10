import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-between bg-white px-6 pt-12 pb-10">

        {/* Nome e logo */}
        <View className="flex-row justify-center items-center">
          <Text className="text-3xl font-extrabold text-red-600 mr-2">Hemoglovida</Text>
          <Image
            source={require('@/assets/images/icon2.png')}
            className="h-8 w-8"
            resizeMode="contain"
            style={{ marginTop: 2 }}
          />
        </View>

        {/* Container conteúdo do meio*/}
        <View className="flex gap-10">

          <Image
            source={require('@/assets/images/onboarding.png')}
            className="w-60 h-60 self-center"
            resizeMode="contain"
          />

          {/* Textos */}
          <View className="items-center">
            <Text className="text-center text-xl font-bold text-black mt-8">
              Seu Gesto Pode Mudar o Mundo de Alguém
            </Text>

            <Text className="text-center text-gray-500 mt-3 px-4">
              Junte-se ao Hemoglovida e faça parte dessa corrente de solidariedade.
            </Text>
          </View>

          {/* Botões */}
          <View className="items-center">
            <TouchableOpacity
              className="bg-red-600 w-full py-3 mt-10 rounded-full"
              onPress={() => router.push('/pages/(auth)/signinPage')}
            >
              <Text className="text-center text-white font-bold text-base">LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 w-full py-3 mt-4 rounded-full"
            onPress={() => router.push('/pages/(auth)/signupPage')}
            >
              <Text className="text-center text-gray-700 font-bold text-base">CADASTRE – SE</Text>
            </TouchableOpacity>
          </View>

        </View>
        
        {/* Rodapé */}
        <View className="items-center">
          <Text className="text-gray-500 text-sm">explore</Text>
          <View className="w-16 h-1 bg-red-600 rounded-full mt-2" />
        </View>
      </View>
    </ScrollView >
  );
}
