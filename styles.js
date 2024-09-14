import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 20,  // Diminuir o espaçamento superior/inferior
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '90%',
  },
  // Estilo para o gráfico
  graficoContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  gastoBotao: {
    backgroundColor: 'lightgreen',
    padding: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gastoTexto: {
    fontSize: 18,
    fontWeight: '700',
  },
  gastoConteudo: {
    backgroundColor: '#cdcdcd',
    padding: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 6,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 10,
    marginVertical: 6,
  },
  iconsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
