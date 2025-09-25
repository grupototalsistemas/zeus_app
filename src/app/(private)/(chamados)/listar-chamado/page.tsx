'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TicketList from '@/components/tables/TicketList';

export default function ListTicketPage() {
  return (
    <div className="col-span-12 xl:col-span-7">
      <PageBreadcrumb pageTitle="Listar Chamados" pageBefore="Chamados" />

      <TicketList />
    </div>
  );
}
