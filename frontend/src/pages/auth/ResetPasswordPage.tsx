import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@services/authService';

const schema = z.object({
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ResetPasswordForm) => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Thiếu token đặt lại mật khẩu.');
      return;
    }

    setMessage('');
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword({ token, ...data });
      setMessage('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 520 }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Đặt lại mật khẩu</h3>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control type="password" isInvalid={!!errors.password} {...register('password')} />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control type="password" isInvalid={!!errors.confirmPassword} {...register('confirmPassword')} />
              <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</Button>
          </Form>
          <div className="text-center mt-3"><Link to="/login">Về trang đăng nhập</Link></div>
        </Card.Body>
      </Card>
    </Container>
  );
}
