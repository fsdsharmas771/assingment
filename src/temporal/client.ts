import { Connection, Client } from '@temporalio/client';

let clientInstance: Client | null = null;

export async function getTemporalClient(): Promise<Client> {
  if (clientInstance) {
    return clientInstance;
  }

  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  });

  clientInstance = new Client({
    connection,
    namespace: 'default',
  });

  return clientInstance;
}

