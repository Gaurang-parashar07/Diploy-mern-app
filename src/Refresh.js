import React, { useEffect } from 'react'
import { useLocation , useNavigate } from 'react-router-dom';   

function Refresh({setAuthenticated}) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      setAuthenticated(true);
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/dashboard', { replace: false });
      }
    }
  }, [location, navigate, setAuthenticated]);

  const handleRefresh = () => {
    navigate(location.pathname, { replace: true });
  };

  return (
    <button onClick={handleRefresh}>
      Refresh
    </button>
  );
}

export default Refresh;