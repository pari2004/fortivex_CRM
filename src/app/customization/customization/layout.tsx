import { CustomizationLayout } from '@/components/customize/CustomizationLayout';

export default function CustomizationSubmoduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomizationLayout>{children}</CustomizationLayout>;
}
