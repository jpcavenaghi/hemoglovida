import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars'; 
import { useRouter } from 'expo-router'; 

import { db } from '../../services/firebase/config'; 
import { collection, addDoc, doc, updateDoc, onSnapshot, getDocs, query } from 'firebase/firestore'; 

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// --- Interfaces ---
interface Hemocentro {
  id: string;
  nome: string;
}

interface Appointment {
  id?: string; 
  local: string;
  data: string;
  hora: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Concluído'; 
  hemocentroId: string; 
  patientName: string; 
  userId: string;
}

interface AppointmentStatusCardProps {
  appointment: Appointment;
  onCancel: () => void;
  onNewAppointment: () => void; 
  onGoHome: () => void; 
}

interface InfoRowProps {
  icon: IconName;
  label: string;
  value: string;
  isLast?: boolean;
}

const AVAILABLE_TIMES = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00'];

// --- COMPONENTE DO CARD ---
const AppointmentStatusCard: React.FC<AppointmentStatusCardProps> = ({ appointment, onCancel, onNewAppointment, onGoHome }) => {
  const getStatusInfo = (): { icon: IconName; color: string; bg: string; title: string } => {
    switch (appointment.status) {
      case 'Concluído': 
        return { icon: 'ribbon', color: 'text-blue-700', bg: 'bg-blue-100', title: 'Doação Realizada!' };
      case 'Confirmado': 
        return { icon: 'checkmark-circle', color: 'text-green-600', bg: 'bg-green-100', title: 'Confirmado' };
      case 'Cancelado': 
        return { icon: 'close-circle', color: 'text-red-600', bg: 'bg-red-100', title: 'Cancelado' };
      case 'Pendente': 
      default: 
        return { icon: 'time-outline', color: 'text-yellow-600', bg: 'bg-yellow-100', title: 'Pendente' };
    }
  };
  const statusInfo = getStatusInfo(); 

  const formatDate = (dateString: string) => {
    if(!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <View className="p-6 flex-1 justify-center">
      <Text className="text-2xl font-extrabold text-red-600 mb-6 text-center">
        {appointment.status === 'Concluído' ? 'Parabéns!' : 'Seu Agendamento'}
      </Text>
      <View className={`p-6 rounded-xl flex-row items-center justify-center ${statusInfo.bg} mb-8 shadow-sm`}>
        <Ionicons name={statusInfo.icon} size={32} className={statusInfo.color} />
        <Text className={`text-xl font-bold ml-3 ${statusInfo.color}`}>{statusInfo.title}</Text>
      </View>
      {appointment.status === 'Concluído' && (
        <Text className="text-center text-gray-600 mb-8 px-4">
          Obrigado por sua doação! Seu gesto salvou vidas. 
          Seu período de intervalo já começou a contar.
        </Text>
      )}
      <View className="bg-white rounded-lg p-4 shadow-sm mb-8">
        <InfoRow icon="business-outline" label="Local" value={appointment.local} />
        <InfoRow icon="calendar-outline" label="Data" value={formatDate(appointment.data)} />
        {appointment.status !== 'Concluído' && (
           <InfoRow icon="time-outline" label="Hora" value={appointment.hora} isLast />
        )}
      </View>
      
      {(appointment.status === 'Confirmado' || appointment.status === 'Pendente') && (
        <TouchableOpacity onPress={onCancel} className="bg-red-600 py-4 rounded-full flex-row items-center justify-center shadow-md">
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">Cancelar Agendamento</Text>
        </TouchableOpacity>
      )}
      {appointment.status === 'Cancelado' && (
        <TouchableOpacity onPress={onNewAppointment} className="bg-blue-600 py-4 rounded-full flex-row items-center justify-center shadow-md">
          <Ionicons name="calendar-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">Fazer Novo Agendamento</Text>
        </TouchableOpacity>
      )}
      {appointment.status === 'Concluído' && (
        <TouchableOpacity onPress={onGoHome} className="bg-gray-800 py-4 rounded-full flex-row items-center justify-center shadow-md">
          <Ionicons name="home-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">Voltar ao Início</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, isLast = false }) => (
  <View className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <Ionicons name={icon} size={22} color="#6B7280" />
    <View className="flex-1 ml-4">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-base font-semibold text-gray-800">{value}</Text>
    </View>
  </View>
);

// --- COMPONENTE PRINCIPAL ---
export default function AppointmentsScreen() {
  const router = useRouter(); 
  const { userData, isLoading: isAuthLoading } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localAppointment, setLocalAppointment] = useState<Appointment | null>(null);

  const [hemocentrosList, setHemocentrosList] = useState<Hemocentro[]>([]);
  const [isLoadingHemocentros, setIsLoadingHemocentros] = useState(true);

  const [selectedHemocentro, setSelectedHemocentro] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showHemocentroModal, setShowHemocentroModal] = useState(false);

  // --- VERIFICAÇÕES DE STATUS ---
  const hasCompletedForm = userData && userData.tipoSanguineo && userData.status;
  const isChronicUnfit = userData?.status === 'Inapto Cronicamente';
  const isTemporaryUnfit = userData?.status === 'Inapto Temporariamente';

  // --- BUSCAR HEMOCENTROS ---
  useEffect(() => {
    const fetchHemocentros = async () => {
      try {
        const q = query(collection(db, 'hemocentros'));
        const querySnapshot = await getDocs(q);
        
        const list: Hemocentro[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.nome) {
            list.push({ id: doc.id, nome: data.nome });
          }
        });
        
        setHemocentrosList(list);
        if (list.length > 0 && !selectedHemocentro) {
           setSelectedHemocentro(list[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar hemocentros:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de locais.");
      } finally {
        setIsLoadingHemocentros(false);
      }
    };

    fetchHemocentros();
  }, []);

  const getToday = () => new Date().toISOString().split('T')[0];
  const getThreeMonthsFromNow = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  };

  const markedDates = useMemo(() => {
    if (!selectedDate) return {};
    return { [selectedDate]: { selected: true, selectedColor: '#E53935' } };
  }, [selectedDate]);

  // --- EFEITOS DE AGENDAMENTO ---
  useEffect(() => {
    if (userData?.appointment) {
      setLocalAppointment(userData.appointment as Appointment);
    }
  }, [userData]);

  useEffect(() => {
    if (!localAppointment || !localAppointment.id) return;

    const appointmentRef = doc(db, 'appointments', localAppointment.id);
    const unsubscribe = onSnapshot(appointmentRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedData = docSnap.data() as Appointment;
        if (updatedData.status !== localAppointment.status) {
          setLocalAppointment(prev => ({ ...prev!, status: updatedData.status }));
        }
      }
    });
    return () => unsubscribe();
  }, [localAppointment?.id]);


  const handleSaveAppointment = async () => {
    if (!selectedHemocentro || !selectedDate || !selectedTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const hemocentroObj = hemocentrosList.find(h => h.id === selectedHemocentro);
      const hemocentroNome = hemocentroObj?.nome || 'Local desconhecido';
      
      const newAppointment: Omit<Appointment, 'id'> = {
        local: hemocentroNome,
        hemocentroId: selectedHemocentro,
        data: selectedDate,
        hora: selectedTime,
        status: 'Pendente',
        patientName: userData?.nome || 'Usuário App',
        userId: userData?.uid || 'anonimo',
      };

      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      const appointmentWithId = { ...newAppointment, id: docRef.id };

      if (userData?.uid) {
        await updateDoc(doc(db, 'users', userData.uid), {
          appointment: appointmentWithId
        });
      }

      setLocalAppointment(appointmentWithId); 
      Alert.alert("Sucesso!", "Seu agendamento foi enviado.");
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancelar Agendamento",
      "Tem certeza que deseja cancelar seu agendamento?",
      [
        { text: "Ficar", style: "cancel" },
        { 
          text: "Cancelar", 
          style: "destructive", 
          onPress: async () => {
            try {
              if (localAppointment?.id) {
                 await updateDoc(doc(db, 'appointments', localAppointment.id), {
                   status: 'Cancelado'
                 });
              } else if (userData?.uid) {
                 await updateDoc(doc(db, 'users', userData.uid), {
                   'appointment.status': 'Cancelado'
                 });
                 setLocalAppointment(prev => prev ? ({ ...prev, status: 'Cancelado' }) : null);
              }
              Alert.alert("Cancelado", "Agendamento cancelado.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível cancelar.");
            }
          } 
        }
      ]
    );
  };

  const handleResetScreen = () => {
    setLocalAppointment(null); 
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleGoHome = () => {
    router.replace('/pages/(home)/homePage');
  };

  const selectedHemocentroName = hemocentrosList.find(h => h.id === selectedHemocentro)?.nome || 'Selecione o Hemocentro...';

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // 1. Loading
  if (isAuthLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  // 2. Agendamento Existente (Mostra o Card)
  if (localAppointment) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <AppointmentStatusCard 
          appointment={localAppointment}
          onCancel={handleCancelAppointment}
          onNewAppointment={handleResetScreen}
          onGoHome={handleGoHome} 
        />
      </SafeAreaView>
    );
  }

  // 3. BLOQUEIO: Inapto Cronicamente
  if (isChronicUnfit) {
    return (
        <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center p-6">
            <View className="bg-white p-8 rounded-2xl shadow-sm w-full items-center">
                <View className="bg-red-100 p-4 rounded-full mb-6">
                    <Ionicons name="close-circle" size={48} color="#DC2626" />
                </View>
                <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                    Inapto para Doação
                </Text>
                <Text className="text-gray-500 text-center mb-8 leading-6">
                    De acordo com as informações fornecidas, você possui um impedimento crônico para doação de sangue. Agradecemos seu interesse em ajudar!
                </Text>
                <TouchableOpacity 
                    onPress={handleGoHome}
                    className="bg-gray-800 w-full py-4 rounded-full flex-row items-center justify-center shadow-md"
                >
                    <Text className="text-white font-bold text-base">Voltar ao Início</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
  }

  // 4. BLOQUEIO: Inapto Temporariamente (Ex: Acabou de doar ou Formulario)
  if (isTemporaryUnfit) {
      return (
          <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center p-6">
              <View className="bg-white p-8 rounded-2xl shadow-sm w-full items-center">
                  <View className="bg-blue-100 p-4 rounded-full mb-6">
                      <Ionicons name="time-outline" size={48} color="#1E40AF" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                      Aguarde o Intervalo
                  </Text>
                  <Text className="text-gray-500 text-center mb-8 leading-6">
                      Você possui um impedimento temporário (ex: doação recente ou condição de saúde). Consulte seu perfil para saber quando poderá doar novamente.
                  </Text>
                  <TouchableOpacity 
                      onPress={() => router.push('/pages/(home)/profilePage')}
                      className="bg-blue-600 w-full py-4 rounded-full flex-row items-center justify-center shadow-md"
                  >
                      <Text className="text-white font-bold text-base">Ver Perfil</Text>
                  </TouchableOpacity>
              </View>
          </SafeAreaView>
      );
  }

  // 5. BLOQUEIO: Formulário Não Preenchido
  if (!hasCompletedForm) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center p-6">
        <View className="bg-white p-8 rounded-2xl shadow-sm w-full items-center">
            <View className="bg-red-100 p-4 rounded-full mb-6">
                <Ionicons name="clipboard-outline" size={48} color="#DC2626" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                Formulário Necessário
            </Text>
            <Text className="text-gray-500 text-center mb-8 leading-6">
                Para realizar um agendamento, precisamos conhecer um pouco mais sobre você. Por favor, preencha o formulário de doação.
            </Text>
            <TouchableOpacity 
                onPress={() => router.push('/pages/(home)/formDonatePage')}
                className="bg-red-600 w-full py-4 rounded-full flex-row items-center justify-center shadow-md"
            >
                <Text className="text-white font-bold text-base">Preencher Agora</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 8}} />
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 6. TELA NORMAL DE AGENDAMENTO (Se passou por tudo acima)
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="p-6">
          <Text className="text-2xl font-extrabold text-red-600 mb-6">Agendar Doação</Text>

          {/* SELETOR DE HEMOCENTROS */}
          <View className="bg-white rounded-lg shadow-sm mb-6 p-2">
            <Text className="text-sm font-bold text-gray-600 ml-2 mb-1">Escolha o Hemocentro</Text>
            {isLoadingHemocentros ? (
               <View className="p-4 items-center">
                  <ActivityIndicator size="small" color="#E53935" />
                  <Text className="text-xs text-gray-400 mt-2">Carregando locais...</Text>
               </View>
            ) : (
              <>
                {Platform.OS === 'ios' ? (
                  <>
                    <TouchableOpacity 
                      onPress={() => setShowHemocentroModal(true)}
                      className="p-3 bg-gray-50 rounded-md border border-gray-200 flex-row justify-between items-center"
                    >
                      <Text className="text-base text-gray-800" numberOfLines={1}>{selectedHemocentroName}</Text>
                      <Ionicons name="chevron-down" size={20} color="gray" />
                    </TouchableOpacity>
                    <Modal
                      visible={showHemocentroModal}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setShowHemocentroModal(false)}
                    >
                      <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white w-full pb-8 rounded-t-2xl">
                          <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-gray-100 rounded-t-2xl">
                            <Text className="text-gray-500 font-medium">Selecione</Text>
                            <TouchableOpacity onPress={() => setShowHemocentroModal(false)}>
                              <Text className="text-blue-600 font-bold text-lg">Pronto</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ height: 200, width: '100%', justifyContent: 'center' }}>
                            <Picker
                              selectedValue={selectedHemocentro}
                              onValueChange={(itemValue) => setSelectedHemocentro(itemValue)}
                              style={{ height: 200 }}
                              itemStyle={{ color: 'black', fontSize: 18 }}
                            >
                              {hemocentrosList.map(hc => (
                                <Picker.Item key={hc.id} label={hc.nome} value={hc.id} color="black" />
                              ))}
                            </Picker>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </>
                ) : (
                  <Picker
                    selectedValue={selectedHemocentro}
                    onValueChange={(itemValue) => setSelectedHemocentro(itemValue)}
                  >
                    {hemocentrosList.length === 0 && <Picker.Item label="Nenhum local disponível" value="" />}
                    {hemocentrosList.map(hc => (
                      <Picker.Item key={hc.id} label={hc.nome} value={hc.id} />
                    ))}
                  </Picker>
                )}
              </>
            )}
          </View>
          
          <View className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setSelectedTime('');
              }}
              markedDates={markedDates}
              minDate={getToday()}
              maxDate={getThreeMonthsFromNow()}
              theme={{
                todayTextColor: '#E53935',
                arrowColor: '#E53935',
              }}
            />
          </View>

          {selectedDate && (
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-4">Escolha um horário:</Text>
              <View className="flex-row flex-wrap gap-2">
                {AVAILABLE_TIMES.map(time => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    className={`
                      py-3 px-4 rounded-lg border-2
                      ${selectedTime === time ? 'bg-red-600 border-red-600' : 'bg-white border-gray-200'}
                    `}
                  >
                    <Text className={selectedTime === time ? 'text-white font-bold' : 'text-gray-700'}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSaveAppointment}
            disabled={!selectedHemocentro || !selectedDate || !selectedTime || isSubmitting}
            className={`
              py-4 rounded-full flex-row items-center justify-center mt-8 mb-6
              ${(!selectedHemocentro || !selectedDate || !selectedTime || isSubmitting) ? 'bg-gray-400' : 'bg-red-600'}
            `}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">Salvar Agendamento</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}