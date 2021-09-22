import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { updateUserStatus } from "../actions/userAction";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Register.module.scss";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const { user } = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      dispatch(
        updateUserStatus({
          id: user.uid,
          availabilityStatus: true,
        })
      );

      setLoading(false);
      history.push("/");
    } catch (err) {
      setLoading(false);
      return setError(err.message);
    }
  };

  return (
    <section className={styles.background}>
      <div className={styles.loginGlass}>
        <h1>Welcome Back</h1>
        <h4>Please login with your credentials to continue</h4>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" ref={emailRef} required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef} required />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.btnSubmit} disabled={loading} type="submit">
            Login
          </button>
        </form>

        <div className={styles.navigate}>
          Need an account?{" "}
          <Link to="/register">
            <span>Register</span>
          </Link>
        </div>
      </div>

      <div className={styles.circle4}></div>
      <div className={styles.circle5}></div>
    </section>
  );
};

export default Login;
