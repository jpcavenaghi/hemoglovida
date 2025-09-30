import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


type Question = {
  key: string;
  text: string;
  info?: string;
};

type FormStep = {
  step: number;
  title: string;
  questions: Question[];
};


const formSteps = [
  {
    step: 1,
    title: 'Impedimentos Crônicos',
    questions: [
      {
        key: 'doencasInfecciosas',
        text: 'Você tem ou já teve alguma doença infecciosa transmissível pelo sangue?',
        info: 'Isso inclui HIV, AIDS, Hepatites B e C, Doença de Chagas, Malária, HTS, IST, entre outras.'
      },
      {
        key: 'usoDrogasIlicitas',
        text: 'Você já fez uso de drogas ilícitas injetáveis alguma vez na vida?',
        info: 'Qualquer uso de drogas ilícitas injetáveis é um impedimento definitivo para a doação.'
      },
      {
        key: 'doencasGraves',
        text: 'Você tem ou já teve alguma doença grave?',
        info: 'Isso inclui doenças cardíacas, renais, pulmonares, hepáticas, autoimunes, hipertireoidismo ou câncer.'
      }
    ]
  },
  {
    step: 2,
    title: 'Impedimentos Temporários (Saúde)',
    questions: [
      {
        key: 'gripeResfriado',
        text: 'Nos últimos dias, você teve gripe, resfriado ou febre?',
        info: 'É necessário aguardar 7 dias após o desaparecimento completo dos sintomas.'
      },
      {
        key: 'alergiaDiarreia',
        text: 'Você está passando por alguma crise de alergia, pressão alta ou diarreia?',
        info: 'É preciso estar com a saúde estável no dia da doação.'
      },
      {
        key: 'gravidezAmamentacao',
        text: 'Você está grávida, em período pós-parto ou amamentando?',
        info: 'Prazos: Parto Normal (90 dias), Cesariana (180 dias), Amamentação (12 meses após o parto).'
      },
      {
        key: 'tatuagemMaquiagem',
        text: 'Você fez tatuagem, maquiagem definitiva ou piercing recentemente?',
        info: 'É necessário aguardar um período que pode variar dependendo do procedimento e das condições sanitárias do local.'
      },
      {
        key: 'tratamentoDentario',
        text: 'Você passou por algum procedimento odontológico recentemente?',
        info: 'Procedimentos como tratamento de canal podem exigir um tempo de espera de algumas semanas.'
      }
    ]
  },
  {
    step: 3,
    title: 'Impedimentos Temporários (Procedimentos)',
    questions: [
      {
        key: 'cirurgias',
        text: 'Você passou por alguma cirurgia nos últimos meses?',
        info: 'O tempo de espera pode variar de 3 meses a 1 ano, dependendo do tipo de cirurgia.'
      },
      {
        key: 'endoscopia',
        text: 'Você fez endoscopia ou colonoscopia recentemente?',
        info: 'É necessário aguardar 6 meses após o procedimento.'
      },
      {
        key: 'vacinas',
        text: 'Você tomou alguma vacina nas últimas semanas?',
        info: 'O tempo de espera varia de 2 dias a 4 semanas, dependendo da vacina.'
      },
      {
        key: 'medicamentos',
        text: 'Você está fazendo uso de algum medicamento, como antibióticos?',
        info: 'O uso de certos medicamentos pode impedir a doação temporariamente.'
      },
      {
        key: 'transfusao',
        text: 'Você recebeu transfusão de sangue no último ano?',
        info: 'É necessário aguardar 12 meses após receber uma transfusão.'
      }
    ]
  },
  {
    step: 4,
    title: 'Impedimentos Temporários (Hábitos)',
    questions: [
      {
        key: 'parceirosSexuais',
        text: 'No último ano, você teve mais de um parceiro(a) sexual?',
        info: 'Para a segurança da doação, o Ministério da Saúde recomenda no máximo 1 parceiro no intervalo de um ano.'
      },
      {
        key: 'drogasNaoInjetaveis',
        text: 'Você fez uso de drogas ilícitas não injetáveis recentemente?',
        info: 'O tempo de espera pode variar de dias a 1 ano.'
      },
      {
        key: 'bebidaAlcoolica',
        text: 'Você consumiu bebida alcoólica nas últimas 12 horas?',
        info: 'É necessário estar sóbrio e bem hidratado para a doação.'
      },
      {
        key: 'viagem',
        text: 'Você viajou para alguma área endêmica de doenças (como malária) recentemente?',
        info: 'Viagens para certas regiões podem exigir um período de espera antes de poder doar.'
      }
    ]
  },
];

