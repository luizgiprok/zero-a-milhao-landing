
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          De <span className="text-blue-600">0 a 1 Milhão</span> com um Método
          <br className="hidden sm:block" /> Direto e Sem Enrolação
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Aprenda a investir do zero e construir seu patrimônio com renda passiva,
          usando um método prático e linguagem simples
        </p>
        <div className="flex justify-center gap-4 mb-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Rocket className="mr-2 h-5 w-5" />
            Quero Começar Agora
          </Button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg mx-auto">
          <p className="text-red-600 font-semibold">🔥 Últimas vagas disponíveis!</p>
          <p className="text-gray-600">Preço promocional por tempo limitado</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
