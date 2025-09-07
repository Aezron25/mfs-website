import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookCheck,
  Calculator,
  Briefcase,
  Wallet,
  ArrowRight,
  Search,
  DraftingCompass,
  Rocket,
  TrendingUp,
} from 'lucide-react';

const services = [
  {
    icon: <BookCheck className="h-8 w-8 text-primary" />,
    title: 'Audit Services',
    description:
      'Independent audits to ensure accuracy, strengthen controls, and build investor confidence.',
  },
  {
    icon: <Calculator className="h-8 w-8 text-primary" />,
    title: 'Tax Services',
    description:
      'Stay compliant with ZRA and minimize tax liabilities with my expert tax strategies.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Consultancy Services',
    description:
      'Tailored financial consultancy to help SMEs and startups achieve sustainable growth.',
  },
  {
    icon: <Wallet className="h-8 w-8 text-primary" />,
    title: 'Personal Finance',
    description:
      'Personalized financial management to help you achieve long-term stability.',
  },
];

const processSteps = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: '1. Discovery Call',
    description: 'We start by understanding your current financial situation, challenges, and long-term goals.',
  },
  {
    icon: <DraftingCompass className="h-8 w-8 text-primary" />,
    title: '2. Strategy Design',
    description: 'I craft a bespoke financial plan and a clear roadmap tailored specifically to your needs.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: '3. Implementation',
    description: 'We put your tailored plan into action, handling the details to ensure a smooth transition.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: '4. Ongoing Review',
    description: 'I continuously monitor progress, track results, and make adjustments to keep you on track.',
  },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src="https://picsum.photos/1920/1080?grayscale"
          alt="Financial meeting"
          fill
          className="object-cover"
          priority
          data-ai-hint="finance office professional"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl font-headline animate-fade-in-up">
            Your Personal Guide to Financial Discipline and Growth
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl animate-fade-in-up [animation-delay:300ms]">
            I'm Mwanakombo, a financial expert dedicated to providing tailored solutions for SMEs, startups, and individuals.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 animate-fade-in-up [animation-delay:600ms]"
          >
            <Link href="/services">
              Explore My Services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section id="services" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                My Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Comprehensive Financial Solutions
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I offer a wide range of services to meet the diverse needs of
                my clients, from individuals to growing businesses.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
            {services.map(service => (
              <div
                key={service.title}
                className="group flex flex-col items-center text-center gap-4 transition-transform transform-gpu hover:-translate-y-2"
              >
                <div className="bg-muted rounded-full p-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold font-headline">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                My Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                A Clear Path to Financial Success
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I follow a structured and transparent process to ensure your financial goals are met with precision and care.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
            {processSteps.map((step) => (
               <div
                key={step.title}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="bg-background rounded-full p-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold font-headline">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
