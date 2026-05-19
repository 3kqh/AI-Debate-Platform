import { Spinner, Container } from 'react-bootstrap';

export function LoadingScreen() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải...</p>
      </div>
    </Container>
  );
}
