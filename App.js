import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { AntDesign } from '@expo/vector-icons';
import { styles } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { iniciarBancoDeDados, adicionarGasto, atualizarGasto, excluirGasto, excluirTodosGastos } from './components/db';

// Componente GastoBotao
const GastoBotao = ({ gasto, excluirGasto, atualizarGasto }) => {
  const [gastoSelecionado, setGastoSelecionado] = useState(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [gastoEditado, setGastoEditado] = useState({
    descricao: gasto.descricao,
    valor: gasto.valor,
    data: gasto.data,
  });

  const confirmarExcluir = () => {
    Alert.alert(
      "Atenção!",
      'Deseja excluir este gasto?',
      [
        { text: 'Não', onPress: () => {}, style: 'cancel' },
        { text: 'Sim', onPress: () => excluirGasto(gasto.id) },
      ],
      { cancelable: true }
    );
  };

  const handleEditar = () => {
    atualizarGasto(gasto.id, gastoEditado.descricao, gastoEditado.valor, gastoEditado.data);
    setEstaEditando(false);
  };

  return (
    <View>
      <Pressable 
        style={styles.gastoBotao}
        onPress={() => setGastoSelecionado(gastoSelecionado === gasto.id ? null : gasto.id)}
      >
        <Text style={styles.gastoTexto}>{gasto.descricao} - R$ {gasto.valor}</Text>
        {gastoSelecionado === gasto.id && (
          <View style={styles.actions}>
            <AntDesign 
              name='edit'
              size={18}
              color='blue'
              onPress={() => setEstaEditando(true)}
              style={styles.icon}
            />
            <AntDesign 
              name='delete'
              size={18}
              color='red'
              onPress={confirmarExcluir}
              style={styles.icon}
            />
          </View>
        )}
      </Pressable>

      {gastoSelecionado === gasto.id && !estaEditando && (
        <View style={styles.gastoConteudo}>
          <Text>Descrição: {gasto.descricao}</Text>
          <Text>Valor: R$ {gasto.valor}</Text>
          <Text>Data: {gasto.data}</Text>
        </View>
      )}

      {gastoSelecionado === gasto.id && estaEditando && (
        <GastoFormulario gasto={gastoEditado} setGasto={setGastoEditado} onSave={handleEditar} setMostrarFormulario={setEstaEditando} />
      )}
    </View>
  );
};

// Componente Gasto Formulário
const GastoFormulario = ({ gasto, setGasto, onSave, setMostrarFormulario }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setGasto({...gasto, data: formattedDate});
    }
  };

  return (
    <View>
      <TextInput 
        style={styles.input}
        placeholder='Descrição'
        value={gasto.descricao}
        onChangeText={(text) => setGasto({...gasto, descricao: text})}
      />
      <TextInput 
        style={styles.input}
        placeholder='Valor'
        value={gasto.valor.toString()}
        onChangeText={(text) => setGasto({...gasto, valor: parseFloat(text)})}
        keyboardType='numeric'
      />
      <Pressable 
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{gasto.data ? gasto.data : 'Escolha a data'}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={gasto.data ? new Date(gasto.data) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Pressable onPress={onSave} style={styles.saveButton}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>

      <Pressable onPress={() => setMostrarFormulario(false)} style={styles.cancelButton}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </Pressable>
    </View>
  );
};

// Componente Conteudo
const Conteudo = () => {
  const db = useSQLiteContext();
  const [gastos, setGastos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gasto, setGasto] = useState({ id: 0, descricao: '', valor: '', data: '' });

  const getGastos = async () => {
    try {
      const todosRegistros = await db.getAllAsync('SELECT * FROM gasto');
      setGastos(todosRegistros);
    } catch (error) {
      console.log('Erro ao ler os dados dos gastos: ', error);
    }
  };

  const confirmarSalvar = () => {
    if (gasto.descricao.length === 0 || gasto.valor.length === 0 || gasto.data.length === 0) {
      Alert.alert('Atenção!', 'Preencha todos os campos!');
    } else {
      adicionarGasto(gasto, db, setGastos);
      setGasto({ descricao: '', valor: '', data: '' });
      setMostrarFormulario(false);
    }
  };

  const handleAtualizarGasto = async (id, descricao, valor, data) => {
    atualizarGasto(id, descricao, valor, data, db, setGastos);
  };

  useEffect(() => {
    getGastos();
  }, []);

  return (
    <View style={styles.contentContainer}>
      {gastos.length === 0 ? (
        <Text>Não existem gastos registrados</Text>
      ) : (
        <FlatList 
          data={gastos}
          renderItem={({ item }) => (<GastoBotao gasto={item} excluirGasto={excluirGasto} atualizarGasto={handleAtualizarGasto} />)}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {mostrarFormulario && (<GastoFormulario gasto={gasto} setGasto={setGasto} onSave={confirmarSalvar} setMostrarFormulario={setMostrarFormulario} />)}

      <View style={styles.iconsContent}>
        <AntDesign 
          name='pluscircleo'
          size={24}
          color='blue'
          onPress={() => setMostrarFormulario(true)}
          style={styles.icon}
        />
        <AntDesign 
          name='delete'
          size={24}
          color='red'
          onPress={() => excluirTodosGastos(db, setGastos)}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

// Função principal do aplicativo
const App = () => {
  return (
    <SQLiteProvider databaseName='bancoGasto.db' onInit={iniciarBancoDeDados}>
      <View style={styles.container}>
        <Text style={styles.title}>Gerenciador de Gastos</Text>
        <Conteudo />
      </View>
    </SQLiteProvider>
  );
};

export default App;
