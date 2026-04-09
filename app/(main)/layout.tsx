import { AppShell } from "@/components/layout/AppShell";
import { MainGate } from "@/components/layout/MainGate";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainGate>
      <AppShell>{children}</AppShell>
    </MainGate>
  );
}
