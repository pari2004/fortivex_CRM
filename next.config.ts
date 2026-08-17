import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/students/batch_allocation',
        destination: '/students/batch-allocation',
        permanent: true,
      },
      {
        source: '/analytics/dashboard',
        destination: '/analytics',
        permanent: true,
      },
      {
        source: '/reports/leads',
        destination: '/reports/lead',
        permanent: true,
      },
      {
        source: '/reports/admissions',
        destination: '/reports/admission',
        permanent: true,
      },
      {
        source: '/reports/students',
        destination: '/reports/student',
        permanent: true,
      },
      {
        source: '/reports/payments',
        destination: '/reports/payment',
        permanent: true,
      },
      {
        source: '/reports/trainers',
        destination: '/reports/trainer',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
