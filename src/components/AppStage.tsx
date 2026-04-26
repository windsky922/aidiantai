import type { PropsWithChildren } from 'react';

export function AppStage({ children }: PropsWithChildren) {
  return (
    <main className="stage">
      <div className="fluid fluid-blue" />
      <div className="fluid fluid-violet" />
      <div className="fluid fluid-rose" />
      <div className="noise" />
      {children}
    </main>
  );
}

