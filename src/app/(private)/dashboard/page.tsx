'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics';
import StatisticsChart from '@/components/ecommerce/StatisticsChart';

export default function Dashboard() {
  return (
    <div className="col-span-10 space-y-8 xl:col-span-7">
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>
      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  );
}
