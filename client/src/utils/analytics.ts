const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

function track(event: string, metadata?: Record<string, unknown>) {
  if (!sentryDsn) {
    console.info(`[analytics] ${event}`, metadata);
    return;
  }

  // Minimal placeholder for Sentry/analytics integration.
  console.info(`[sentry:${sentryDsn}] ${event}`, metadata);
}

export const analytics = {
  track,
};