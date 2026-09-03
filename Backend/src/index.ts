import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { classifyIncident } from './aiClassifier';

const app = express();
const PORT = 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => { res.json({ status: 'Sawubona Mfondini!' }); });

app.post('/api/incidents', async (req, res) => {
  try {
    const { vehicleRegistration, policyId, description, towingRequired, damageSeverity, severityScore, recommendedRouting } = req.body;

    const incident = await prisma.incident.create({
        data: { vehicleRegistration, policyId, description, towingRequired, damageSeverity, severityScore, recommendedRouting },
    });

    res.status(201).json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create incident' });
  }
});

app.get('/api/incidents', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch incidents' });
  }
});

app.post('/api/incidents/analyze', (req, res) => {
  try {
    const { description, towingRequired } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'A description is required' });
    }

    const result = classifyIncident(description, Boolean(towingRequired));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not analyze incident' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/incidents/history', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    });

    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch incident history' });
  }
});

app.delete('/api/incidents/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const incident = await prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not archive incident' });
  }
});