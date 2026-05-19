import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
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
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-chat-square-quote me-2" />
          AI Debate
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
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
                  <span>
                    <i className="bi bi-person-circle me-1" />
                    {user.profile.displayName || user.username}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to={`/profile/${user._id}`}>
                  Hồ sơ
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link as any} to="/login" variant="outline-light" size="sm">
                  Đăng nhập
                </Button>
                <Button as={Link as any} to="/register" variant="primary" size="sm">
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
