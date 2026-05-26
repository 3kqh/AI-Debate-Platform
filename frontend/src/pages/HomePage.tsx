import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

const primaryCtaByAuth = {
  authenticated: { to: '/matchmaking', label: 'Vào xếp hạng', icon: 'bi bi-lightning' },
  guest: { to: '/register', label: 'Bắt đầu ngay', icon: 'bi bi-rocket-takeoff' },
};

const secondaryCtaByAuth = {
  authenticated: { to: '/rooms/create', label: 'Tạo phòng', icon: 'bi bi-plus-circle' },
  guest: { to: '/matches', label: 'Xem trận đấu', icon: 'bi bi-play-circle' },
};

const entryPoints = [
  {
    title: 'Vào trận theo cách bạn muốn',
    description:
      'Chọn xếp hạng để gặp đối thủ phù hợp hoặc mở phòng riêng cho bạn bè và câu lạc bộ.',
    bullets: ['Ranked matchmaking', 'Phòng riêng linh hoạt', '1v1 và 3v3'],
    cta: { to: '/matchmaking', label: 'Khám phá chế độ đấu', icon: 'bi bi-people-fill' },
    panel: {
      eyebrow: 'Bắt đầu nhanh',
      title: 'Ranked hoặc custom room',
      detail: 'Ghép cặp nhanh hoặc chủ động tạo bàn tranh biện của riêng bạn.',
      stats: [
        { label: 'Chế độ', value: '1v1 / 3v3' },
        { label: 'Truy cập', value: 'Công khai / riêng tư' },
      ],
    },
  },
  {
    title: 'AI giúp bạn tranh biện tốt hơn',
    description:
      'Không chỉ chấm điểm, AI còn chỉ ra lập luận yếu, ngụy biện và điểm cần cải thiện sau mỗi trận.',
    bullets: ['Phân tích lập luận', 'Phát hiện ngụy biện', 'Phản hồi sau trận'],
    cta: { to: '/matches', label: 'Xem trải nghiệm AI', icon: 'bi bi-robot' },
    panel: {
      eyebrow: 'Lợi thế khác biệt',
      title: 'Feedback rõ ràng, công bằng',
      detail: 'Biến mỗi trận đấu thành một vòng học tập có thể đo được.',
      stats: [
        { label: 'Phân tích', value: 'Lập luận' },
        { label: 'Nhận diện', value: 'Ngụy biện' },
      ],
    },
  },
  {
    title: 'Theo dõi tiến bộ thật qua từng trận',
    description:
      'Điểm ELO, lịch sử thắng thua và hồ sơ cá nhân giúp bạn biết mình đang tiến lên ở đâu.',
    bullets: ['Xếp hạng ELO', 'Lịch sử trận đấu', 'Hồ sơ tiến bộ'],
    cta: { to: '/leaderboard', label: 'Xem bảng xếp hạng', icon: 'bi bi-trophy' },
    panel: {
      eyebrow: 'Tiến bộ đo được',
      title: 'Stats không chỉ để trưng bày',
      detail: 'Biết bạn đang mạnh ở đâu và cần luyện thêm điều gì.',
      stats: [
        { label: 'Theo dõi', value: 'Win / Loss' },
        { label: 'Cải thiện', value: 'Theo thời gian' },
      ],
    },
  },
  {
    title: 'Xem cộng đồng tranh biện đang diễn ra',
    description:
      'Theo dõi trận đang live, bảng xếp hạng và hoạt động nổi bật để học nhanh hơn từ người khác.',
    bullets: ['Live matches', 'Leaderboard', 'Quan sát chiến thuật'],
    cta: { to: '/matches', label: 'Xem trận đang diễn ra', icon: 'bi bi-broadcast' },
    panel: {
      eyebrow: 'Khám phá cộng đồng',
      title: 'Học qua quan sát',
      detail: 'Không cần vào trận ngay, bạn vẫn có thể xem, phân tích và học hỏi.',
      stats: [
        { label: 'Theo dõi', value: 'Trận trực tiếp' },
        { label: 'Khám phá', value: 'Top người chơi' },
      ],
    },
  },
] as const;

