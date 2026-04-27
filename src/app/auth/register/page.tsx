import PageContainer from '@/components/layout/page-container';
import RegisterForm from '@/components/register-form';

export default function Register() {
  return (
    <PageContainer>
      <section className="mx-auto max-w-md">
        <RegisterForm />
      </section>
    </PageContainer>
  );
}
