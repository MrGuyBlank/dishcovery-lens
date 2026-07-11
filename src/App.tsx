import { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const Landing = lazy(() => import('./pages/Landing'));
const product = () => import('./pages/product');
const ProductShell = lazy(() => product().then((m) => ({ default: m.ProductShell })));
const Lens = lazy(() => product().then((m) => ({ default: m.Lens })));
const MapPage = lazy(() => product().then((m) => ({ default: m.MapPage })));
const PlanPage = lazy(() => product().then((m) => ({ default: m.PlanPage })));
const KitchenPage = lazy(() => product().then((m) => ({ default: m.KitchenPage })));
const Cookspace = lazy(() => product().then((m) => ({ default: m.Cookspace })));

function RouteFx() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

function Loader() {
  return (
    <div role="status" aria-label="Loading" style={{ minHeight: '60svh', display: 'grid', placeItems: 'center' }}>
      <span className="caps caps--dim">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <>
      <RouteFx />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/cookspace/:slug" element={<Cookspace />} />
          <Route element={<ProductShell />}>
            <Route path="/lens" element={<Lens />} />
            <Route path="/map/:slug" element={<MapPage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
