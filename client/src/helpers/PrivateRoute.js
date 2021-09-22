import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loggedUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return loggedUser ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
};

export default PrivateRoute;
