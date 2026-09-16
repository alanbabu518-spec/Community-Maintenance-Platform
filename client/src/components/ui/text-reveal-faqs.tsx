"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const faqItems = [
  {
    id: "item-1",
    question: "What is CommunityCare?",
    answer:
      "CommunityCare is a centralized community maintenance platform that connects residents, management teams, and technicians. It helps communities report, organize, assign, track, and resolve maintenance issues from one place.",
  },
  {
    id: "item-2",
    question: "How can residents report a maintenance issue?",
    answer:
      "Residents can submit a maintenance request by providing the issue title, description, category, priority, unit information, and supporting photos. Once submitted, the request can be tracked through its complete lifecycle.",
  },
  {
    id: "item-3",
    question: "Can I track the status of my maintenance request?",
    answer:
      "Yes. Every maintenance request follows a clear workflow from Open to Acknowledged, Assigned, In Progress, Resolved, and Closed. Residents can view the current status and request details from the platform.",
  },
  {
    id: "item-4",
    question: "Who manages and assigns maintenance requests?",
    answer:
      "Authorized management users can review maintenance requests, acknowledge issues, assign them to technicians, and monitor their progress until the request is resolved and closed.",
  },
  {
    id: "item-5",
    question: "Can I attach photos to a maintenance request?",
    answer:
      "Yes. Residents can attach multiple photos when reporting an issue. Photos help management and technicians understand the problem more clearly and provide useful visual context before work begins.",
  },
];

export default function FAQs() {
  return (
    <section
      id="faqs"
      className="scroll-mt-16 border-t border-slate-200 bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5 md:gap-14">
          <div className="md:col-span-2">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <HelpCircle size={21} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to know
            </h2>

            <p className="mt-4 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
              Learn how CommunityCare helps residents, management teams, and
              technicians keep community maintenance organized.
            </p>

            <div className="mt-7 hidden md:block">
              <p className="text-sm leading-6 text-slate-500">
                Still have a question?
              </p>

              <Link
                to="/maintenance/new"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-slate-600"
              >
                Report an issue
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <Accordion type="single" collapsible>
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-slate-200"
                >
                  <AccordionTrigger className="cursor-pointer text-base font-medium text-slate-900 hover:no-underline sm:text-lg">
                    {item.question}
                  </AccordionTrigger>

                  <AccordionContent>
                    <BlurredStagger text={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="md:hidden">
            <p className="text-sm leading-6 text-slate-500">
              Still have a question?
            </p>

            <Link
              to="/maintenance/new"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-slate-600"
            >
              Report an issue
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export const BlurredStagger = ({
  text = "CommunityCare",
}: {
  text: string;
}) => {
  const container = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <div className="w-full">
      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className="break-words whitespace-normal text-base leading-relaxed text-slate-600"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={letterAnimation}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
};