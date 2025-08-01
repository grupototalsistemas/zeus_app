import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import UserList from '@/components/tables/UserList';

export default function ListUserPage() {
  return (
    <div className="col-span-12 xl:col-span-7">
      <PageBreadcrumb pageTitle="Listar Usuários" pageBefore="Usuários" />
      <UserList />
    </div>
  );
}
