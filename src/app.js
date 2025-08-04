const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

const config = require('./config');
const logger = require('./config/logger');
const ApiError = require('./utils/ApiError');
const errorHandler = require('./middlewares/errorHandler');
const apiRoutes = require('./routes'); 

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');

const app = express();

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const allowedOrigins = [];
if (config.env === 'development') {
  allowedOrigins.push('http://localhost:3000');

}
if (config.corsOriginFe) { 
  config.corsOriginFe.split(',').forEach(origin => allowedOrigins.push(origin.trim()));
}

const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.error(`CORS: Blocked origin - ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'timezone'],
      credentials: true,
      optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  const uploadsPath = path.resolve(__dirname, '..', 'uploads');
  app.use('api/uploads', express.static(uploadsPath));

  if (config.env === 'development') {
    app.use(morgan('dev'));
  }

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiRoutes);

// app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads'),{
//   setHeaders: (res, path) => {
//     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//   }
// }));

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'API Route Not Found'));
});


app.use(errorHandler);


module.exports = app;