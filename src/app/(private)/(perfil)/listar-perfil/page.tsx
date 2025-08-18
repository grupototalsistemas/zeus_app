import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PerfilList from '@/components/tables/PerfilList';

export default function ListUserPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Listar Perfil" pageBefore="Perfis" />
      <PerfilList />
    </>
  );
}