const sectionDelayClasses = ['landing-animate-delay-1', 'landing-animate-delay-2', 'landing-animate-delay-3', 'landing-animate-delay-4'] as const;

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const primaryCta = isAuthenticated ? primaryCtaByAuth.authenticated : primaryCtaByAuth.guest;
  const secondaryCta = isAuthenticated ? secondaryCtaByAuth.authenticated : secondaryCtaByAuth.guest;

  return (
    <div className="landing-page">
      <section className="landing-hero py-5 py-lg-6">
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <Badge bg="secondary" className="landing-kicker landing-animate-fade-up mb-3">
              Academic debate, powered by AI
            </Badge>
            <h1 className="landing-title landing-animate-fade-up landing-animate-delay-1 mb-3">
              Nền tảng tranh biện AI cho thi đấu học thuật
            </h1>
            <p className="landing-subtitle landing-animate-fade-up landing-animate-delay-2 mb-4">
              Tranh biện xếp hạng, tạo phòng riêng và nhận phản hồi AI rõ ràng sau mỗi trận.
            </p>
            <div className="landing-hero-actions landing-animate-fade-up landing-animate-delay-3 d-flex flex-column flex-sm-row gap-3">
              <Button as={Link as any} to={primaryCta.to} variant="primary" size="lg" className="landing-interactive-lift">
                <i className={`${primaryCta.icon} me-2`} />
                {primaryCta.label}
              </Button>
              <Button as={Link as any} to={secondaryCta.to} variant="outline-primary" size="lg" className="landing-interactive-lift">
                <i className={`${secondaryCta.icon} me-2`} />
                {secondaryCta.label}
              </Button>
            </div>
          </Col>

          <Col lg={6}>
            <div className="landing-showcase landing-animate-fade-up landing-animate-delay-2">
              <div className="landing-showcase-panel landing-showcase-panel-primary landing-soft-glow">
                <span className="landing-panel-label">Live Debate Room</span>
                <h2>Cross Examination đang diễn ra</h2>
                <p>Luồng tranh biện rõ ràng, tốc độ nhanh, tập trung vào quyết định và phản biện.</p>
                <div className="landing-showcase-stats">
                  <div>
                    <span>Format</span>
                    <strong>1v1 / 3v3</strong>
                  </div>
                  <div>
                    <span>Judge</span>
                    <strong>AI + Ranking</strong>
                  </div>
                  <div>
                    <span>Queue</span>
                    <strong>Live Matchmaking</strong>
                  </div>
                </div>
              </div>

              <div className="landing-showcase-panel landing-showcase-panel-secondary landing-soft-glow landing-animate-fade-up landing-animate-delay-4">
                <span className="landing-panel-label">Player Snapshot</span>
                <div className="landing-mini-stats">
                  <div>
                    <span>ELO</span>
                    <strong>1480</strong>
                  </div>
                  <div>
                    <span>Win rate</span>
                    <strong>64%</strong>
                  </div>
                  <div>
                    <span>Feedback</span>
                    <strong>4 điểm mạnh</strong>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {entryPoints.map((section, index) => {
        const imageFirst = index % 2 === 0;
        const delayClass = sectionDelayClasses[index % sectionDelayClasses.length];

        return (
          <section key={section.title} className={`landing-section landing-animate-fade-up ${delayClass} py-5`}>
            <Row className="align-items-center g-4 g-lg-5 flex-lg-row">
              <Col lg={6} className={imageFirst ? 'order-lg-1' : 'order-lg-2'}>
                <div className="landing-feature-panel landing-interactive-lift h-100">
                  <span className="landing-panel-label">{section.panel.eyebrow}</span>
                  <h2 className="landing-section-title">{section.panel.title}</h2>
                  <p className="landing-section-copy">{section.panel.detail}</p>
                  <div className="landing-feature-stats">
                    {section.panel.stats.map((stat) => (
                      <div key={stat.label} className="landing-feature-stat">
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              <Col lg={6} className={imageFirst ? 'order-lg-2' : 'order-lg-1'}>
                <div className="landing-section-copy-wrap">
                  <h2 className="landing-section-title">{section.title}</h2>
                  <p className="landing-section-copy">{section.description}</p>
                  <ul className="landing-bullets list-unstyled mb-4">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>
                        <i className="bi bi-check-circle-fill me-2" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Button as={Link as any} to={section.cta.to} variant="outline-primary" className="landing-interactive-lift">
                    <i className={`${section.cta.icon} me-2`} />
                    {section.cta.label}
                  </Button>
                </div>
              </Col>
            </Row>
          </section>
        );
      })}

      <section className="landing-final-cta landing-animate-fade-up landing-animate-delay-3 py-5">
        <Card className="landing-final-cta-card landing-soft-glow border-0 shadow-sm">
          <Card.Body className="text-center py-5 px-4 px-lg-5">
            <h2 className="landing-final-title mb-3">Sẵn sàng cho trận tranh biện tiếp theo?</h2>
            <p className="landing-final-copy mb-4">
              Bắt đầu với một trận xếp hạng, mở phòng riêng hoặc khám phá cộng đồng đang tranh biện ngay lúc này.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button as={Link as any} to={primaryCta.to} variant="primary" size="lg" className="landing-interactive-lift">
                <i className={`${primaryCta.icon} me-2`} />
                {primaryCta.label}
              </Button>
              <Button as={Link as any} to={secondaryCta.to} variant="outline-primary" size="lg" className="landing-interactive-lift">
                <i className={`${secondaryCta.icon} me-2`} />
                {secondaryCta.label}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}
