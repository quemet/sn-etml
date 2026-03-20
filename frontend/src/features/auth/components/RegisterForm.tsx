import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../schemas/auth.schema';
import { useRegister } from '../hooks/useRegister';
import { Link } from 'react-router-dom';

const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const IconLock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const RegisterForm = () => {
  const { isLoading, error, handleRegister } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...dto } = data;
    await handleRegister(dto);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {error && (
        <p role="alert" className="form-error-global">
          {error}
        </p>
      )}

      <div className="register-field-block">
        <p className="field-label">Username :</p>
        <div className={`field-input-row${errors.username ? ' input-error' : ''}`}>
          <div className="field-icon">
            <IconUser />
          </div>
          <div className="field-separator"></div>
          <input
            id="username"
            type="text"
            placeholder="Type your username here..."
            autoComplete="username"
            {...register('username')}
          />
        </div>
        {errors.username && (
          <p role="alert" className="field-error">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="register-field-block">
        <p className="field-label">Email :</p>
        <div className={`field-input-row${errors.email ? ' input-error' : ''}`}>
          <div className="field-icon">
            <IconMail />
          </div>
          <div className="field-separator"></div>
          <input
            id="email"
            type="email"
            placeholder="Type your personal email right here..."
            autoComplete="email"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p role="alert" className="field-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="register-field-block">
        <p className="field-label">Enter your password :</p>
        <div className={`field-input-row${errors.password ? ' input-error' : ''}`}>
          <div className="field-icon">
            <IconLock />
          </div>
          <div className="field-separator"></div>
          <input
            id="password"
            type="password"
            placeholder="Type your password here..."
            autoComplete="new-password"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p role="alert" className="field-error">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="register-field-block">
        <p className="field-label">Confirm your password :</p>
        <div className={`field-input-row${errors.confirmPassword ? ' input-error' : ''}`}>
          <div className="field-icon">
            <IconLock />
          </div>
          <div className="field-separator"></div>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Type your confirm password here..."
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p role="alert" className="field-error">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <p className="register-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      <div className="register-submit-block">
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
