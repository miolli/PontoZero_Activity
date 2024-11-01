{
  /* 
  Edição para que o layout ocupe toda a tela do usuário e a função de rolagem da tela funcione   
  */

  /*  
      Fernando Rocha 
      Gabriel Nobre
      Higo FLorindo
      Vitor Magalh~ses
      Kauê Souza

  */
}

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  Vibration,
  ScrollView,
} from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';

export default function App() {
  const [placa, setPlaca] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('Compacto');
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(null);
  const [temporizadorAtivo, setTemporizadorAtivo] = useState(false);

  const valoresHora = {
    Compacto: 2.0,
    'Hatch/Sedan': 3.0,
    'SUV/Pickup': 5.0,
  };

  const validarPlaca = (texto) => {
    const textoFormatado = texto.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setPlaca(textoFormatado);
  };

  const calcularValorETempo = () => {
    const horasInt = parseInt(horas) || 0;
    const minutosInt = parseInt(minutos) || 0;

    if (horasInt > 24) {
      Alert.alert('Erro', 'O máximo permitido são 24 horas.');
      return;
    }
    if (minutosInt > 60) {
      Alert.alert('Erro', 'O máximo permitido são 60 minutos.');
      return;
    }

    const valorPorHora = valoresHora[tipoVeiculo];
    const valor = (horasInt + minutosInt / 60) * valorPorHora;
    setValorTotal(valor);

    const tempoEmSegundos = horasInt * 3600 + minutosInt * 60;
    setTempoRestante(tempoEmSegundos);
    setTemporizadorAtivo(true);
  };

  useEffect(() => {
    let intervalo = null;

    if (temporizadorAtivo && tempoRestante && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante((anterior) => {
          const novoTempo = anterior - 1;

          if (novoTempo === 900) {
            Alert.alert('Atenção', 'Faltam 15 minutos para o tempo expirar!');
          }

          if (novoTempo === 0) {
            Vibration.vibrate([500, 500, 500, 500, 500], true);
            clearInterval(intervalo);
            setTemporizadorAtivo(false);
          }

          return novoTempo;
        });
      }, 1000);
    }

    return () => clearInterval(intervalo);
  }, [temporizadorAtivo, tempoRestante]);

  const formatarTempo = (segundos) => {
    if (segundos === null || isNaN(segundos)) return '0h 0m 0s';
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://i.postimg.cc/qq5zj1Y4/Logo-Zona-Azul.png',
          }}
          style={styles.logo}
        />

        <TextInput
          label="Placa do Carro"
          mode="outlined"
          value={placa}
          onChangeText={validarPlaca}
          style={styles.input}
          placeholder="ABC1234"
          maxLength={7}
        />

        <Text style={styles.label}>Selecione o tipo de veículo:</Text>
        <RadioButton.Group onValueChange={setTipoVeiculo} value={tipoVeiculo}>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Compacto" />
            <Text>Compacto (R$2,00/h)</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="Hatch/Sedan" />
            <Text>Hatch/Sedan (R$3,00/h)</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="SUV/Pickup" />
            <Text>SUV/Pickup (R$5,00/h)</Text>
          </View>
        </RadioButton.Group>

        <TextInput
          label="Horas (máx. 24h)"
          mode="outlined"
          value={horas}
          onChangeText={(text) => setHoras(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Minutos (máx. 60)"
          mode="outlined"
          value={minutos}
          onChangeText={(text) => setMinutos(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.valorTotal}>
          Valor total: R$ {valorTotal.toFixed(2)}
        </Text>

        <Button
          mode="contained"
          onPress={calcularValorETempo}
          style={styles.button}
          uppercase={false} // Ajuste para evitar sombra de estilo padrão
        >
          Confirmar Estacionamento
        </Button>

        {tempoRestante !== null && (
          <View style={styles.temporizadorContainer}>
            <Text style={styles.temporizadorText}>
              Placa: {placa} - Tempo restante: {formatarTempo(tempoRestante)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 43,
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: '90%',
    elevation: 0, // Remova sombreamento padrão
  },
  temporizadorContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    width: '90%',
    alignItems: 'center',
  },
  temporizadorText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
