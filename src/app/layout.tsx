import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
// caminho do componente que você criou
import { ReduxProvider } from '@/store/ReduxProvider';

// @ts-expect-error
import './globals.css';

// const outfit = Outfit({
//   subsets: ['latin'],
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        // className={`${outfit.className} overflow-x-hidden dark:bg-gray-900`}
        className={`overflow-x-hidden dark:bg-gray-900`}
        suppressHydrationWarning={true}
      >
        <ReduxProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
