import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

import useAuth from "../hooks/useAuth/useAuth";
import ScaleLoader from './../../node_modules/react-spinners/esm/ScaleLoader';

const Protector = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();

  // Show a skeleton dashboard loader while user data is being fetched
  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
       <ScaleLoader
  color="rgba(36, 1, 219, 1)"
  height={40}
  loading
/>
      </div>
    );
  }

  // Redirect to the login page if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
};
Protector.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protector;

