import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Hemocentro {
  id: string;
  nome: string;
}

interface Appointment {
  local: string;
  data: string;
  hora: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
}

interface AppointmentStatusCardProps {
  appointment: Appointment;
  onCancel: () => void;
}

interface InfoRowProps {
  icon: IconName;
  label: string;
  value: string;
  isLast?: boolean;
}

const HEMOCENTROS: Hemocentro[] = [ 
  { id: 'hc-campinas', nome: 'Hemocentro Campinas (Unicamp)' },
  { id: 'hc-itapira', nome: 'Hemocentro Itapira (Unidade Móvel)' },
  { id: 'hc-sumare', nome: 'Hemocentro Sumaré (Hospital Estadual)' },
];

const AVAILABLE_TIMES = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];

const AppointmentStatusCard: React.FC<AppointmentStatusCardProps> = ({ appointment, onCancel }) => {
  
  const getStatusInfo = (): { icon: IconName; color: string; bg: string } => {
    switch (appointment.status) {
      case 'Confirmado':
        return { icon: 'checkmark-circle', color: 'text-green-600', bg: 'bg-green-100' };
      case 'Cancelado':
        return { icon: 'close-circle', color: 'text-red-600', bg: 'bg-red-100' };
      case 'Pendente':
      default:
        return { icon: 'time-outline', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };
  const statusInfo = getStatusInfo(); 

  return (
    <View className="p-6">
      <Text className="text-2xl font-extrabold text-red-600 mb-6">Seu Agendamento</Text>
      <View className={`p-4 rounded-lg flex-row items-center ${statusInfo.bg} mb-6`}>
        <Ionicons name={statusInfo.icon} size={28} className={statusInfo.color} />
        <Text className={`text-base font-bold ml-3 ${statusInfo.color}`}>{appointment.status}</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm">
        <InfoRow icon="business-outline" label="Local" value={appointment.local} />
        <InfoRow icon="calendar-outline" label="Data" value={appointment.data} />
        <InfoRow icon="time-outline" label="Hora" value={appointment.hora} isLast />
      </View>

      {appointment.status !== 'Cancelado' && (
        <TouchableOpacity
          onPress={onCancel}
          className="bg-red-600 py-4 rounded-full flex-row items-center justify-center mt-8 shadow-md"
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">Cancelar Agendamento</Text>
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

export default function AppointmentsScreen() {
  const { userData, isLoading } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHemocentro, setSelectedHemocentro] = useState(HEMOCENTROS[0].id);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const getToday = () => new Date().toISOString().split('T')[0];
  const getThreeMonthsFromNow = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  };

  const markedDates = useMemo(() => {
    if (!selectedDate) return {};
    return {
      [selectedDate]: { selected: true, selectedColor: '#E53935' }
    };
  }, [selectedDate]);

  const handleSaveAppointment = async () => {
    if (!selectedHemocentro || !selectedDate || !selectedTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const hemocentroNome = HEMOCENTROS.find(h => h.id === selectedHemocentro)?.nome;
      const newAppointment: Appointment = {
        local: hemocentroNome || 'Local não encontrado',
        data: selectedDate,
        hora: selectedTime,
        status: 'Pendente'
      };

      console.log('Salvando:', newAppointment);
      Alert.alert("Sucesso!", "Seu agendamento foi salvo e está pendente de confirmação.");
      
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar seu agendamento.");
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
            console.log("Cancelando agendamento...");
          } 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  // MODO 1: Usuário JÁ TEM um agendamento
  if (userData?.appointment) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <AppointmentStatusCard 
          appointment={userData.appointment as Appointment}
          onCancel={handleCancelAppointment} 
        />
      </SafeAreaView>
    );
  }

  // MODO 2: Usuário NÃO TEM agendamento (mostrar formulário)
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="p-6">
          <Text className="text-2xl font-extrabold text-red-600 mb-6">Agendar Doação</Text>

          {/* 1. Seletor de Hemocentro */}
          <View className="bg-white rounded-lg shadow-sm mb-6 p-2">
            <Text className="text-sm font-bold text-gray-600 ml-2 mb-1">Escolha o Hemocentro</Text>
            <Picker
              selectedValue={selectedHemocentro}
              onValueChange={(itemValue) => setSelectedHemocentro(itemValue)}
            >
              {HEMOCENTROS.map(hc => (
                <Picker.Item key={hc.id} label={hc.nome} value={hc.id} />
              ))}
            </Picker>
          </View>
          
          {/* 2. Calendário */}
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

          {/* 3. Seletor de Horário */}
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

          {/* 4. Botão Salvar */}
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