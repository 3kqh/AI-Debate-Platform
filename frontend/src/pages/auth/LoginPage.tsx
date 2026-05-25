import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@stores/authStore';
import { authService } from '@services/authService';
import { ENV } from '@/config/env';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: { theme: string; size: string; width?: number }) => void;
        };
      };
    };
  }
}

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleInitializedRef = useRef(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleCredential = useCallback(async ({ credential }: { credential: string }) => {
    setError('');
    try {
      const res = await authService.googleLogin({ idToken: credential });
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại');
    }
  }, [from, login, navigate]);

  useEffect(() => {
    if (!ENV.GOOGLE_CLIENT_ID) return;

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current || googleInitializedRef.current) return;
      googleInitializedRef.current = true;
      window.google.accounts.id.initialize({
        client_id: ENV.GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', width: 240 });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton, { once: true });
      return () => existingScript.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', renderGoogleButton, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener('load', renderGoogleButton);
  }, [handleGoogleCredential]);

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(data);
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm mt-5">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Đăng nhập</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="you@example.com" isInvalid={!!errors.email} {...register('email')} />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" placeholder="••••••" isInvalid={!!errors.password} {...register('password')} />
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Form.Group>

                <div className="text-end mb-3">
                  <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>

                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </Button>
              </Form>

              {ENV.GOOGLE_CLIENT_ID && (
                <>
                  <div className="text-center text-muted my-3">hoặc</div>
                  <div ref={googleButtonRef} className="d-flex justify-content-center" />
                </>
              )}

              <p className="text-center mt-3 mb-0">
                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
