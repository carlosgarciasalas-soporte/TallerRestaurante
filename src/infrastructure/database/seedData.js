const seedData = {
  users: [
    { id: "1", name: "Admin SIGR", email: "admin@sigr.local", password: "admin123", role: "administrador" },
    { id: "2", name: "Maria Mesera", email: "mesera@sigr.local", password: "mesera123", role: "mesero" },
    { id: "3", name: "Carlos Cliente", email: "cliente@sigr.local", password: "cliente123", role: "cliente" }
  ],
  categories: [
    { id: "1", name: "Entradas", description: "Platos ligeros para iniciar." },
    { id: "2", name: "Platos fuertes", description: "Preparaciones principales." },
    { id: "3", name: "Bebidas", description: "Bebidas frias y calientes." }
  ],
  products: [
    { id: "1", categoryId: "1", name: "Empanadas de carne", description: "Orden por tres unidades.", price: 9000, available: true },
    { id: "2", categoryId: "2", name: "Arroz con pollo", description: "Plato tradicional con ensalada.", price: 22000, available: true },
    { id: "3", categoryId: "3", name: "Limonada natural", description: "Vaso de 16 onzas.", price: 6000, available: true }
  ],
  reservations: [
    { id: "1", customerName: "Laura Perez", phone: "3001112233", date: "2026-05-12", time: "19:00", people: 4, status: "confirmada" }
  ]
};

module.exports = { seedData };
