import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./helpers/PrivateRoute";
import { CallProvider } from "./contexts/CallContext";
import VideoCall from "./components/VideoCall";
import RoomCall from "./components/RoomCall";
import { RoomCallProvider } from "./contexts/RoomCallContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CallProvider>
          <RoomCallProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/videocall/:id" component={VideoCall} />
              <PrivateRoute path="/roomcall/:id" component={RoomCall} />
            </Switch>
          </RoomCallProvider>
        </CallProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
