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
import { Text, View, StyleSheet, Image, Alert, Vibration, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';

export default function App() {
  const [placa, setPlaca] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('Compacto');
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(null); // Tempo restante em segundos
  const [temporizadorAtivo, setTemporizadorAtivo] = useState(false); // Controla o temporizador

  const valoresHora = {
    Compacto: 2.0,
    'Hatch/Sedan': 3.0,
    'SUV/Pickup': 5.0,
  };

  // Validação para aceitar apenas letras e números
  const validarPlaca = (texto) => {
    // Remove qualquer caractere não alfanumérico e converte para maiúsculas
    const textoFormatado = texto.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setPlaca(textoFormatado);
  };

  // Função que calcula o valor total e converte o tempo para segundos
  const calcularValorETempo = () => {
    const horasInt = parseInt(horas);
    const minutosInt = parseInt(minutos);

    // Validação de tempo: máximo de 24 horas e 60 minutos
    if (horasInt > 24) {
      Alert.alert('Erro', 'O máximo permitido são 24 horas.');
      return;
    }
    if (minutosInt > 60) {
      Alert.alert('Erro', 'O máximo permitido são 60 minutos.');
      return;
    }
    if (isNaN(horasInt) || isNaN(minutosInt)) {
      Alert.alert('Erro', 'Por favor, insira valores válidos para horas e minutos.');
      return;
    }

    // Calculando o valor total com base no tipo de veículo
    const valorPorHora = valoresHora[tipoVeiculo];
    const valor = (horasInt + minutosInt / 60) * valorPorHora;
    setValorTotal(valor);

    // Convertendo o tempo para segundos
    const tempoEmSegundos = horasInt * 3600 + minutosInt * 60;
    setTempoRestante(tempoEmSegundos);

    // Inicia o temporizador
    setTemporizadorAtivo(true);
  };

  // Efeito que lida com o temporizador
  useEffect(() => {
    let intervalo = null;

    if (temporizadorAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante((anterior) => {
          const novoTempo = anterior - 1;

          // Se restarem 15 minutos, exibir alerta
          if (novoTempo === 900) {
            Alert.alert('Atenção', 'Faltam 15 minutos para o tempo expirar!');
          }

          // Se o tempo chegar a 0, vibrar o dispositivo
          if (novoTempo === 0) {
            Vibration.vibrate([500, 500, 500, 500, 500], true); // Vibração sequencial
            clearInterval(intervalo);
            setTemporizadorAtivo(false);
          }

          return novoTempo;
        });
      }, 1000); // Executa a cada 1 segundo
    } else if (tempoRestante === 0) {
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar o componente
  }, [temporizadorAtivo, tempoRestante]);

  // Função para formatar o tempo restante em horas, minutos e segundos
  const formatarTempo = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo do Projeto */}
        <Image
          source={{
            uri: 'https://i.postimg.cc/qq5zj1Y4/Logo-Zona-Azul.png',
          }}
          style={styles.logo}
        />

        {/* Campo para a Placa */}
        <TextInput
          label="Placa do Carro"
          mode="outlined"
          value={placa}
          onChangeText={validarPlaca}
          style={styles.input}
          placeholder="ABC1234"
        />

        {/* Seletor do Tipo de Veículo */}
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

        {/* Campo para Inserir as Horas */}
        <TextInput
          label="Horas (máx. 24h)"
          mode="outlined"
          value={horas}
          onChangeText={(text) => setHoras(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Campo para Inserir os Minutos */}
        <TextInput
          label="Minutos (máx. 60)"
          mode="outlined"
          value={minutos}
          onChangeText={(text) => setMinutos(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Exibição do valor total */}
        <Text style={styles.valorTotal}>
          Valor total: R$ {valorTotal.toFixed(2)}
        </Text>

        {/* Botão de Confirmar */}
        <Button
          mode="contained"
          onPress={calcularValorETempo}
          style={styles.button}
        >
          Confirmar Estacionamento
        </Button>

        {/* Exibição do temporizador */}
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
    paddingVertical: 20,
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
  },
  temporizadorContainer: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  temporizadorText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
