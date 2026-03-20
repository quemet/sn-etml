import RegisterForm from '../features/auth/components/RegisterForm';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-root">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Register</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