const TOTAL_STEPS = formSteps.length;

// Barra de Progresso
const ProgressBar = ({ currentStep }: { currentStep: number }) => (
    <View className="flex-row justify-between items-center w-full">
        <View className="flex-row gap-2 flex-1">
            {formSteps.map((stepInfo) => (
                <View
                    key={stepInfo.step}
                    className={`h-2 flex-1 rounded-full ${currentStep >= stepInfo.step ? 'bg-red-600' : 'bg-gray-300'}`}
                />
            ))}
        </View>
        <Text className="text-gray-500 font-semibold ml-4">
            Passo {currentStep} de {TOTAL_STEPS}
        </Text>
    </View>
);

export default function FormDonate() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, 'sim' | 'nao'>>({});
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [modalInfoText, setModalInfoText] = useState('');

    const handleAnswer = (questionKey: string, answer: 'sim' | 'nao') => {
        setFormData((prevData) => ({
            ...prevData,
            [questionKey]: answer,
        }));
    };

    const openInfoModal = (infoText: string) => {
        setModalInfoText(infoText);
        setInfoModalVisible(true);
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Formulário finalizado!', formData);
        }
    };
    
    const handleBackOrExit = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const currentStepData = formSteps.find((step) => step.step === currentStep);

    return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Modal de Informação */}
      <Modal
        transparent={true}
        visible={isInfoModalVisible}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <Pressable onPress={() => setInfoModalVisible(false)} className="flex-1 justify-center items-center bg-black/50 p-8">
          <View className="bg-white rounded-lg p-6 w-full">
            <Text className="text-lg font-bold mb-4">Informação Adicional</Text>
            <Text className="text-base text-gray-700">{modalInfoText}</Text>
            <TouchableOpacity onPress={() => setInfoModalVisible(false)} className="bg-red-600 rounded-full py-3 mt-6">
              <Text className="text-white text-center font-bold">Entendi</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Container Principal */}
      <View className="p-6 flex-1">
        <ProgressBar currentStep={currentStep} />
        
        <View className="mt-8">
          <Text className="text-3xl font-extrabold text-gray-800">
            {currentStepData?.title}
          </Text>
        </View>

        {/* Área de Rolagem com as Perguntas */}
        <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
            <View className="gap-6 pb-4"> 
              {currentStepData?.questions.map((question) => (
                <View key={question.key}>
                  <View className="flex-row items-center mb-3">
                    <Text className="text-base font-semibold text-gray-700 flex-1">{question.text}</Text>
                    {question.info && (
                      <TouchableOpacity onPress={() => openInfoModal(question.info!)} className="ml-2">
                        <Ionicons name="information-circle-outline" size={26} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="flex-row gap-4">
                    <TouchableOpacity 
                      onPress={() => handleAnswer(question.key, 'sim')}
                      className={`flex-1 py-3 rounded-full border ${formData[question.key] === 'sim' ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'}`}
                    >
                      <Text className={`text-center font-bold ${formData[question.key] === 'sim' ? 'text-white' : 'text-gray-700'}`}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleAnswer(question.key, 'nao')}
                      className={`flex-1 py-3 rounded-full border ${formData[question.key] === 'nao' ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'}`}
                    >
                      <Text className={`text-center font-bold ${formData[question.key] === 'nao' ? 'text-white' : 'text-gray-700'}`}>Não</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
        </ScrollView>

        <View className="flex-row gap-4 pt-4">
          <TouchableOpacity onPress={handleBackOrExit} className="flex-1 border border-gray-300 py-4 rounded-full items-center justify-center">
            <Text className="text-gray-700 font-bold text-base">Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} className="flex-1 bg-red-600 py-4 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-base">
              {currentStep === TOTAL_STEPS ? 'Finalizar' : 'Próximo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}