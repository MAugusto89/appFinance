// Função para inicializar o banco de dados de gastos financeiros
export const iniciarBancoDeDados = async (db) => {
  try {
    await db.execAsync(`  
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS gasto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT,
        valor REAL,
        data TEXT
      );
    `);
    console.log('Banco de Dados de gastos inicializado');
  } catch (error) {
    console.log('Erro ao iniciar o Banco de Dados: ', error);
  }
};

// Função para adicionar um gasto
export const adicionarGasto = async (novoGasto, db, setGastos) => {
  try {
    const query = await db.prepareAsync('INSERT INTO gasto (descricao, valor, data) VALUES (?, ?, ?)');
    await query.executeAsync([novoGasto.descricao, novoGasto.valor, novoGasto.data]);
    await getGastos(db, setGastos);
  } catch (error) {
    console.log('Erro ao adicionar o gasto', error);
  }
};

// Função para atualizar um gasto
export const atualizarGasto = async (gastoId, novaDescricao, novoValor, novaData, db, setGastos) => {
  try {
    await db.runAsync('UPDATE gasto SET descricao = ?, valor = ?, data = ? WHERE id = ?', [novaDescricao, novoValor, novaData, gastoId]);
    Alert.alert('Atenção!', 'Gasto atualizado com sucesso!');
    await getGastos(db, setGastos);
  } catch (error) {
    console.log('Erro ao atualizar o gasto: ', error);
  }
}