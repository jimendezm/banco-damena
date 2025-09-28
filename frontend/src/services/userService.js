// Simulamos una base de datos simple leyendo/escribiendo en localStorage
// En un proyecto real, esto sería una API backend

const STORAGE_KEY = 'bank_users';

// Obtener usuarios desde localStorage
export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : { users: [] };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return { users: [] };
  }
};

// Guardar usuarios en localStorage
export const saveUsers = (usersData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usersData));
    return true;
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    return false;
  }
};

// Verificar si un username ya existe
export const usernameExists = (username) => {
  const usersData = getUsers();
  return usersData.users.some(user => user.username === username.toLowerCase());
};

// Verificar si un correo ya existe
export const emailExists = (email) => {
  const usersData = getUsers();
  return usersData.users.some(user => user.correo === email.toLowerCase());
};

// Crear nuevo usuario
export const createUser = (userData) => {
  const usersData = getUsers();
  
  // Validar que no exista el username o email
  if (usernameExists(userData.username)) {
    return { success: false, error: 'El username ya está en uso' };
  }
  
  if (emailExists(userData.correo)) {
    return { success: false, error: 'El correo electrónico ya está registrado' };
  }

  const newUser = {
    id: Date.now(), // ID simple basado en timestamp
    ...userData,
    username: userData.username.toLowerCase(),
    correo: userData.correo.toLowerCase(),
    fechaRegistro: new Date().toISOString(),
    cuentas: [],
    tarjetas: []
  };

  usersData.users.push(newUser);
  
  const success = saveUsers(usersData);
  return { success, user: newUser };
};

// Inicializar datos de ejemplo si no existen
export const initializeSampleData = () => {
  const currentData = getUsers();
  if (currentData.users.length === 0) {
    const sampleUsers = {
      users: [
        {
          id: 1,
          tipoId: "nacional",
          numId: "123456789",
          username: "demo",
          nombre: "Usuario Demo",
          nacimiento: "1990-01-01",
          correo: "demo@banco.com",
          telefono: "+506 8888 8888",
          password: "Demo1234", // En un caso real esto estaría hasheado
          fechaRegistro: "2024-01-01T10:00:00Z",
          cuentas: [
            {
              account_id: "CR01-0123-0456-000000000001",
              alias: "Cuenta Principal",
              tipo: "Ahorro",
              moneda: "CRC",
              saldo: 1523400.50
            }
          ],
          tarjetas: [
            {
              tipo: "Gold",
              numero: "1234********1234",
              exp: "12/25",
              titular: "Usuario Demo",
              moneda: "CRC",
              limite: 500000,
              saldo: 125000
            }
          ]
        }
      ]
    };
    saveUsers(sampleUsers);
  }
};