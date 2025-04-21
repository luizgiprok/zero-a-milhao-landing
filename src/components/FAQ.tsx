
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Preciso ter experiência prévia com investimentos?",
      answer: "Não! O curso foi desenvolvido pensando em quem está começando do zero. Tudo é explicado de forma simples e progressiva.",
    },
    {
      question: "Quanto tempo tenho acesso ao curso?",
      answer: "O acesso é vitalício! Você poderá assistir e revisitar o conteúdo quantas vezes quiser, para sempre.",
    },
    {
      question: "Existe suporte para dúvidas?",
      answer: "Sim! Você terá acesso a um grupo exclusivo onde poderá tirar todas as suas dúvidas diretamente com a equipe.",
    },
    {
      question: "Quanto preciso ter para começar a investir?",
      answer: "Você aprenderá a começar com qualquer valor! O importante é iniciar com o que você tem disponível.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Dúvidas Frequentes
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
