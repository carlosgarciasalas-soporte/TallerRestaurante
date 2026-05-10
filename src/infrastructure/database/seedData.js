const seedData = {
  users: [
    { id: "1", name: "Admin SIGR", email: "admin@sigr.local", password: "admin123", role: "administrador", phone: "3000000001" },
    { id: "2", name: "Maria Mesera", email: "mesera@sigr.local", password: "mesera123", role: "mesero", phone: "3000000002" },
    { id: "3", name: "Carlos Cliente", email: "cliente@sigr.local", password: "cliente123", role: "cliente", phone: "3001001001" },
    { id: "4", name: "Laura Perez", email: "laura@example.com", password: "cliente123", role: "cliente", phone: "3001001002" },
    { id: "5", name: "Andres Rojas", email: "andres@example.com", password: "cliente123", role: "cliente", phone: "3001001003" },
    { id: "6", name: "Valentina Ruiz", email: "valentina@example.com", password: "cliente123", role: "cliente", phone: "3001001004" },
    { id: "7", name: "Sofia Martinez", email: "sofia@example.com", password: "cliente123", role: "cliente", phone: "3001001005" },
    { id: "8", name: "Juan Torres", email: "juan@example.com", password: "cliente123", role: "cliente", phone: "3001001006" },
    { id: "9", name: "Camila Gomez", email: "camila@example.com", password: "cliente123", role: "cliente", phone: "3001001007" },
    { id: "10", name: "Mateo Vargas", email: "mateo@example.com", password: "cliente123", role: "cliente", phone: "3001001008" },
    { id: "11", name: "Isabella Castro", email: "isabella@example.com", password: "cliente123", role: "cliente", phone: "3001001009" },
    { id: "12", name: "Nicolas Moreno", email: "nicolas@example.com", password: "cliente123", role: "cliente", phone: "3001001010" }
  ],
  categories: [
    { id: "1", name: "Entradas", description: "Platos ligeros para iniciar." },
    { id: "2", name: "Platos Fuertes", description: "Preparaciones principales." },
    { id: "3", name: "Bebidas", description: "Bebidas frias y calientes." },
    { id: "4", name: "Postres", description: "Opciones dulces para cerrar la experiencia." }
  ],
  products: [
    { id: "1", categoryId: "1", name: "Empanadas de carne", description: "Orden por tres unidades.", price: 9000, imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "2", categoryId: "2", name: "Arroz con pollo", description: "Plato tradicional con ensalada.", price: 22000, imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "3", categoryId: "3", name: "Limonada natural", description: "Vaso de 16 onzas.", price: 6000, imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "4", categoryId: "1", name: "Bruschetta mediterranea", description: "Pan artesanal, tomate, albahaca y aceite de oliva.", price: 14000, imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "5", categoryId: "1", name: "Ensalada fresca", description: "Mix verde con vegetales de temporada.", price: 16000, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "6", categoryId: "1", name: "Sopa del dia", description: "Preparacion caliente de la casa.", price: 12000, imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "7", categoryId: "2", name: "Pasta al pesto", description: "Pasta corta con pesto de albahaca y parmesano.", price: 28000, imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "8", categoryId: "2", name: "Hamburguesa artesanal", description: "Carne premium, queso, vegetales y papas.", price: 30000, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "9", categoryId: "2", name: "Salmon grillado", description: "Salmon a la parrilla con vegetales.", price: 42000, imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "10", categoryId: "2", name: "Pizza margarita", description: "Tomate, mozzarella y albahaca.", price: 26000, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "11", categoryId: "3", name: "Cafe latte", description: "Cafe espresso con leche vaporizada.", price: 8000, imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "12", categoryId: "3", name: "Jugo de frutos rojos", description: "Bebida natural sin conservantes.", price: 9000, imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "13", categoryId: "4", name: "Cheesecake de frutos rojos", description: "Porcion con salsa artesanal.", price: 15000, imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "14", categoryId: "4", name: "Brownie con helado", description: "Brownie tibio con helado de vainilla.", price: 14000, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80", available: true },
    { id: "15", categoryId: "4", name: "Flan de caramelo", description: "Postre clasico con caramelo.", price: 11000, imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80", available: true }
  ],
  orders: [
    { id: "1", customerId: "3", tableNumber: 4, status: "pagado", createdAt: "2026-05-10T12:15:00.000Z", items: [{ productId: "1", quantity: 2, unitPrice: 9000 }, { productId: "3", quantity: 1, unitPrice: 6000 }] },
    { id: "2", customerId: "4", tableNumber: 8, status: "en_preparacion", createdAt: "2026-05-10T13:05:00.000Z", items: [{ productId: "8", quantity: 1, unitPrice: 30000 }, { productId: "12", quantity: 2, unitPrice: 9000 }] },
    { id: "3", customerId: "5", tableNumber: 2, status: "servido", createdAt: "2026-05-10T13:40:00.000Z", items: [{ productId: "7", quantity: 1, unitPrice: 28000 }, { productId: "13", quantity: 1, unitPrice: 15000 }] },
    { id: "4", customerId: "6", tableNumber: 10, status: "pendiente", createdAt: "2026-05-10T14:10:00.000Z", items: [{ productId: "5", quantity: 1, unitPrice: 16000 }, { productId: "9", quantity: 1, unitPrice: 42000 }] },
    { id: "5", customerId: "7", tableNumber: 6, status: "pagado", createdAt: "2026-05-10T15:00:00.000Z", items: [{ productId: "10", quantity: 2, unitPrice: 26000 }, { productId: "14", quantity: 2, unitPrice: 14000 }] }
  ],
  payments: [
    { id: "1", orderId: "1", amount: 24000, method: "efectivo", paidAt: "2026-05-10T12:45:00.000Z" },
    { id: "2", orderId: "5", amount: 80000, method: "tarjeta", paidAt: "2026-05-10T15:35:00.000Z" }
  ],
  reservations: [
    { id: "1", customerName: "Laura Perez", phone: "3001112233", date: "2026-05-12", time: "19:00", people: 4, status: "confirmada" },
    { id: "2", customerName: "Andres Rojas", phone: "3002223344", date: "2026-05-12", time: "20:30", people: 2, status: "pendiente" },
    { id: "3", customerName: "Sofia Martinez", phone: "3003334455", date: "2026-05-13", time: "18:45", people: 6, status: "confirmada" }
  ]
};

module.exports = { seedData };
