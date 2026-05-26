import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@services/userService';
import { useAuthStore } from '@stores/authStore';
import type { User } from '@/types';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Vui lòng nhập tên hiển thị').max(50, 'Tối đa 50 ký tự'),
  avatar: z.union([z.string().url('URL ảnh không hợp lệ'), z.literal('')]),
  bio: z.string().max(500, 'Tối đa 500 ký tự'),
  school: z.string().max(100, 'Tối đa 100 ký tự'),
  club: z.string().max(100, 'Tối đa 100 ký tự'),
});

const fallbackAvatar = 'https://via.placeholder.com/160?text=User';

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, setUser } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const isOwner = !!currentUser && currentUser._id === userId;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    userService.getProfile(userId)
      .then((res) => {
        const user = res.data.data;
        setProfile(user);
        reset({
          displayName: user.profile.displayName || user.username,
          avatar: user.profile.avatar || '',
          bio: user.profile.bio || '',
          school: user.profile.school || '',
          club: user.profile.club || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải hồ sơ'))
      .finally(() => setLoading(false));
  }, [reset, userId]);

  const onSubmit = async (data: ProfileForm) => {
    if (!userId) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await userService.updateProfile(userId, data);
      setProfile(res.data.data);
      if (isOwner) setUser(res.data.data);
      setMessage('Cập nhật hồ sơ thành công.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Container className="py-5 text-center"><Spinner /></Container>;
  }

  if (!profile) {
    return <Container className="py-5"><Alert variant="danger">{error || 'Không tìm thấy hồ sơ'}</Alert></Container>;
  }

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Image
                src={profile.profile.avatar || fallbackAvatar}
                roundedCircle
                width={160}
                height={160}
                className="object-fit-cover mb-3"
                onError={(event) => {
                  if (event.currentTarget.src !== fallbackAvatar) {
                    event.currentTarget.src = fallbackAvatar;
                  }
                }}
              />
              <h3>{profile.profile.displayName || profile.username}</h3>
              <p className="text-muted mb-2">@{profile.username}</p>
              <Badge bg={profile.isEmailVerified ? 'success' : 'warning'}>{profile.isEmailVerified ? 'Email đã xác thực' : 'Chưa xác thực email'}</Badge>
              <hr />
              <div className="d-flex justify-content-between"><span>ELO</span><strong>{profile.ranking.elo}</strong></div>
              <div className="d-flex justify-content-between"><span>Tier</span><strong>{profile.ranking.tier}</strong></div>
              <div className="d-flex justify-content-between"><span>Thắng / Thua</span><strong>{profile.stats.wins} / {profile.stats.losses}</strong></div>
              <div className="d-flex justify-content-between"><span>Tổng debate</span><strong>{profile.stats.totalDebates}</strong></div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Hồ sơ</h4>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              {isOwner ? (
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên hiển thị</Form.Label>
                    <Form.Control isInvalid={!!errors.displayName} {...register('displayName')} />
                    <Form.Control.Feedback type="invalid">{errors.displayName?.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control isInvalid={!!errors.avatar} {...register('avatar')} />
                    <Form.Control.Feedback type="invalid">{errors.avatar?.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={4} isInvalid={!!errors.bio} {...register('bio')} />
                    <Form.Control.Feedback type="invalid">{errors.bio?.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Trường</Form.Label>
                        <Form.Control isInvalid={!!errors.school} {...register('school')} />
                        <Form.Control.Feedback type="invalid">{errors.school?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CLB</Form.Label>
                        <Form.Control isInvalid={!!errors.club} {...register('club')} />
                        <Form.Control.Feedback type="invalid">{errors.club?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</Button>
                </Form>
              ) : (
                <div>
                  <p><strong>Bio:</strong> {profile.profile.bio || 'Chưa cập nhật'}</p>
                  <p><strong>Trường:</strong> {profile.profile.school || 'Chưa cập nhật'}</p>
                  <p><strong>CLB:</strong> {profile.profile.club || 'Chưa cập nhật'}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
