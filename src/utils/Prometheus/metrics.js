// utils/metrics.js
import client from "prom-client";
import { NextResponse } from "next/server";

export const productPurchases = new client.Counter({
  name: "app_product_purchases_total",
  help: "Total number of product purchases",
  labelNames: ["product_type"],
});

export function trackPurchase(productType) {
  productPurchases.inc({ product_type: productType });
}

export const activeUserConnections = new client.Gauge({
  name: "app_users",
  help: "Number of active users",
});

export function incrementUserConnections() {
  console.log("Incrementing active user connections");
  activeUserConnections.inc();
}

export function decrementUserConnections() {
  console.log("Decrementing active user connections");
  activeUserConnections.dec();
}

// Uncomment and fix the userSignups metric
export const userSignups = new client.Counter({
  name: "app_user_signups_total",
  help: "Total number of user signups",
});

export function trackSignup() {
  userSignups.inc();
}

export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
});

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

export const errorCounter = new client.Counter({
  name: "app_errors_total",
  help: "Total number of errors in the application",
  labelNames: ["type", "route"],
});

export function withMetrics(handler) {
  return async (request, context) => {
    const start = Date.now();
    const route = request.nextUrl.pathname;

    try {
      const response = await handler(request, context);

      httpRequestCounter.inc({
        method: request.method,
        route: route,
        code: response.status,
      });

      httpRequestDuration.observe(
        {
          method: request.method,
          route: route,
          code: response.status,
        },
        (Date.now() - start) / 1000
      );

      return response;
    } catch (error) {
      errorCounter.inc({
        type: error.name || "UnknownError",
        route: route,
      });

      throw error;
    }
  };
}
