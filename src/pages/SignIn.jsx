import AuthLayout from '../components/auth/AuthLayout';
import AuthForm from '../components/auth/AuthForm';

export default function SignIn() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to make your next Reel.">
      <AuthForm mode="signin" />
    </AuthLayout>
  );
}
