import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { useAuthStore } from '@stores/authStore';
import { authService } from '@services/authService';

export function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      navigate('/');
    }
  };

  return (
    <Navbar expand="lg" sticky="top" className="navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-chat-square-quote me-2" />
          AI Debate
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" style={{ borderColor: 'rgba(0,245,255,0.4)' }} />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/matches">
              <i className="bi bi-broadcast me-1" />
              Live Matches
            </Nav.Link>
            <Nav.Link as={Link} to="/leaderboard">
              <i className="bi bi-trophy me-1" />
              Leaderboard
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/matchmaking">
                  <i className="bi bi-lightning me-1" />
                  Rank
                </Nav.Link>
                <Nav.Link as={Link} to="/rooms/create">
                  <i className="bi bi-plus-circle me-1" />
                  Tạo phòng
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {isAuthenticated && user ? (
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center gap-2">
                    {user.profile.avatar ? (
                      <>
                        <Image
                          src={user.profile.avatar}
                          alt={user.profile.displayName || user.username}
                          width={24}
                          height={24}
                          roundedCircle
                          style={{ objectFit: 'cover' }}
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                            const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'inline-flex';
                          }}
                        />
                        <span
                          className="rounded-circle align-items-center justify-content-center"
                          style={{
                            width: 24,
                            height: 24,
                            display: 'none',
                            color: 'var(--bs-primary)',
                            border: '1px solid var(--border-neon)',
                            background: 'rgba(0, 245, 255, 0.08)',
                          }}
                        >
                          <i className="bi bi-person-fill" />
                        </span>
                      </>
                    ) : (
                      <span
                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: 24,
                          height: 24,
                          color: 'var(--bs-primary)',
                          border: '1px solid var(--border-neon)',
                          background: 'rgba(0, 245, 255, 0.08)',
                        }}
                      >
                        <i className="bi bi-person-fill" />
                      </span>
                    )}
                    <span>{user.profile.displayName || user.username}</span>
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to={`/profile/${user._id}`}>
                  <i className="bi bi-person me-2" />
                  Hồ sơ
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2" />
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  as={Link as any}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="px-3"
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link as any}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="px-3"
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
