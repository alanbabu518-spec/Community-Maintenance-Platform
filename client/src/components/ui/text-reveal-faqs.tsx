"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  body,
  h2,
  h3,
  eyebrow,
  lead,
  container,
  sectionPad,
  focus,
} from "./Tokens";

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

function AskLink() {
  return (
    <div>
      <p className={`${body} text-body-sm leading-body-sm text-slate-body`}>
        Still have a question?
      </p>
      <Link
        to="/maintenance/new"
        className={`font-f37-bolton mt-3 inline-flex items-center gap-2 rounded-md text-body-sm text-signal-blue transition-colors duration-150 hover:text-midnight-ink ${focus}`}
      >
        Report an issue
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default function FAQs() {
  return (
    <section
      id="faqs"
      className="scroll-mt-20 border-t border-silver-border bg-paper text-midnight-ink"
    >
      <div className={`${container} ${sectionPad}`}>
        <div className="grid gap-10 md:grid-cols-5 md:gap-14">
          <div className="md:col-span-2">
            <p className={eyebrow.light}>Frequently asked questions</p>

            <h2 className={`${h2} mt-4`}>Everything you need to know</h2>

            <p className={`${lead.light} mt-5 max-w-md`}>
              Learn how CommunityCare helps residents, management teams, and
              technicians keep community maintenance organized.
            </p>

            <div className="mt-8 hidden md:block">
              <AskLink />
            </div>
          </div>

          <div className="md:col-span-3">
            <Accordion type="single" collapsible>
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-silver-border"
                >
                  <AccordionTrigger
                    className={`${h3} cursor-pointer py-5 text-left text-midnight-ink transition-colors duration-150 hover:text-signal-blue hover:no-underline ${focus}`}
                  >
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
            <AskLink />
          </div>
        </div>
      </div>
    </section>
  );
}

/*
  Answer reveal. The original blurred every character (hundreds of nodes);
  this fades in word by word — opacity only — and is skipped entirely for
  reduced motion. Export name kept so existing imports keep working.
*/
export const BlurredStagger = ({
  text = "CommunityCare",
}: {
  text: string;
}) => {
  const reduce = useReducedMotion();
  const textClass = `${body} pb-5 text-body-sm leading-body-sm text-slate-body`;

  if (reduce) return <p className={textClass}>{text}</p>;

  return (
    <motion.p
      className={textClass}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.018 } } }}
    >
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ duration: 0.25 }}
        >
          {word}
          {"\u00A0"}
        </motion.span>
      ))}
    </motion.p>
  );
};