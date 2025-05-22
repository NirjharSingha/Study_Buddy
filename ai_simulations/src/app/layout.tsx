import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { BodyWrapper } from "@/components/layout/BodyWrapper";

export const metadata: Metadata = {
  title: "Physics Simulations",
  description: "Interactive physics simulations for learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <BodyWrapper>
        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </BodyWrapper>
    </html>
  );
}
