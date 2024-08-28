import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebaseConfig';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    loginContainer: {
      maxWidth: '450px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    },
    title: {
      marginBottom: '30px',
      fontSize: '28px',
      color: '#333',
      fontWeight: 'bold'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '20px'
    },
    label: {
      fontSize: '16px',
      marginBottom: '8px',
      color: '#555',
      alignSelf: 'flex-start'
    },
    inputWithIcon: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '0 15px',
      backgroundColor: 'white',
      transition: 'border-color 0.3s, box-shadow 0.3s'
    },
    input: {
      flex: '1',
      padding: '12px 10px',
      border: 'none',
      outline: 'none',
      fontSize: '16px',
      width: '100%'
    },
    inputIcon: {
      marginRight: '12px',
      color: '#555'
    },
    button: {
      width: '50%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.1s',
      margin: '20px auto 0'
    },
    buttonHover: {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)'
    },
    errorMessage: {
      marginTop: '20px',
      color: '#dc3545',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h2 style={styles.title}>Welcome To Admin Panel</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWithIcon}>
            <Mail size={20} style={styles.inputIcon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWithIcon}>
            <Lock size={20} style={styles.inputIcon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
            e.currentTarget.style.transform = styles.buttonHover.transform;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Login
        </button>
      </form>
      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Login;