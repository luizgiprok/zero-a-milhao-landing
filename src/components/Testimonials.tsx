
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Iniciante em Investimentos",
      content: "Em apenas 3 meses já consegui organizar minhas finanças e começar a investir. O método é realmente direto e prático!",
      rating: 5,
    },
    {
      name: "Ana Paula",
      role: "Professora",
      content: "Nunca pensei que investir poderia ser tão simples. O curso mudou completamente minha visão sobre dinheiro.",
      rating: 5,
    },
    {
      name: "Roberto Santos",
      role: "Aposentado",
      content: "Mesmo com mais de 60 anos, consegui aprender a investir. A linguagem clara e direta faz toda diferença.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          O Que Nossos Alunos Dizem
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
