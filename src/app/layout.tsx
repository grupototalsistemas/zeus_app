import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
// caminho do componente que você criou
import { WithReduxInitialData } from '@/components/WithReduxInitialData';
import { ReduxProvider } from '@/store/ReduxProvider';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReduxProvider>
          <ThemeProvider>
            <SidebarProvider>
              <WithReduxInitialData>{children}</WithReduxInitialData>
            </SidebarProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
