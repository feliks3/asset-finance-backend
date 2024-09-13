require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

connectDB();

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Application API',
      version: '1.0.0',
      description: 'API Documentation for Application Management',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:8001',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Export the app instance
module.exports = app;

// Start the server only if this file is directly executed
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {});
}
