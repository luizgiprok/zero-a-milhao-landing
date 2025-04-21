
import { CircleCheck } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      title: "Método Prático e Direto",
      description: "Sem rodeios ou complicações. Aprenda exatamente o que precisa para começar a investir.",
    },
    {
      title: "Linguagem Simples",
      description: "Explicações claras e diretas, sem jargões técnicos complicados.",
    },
    {
      title: "Resultados Reais",
      description: "Estratégias testadas e aprovadas por centenas de alunos.",
    },
    {
      title: "Suporte Completo",
      description: "Acompanhamento durante toda sua jornada de aprendizado.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Por que Escolher Este Curso?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start p-6 bg-blue-50 rounded-lg">
              <CircleCheck className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
