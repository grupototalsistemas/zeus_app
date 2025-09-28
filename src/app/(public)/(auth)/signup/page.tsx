import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastre-se | Zeus',
  description: 'Página de cadastro do sistema Zeus',
};

export default function SignUp() {
  return <SignUpForm />;
}
