import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch } from "react-redux";
import { addUserDocument } from "../actions/userAction";
import styles from "../styles/Register.module.scss";
import { timestamp } from "../firebase";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { register } = useAuth();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }

    try {
      setError("");
      setLoading(true);

      const { user } = await register(
        emailRef.current.value,
        passwordRef.current.value
      );

      const newUser = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        isAvailable: true,
        topic: "",
        rooms: [],
        createdAt: timestamp(),
      };

      dispatch(addUserDocument(user.uid, newUser));

      setLoading(false);
      history.push("/");
    } catch (err) {
      setLoading(false);
      return setError(err.message);
    }
  };

  return (
    <section className={styles.background}>
      <div className={styles.registerGlass}>
        <h1>Create an account</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" ref={usernameRef} required />

            <label htmlFor="email">Email</label>
            <input type="text" id="email" ref={emailRef} required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef} required />

            <label htmlFor="password-confirm">Confirm Password</label>
            <input
              type="password"
              id="password-confirm"
              ref={passwordConfirmRef}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.btnSubmit} disabled={loading} type="submit">
            Register
          </button>
        </form>

        <div className={styles.navigate}>
          Already have an account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </div>
      </div>

      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>
    </section>
  );
};

export default Register;
