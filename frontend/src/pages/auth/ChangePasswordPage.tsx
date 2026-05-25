import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@services/authService';

const schema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type ChangePasswordForm = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ChangePasswordForm) => {
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await authService.changePassword(data);
      reset();
      setMessage('Đổi mật khẩu thành công.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 520 }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Đổi mật khẩu</h3>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control type="password" isInvalid={!!errors.currentPassword} {...register('currentPassword')} />
              <Form.Control.Feedback type="invalid">{errors.currentPassword?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control type="password" isInvalid={!!errors.newPassword} {...register('newPassword')} />
              <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control type="password" isInvalid={!!errors.confirmPassword} {...register('confirmPassword')} />
              <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
