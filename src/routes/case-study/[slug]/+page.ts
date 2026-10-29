import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = () => {
  return [{ slug: 'trinidad-hri' }, { slug: 'telemetry-stream' }];
};

export const load: PageLoad = ({ params }) => {
  const isHri = params.slug === 'trinidad-hri';

  return {
    slug: params.slug,
    title: isHri ? 'Trinidad Teleoperation HRI Console' : 'Spatial Kinematics Telemetry Stream',
    kicker: isHri
      ? '2025 · INDUSTRIAL HUMAN-ROBOT INTERACTION'
      : '2024 · UX ENGINEERING & GRAPHICS',
    lead: isHri
      ? 'A resilient human-robot interaction design system engineered for high-consequence spatial teleoperation over high-latency WebRTC streams.'
      : '60 FPS canvas-accelerated telemetry inspection tool rendering 10,000 real-time coordinate updates on low-power operator tablets.',
    client: isHri ? 'Autonomous Robotics Research' : 'Precision Aerospace Lab',
    role: 'Lead UX Engineer & Design Systems Architect',
    timeline: isHri ? '6 Months · Q1–Q2 2025' : '4 Months · Q3–Q4 2024'
  };
};
