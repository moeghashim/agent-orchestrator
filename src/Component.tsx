import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Network,
  Disc,
  MoveRight,
  Star,
  Hexagon,
  Code,
  Boxes,
  Activity,
  Shield,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Shared UI Components (Reference Style) ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <motion.button
      className={cn("relative overflow-hidden group", className)}
      whileHover="hover"
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 bg-blue-600 translate-y-full"
        variants={{
          hover: { translateY: 0 }
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">{children}</span>
    </motion.button>
  );
};

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  
  return (
    <div ref={ref} className={cn("overflow-hidden h-full w-full relative", className)}>
      <motion.img 
        style={{ y }}
        src={src} 
        alt={alt} 
        className="w-full h-[120%] object-cover object-center absolute -top-[10%]"
      />
    </div>
  );
};

const Marquee = ({ children, direction = 1 }: { children: React.ReactNode; direction?: number }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap flex select-none py-8 border-y border-stone-300 bg-stone-100">
      <motion.div
        className="flex min-w-full gap-16 items-center"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
};

const ServiceItem = ({ 
  number, 
  title, 
  description, 
  icon: Icon,
  index,
  tags 
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: any;
  index: number;
  tags: string[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      viewport={{ once: true }}
      className="group relative border-b border-stone-300 last:border-b-0 cursor-pointer"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[180px] md:min-h-[220px]">
        <div className="col-span-1 md:col-span-1 p-6 flex items-start justify-center border-r border-stone-300/30">
          <span className="text-xs font-mono text-stone-400 mt-2">{number}</span>
        </div>
        
        <div className="col-span-1 md:col-span-6 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <Icon className="w-5 h-5 text-blue-600" />
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight font-serif italic">{title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest border border-stone-300 px-2 py-1 rounded-full text-stone-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-5 flex items-center p-6 md:p-10">
           <p className="text-stone-500 text-sm leading-relaxed group-hover:text-stone-800 transition-colors duration-500">
             {description}
           </p>
        </div>

        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <ArrowUpRight className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Layout ---

export default function NeuralFoundry() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const industrialImages = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop", // Cyber Security
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop", // Hardware
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"  // Network
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % industrialImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [industrialImages.length]);

  return (
    <div className="bg-[#EBEBE8] text-[#18181B] min-h-screen font-sans selection:bg-[#18181B] selection:text-white overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .stroke-text {
          -webkit-text-stroke: 1px #18181B;
        }
      `}</style>

      <NoiseOverlay />
      
      {/* Structural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none grid grid-cols-6 md:grid-cols-12 max-w-[1600px] mx-auto border-x border-stone-300/30 z-0">
        {[...Array(11)].map((_, i) => (
          <div key={i} className="border-r border-stone-300/10 h-full"></div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto border-x border-stone-300 bg-[#EBEBE8]/50">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#EBEBE8]/90 backdrop-blur-md border-b border-stone-300">
          <div className="flex justify-between items-center px-4 md:px-8 py-5">
            <nav className="flex items-center gap-8">
              <a href="#foundry" className="text-xs font-mono font-medium tracking-widest uppercase hover:text-blue-600 transition-colors">Infrastructure</a>
              <a href="#capabilities" className="text-xs font-mono font-medium tracking-widest uppercase hidden md:block hover:text-blue-600 transition-colors">Capabilities</a>
            </nav>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group cursor-pointer">
              <Hexagon className="w-5 h-5 text-blue-600 animate-spin-slow" />
              <span className="font-bold tracking-tight text-xl font-serif italic uppercase">Neural<span className="not-italic font-sans">Foundry</span></span>
            </div>

            <nav className="flex items-center gap-8">
              <a href="#docs" className="text-xs font-mono font-medium tracking-widest uppercase hidden md:block hover:text-blue-600 transition-colors">Documentation</a>
              <MagneticButton className="px-5 py-2 bg-stone-900 text-white rounded-full text-xs font-mono uppercase tracking-widest transition-colors">
                Terminal Login
              </MagneticButton>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-stone-300 min-h-[85vh]">
          
          {/* Hero Left Content */}
          <div className="col-span-1 lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-300 relative overflow-hidden">
            
            <div className="absolute top-8 left-8 flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-mono text-stone-400 tracking-widest">CORE-SYSTEM-ONLINE // v4.2.0</span>
            </div>

            <div className="mt-16 lg:mt-24">
               <h1 className="flex flex-col text-7xl md:text-9xl xl:text-[9.5rem] leading-[0.8] tracking-tighter text-stone-900">
                 <span className="font-serif italic font-light">Engineered</span>
                 <span className="font-bold tracking-tighter text-transparent stroke-text">INTELLIGENCE</span>
               </h1>

               <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                  <div className="max-w-sm">
                     <p className="font-serif text-2xl italic text-stone-600 leading-tight mb-6">
                       Standardizing the deployment of cognitive infrastructure.
                     </p>
                     <p className="text-sm font-mono text-stone-500 leading-relaxed">
                       Neural Foundry provides the hardened substrate required for high-stakes AI orchestration and autonomous agent swarms.
                     </p>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="p-6 border border-stone-300 bg-white/30 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-6">
                           <span className="text-[10px] font-mono uppercase text-stone-400">Next-Gen Deployment</span>
                           <ArrowUpRight className="w-4 h-4 text-stone-300" />
                        </div>
                        <p className="text-xs font-mono text-stone-600 mb-6 uppercase tracking-wider">Deploy your first agent in under 45 seconds.</p>
                        <MagneticButton className="w-full h-12 bg-blue-600 text-white flex items-center justify-center gap-3 px-6 group">
                           <span className="font-mono text-xs uppercase tracking-widest">Initialize Foundry</span>
                           <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                     </div>
                  </div>
               </div>
            </div>

            <div className="hidden lg:flex items-center gap-12 mt-12 pt-8 border-t border-stone-300/50">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">Uptime</span>
                  <span className="font-medium text-sm tabular-nums">99.999%</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">Compute</span>
                  <span className="font-medium text-sm">H100 Clusters</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">Encryption</span>
                  <span className="font-medium text-sm">Quantum-Resistant</span>
               </div>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="col-span-1 lg:col-span-5 relative bg-stone-200 overflow-hidden h-[500px] lg:h-auto group">
             <div className="absolute inset-0 z-20 border-[24px] border-[#EBEBE8] pointer-events-none"></div>
             
             <AnimatePresence mode="wait">
               <motion.img 
                  key={activeSlide}
                  src={industrialImages[activeSlide]}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.05, opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
               />
             </AnimatePresence>
             
             <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply pointer-events-none"></div>

             {/* Dynamic Tech Overlay */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/5 group-hover:scale-110 transition-transform duration-700">
                   <div className="w-32 h-32 border border-white/40 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 border border-white/60 rounded-full animate-ping"></div>
                   </div>
                </div>
             </div>
             
             <div className="absolute bottom-12 left-12 right-12 z-30">
                <div className="bg-stone-900/90 backdrop-blur-lg border border-stone-800 p-5">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-stone-500 uppercase">Real-time Stream</span>
                      <div className="flex gap-1">
                         <div className="w-1 h-3 bg-blue-600"></div>
                         <div className="w-1 h-5 bg-blue-600"></div>
                         <div className="w-1 h-2 bg-blue-600"></div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="text-white">
                         <p className="text-[8px] font-mono text-stone-500 uppercase mb-1">Packet Throughput</p>
                         <p className="text-xl font-mono">1.42 GB/s</p>
                      </div>
                      <div className="text-white">
                         <p className="text-[8px] font-mono text-stone-500 uppercase mb-1">Active Agents</p>
                         <p className="text-xl font-mono">8,421</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Feature Marquee */}
        <Marquee>
          <span className="text-6xl md:text-8xl font-bold tracking-tighter text-stone-300 mx-8 opacity-40 uppercase">Hardened Kernels</span>
          <Star className="w-8 h-8 text-blue-600 mx-8" fill="currentColor" />
          <span className="text-6xl md:text-8xl font-serif italic text-stone-900 mx-8 uppercase">Neural Orchestration</span>
          <Star className="w-8 h-8 text-blue-600 mx-8" fill="currentColor" />
          <span className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent stroke-text mx-8 uppercase">Multi-Agent Swarms</span>
          <Star className="w-8 h-8 text-blue-600 mx-8" fill="currentColor" />
        </Marquee>

        {/* Capabilities Section */}
        <section id="capabilities" className="bg-[#EBEBE8] py-20 md:py-32 border-b border-stone-300 relative">
          <div className="px-6 md:px-12 mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
             <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-px bg-blue-600"></div>
                   <span className="text-xs font-mono uppercase text-blue-600 tracking-widest">Operational Capabilities</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
                  Industrial tools for <br/><span className="text-stone-400 font-serif italic">autonomous systems.</span>
                </h2>
             </div>
             
             <div className="hidden lg:block text-right">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-[0.3em] mb-4">Foundation Protocol</p>
                <div className="flex gap-2 justify-end">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-1 bg-stone-300"></div>)}
                </div>
             </div>
          </div>

          <div className="border-t border-stone-300">
             <ServiceItem 
               index={0}
               number="01" 
               title="Swarm Controller" 
               icon={Boxes}
               description="Coordinate thousands of specialized agents through a single unified protocol. Handles load balancing, consensus, and state synchronization."
               tags={["Orchestration", "Auto-scaling", "GRPC"]}
             />
             <ServiceItem 
               index={1}
               number="02" 
               title="Secure Kernel" 
               icon={Shield}
               description="A zero-trust execution environment for LLM operations. Sandboxed runtimes with hardware-level memory isolation for proprietary data."
               tags={["TEE", "Encryption", "Isolation"]}
             />
             <ServiceItem 
               index={2}
               number="03" 
               title="Cognitive Pipelines" 
               icon={Network}
               description="Build complex inference graphs with drag-and-drop node interfaces. Optimize latency by routing tasks through localized compute clusters."
               tags={["Graph Theory", "Low-Latency", "Edges"]}
             />
             <ServiceItem 
               index={3}
               number="04" 
               title="Agentic Observability" 
               icon={Activity}
               description="Deep-trace agent reasoning paths. Monitor hallucination rates, token efficiency, and computational spend in real-time."
               tags={["Monitoring", "Tracing", "Analytics"]}
             />
          </div>
        </section>

        {/* Parallax Mid-Section */}
        <section className="h-[80vh] overflow-hidden relative border-b border-stone-300 flex items-center justify-center bg-stone-900 text-white">
           <div className="absolute inset-0 z-0 opacity-40 grayscale contrast-150">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=2674&auto=format&fit=crop" 
                alt="Datacenter Architecture" 
              />
           </div>
           
           <div className="relative z-10 text-center p-8 max-w-5xl mx-auto">
              <div className="w-64 h-64 bg-blue-600 rounded-full blur-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30"></div>
              <h2 className="text-7xl md:text-[10rem] font-bold tracking-tighter mb-12 leading-[0.8]">
                HARDWARE<br/>
                <span className="font-serif italic font-normal text-stone-500 uppercase">Optimized.</span>
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8">
                 <div className="text-center">
                    <p className="text-5xl font-mono mb-2">12ms</p>
                    <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Global Latency</p>
                 </div>
                 <div className="w-px h-16 bg-stone-800 hidden md:block"></div>
                 <div className="text-center">
                    <p className="text-5xl font-mono mb-2">10PB</p>
                    <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Secure Context</p>
                 </div>
                 <div className="w-px h-16 bg-stone-800 hidden md:block"></div>
                 <div className="text-center">
                    <p className="text-5xl font-mono mb-2">256bit</p>
                    <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">End-to-End</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Technical Blog / Journal */}
        <section id="docs" className="grid grid-cols-1 lg:grid-cols-12 border-b border-stone-300 bg-stone-100">
           <div className="col-span-1 lg:col-span-4 p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-300">
              <div>
                <span className="text-xs font-mono uppercase text-stone-500 mb-6 block tracking-widest flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Engineering Logs
                </span>
                <h3 className="text-5xl font-medium tracking-tight mb-8 font-serif italic">Standardizing<br/>Intelligence</h3>
                <p className="text-sm text-stone-500 leading-relaxed font-mono">
                   Deep dives into the architecture of modern AI systems, from silicon to synapse.
                </p>
              </div>
              <div className="mt-16 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center">
                    <Disc className="w-6 h-6 text-stone-300 animate-spin-slow" />
                 </div>
                 <span className="text-xs font-mono text-stone-400">SYNCING LATEST POSTS...</span>
              </div>
           </div>
           
           <div className="col-span-1 lg:col-span-8 bg-[#EBEBE8]">
              {[
                { date: "JAN 05, 2024", tag: "PROTOCOL", title: "Implementing Byzantine Fault Tolerance in Agent Swarms" },
                { date: "DEC 20, 2023", tag: "HARDWARE", title: "Optimizing H100 GPU Clusters for Long-Context Inference" },
                { date: "DEC 08, 2023", tag: "SECURITY", title: "Zero-Trust Architectures for Multi-Tenant LLM Runtimes" }
              ].map((item, i) => (
                <a key={i} href="#" className="block p-10 lg:p-14 border-b border-stone-300 hover:bg-white transition-all duration-500 group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                      <div className="flex items-center gap-4">
                         <span className="text-xs font-mono text-stone-400">{item.date}</span>
                         <span className="px-2 py-0.5 border border-stone-300 rounded-full text-[10px] font-mono text-stone-500 group-hover:bg-stone-900 group-hover:text-white transition-colors">{item.tag}</span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-stone-300 group-hover:text-blue-600 transition-colors" />
                   </div>
                   <h4 className="text-4xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-500">{item.title}</h4>
                </a>
              ))}
              <div className="p-10 flex justify-end">
                 <button className="text-xs font-mono uppercase tracking-widest flex items-center gap-3 group">
                    <span>Explore Documentation</span>
                    <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#18181B] text-[#E4E4E7] pt-24 overflow-hidden relative min-h-[90vh] flex flex-col justify-between">
           <div className="px-8 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-16 relative z-10">
              <div className="col-span-1 md:col-span-7">
                 <h2 className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-12 leading-none">
                    Start your<br/>
                    <span className="text-stone-500 font-serif italic">Industrial Era.</span>
                 </h2>
                 <div className="flex flex-wrap gap-6">
                    <button className="px-10 py-5 bg-blue-600 text-white text-xs font-mono uppercase tracking-widest hover:bg-blue-700 transition-colors">
                       Request Infrastructure
                    </button>
                    <button className="px-10 py-5 border border-stone-700 text-white text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                       Talk to an Architect
                    </button>
                 </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 md:col-start-9">
                 <h4 className="text-xs font-mono uppercase text-stone-500 mb-8 tracking-widest">[ Foundry ]</h4>
                 <ul className="space-y-4 text-sm text-stone-400 font-mono">
                    <li><a href="#" className="hover:text-white transition-colors block">Network Status</a></li>
                    <li><a href="#" className="hover:text-white transition-colors block">API Reference</a></li>
                    <li><a href="#" className="hover:text-white transition-colors block">Security Audit</a></li>
                    <li><a href="#" className="hover:text-white transition-colors block">Open Source</a></li>
                 </ul>
              </div>

              <div className="col-span-1 md:col-span-2">
                 <h4 className="text-xs font-mono uppercase text-stone-500 mb-8 tracking-widest">[ Connect ]</h4>
                 <ul className="space-y-4 text-sm text-stone-400 font-mono">
                    <li><a href="#" className="hover:text-white transition-colors block">Twitter / X</a></li>
                    <li><a href="#" className="hover:text-white transition-colors block">GitHub</a></li>
                    <li><a href="#" className="hover:text-white transition-colors block">Discord</a></li>
                 </ul>
              </div>
           </div>

           <div className="mt-24 px-8 md:px-16 pb-12 flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.2em]">Global Grid Active</span>
                 </div>
                 <p className="text-xs font-mono text-stone-600 uppercase tracking-widest">© 2024 NEURAL FOUNDRY AG.</p>
              </div>
              
              <div className="text-right hidden md:block">
                 <div className="font-serif italic text-3xl text-stone-800 opacity-50 mb-2">Form Follows Intelligence.</div>
                 <div className="text-[10px] font-mono text-stone-700 uppercase tracking-widest">N 37.7749 / W 122.4194</div>
              </div>
           </div>
           
           {/* Huge Animated Logo */}
           <div className="w-full overflow-hidden border-t border-stone-800 bg-[#18181B] pointer-events-none">
              <div className="whitespace-nowrap flex select-none py-6 opacity-10">
                <motion.div
                  className="flex min-w-full items-center"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                >
                  <span className="text-[20vw] font-bold leading-none tracking-tighter text-white mr-20">NEURAL FOUNDRY</span>
                  <span className="text-[20vw] font-serif italic leading-none tracking-tighter text-stone-600 mr-20">NEURAL FOUNDRY</span>
                </motion.div>
              </div>
           </div>
        </footer>

      </div>
    </div>
  );
}

