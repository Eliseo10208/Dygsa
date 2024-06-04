// pages/_app.tsx
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from './layout';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isClientsRoute = router.pathname.startsWith('/clients');
  const isUnidadesRoute = router.pathname.startsWith('/unidades');
  const isViajesRoute = router.pathname.startsWith('/viajes');

  const isLayoutRoute = isClientsRoute || isUnidadesRoute || isViajesRoute;

  return isLayoutRoute ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );
};

export default MyApp;
