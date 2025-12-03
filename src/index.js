import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import invitationRoutes from './routes/invitations.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/invitations', invitationRoutes);

app.listen(config.port, () => {
  console.log(`Partner invite service running on port ${config.port}`);
});