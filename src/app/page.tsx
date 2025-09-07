import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookCheck,
  Calculator,
  Briefcase,
  Wallet,
  ArrowRight,
  Star,
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

const testimonials = [
  {
    name: 'Bwalya Chisanga',
    title: 'CEO, Agri-Innovate Zambia',
    avatar: 'https://picsum.photos/100/100?random=1',
    dataAiHint: 'woman portrait',
    text: "Mwanakombo's consultancy services were a game-changer for our business. His insights were invaluable for our strategic planning.",
  },
  {
    name: 'Tendai Zulu',
    title: 'Owner, T&Z Logistics',
    avatar: 'https://picsum.photos/100/100?random=2',
    dataAiHint: 'man portrait',
    text: 'His tax knowledge is incredible. He helped us navigate a complex tax situation with ease. Highly recommended!',
  },
  {
    name: 'Chipo Banda',
    title: 'Individual Client',
    avatar: 'https://picsum.photos/100/100?random=3',
    dataAiHint: 'person smiling',
    text: 'Mwanakombo guided me through every step of managing my personal finances. The advice was clear, transparent, and effective.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src="https://picsum.photos/1800/1200"
          alt="Financial meeting"
          fill
          className="object-cover"
          priority
          data-ai-hint="business portrait"
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

      <section
        id="ai-recommender"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted"
      >
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Not Sure Where to Start?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Use my AI-powered tool to get a personalized service
              recommendation. Just describe your financial needs, and I'll
              suggest the best service for you.
            </p>
            <Button asChild size="lg">
              <Link href="/services#recommendation-tool">
                Get Your Recommendation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://picsum.photos/600/400"
              alt="AI illustration"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint="artificial intelligence"
            />
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                What My Clients Say
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I'm proud to have earned the trust of my clients. Here's
                what they have to say about their experience with me.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            {testimonials.map(testimonial => (
              <Card
                key={testimonial.name}
                className="bg-card hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        data-ai-hint={testimonial.dataAiHint}
                        width={100}
                        height={100}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-bold">
                        {testimonial.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
