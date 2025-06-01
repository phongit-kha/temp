import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

const faqItems = [
  {
    value: "item-1",
    question: "How do I rent a tool?",
    answer: "Browse our equipment list, select the tool you need, choose your rental dates, and proceed to checkout. You'll need to create an account if you haven't already."
  },
  {
    value: "item-2",
    question: "What are the payment methods accepted?",
    answer: "We accept major credit/debit cards, e-wallets, and Cash on Delivery for certain locations. You can see all available options at checkout."
  },
  {
    value: "item-3",
    question: "What if a tool is damaged during my rental period?",
    answer: "Please report any damage immediately through your rental details page or by contacting support. Depending on the damage and if you opted for insurance, repair or replacement costs may apply as per our rental agreement."
  },
  {
    value: "item-4",
    question: "How do I return a tool?",
    answer: "You can return the tool to our designated drop-off points or arrange for a pickup if that service was selected. Ensure you upload return evidence via your rental details page."
  },
  {
    value: "item-5",
    question: "Can I extend my rental period?",
    answer: "Yes, if the tool is available, you can request an extension through your rental details page. Additional charges will apply."
  }
];

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <HelpCircle className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline mb-2">Help Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team.
        </p>
      </header>

      <section className="mb-12 max-w-xl mx-auto">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search help articles or FAQs..."
            className="h-12 text-base pl-12 pr-4"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-headline mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faqItems.map(item => (
            <AccordionItem value={item.value} key={item.value}>
              <AccordionTrigger className="text-base text-left hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-6 text-center">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Chat With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Get instant help from our support agents via live chat.</p>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
              <Phone className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Speak directly to a support representative.</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="tel:+66001234567">Call +66 (0)0-123-4567</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
