import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../services/firebase/config";

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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Enviar e-mail de verificação
      await sendEmailVerification(userCredential.user);

      Alert.alert(
        "Verifique seu e-mail",
        "Enviamos um link de verificação para o seu e-mail."
      );

      // Redireciona para a tela de verificação
      router.push('/pages/(auth)/emailVerification');

    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#f7f7f7' }}>
      <TouchableOpacity className='mt-5' onPress={() => router.push('../../')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Cadastre-se</Text>
      <Text style={{ color: '#777', marginBottom: 20 }}>
        Um gesto simples. Um impacto imenso.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Nome:</Text>
      <TextInput
        placeholder="Seu nome"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 10,
          marginBottom: 15
        }}
      />

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Email:</Text>
      <TextInput
        placeholder="Seu email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 10,
          marginBottom: 15
        }}
      />

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Senha:</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15
        }}
      >
        <TextInput
          placeholder="Sua senha"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={{ flex: 1, paddingVertical: 10 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Confirmar senha:</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 20
        }}
      >
        <TextInput
          placeholder="Confirme sua senha"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{ flex: 1, paddingVertical: 10 }}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: '#e53935',
          paddingVertical: 15,
          borderRadius: 30,
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cadastrar-se</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Já tem uma conta?{' '}
        <Text style={{ color: '#e53935', fontWeight: 'bold' }}
          onPress={() => router.push('/pages/(auth)/signinPage')}
        >Faça Login</Text>
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
        <Text style={{ marginHorizontal: 10, color: '#777' }}>ou</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 15,
            flex: 1,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FontAwesome name="google" size={20} color="#00000" style={{ marginRight: 8 }} />
          <Text>Cadastre-se com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 15,
            flex: 1,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FontAwesome name="apple" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text>Cadastre-se com Apple</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-end items-center pb-4">
        <View className="w-1/3 h-2 mb-2 bg-red-600 rounded-full" />
      </View>
    </ScrollView>
  );
}
