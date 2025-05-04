import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/user.router.js'
import authRouter from './routes/auth.router.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017'

// Middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }),
)

// Serve static images
// app.use('./src/upload', express.static(path.join(__dirname, 'public', 'upload')))

// Mongoose connection

mongoose
  .connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error))

// Routes
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
  })
})

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`))

export default app
