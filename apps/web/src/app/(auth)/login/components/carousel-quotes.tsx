/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
"use client";

import { cn } from "@/lib/utils";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";

const carouselQuotes = [
  {
    title: "Controle suas finanças de forma inteligente",
    description:
      "Gerencie receitas, despesas e investimentos em uma única plataforma. Tenha visibilidade completa do seu fluxo de caixa em tempo real.",
  },
  {
    title: "Decisões financeiras mais assertivas",
    description:
      "Transforme dados em insights poderosos. Analise tendências, identifique oportunidades e tome decisões baseadas em informações concretas.",
  },
  {
    title: "Automatize sua gestão financeira",
    description:
      "Reduza tarefas manuais e elimine erros. Nossa plataforma automatiza processos e libera seu tempo para focar no crescimento do seu negócio.",
  },
  {
    title: "Segurança em primeiro lugar",
    description:
      "Seus dados financeiros protegidos com criptografia de ponta. Confie em uma plataforma que leva a segurança das suas informações a sério.",
  },
];

export function CarouselQuotes() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="hidden xl:flex xl:flex-col xl:gap-6 items-center justify-center size-full bg-[#1C1C1C] rounded-r-2xl p-24">
      <div className="w-20 h-20 rounded-2xl bg-green-600 flex items-center justify-center mx-auto">
        <HandCoins className="w-12 h-12 text-white" />
      </div>

      <div className="flex flex-col justify-center items-center relative min-h-[150px] min-w-[600px]">
        {carouselQuotes.map((quote, index) => (
          <div
            key={index}
            className={cn("absolute inset-0 transition-opacity duration-1000", {
              "opacity-100": index === currentIndex,
              "opacity-0": index !== currentIndex,
            })}
          >
            <h2 className="text-3xl font-bold text-white text-center text-balance mb-4">
              {quote.title}
            </h2>
            <p className="text-[#999999] text-lg leading-relaxed text-center">
              {quote.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
        {carouselQuotes.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn("h-2 rounded-full transition-all duration-300", {
              "w-8 bg-green-600": index === currentIndex,
              "w-2 bg-[#444444] hover:bg-[#666666] cursor-pointer":
                index !== currentIndex,
            })}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-sm text-[#666666]">Seguro</div>
        </div>

        <div className="h-12 w-px bg-[#333333]" />

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">24/7</div>
          <div className="text-sm text-[#666666]">Acesso</div>
        </div>

        <div className="h-12 w-px bg-[#333333]" />

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">∞</div>
          <div className="text-sm text-[#666666]">Transações</div>
        </div>
      </div>
    </div>
  );
}
