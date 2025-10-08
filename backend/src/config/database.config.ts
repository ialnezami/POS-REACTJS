import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pos',
  dbName: process.env.MONGODB_DB_NAME || 'pos',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 10,
    maxPoolSize: 100,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  },
}));


