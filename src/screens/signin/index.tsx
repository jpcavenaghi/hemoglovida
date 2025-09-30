import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
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
            router.push("/pages/(home)/homePage");
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <View className="flex-1 bg-background px-6 pt-8">
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
                    className="mb-8 self-start"> 
                    <Text className="text-red-500 text-base">Esqueceu a Senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-red-600 py-4 rounded-full mb-8">
                    <Text className="text-white text-lg text-center font-bold">Login</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-500 text-base">
                    Não tem uma conta?{' '}
                    <Text
                        className="text-red-500 font-semibold"
                        onPress={() => router.push('/pages/(auth)/signupPage')}
                    >
                        Cadastre-se
                    </Text>
                </Text>
            </View>
        </View>
    );
}