import { Outlet } from 'react-router-dom';

/**
 * Full-screen layout for debate room — no navbar/footer to maximize space.
 */
export default function DebateLayout() {
  return (
    <div className="vh-100 d-flex flex-column">
      <Outlet />
    </div>
  );
}
