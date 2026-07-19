import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full min-h-full flex justify-center bg-bg overflow-scroll">
      <main className="max-w-[430px] w-full bg-bg antialiased">{children}</main>
    </div>
  );
}
