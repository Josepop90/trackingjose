require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS - permite múltiples orígenes para desarrollo y producción
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como mobile apps o curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ horaServidor: result.rows[0].now });
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err);
    res.status(500).send("Error al consultar la base de datos: " + err.message);
  }
});

app.get("/", (_req, res) => {
  res.send("Backend conectado correctamente con Supabase PostgreSQL");
});

const clientesRoutes = require("./routes/clientes");
const dispositivosRoutes = require("./routes/dispositivos");
const ordenesRoutes = require("./routes/ordenes");
const historialRoutes = require("./routes/historial");
const estadosRoutes = require("./routes/estados");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const marcasRoutes = require("./routes/marcas");
const modelosRoutes = require("./routes/modelos");
const rolesRoutes = require("./routes/roles");
const trackingRoutes = require("./routes/tracking");

// IMPORTANTE: Ruta pública de tracking (debe ir ANTES de las rutas protegidas)
app.use("/api/tracking", trackingRoutes);

app.use("/api/clientes", clientesRoutes);
app.use("/api/dispositivos", dispositivosRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/estados", estadosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/modelos", modelosRoutes);
app.use("/api/roles", rolesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
