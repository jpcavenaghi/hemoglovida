import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function VerificationScreen() {
  const [code, setCode] = useState(["", "", "", ""]);

  const handlePressNumber = (num: string) => {
    const newCode = [...code];
    const index = newCode.findIndex((c) => c === "");
    if (index !== -1) {
      newCode[index] = num;
      setCode(newCode);
    }
  };

  const handleDelete = () => {
    const newCode = [...code];
    const lastIndex = newCode.slice().reverse().findIndex((c) => c !== "");
    if (lastIndex !== -1) {
      const indexToClear = newCode.length - 1 - lastIndex;
      newCode[indexToClear] = "";
      setCode(newCode);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-10 justify-between">
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-center">
          Email de Verificação
        </Text>
        <Text className="text-center mt-2 text-lg text-gray-600">
          Confere lá na sua caixa de entrada 😊
        </Text>

        {/* Inputs do código */}
        <View className="flex-row justify-center gap-2 mt-10 space-x-6">
          {code.map((digit, index) => (
            <View
              key={index}
              className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center ${
                digit ? "border-primaryRed" : "border-gray-400"
              }`}
            >
              <Text className="text-2xl font-bold">{digit}</Text>
            </View>
          ))}
        </View>

        {/* Texto de ajuda */}
        <Text className="text-center text-gray-500 mt-6 text-base">
          Sem sinal do e-mail? A gente te ajuda!
        </Text>
        <TouchableOpacity>
          <Text className="text-center text-primaryRed mt-1 text-base font-semibold">
            Reenviar o email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão confirmar */}
      <TouchableOpacity className="bg-primaryRed py-4 rounded-full mt-8">
        <Text className="text-white text-center text-lg font-bold">
          Confirmar
        </Text>
      </TouchableOpacity>

      {/* Teclado numérico */}
      <View className="mt-8">
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          [".", "0", "del"],
        ].map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-around my-3">
            {row.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() =>
                  item === "del" ? handleDelete() : handlePressNumber(item)
                }
                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <Text className="text-2xl font-bold">
                  {item === "del" ? "⌫" : item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
