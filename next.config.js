/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "redditclonec7cf1cfca7df48abaabb435b4ed4e8b2154746-dev.s3.eu-west-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig
