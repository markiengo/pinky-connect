import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    // In dev, the Windsurf browser preview proxies the app on a dynamic port,
    // so the Server Action Origin header (e.g. 127.0.0.1:52715) won't match the
    // dev server host (localhost:3001), triggering Next's CSRF check and an
    // "Invalid Server Actions request" error.
    //
    // Next's origin matcher splits on "." and treats "*" as a single DNS segment.
    // Since a port has no ".", the pattern "127.0.0.*" matches 127.0.0.1 on ANY
    // port. This whitelists the local preview proxy regardless of its port.
    // The dev server is locked to port 3001; the exact localhost origins are
    // listed here to keep Server Actions strict same-origin checks working.
    // Production keeps the default strict same-origin CSRF protection.
    serverActions: {
      allowedOrigins: isDev
        ? ["127.0.0.*", "localhost:3001", "127.0.0.1:3001"]
        : [],
    },
  },
};

export default nextConfig;
