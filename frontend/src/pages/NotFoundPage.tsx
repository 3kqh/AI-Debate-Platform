import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container className="text-center py-5">
      <h1 className="display-1 fw-bold text-muted">404</h1>
      <p className="lead">Trang không tồn tại</p>
      <Button as={Link as any} to="/" variant="primary">
        Về trang chủ
      </Button>
    </Container>
  );
}
