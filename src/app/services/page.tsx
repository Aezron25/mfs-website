import { RecommendationTool } from "@/components/services/RecommendationTool";
import { BookCheck, Calculator, Briefcase, Wallet } from "lucide-react";
import Image from "next/image";

const services = [
  {
    icon: <BookCheck className="h-10 w-10 text-primary" />,
    title: "Audit Services",
    description: "Delivering independent and reliable audits that ensure accuracy, strengthen internal controls, and build investor and stakeholder confidence. We help businesses meet statutory requirements while identifying opportunities to improve efficiency and performance.",
    image: "https://picsum.photos/600/400?random=4",
    dataAiHint: "accounting documents",
  },
  {
    icon: <Calculator className="h-10 w-10 text-primary" />,
    title: "Tax Services",
    description: "Helping you stay compliant with ZRA requirements while minimizing tax liabilities. From VAT and PAYE to corporate tax planning, our experts design tax strategies that free up resources and keep your business ahead of deadlines.",
    image: "https://picsum.photos/600/400?random=5",
    dataAiHint: "calculator tax",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Consultancy Services",
    description: "Providing tailored business and financial consultancy to help SMEs and startups grow sustainably. From budgeting and forecasting to compliance training and systems setup, we guide you with practical solutions that unlock business potential.",
    image: "https://picsum.photos/600/400?random=6",
    dataAiHint: "business strategy",
  },
  {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: "Consumer Finance",
    description: "Supporting individuals with personalized financial management—from savings plans and budgeting to debt management and financial literacy training. We help you make smarter financial decisions and achieve long-term stability.",
    image: "https://picsum.photos/600/400?random=7",
    dataAiHint: "personal finance",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Our Services
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Empowering SMEs, Startups, and Individuals with Financial Discipline
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-12 mt-16">
            {services.map((service, index) => (
              <div key={service.title} className={`grid gap-6 lg:grid-cols-2 lg:gap-12 items-center`}>
                <div className={`flex flex-col justify-center space-y-4 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-muted p-3">
                      {service.icon}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter font-headline">{service.title}</h2>
                    <p className="max-w-[600px] text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  data-ai-hint={service.dataAiHint}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <RecommendationTool />
        </div>
      </section>
    </>
  );
}
