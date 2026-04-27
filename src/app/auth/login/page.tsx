import LoginForm from '@/components/login-form';
import PageContainer from '@/components/layout/page-container';

export default function Login() {
  return (
    <PageContainer>
      <section className="mx-auto max-w-md">
        <LoginForm />
      </section>
    </PageContainer>
  );
}
