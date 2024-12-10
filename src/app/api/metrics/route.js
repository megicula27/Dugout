// app/api/metrics/route.js
import client from "prom-client";
import * as customMetrics from "@/utils/Prometheus/metrics";

// Explicitly disable default metrics
// if (typeof window === "undefined") {
//   client.collectDefaultMetrics({
//     register,
//     eventLoopMonitoringEnabled: true,
//   });
// } else {
//   client.collectDefaultMetrics({
//     register,
//     eventLoopMonitoringEnabled: false,
//   });
// }
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

collectDefaultMetrics({ register });

// Register only custom metrics
register.registerMetric(customMetrics.productPurchases);
register.registerMetric(customMetrics.userSignups);
register.registerMetric(customMetrics.activeUserConnections);
register.registerMetric(customMetrics.httpRequestCounter);
register.registerMetric(customMetrics.httpRequestDuration);
register.registerMetric(customMetrics.errorCounter);

export async function GET(request) {
  const metrics = await register.metrics();
  return new Response(metrics, {
    headers: {
      "Content-Type": register.contentType,
    },
  });
}
export const revalidate = 0;
