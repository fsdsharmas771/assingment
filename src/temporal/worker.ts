import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'temporal:7233',
  });

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'hotel-offer-queue',
    workflowsPath: require.resolve('../workflows/hotelWorkflow'),
    activities: {
      fetchSupplierA: activities.fetchSupplierA,
      fetchSupplierB: activities.fetchSupplierB,
      saveToRedis: activities.saveToRedis,
      getFromRedis: activities.getFromRedis,
    },
  });

  console.log('✅ Hotel Temporal Worker started');
  await worker.run();
}

run().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});
