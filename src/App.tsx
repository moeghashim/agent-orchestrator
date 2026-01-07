import { Analytics } from '@vercel/analytics/react';
import { AgentFacilitator } from './components';

export default function App() {
  return (
    <>
      <AgentFacilitator />
      <Analytics />
    </>
  );
}
