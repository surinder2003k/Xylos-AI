import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnimeText } from '@/components/premium/anime-text';
import { BentoGrid, BentoCard } from '@/components/premium/bento-grid';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  FileText, 
  Code2, 
  Search, 
  ArrowRight,
  Image as ImageIcon,
  PenTool,
  Briefcase,
  Layout,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';

// Data dictionary for our programmatic SEO pages
const toolData: Record<string, { title: string, description: string, h1: string, keywords: string[], icon: any, benefits: string[] }> = {
  'ai-pdf-analyzer': {
    title: 'Free AI PDF Analyzer & Summarizer',
    description: 'Instantly analyze, summarize, and extract data from massive PDFs for free using the best AI models. No sign-up required for basics.',
    h1: 'The Ultimate Free AI PDF Analyzer',
    keywords: ['AI PDF analyzer', 'free PDF AI reader', 'summarize PDF with AI', 'chat with PDF free', 'AI document analysis'],
    icon: FileText,
    benefits: ['Extract text from 100+ page PDFs instantly', 'Ask questions directly to your documents', '100% Free powered by Llama 3 & Gemini 1.5']
  },
  'ai-code-assistant': {
    title: 'Best Free AI Code Assistant',
    description: 'Write, debug, and refactor code 10x faster with our free AI coding assistant. Supports React, Python, Node, and 50+ languages.',
    h1: 'Free AI Code Assistant & Debugger',
    keywords: ['free AI code assistant', 'AI coding tool', 'Github Copilot alternative free', 'AI code generator'],
    icon: Code2,
    benefits: ['Polyglot support for 50+ languages', 'Instant bug fixing and refactoring', 'No rate limits on standard models']
  },
  'ai-chat-free': {
    title: 'Best Free AI Chat Online',
    description: 'Access the most powerful AI models for free. A superior ChatGPT alternative featuring 7 cutting-edge LLMs including Llama 3, Gemini, and Mistral.',
    h1: 'The Most Powerful Free AI Chat',
    keywords: ['best free AI chat', 'ChatGPT alternative free', 'AI tools online free', 'free Llama 3 chat'],
    icon: Sparkles,
    benefits: ['Access 7 state-of-the-art models in one place', 'Zero cost, premium experience', 'Privacy-first encryption protocol']
  },
  'ai-research-agent': {
    title: 'Free Autonomous AI Research Agent',
    description: 'Deploy an autonomous AI agent to conduct deep research, synthesize findings, and generate comprehensive reports for free.',
    h1: 'Autonomous Free AI Research Agent',
    keywords: ['AI research assistant', 'free autonomous agent tool', 'deep research AI', 'AI synthesizer'],
    icon: Search,
    benefits: ['Recursive web search capabilities', 'Automated source citation', 'Exports directly to Markdown or PDF']
  },
  'ai-vision-lab': {
    title: 'Free AI Vision & Image Analysis',
    description: 'Analyze screenshots, diagrams, and photos with premium optical reasoning models for free.',
    h1: 'Free AI Vision & Image Lab',
    keywords: ['AI vision tool', 'free image analysis AI', 'optical reasoning', 'screenshot to code'],
    icon: ImageIcon,
    benefits: ['Reason about complex diagrams', 'Convert screenshots to code', 'Real-time image synthesis']
  },
  'ai-content-factory': {
    title: 'Free AI Content & Social Generator',
    description: 'Generate viral social posts, blog outlines, and marketing copy with high-performance AI models.',
    h1: 'AI Content Factory & Generator',
    keywords: ['free AI content generator', 'social media AI tool', 'blog assistant free'],
    icon: PenTool,
    benefits: ['Multi-platform content adaptation', 'SEO-tuned blog outlines', 'Tone-matching technology']
  },
  'ai-meeting-notes': {
    title: 'Free AI Meeting & Audio Notes',
    description: 'Transform your transcripts and meeting recordings into structured summaries and action items.',
    h1: 'Free AI Meeting Recap Agent',
    keywords: ['AI meeting notes', 'free transcription summary', 'meeting action items AI'],
    icon: Briefcase,
    benefits: ['Automated action item extraction', 'Speaker-aware summarization', 'Integration with top workspace tools']
  },
  'ai-model-comparator': {
    title: 'Free AI Model Comparison Tool',
    description: 'Compare responses from Llama 3, Gemini, and Mistral side-by-side to find the best result.',
    h1: 'AI Model Side-by-Side Comparison',
    keywords: ['compare AI models', 'Llama 3 vs Gemini', 'AI playground free'],
    icon: Layout,
    benefits: ['Simultaneous multi-model prompting', 'Accuracy benchmarking', 'Prompt engineering lab']
  },
  'ai-life-coach': {
    title: 'Free AI Life Coach & Private Journal',
    description: 'A private, reflective AI workspace for personal growth, goal tracking, and recursive thinking.',
    h1: 'Private AI Life Coach & Mentor',
    keywords: ['AI life coach', 'private AI journal', 'reflective thinking AI'],
    icon: BrainCircuit,
    benefits: ['Recursive reflective logic', 'Goal tracking & accountability', 'Complete privacy encryption']
  }
};

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = toolData[resolvedParams.tool];
  
  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  return {
    title: `${tool.title} | Pulse AI`,
    description: `${tool.description} - Powered by Pulse AI.`,
    openGraph: {
      title: `${tool.title} | Pulse AI`,
      description: tool.description,
      type: 'article',
    }
  };
}

export default async function ToolProxyPage({ params }: { params: Promise<{ tool: string }> }) {
  const resolvedParams = await params;
  const tool = toolData[resolvedParams.tool];

  if (!tool) {
    notFound();
  }

  // Schema Markup for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: tool.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Pulse AI'
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <tool.icon className="w-8 h-8 text-primary" />
        </div>
        
        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Pulse AI Protocol // Auto-Blogging Era</p>
        <AnimeText 
          text={tool.h1} 
          className="text-5xl md:text-7xl font-black font-fustat tracking-tighter uppercase leading-none max-w-4xl italic"
        />
        
        <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
          {tool.description}
        </p>

        <Link 
          href="/chat"
          className="mt-8 flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-bold hover:scale-105 transition-all shadow-xl group"
        >
          Get Started with {tool.title.split(' ')[0]}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto mt-32">
        <h2 className="text-3xl font-bold mb-12 text-center">Engineered for Dominance</h2>
        <BentoGrid>
          {tool.benefits.map((benefit, idx) => (
             <BentoCard key={idx} delay={idx * 0.1} className="col-span-1 md:col-span-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6 text-secondary">
                   <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">{benefit}</h3>
             </BentoCard>
          ))}
          <BentoCard delay={0.3} className="col-span-1 md:col-span-3 lg:col-span-1 bg-gradient-to-br from-primary/10 to-transparent">
             <div className="flex flex-col h-full justify-between">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Enterprise Grade Security</h3>
                <p className="text-sm text-white/40 font-medium">This report was autonomously synthesized using Pulse AI's Neural Buffer.</p>
             </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </div>
  );
}
