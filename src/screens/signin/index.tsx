import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase/config";

export default function Signin() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Sucesso", "Login realizado!");
            router.push("./onboarding"); // ajuste para sua tela inicial
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <View className="flex-1 bg-background px-6 pt-8 justify-between">
            <View>
                <TouchableOpacity onPress={() => router.push('../')} className="mt-5 mb-6">
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>

                <Text className="text-2xl font-bold mb-1">Bem Vindo de Volta 👋</Text>
                <Text className="text-lg text-gray-500 mb-10">
                    Juntos pelo mesmo sangue, juntos pela vida.
                </Text>

                <Text className="text-base font-semibold mb-2">Email:</Text>
                <View className="flex-row items-center bg-gray-100 rounded-md mb-5 px-3">
                    <TextInput
                        className="flex-1 py-4 text-base"
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <Text className="text-base font-semibold mb-2">Senha:</Text>
                <View className="flex-row items-center bg-gray-100 rounded-md mb-3 px-3">
                    <TextInput
                        className="flex-1 py-4 text-base"
                        placeholder="Digite sua senha"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={22}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/pages/(auth)/forgotPassword')}
                    className="mb-8">
                    <Text className="text-red-500 text-base">Esqueceu a Senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-red-600 py-4 rounded-full mb-8">
                    <Text className="text-white text-lg text-center font-bold">Login</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-500 text-base mb-10">
                    Não tem uma conta?{' '}
                    <Text
                        className="text-red-500 font-semibold"
                        onPress={() => router.push('/pages/(auth)/signupPage')}
                    >
                        Cadastre-se
                    </Text>
                </Text>
            </View>

            <View className="flex-row items-center mb-8">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-3 text-gray-500 text-base">ou</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <View className="flex-row justify-between mb-10">
                <TouchableOpacity className="flex-row items-center border border-gray-300 px-4 py-4 rounded-lg w-[48%] justify-center">
                    <AntDesign name="google" size={22} color="black" />
                    <Text className="ml-2 text-base">Google</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center border border-gray-300 px-4 py-4 rounded-lg w-[48%] justify-center">
                    <AntDesign name="apple1" size={22} color="black" />
                    <Text className="ml-2 text-base">Apple</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-end items-center pb-4">
                <View className="w-1/3 h-2 mb-5 bg-red-600 rounded-full" />
            </View>
        </View>
    );
}
