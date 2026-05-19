import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AppNavbar } from '@components/common/AppNavbar';

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <Container as="main" className="flex-grow-1 py-4">
        <Outlet />
      </Container>
      <footer className="bg-light text-center py-3 border-top">
        <small className="text-muted">AI Debate Platform &copy; 2026</small>
      </footer>
    </div>
  );
}
