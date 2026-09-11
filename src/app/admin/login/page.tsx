import { LoginForm } from "@/features/admin-review";

export default function AdminLoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-muted p-4"
      style={{
        backgroundImage:
          "radial-gradient(900px 480px at 50% 0%, color-mix(in srgb, var(--color-brand-600) 8%, transparent) 0%, transparent 65%)",
      }}
    >
      <LoginForm />
    </main>
  );
}
