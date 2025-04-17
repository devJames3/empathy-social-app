import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
// "https://scontent.cdninstagram.com/v/t51.2885-15/69377162_118208879265931_4617040543846263299_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=1-7&_nc_sid=18de74&_nc_ohc=g9PALIxQhhsQ7kNvwEoqmi6&_nc_oc=AdmhG0MhqX64fpGn-oSfg2RwRW1BjBp9wstRUdiPoujGUc0xGC1e0JFEMPz6j1eHIxk&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfFzSG1R6HdrfaJt8apB52kmnbKGPTEB0HPF_WMYCZ6ZDQ&oe=6806BB97"