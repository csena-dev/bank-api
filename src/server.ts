// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';



dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'API Bancária rodando!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});


//Configuracao do Swagger

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Bancária",
        version: "1.0.0",
        description: "Documentação das APIs do projeto"
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [
        { bearerAuth: [] }
      ]
    },
    apis: ["./src/routes/*.ts"],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs) as unknown as express.RequestHandler);


app.listen(PORTA, () => {
    console.log(`Servidor rodando na url http://localhost:${PORTA} :)`);
});