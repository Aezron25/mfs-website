import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Khadija Mwanakombo",
    role: "Founder & CEO",
    avatar: "https://picsum.photos/200/200?random=8",
    dataAiHint: "woman ceo",
    bio: "With over 20 years of experience in the financial industry, Khadija leads the firm with a passion for client success and ethical practice.",
  },
  {
    name: "David Chen",
    role: "Head of Audit",
    avatar: "https://picsum.photos/200/200?random=9",
    dataAiHint: "man professional",
    bio: "David is a certified public accountant with a meticulous eye for detail, ensuring the highest standards of accuracy and compliance.",
  },
  {
    name: "Maria Rodriguez",
    role: "Director of Tax Services",
    avatar: "https://picsum.photos/200/200?random=10",
    dataAiHint: "woman smiling",
    bio: "Maria specializes in corporate and international tax law, helping clients navigate complex tax landscapes with confidence.",
  },
  {
    name: "James O'Connell",
    role: "Lead Consultant",
    avatar: "https://picsum.photos/200/200?random=11",
    dataAiHint: "man consultant",
    bio: "James brings a strategic mindset to our consultancy team, with a track record of driving growth for businesses of all sizes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Us</div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                A Legacy of Financial Integrity
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Mwanakombo Financial Services was founded with a single mission: to provide transparent, expert, and personalized financial services. We believe in building long-term relationships with our clients based on trust and mutual respect.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://picsum.photos/800/600"
                alt="Office building"
                width={800}
                height={600}
                className="rounded-xl shadow-lg"
                data-ai-hint="office building"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 space-y-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter font-headline">Our Mission</h2>
              <p className="text-muted-foreground">
                To empower our clients to achieve financial success and security through expert guidance, innovative solutions, and an unwavering commitment to integrity.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter font-headline">Our Vision</h2>
              <p className="text-muted-foreground">
                To be the most trusted and respected financial services firm in the region, known for our exceptional client service and positive impact on the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Meet Our Leadership
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our team of seasoned professionals is dedicated to your success.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                  <Avatar className="h-32 w-32 border-4 border-muted">
                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} width={200} height={200}/>
                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm font-medium text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground pt-2">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
