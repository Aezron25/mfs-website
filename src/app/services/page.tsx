import { RecommendationTool } from "@/components/services/RecommendationTool";
import { BookCheck, Calculator, Briefcase, Wallet } from "lucide-react";
import Image from "next/image";

const services = [
  {
    icon: <BookCheck className="h-10 w-10 text-primary" />,
    title: "Audit Services",
    description: "Our audit and assurance services provide you with a high-quality audit that is tailored to your needs. We use a risk-based approach to ensure that your financial statements are free from material misstatement and that you are compliant with all relevant regulations.",
    image: "https://picsum.photos/600/400?random=4",
    dataAiHint: "accounting documents",
  },
  {
    icon: <Calculator className="h-10 w-10 text-primary" />,
    title: "Tax Services",
    description: "Navigating the complexities of tax is a challenge. Our tax experts provide comprehensive tax planning, compliance, and advisory services to both individuals and businesses. We help you minimize your tax liability while ensuring full compliance with the law.",
    image: "https://picsum.photos/600/400?random=5",
    dataAiHint: "calculator tax",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Consultancy Services",
    description: "Our consultancy services are designed to help you achieve your business objectives. We offer strategic planning, financial forecasting, risk management, and process improvement services to help you make informed decisions and drive your business forward.",
    image: "https://picsum.photos/600/400?random=6",
    dataAiHint: "business strategy",
  },
  {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: "Consumer Finance",
    description: "We provide accessible and responsible consumer finance solutions. Whether you're looking for a personal loan, asset financing, or other credit facilities, our team is here to provide a solution that fits your personal financial situation and goals.",
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
                Tailored financial solutions to empower your growth and stability.
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
