import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Estrutura de dados para as etapas do formulário
const formSteps = [
  {
    step: 1,
    title: 'Informações Pessoais',
    questions: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Pergunta 4', 'Pergunta 5'],
  },
  {
    step: 2,
    title: 'Doenças e Condições',
    questions: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Pergunta 4', 'Pergunta 5'],
  },
  {
    step: 3,
    title: 'Consumos e Hábitos',
    questions: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Pergunta 4', 'Pergunta 5'],
  },
  {
    step: 4,
    title: 'Condições Temporárias',
    questions: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Pergunta 4', 'Pergunta 5'],
  },
  {
    step: 5,
    title: 'Condições Permanentes',
    questions: ['Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Pergunta 4', 'Pergunta 5'],
  },
];

const TOTAL_STEPS = formSteps.length;

// Componente da Barra de Progresso
const ProgressBar = ({ currentStep }: { currentStep: number }) => (
  <View className="flex-row justify-between items-center w-full">
    <View className="flex-row gap-2">
      {formSteps.map((stepInfo) => (
        <View
          key={stepInfo.step}
          className={`h-2 flex-1 rounded-full ${
            currentStep >= stepInfo.step ? 'bg-red-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </View>
    <Text className="text-gray-500 font-semibold ml-4">
      Step {currentStep} of {TOTAL_STEPS}
    </Text>
  </View>
);

export default function FormDonate() {
 const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Formulário finalizado!');
      // Ação de finalização
    }
  };

  const handlePrevious = () => {
    // Esta função será usada pela nova lógica do botão
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // NOVA FUNÇÃO PARA O BOTÃO ESQUERDO
  const handleBackOrExit = () => {
    if (currentStep > 1) {
      handlePrevious(); // Se não for a primeira etapa, apenas volta uma etapa
    } else {
      router.back(); // Se for a primeira etapa, volta para a tela anterior (Home)
    }
  };

  const currentStepData = formSteps.find((step) => step.step === currentStep);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-6 flex-1">
        <ProgressBar currentStep={currentStep} />

        <View className="mt-8">
          <Text className="text-3xl font-extrabold text-gray-800">
            {currentStepData?.title}
          </Text>

          <View className="mt-6 gap-5">
            {currentStepData?.questions.map((question, index) => (
              <View key={index}>
                <Text className="text-base font-semibold text-gray-600 mb-2">
                  {question}
                </Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Sua resposta"
                />
              </View>
            ))}
          </View>
        </View>

        <View className="flex-1" />

        {/* BOTÕES DE NAVEGAÇÃO ATUALIZADOS */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handleBackOrExit} // <-- Usa a nova função
            className="flex-1 border border-gray-300 py-4 rounded-full items-center justify-center"
          >
            <Text className="text-gray-700 font-bold text-base">Voltar</Text> 
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 bg-red-600 py-4 rounded-full items-center justify-center"
          >
            <Text className="text-white font-bold text-base">
              {currentStep === TOTAL_STEPS ? 'Finalizar' : 'Próximo'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* O BOTÃO DE VOLTAR AVULSO FOI REMOVIDO DAQUI */}
      </View>
    </SafeAreaView>
  );
}