import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Card, Container, Spinner } from 'react-bootstrap';
import { authService } from '@services/authService';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Thiếu token xác thực.');
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email đã được xác thực. Bạn có thể đăng nhập.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Token xác thực không hợp lệ hoặc đã hết hạn.');
      });
  }, [searchParams]);

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 520 }}>
        <Card.Body className="p-4 text-center">
          {status === 'loading' && <Spinner className="mb-3" />}
          <Alert variant={status === 'success' ? 'success' : status === 'error' ? 'danger' : 'info'}>{message}</Alert>
          <Link to="/login">Về trang đăng nhập</Link>
        </Card.Body>
      </Card>
    </Container>
  );
}
