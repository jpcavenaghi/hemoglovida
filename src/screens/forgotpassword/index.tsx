import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const [selected, setSelected] = useState<"email" | "phone" | null>(null);

  return (
    <View className="flex-1 bg-white">
      {/* Conteúdo com scroll */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold">Esqueci a Senha</Text>
        <Text className="mt-3 text-gray-600 text-base leading-5">
          Tudo bem, isso acontece! Vamos te ajudar a recuperar o acesso.
        </Text>

        {/* Opção: Email */}
        <TouchableOpacity
          onPress={() => setSelected("email")}
          className={`flex-row items-center p-5 mt-10 rounded-xl border-2 ${
            selected === "email" ? "border-primaryRed bg-red-50" : "border-gray-300"
          }`}
        >
          <MaterialIcons
            name="email"
            size={30}
            color={selected === "email" ? "#E53935" : "#555"}
          />
          <View className="ml-5 flex-1">
            <Text className="font-bold text-lg">Email</Text>
            <Text className="text-gray-600 text-sm leading-5">
              Recupere sua senha pelo e-mail. É rápido e seguro!
            </Text>
          </View>
        </TouchableOpacity>

        {/* Opção: Telefone */}
        <TouchableOpacity
          onPress={() => setSelected("phone")}
          className={`flex-row items-center p-5 mt-6 rounded-xl border-2 ${
            selected === "phone" ? "border-primaryRed bg-red-50" : "border-gray-300"
          }`}
        >
          <Ionicons
            name="call"
            size={30}
            color={selected === "phone" ? "#E53935" : "#555"}
          />
          <View className="ml-5 flex-1">
            <Text className="font-bold text-lg">Telefone</Text>
            <Text className="text-gray-600 text-sm leading-5">
              Recupere sua senha com um código enviado para seu celular.
            </Text>
          </View>
        </TouchableOpacity>

         <TouchableOpacity
          disabled={!selected}
          className={`py-4 rounded-full mt-4 ${
            selected ? "bg-primaryRed" : "bg-gray-400"
          }`}
        >
          <Text className="text-white text-center text-lg font-bold">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
       
        {/* Barrinha fixa no rodapé */}
        <View className="h-1 bg-primaryRed w-16 self-center rounded-full mb-9" />
   
    </View>
  );
}
