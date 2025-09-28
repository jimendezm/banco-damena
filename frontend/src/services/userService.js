// services/userService.js
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
export const verificarCredenciales = (username, password) => {
  const usersData = getUsers();
  const user = usersData.users.find(
    user => user.username === username && user.password === password
  );
  return user ? user.id : null;
};
export const enviarTarjetas = (userId) => {
  const usersData = getUsers();
  console.log("enviarTarjetas -> usersData:", usersData);

  // buscar user con comparación flexible (string/number)
  const user = usersData.users.find(u => String(u.id) === String(userId));
  console.log("enviarTarjetas -> buscado userId:", userId, "resultado:", user);

  if (!user) {
    return null;
  }

  console.log("enviarTarjetas -> tarjetas completas:", JSON.stringify(user.tarjetas, null, 2));
  return user.tarjetas;
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
    cuentas: [
      {
        account_id: `CR01-0123-0456-${Date.now().toString().slice(-12)}`,
        alias: "Cuenta Principal",
        tipo: "Ahorro",
        moneda: "CRC",
        saldo: 500000.00
      },
      {
        account_id: `CR01-0789-0123-${(Date.now() + 1).toString().slice(-12)}`,
        alias: "Ahorro Navideño",
        tipo: "Ahorro", 
        moneda: "CRC",
        saldo: 750000.00
      }
    ],
    tarjetas: [
      {
        tipo: "Gold",
        numero: "1234********1234",
        exp: "12/25",
        titular: userData.nombre,
        moneda: "CRC",
        limite: 500000,
        saldo: 125000,
        movimientos: []
      }
    ]
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
          nombre: "María Rodríguez López",
          nacimiento: "1990-01-01",
          correo: "demo@banco.com",
          telefono: "+506 8888 8888",
          password: "Demo1234",
          fechaRegistro: "2024-01-01T10:00:00Z",
          cuentas: [
            {
              account_id: "CR01-0123-0456-000000000001",
              alias: "Cuenta Principal",
              tipo: "Ahorro",
              moneda: "CRC",
              saldo: 1523400.50
            },
            {
              account_id: "CR01-0123-0456-000000000002", 
              alias: "Cuenta de Ahorros",
              tipo: "Ahorro",
              moneda: "CRC",
              saldo: 750000.00
            },
            {
              account_id: "CR01-0789-0123-000000000003",
              alias: "Cuenta Corriente",
              tipo: "Corriente",
              moneda: "CRC",
              saldo: 250000.00
            },
            {
              account_id: "CR01-0456-0789-000000000004",
              alias: "Ahorro USD",
              tipo: "Ahorro",
              moneda: "USD",
              saldo: 5000.00
            },
            {
              account_id: "CR01-0890-0345-000000000005",
              alias: "Fondo Emergencia",
              tipo: "Ahorro",
              moneda: "CRC", 
              saldo: 1000000.00
            }
          ],
          tarjetas: [
            {
              tipo: "Gold",
              numero: "1234********1234",
              exp: "12/25",
              titular: "María Rodríguez López",
              moneda: "CRC",
              pin: 1234,
              cvv: 777,
              limite: 500000,
              saldo: 125000,
              movimientos: [
                    {
                        id: "MOV001",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-25T10:00:00Z",
                        tipo: "Pago",
                        descripcion: "Depósito nómina",
                        moneda: "CRC",
                        saldo: 1523400.50
                    },
                    {
                        id: "MOV002",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-26T15:30:00Z",
                        tipo: "Compra",
                        descripcion: "Pago servicios",
                        moneda: "CRC",
                        saldo: 1500000.00
                    }
                ]
            },
            {
              tipo: "Platinum",
              numero: "5678********5678", 
              exp: "06/26",
              titular: "María Rodríguez López",
              moneda: "USD",
              pin: 1234,
              cvv: 777,
              limite: 10000,
              saldo: 2500.00,
              movimientos: [
                    {
                        id: "MOV003",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-25T10:00:00Z",
                        tipo: "Pago",
                        descripcion: "Depósito nómina",
                        moneda: "CRC",
                        saldo: 1523400.50
                    },
                    {
                        id: "MOV004",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-26T15:30:00Z",
                        tipo: "Compra",
                        descripcion: "Pago servicios",
                        moneda: "CRC",
                        saldo: 1500000.00
                    }
                ]
            },
            {
              tipo: "Black",
              numero: "9012********9012",
              exp: "03/27", 
              titular: "María Rodríguez López",
              moneda: "CRC",
              pin: 1234,
              cvv: 777,
              limite: 2000000,
              saldo: 750000.00,
              movimientos: [
                    {
                        id: "MOV005",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-25T10:00:00Z",
                        tipo: "Pago",
                        descripcion: "Depósito nómina",
                        moneda: "CRC",
                        saldo: 1523400.50
                    },
                    {
                        id: "MOV006",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-26T15:30:00Z",
                        tipo: "Compra",
                        descripcion: "Pago servicios",
                        moneda: "CRC",
                        saldo: 1500000.00
                    }
                ]
            }
          ]
        },
        {
          id: 2,
          tipoId: "nacional", 
          numId: "987654321",
          username: "cliente",
          nombre: "Carlos Méndez Solís",
          nacimiento: "1985-05-15",
          correo: "cliente@banco.com",
          telefono: "+506 7777 7777",
          password: "Cliente123",
          fechaRegistro: "2024-01-02T14:30:00Z",
          cuentas: [
            {
              account_id: "CR01-0567-0890-000000000006",
              alias: "Cuenta Personal",
              tipo: "Corriente",
              moneda: "CRC",
              saldo: 850000.75
            },
            {
              account_id: "CR01-0678-0901-000000000007",
              alias: "Ahorro Viajes", 
              tipo: "Ahorro",
              moneda: "USD",
              saldo: 3000.50
            }
          ],
          tarjetas: [
            {
              tipo: "Gold",
              numero: "3456********3456",
              exp: "09/25",
              titular: "Carlos Méndez Solís",
              moneda: "CRC",
              pin: 1234,
              cvv: 777,
              limite: 750000,
              saldo: 150000.00,
              movimientos: [
                    {
                        id: "MOV007",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-25T10:00:00Z",
                        tipo: "Pago",
                        descripcion: "Depósito nómina",
                        moneda: "CRC",
                        saldo: 1523400.50
                    },
                    {
                        id: "MOV008",
                        account_id: "CR01-1001-2001-000000000001",
                        fecha: "2025-09-26T15:30:00Z",
                        tipo: "Compra",
                        descripcion: "Pago servicios",
                        moneda: "CRC",
                        saldo: 1500000.00
                    }
                ]
            }
          ]
        }
      ]
    };
    saveUsers(sampleUsers);
    console.log('Datos de ejemplo inicializados con múltiples cuentas');
  }
};

// Obtener usuario por username (para login)
export const getUserByUsername = (username) => {
  const usersData = getUsers();
  return usersData.users.find(user => user.username === username.toLowerCase());
};

// Obtener usuario por ID
export const getUserById = (id) => {
  const usersData = getUsers();
  return usersData.users.find(user => user.id === id);
};

// Actualizar usuario
export const updateUser = (userId, updatedData) => {
  const usersData = getUsers();
  const userIndex = usersData.users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    usersData.users[userIndex] = { ...usersData.users[userIndex], ...updatedData };
    const success = saveUsers(usersData);
    return { success, user: usersData.users[userIndex] };
  }
  
  return { success: false, error: 'Usuario no encontrado' };
};