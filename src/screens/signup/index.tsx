import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase/config";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Cria o documento do usuário no Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
      });
-
      Alert.alert(
        "Sucesso!",
        "Sua conta foi criada. Faça o login para continuar."
      );

      router.push('/pages/(auth)/signinPage');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Erro", "Este e-mail já está cadastrado.");
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta. Verifique seu e-mail e tente novamente.");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <TouchableOpacity onPress={() => router.back()} className="mt-12 mb-6 self-start">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold">Cadastre-se</Text>
        <Text className="text-lg text-gray-500 mb-8">
          Um gesto simples. Um impacto imenso.
        </Text>

        <Text className="text-base font-semibold mb-2">Email:</Text>
        <TextInput
          className="bg-gray-100 rounded-md py-4 px-3 mb-4 text-base"
          placeholder="Seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-base font-semibold mb-2">Senha:</Text>
        <View className="flex-row items-center bg-gray-100 rounded-md mb-4 px-3">
          <TextInput
            className="flex-1 py-4 text-base"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="gray" />
          </TouchableOpacity>
        </View>

        <Text className="text-base font-semibold mb-2">Confirmar senha:</Text>
        <View className="flex-row items-center bg-gray-100 rounded-md mb-8 px-3">
          <TextInput
            className="flex-1 py-4 text-base"
            placeholder="Confirme sua senha"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="bg-red-600 py-4 rounded-full mb-8"
        >
          <Text className="text-white text-lg text-center font-bold">Cadastrar-se</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 text-base mb-10">
          Já tem uma conta?{' '}
          <Text
            className="text-red-500 font-semibold"
            onPress={() => router.push('/pages/(auth)/signinPage')}
          >
            Faça Login
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}