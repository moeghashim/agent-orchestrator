import { Analytics } from '@vercel/analytics/next';
import { AgentFacilitator } from './components';

export default function App() {
  return (
    <>
      <AgentFacilitator />
      <Analytics />
    </>
  );
}
