import Shell, { viewport as shellViewport } from "../shell";

export const viewport = shellViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
