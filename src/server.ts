import app from './app';
import { getTemporalClient } from './temporal/client';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await getTemporalClient();
  console.log('✅ Temporal client prewarmed');
  console.log(`Server is running on port ${PORT}`);
});


