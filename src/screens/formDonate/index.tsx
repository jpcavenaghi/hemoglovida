import React, { useState } from 'react';
// IMPORTS CORRIGIDOS: Adicionado Alert e ActivityIndicator
import { View, Text, TouchableOpacity, SafeAreaView, Modal, Pressable, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../context/authContext'; 

// ESTRUTURA DE DADOS 
type Question = {
  key: string;
  text: string;
  type: 'yes_no' | 'text' | 'select' | 'number';
  info?: string;
  placeholder?: string;
  options?: string[];
};

type FormStep = {
  step: number;
  title: string;
  description: string;
  questions: Question[];
};

const formSteps: FormStep[] = [
    {
        step: 1,
        title: 'Informações Pessoais',
        description: 'Para começar, precisamos de alguns dados básicos sobre você.',
        questions: [
          { key: 'nome', text: 'Nome Completo', type: 'text', placeholder: 'Digite seu nome completo' },
          { key: 'tipoSanguineo', text: 'Tipo Sanguíneo', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não sei'] },
          { key: 'cidade', text: 'Cidade de Residência', type: 'text', placeholder: 'Ex: São Paulo, SP' },
          { key: 'sexo', text: 'Sexo', type: 'select', options: ['Masculino', 'Feminino', 'Outro'] },
          { key: 'idade', text: 'Idade', type: 'number', placeholder: 'Digite sua idade' },
        ]
    },
    {
        step: 2,
        title: 'Impedimentos Crônicos',
        description: 'Responda com atenção. A sua segurança e a do receptor são nossa prioridade.',
        questions: [
          { key: 'doencasInfecciosas', text: 'Você tem ou já teve alguma doença infecciosa transmissível pelo sangue?', type: 'yes_no', info: 'Isso inclui HIV, AIDS, Hepatites B e C, Doença de Chagas, Malária, HTS, IST, entre outras.' },
          { key: 'usoDrogasIlicitas', text: 'Você já fez uso de drogas ilícitas injetáveis alguma vez na vida?', type: 'yes_no', info: 'Qualquer uso de drogas ilícitas injetáveis é um impedimento definitivo para a doação.' },
          { key: 'doencasGraves', text: 'Você tem ou já teve alguma doença grave?', type: 'yes_no', info: 'Isso inclui doenças cardíacas, renais, pulmonares, hepáticas, autoimunes, hipertireoidismo ou câncer.' }
        ]
    },
    {
        step: 3,
        title: 'Impedimentos Temporários (Saúde)',
        description: 'Estas são condições que podem te impedir de doar por um período determinado.',
        questions: [
          { key: 'gripeResfriado', text: 'Nos últimos dias, você teve gripe, resfriado ou febre?', type: 'yes_no', info: 'É necessário aguardar 7 dias após o desaparecimento completo dos sintomas.' },
          { key: 'gravidezAmamentacao', text: 'Você está grávida, em período pós-parto ou amamentando?', type: 'yes_no', info: 'Prazos: Parto Normal (90 dias), Cesariana (180 dias), Amamentação (12 meses após o parto).' },
          { key: 'tatuagemMaquiagem', text: 'Você fez tatuagem, maquiagem definitiva ou piercing recentemente?', type: 'yes_no', info: 'É necessário aguardar um período que pode variar dependendo do procedimento e das condições sanitárias do local.' },
          { key: 'tratamentoDentario', text: 'Você passou por algum procedimento odontológico recentemente?', type: 'yes_no', info: 'Procedimentos como tratamento de canal podem exigir um tempo de espera de algumas semanas.' }
        ]
    },
    {
        step: 4,
        title: 'Impedimentos Temporários (Procedimentos)',
        description: 'Certos procedimentos médicos recentes requerem um tempo de espera.',
        questions: [
            { key: 'cirurgias', text: 'Você passou por alguma cirurgia nos últimos meses?', type: 'yes_no', info: 'O tempo de espera pode variar de 3 meses a 1 ano, dependendo do tipo de cirurgia.' },
            { key: 'endoscopia', text: 'Você fez endoscopia ou colonoscopia recentemente?', type: 'yes_no', info: 'É necessário aguardar 6 meses após o procedimento.' },
            { key: 'vacinas', text: 'Você tomou alguma vacina nas últimas semanas?', type: 'yes_no', info: 'O tempo de espera varia de 2 dias a 4 semanas, dependendo da vacina.' },
            { key: 'medicamentos', text: 'Você está fazendo uso de algum medicamento, como antibióticos?', type: 'yes_no', info: 'O uso de certos medicamentos pode impedir a doação temporariamente.' },
            { key: 'transfusao', text: 'Você recebeu transfusão de sangue no último ano?', type: 'yes_no', info: 'É necessário aguardar 12 meses após receber uma transfusão.' }
        ]
    },
    {
        step: 5,
        title: 'Impedimentos Temporários (Hábitos)',
        description: 'Seus hábitos e estilo de vida também são importantes para a segurança da doação.',
        questions: [
            { key: 'parceirosSexuais', text: 'No último ano, você teve mais de um parceiro(a) sexual?', type: 'yes_no', info: 'Para a segurança da doação, o Ministério da Saúde recomenda no máximo 1 parceiro no intervalo de um ano.' },
            { key: 'drogasNaoInjetaveis', text: 'Você fez uso de drogas ilícitas não injetáveis recentemente?', type: 'yes_no', info: 'O tempo de espera pode variar de dias a 1 ano.' },
            { key: 'bebidaAlcoolica', text: 'Você consumiu bebida alcoólica nas últimas 12 horas?', type: 'yes_no', info: 'É necessário estar sóbrio e bem hidratado para a doação.' },
            { key: 'viagem', text: 'Você viajou para alguma área endêmica de doenças (como malária) recentemente?', type: 'yes_no', info: 'Viagens para certas regiões podem exigir um período de espera antes de poder doar.' }
        ]
    },
];

const TOTAL_STEPS = formSteps.length;

const ProgressBar = ({ currentStep }: { currentStep: number }) => (
    <View className="flex-row justify-between items-center w-full">
        <View className="flex-row gap-2 flex-1">
            {formSteps.map((stepInfo) => (<View key={stepInfo.step} className={`h-2 flex-1 rounded-full ${currentStep >= stepInfo.step ? 'bg-red-600' : 'bg-gray-300'}`} />))}
        </View>
        <Text className="text-gray-500 font-semibold ml-4">Passo {currentStep} de {TOTAL_STEPS}</Text>
    </View>
);

export default function DonateScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [modalInfoText, setModalInfoText] = useState('');
    const [isSelectModalVisible, setSelectModalVisible] = useState(false);
    const [selectOptions, setSelectOptions] = useState<string[]>([]);
    const [currentSelectKey, setCurrentSelectKey] = useState('');
    const [validationAlert, setValidationAlert] = useState({ isVisible: false, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDataChange = (questionKey: string, value: any) => {
        setFormData((prevData) => ({ ...prevData, [questionKey]: value }));
    };

    const openInfoModal = (infoText: string) => {
        setModalInfoText(infoText);
        setInfoModalVisible(true);
    };

    const openSelectModal = (question: Question) => {
        setSelectOptions(question.options || []);
        setCurrentSelectKey(question.key);
        setSelectModalVisible(true);
    };

    const handleSelectOption = (option: string) => {
        handleDataChange(currentSelectKey, option);
        setSelectModalVisible(false);
    };

   
    const handleNext = async () => {
        const currentQuestions = formSteps.find(step => step.step === currentStep)?.questions;
        if (!currentQuestions) return;

        for (const question of currentQuestions) {
            if (!formData[question.key]) {
                setValidationAlert({ isVisible: true, message: 'Por favor, preencha todos os campos para continuar.' });
                return;
            }
        }

        if (currentStep === 1) {
            const age = parseInt(formData.idade, 10);
            if (isNaN(age) || age < 16 || age > 69) {
                setValidationAlert({ isVisible: true, message: 'A idade para doação deve ser entre 16 e 69 anos. Se você tem 16 ou 17, precisará da autorização dos responsáveis.' });
                return;
            }
        }

        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        } else {
            if (!user) {
                Alert.alert("Erro", "Você precisa estar logado para finalizar.");
                return;
            }

            setIsSubmitting(true);
            try {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    respostasFormulario: formData
                });
                Alert.alert("Sucesso!", "Suas respostas foram salvas. Verifique seu status no perfil.");
                router.push('/pages/(home)/profilePage');
            } catch (error) {
                console.error("Erro ao salvar respostas: ", error);
                Alert.alert("Erro", "Não foi possível salvar suas respostas. Tente novamente.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    
    const handleBackOrExit = () => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back();

    const currentStepData = formSteps.find((step) => step.step === currentStep);

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
           
            <Modal transparent visible={isInfoModalVisible} onRequestClose={() => setInfoModalVisible(false)}><Pressable onPress={() => setInfoModalVisible(false)} className="flex-1 justify-center items-center bg-black/50 p-8"><View className="bg-white rounded-lg p-6 w-full"><Text className="text-lg font-bold mb-4">Informação Adicional</Text><Text className="text-base text-gray-700">{modalInfoText}</Text><TouchableOpacity onPress={() => setInfoModalVisible(false)} className="bg-red-600 rounded-full py-3 mt-6"><Text className="text-white text-center font-bold">Entendi</Text></TouchableOpacity></View></Pressable></Modal>
            <Modal transparent visible={isSelectModalVisible} onRequestClose={() => setSelectModalVisible(false)}><Pressable onPress={() => setSelectModalVisible(false)} className="flex-1 justify-center items-center bg-black/50 p-8"><View className="bg-white rounded-lg p-6 w-full"><Text className="text-lg font-bold mb-4">Selecione uma opção</Text><ScrollView>{selectOptions.map((option, index) => (<TouchableOpacity key={index} onPress={() => handleSelectOption(option)} className="py-3 border-b border-gray-200"><Text className="text-base text-gray-800">{option}</Text></TouchableOpacity>))}</ScrollView></View></Pressable></Modal>
            <Modal transparent visible={validationAlert.isVisible} onRequestClose={() => setValidationAlert({ isVisible: false, message: '' })}><Pressable onPress={() => setValidationAlert({ isVisible: false, message: '' })} className="flex-1 justify-center items-center bg-black/50 p-8"><View className="bg-white rounded-lg p-6 w-full items-center"><Ionicons name="alert-circle-outline" size={40} color="#E53935" /><Text className="text-lg font-bold my-4 text-center">Atenção</Text><Text className="text-base text-gray-700 text-center">{validationAlert.message}</Text><TouchableOpacity onPress={() => setValidationAlert({ isVisible: false, message: '' })} className="bg-red-600 rounded-full py-3 mt-6 w-full"><Text className="text-white text-center font-bold">Entendi</Text></TouchableOpacity></View></Pressable></Modal>

            <View className="p-6 flex-1">
                <ProgressBar currentStep={currentStep} />
                <View className="mt-8"><Text className="text-3xl font-extrabold text-gray-800">{currentStepData?.title}</Text><Text className="text-base text-gray-500 mt-2">{currentStepData?.description}</Text></View>
                <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
                    <View className="gap-6 pb-4"> 
                        {currentStepData?.questions.map((question) => (
                            <View key={question.key}>
                                {question.type !== 'yes_no' && (<Text className="text-base font-semibold text-gray-700 mb-2">{question.text}</Text>)}
                                {question.type === 'text' && <TextInput className="bg-white border border-gray-300 rounded-lg p-3 text-base" placeholder={question.placeholder} value={formData[question.key] || ''} onChangeText={(text) => handleDataChange(question.key, text)} />}
                                {question.type === 'number' && <TextInput className="bg-white border border-gray-300 rounded-lg p-3 text-base" placeholder={question.placeholder} keyboardType="number-pad" value={formData[question.key] || ''} onChangeText={(text) => handleDataChange(question.key, text)} />}
                                {question.type === 'select' && (<TouchableOpacity onPress={() => openSelectModal(question)} className="bg-white border border-gray-300 rounded-lg p-3.5 flex-row justify-between items-center"><Text className={`text-base ${formData[question.key] ? 'text-gray-800' : 'text-gray-400'}`}>{formData[question.key] || `Selecione...`}</Text><Ionicons name="chevron-down" size={20} color="gray" /></TouchableOpacity>)}
                                {question.type === 'yes_no' && (<View><View className="flex-row items-center mb-3"><Text className="text-base font-semibold text-gray-700 flex-1">{question.text}</Text>{question.info && (<TouchableOpacity onPress={() => openInfoModal(question.info!)} className="ml-2"><Ionicons name="information-circle-outline" size={26} color="#6B7280" /></TouchableOpacity>)}</View><View className="flex-row gap-4"><TouchableOpacity onPress={() => handleDataChange(question.key, 'sim')} className={`flex-1 py-3 rounded-full border ${formData[question.key] === 'sim' ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'}`}><Text className={`text-center font-bold ${formData[question.key] === 'sim' ? 'text-white' : 'text-gray-700'}`}>Sim</Text></TouchableOpacity><TouchableOpacity onPress={() => handleDataChange(question.key, 'nao')} className={`flex-1 py-3 rounded-full border ${formData[question.key] === 'nao' ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'}`}><Text className={`text-center font-bold ${formData[question.key] === 'nao' ? 'text-white' : 'text-gray-700'}`}>Não</Text></TouchableOpacity></View></View>)}
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View className="flex-row gap-4 pt-4">
                    <TouchableOpacity onPress={handleBackOrExit} className="flex-1 border border-gray-300 py-4 rounded-full items-center justify-center"><Text className="text-gray-700 font-bold text-base">Voltar</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} className="flex-1 bg-red-600 py-4 rounded-full items-center justify-center" disabled={isSubmitting}>
                        {isSubmitting ? (<ActivityIndicator color="white" />) : (<Text className="text-white font-bold text-base">{currentStep === TOTAL_STEPS ? 'Finalizar' : 'Próximo'}</Text>)}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}