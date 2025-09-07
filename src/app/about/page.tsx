import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Me</div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                Mwanakombo
              </h1>
               <p className="text-primary text-xl font-semibold">Financial Expert & Consultant</p>
              <p className="text-muted-foreground md:text-xl">
                As a seasoned financial expert, I am dedicated to providing transparent, expert, and personalized financial guidance. My mission is to build long-term relationships with my clients based on trust, integrity, and a shared goal of achieving financial success.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/moses.jpg"
                alt="Mwanakombo"
                width={600}
                height={600}
                className="rounded-full shadow-lg aspect-square object-cover"
                data-ai-hint="man portrait"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 space-y-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter font-headline">My Mission</h2>
              <p className="text-muted-foreground">
                To empower my clients to achieve financial success and security through expert guidance, innovative solutions, and an unwavering commitment to integrity.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter font-headline">My Vision</h2>
              <p className="text-muted-foreground">
                To be the most trusted and respected financial advisor in the region, known for exceptional client service and a positive impact on their financial well-being.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
