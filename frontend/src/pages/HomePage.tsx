import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {/* Hero */}
      <div className="text-center py-5">
        <h1 className="display-4 fw-bold">AI Debate Platform</h1>
        <p className="lead text-muted">
          Tranh biện trực tuyến theo chuẩn học thuật quốc tế, hỗ trợ bởi AI
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          {isAuthenticated ? (
            <>
              <Button as={Link as any} to="/matchmaking" variant="primary" size="lg">
                <i className="bi bi-lightning me-2" />
                Xếp hạng
              </Button>
              <Button as={Link as any} to="/rooms/create" variant="outline-primary" size="lg">
                <i className="bi bi-plus-circle me-2" />
                Tạo phòng
              </Button>
            </>
          ) : (
            <>
              <Button as={Link as any} to="/register" variant="primary" size="lg">
                Bắt đầu ngay
              </Button>
              <Button as={Link as any} to="/matches" variant="outline-primary" size="lg">
                Xem trận đấu
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <Row className="g-4 mt-3">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-people-fill fs-1 text-primary" />
              <Card.Title className="mt-3">1v1 & 3v3</Card.Title>
              <Card.Text className="text-muted">
                Tranh biện cá nhân hoặc đội, theo luật Cross Examination chuẩn quốc tế.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-robot fs-1 text-primary" />
              <Card.Title className="mt-3">AI BGK</Card.Title>
              <Card.Text className="text-muted">
                AI phân tích lập luận, phát hiện ngụy biện, chấm điểm công bằng.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-trophy fs-1 text-primary" />
              <Card.Title className="mt-3">ELO Ranking</Card.Title>
              <Card.Text className="text-muted">
                Hệ thống xếp hạng ELO, theo dõi tiến bộ qua từng trận.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
