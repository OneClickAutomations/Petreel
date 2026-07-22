import AuthLayout from '../components/auth/AuthLayout';
import AuthForm from '../components/auth/AuthForm';

export default function SignUp() {
  return (
    <AuthLayout
      title="Bring them to life"
      subtitle="Create your account — your first animation is free."
    >
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
