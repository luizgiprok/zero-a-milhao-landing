
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Comece Sua Jornada Para o Primeiro Milhão
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Não perca mais tempo! Junte-se a centenas de alunos que já estão transformando sua realidade financeira.
        </p>
        <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
          <Rocket className="mr-2 h-5 w-5" />
          Quero Começar Agora
        </Button>
        <p className="mt-4 text-blue-100 text-sm">
          *Garantia de 7 dias ou seu dinheiro de volta
        </p>
      </div>
    </section>
  );
};

export default CTASection;
