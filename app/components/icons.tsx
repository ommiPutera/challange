import { LucideProps, icons } from "lucide-react";

function Icon({ name, ...props }: LucideProps & { name: keyof typeof icons }) {
  // eslint-disable-next-line import/namespace
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
}

export { Icon };
