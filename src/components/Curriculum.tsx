
import { Book } from "lucide-react";

const Curriculum = () => {
  const modules = [
    {
      title: "Módulo 1: Fundamentos Financeiros",
      topics: ["Organizando suas finanças", "Criando reserva de emergência", "Planejamento financeiro básico"],
    },
    {
      title: "Módulo 2: Primeiros Investimentos",
      topics: ["Renda fixa sem mistérios", "Tesouro Direto na prática", "Escolhendo os melhores investimentos"],
    },
    {
      title: "Módulo 3: Renda Passiva",
      topics: ["Dividendos e renda passiva", "Construindo sua carteira", "Estratégias de longo prazo"],
    },
    {
      title: "Módulo 4: Rumo ao Primeiro Milhão",
      topics: ["Acelerando seus resultados", "Proteção patrimonial", "Multiplicando seus ganhos"],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          O Que Você Vai Aprender
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Book className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold ml-2">{module.title}</h3>
              </div>
              <ul className="space-y-2">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
