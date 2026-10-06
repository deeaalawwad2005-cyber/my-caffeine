import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICE_RANGE_NOTICE } from "@/lib/service-types";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "كيف أقدّم طلبًا جديدًا؟",
    answer:
      "اضغط على زر «اطلب خدمة الآن»، ثم اختر نوع الخدمة واكتب تفاصيل طلبك مع اسمك ورقم هاتفك للتواصل. سنراجع الطلب ونتواصل معك لتأكيد التفاصيل.",
  },
  {
    question: "كم تبلغ أسعار الخدمات؟",
    answer: `${PRICE_RANGE_NOTICE} ويُحدَّد السعر النهائي داخل هذا النطاق حسب نوع الخدمة وحجم العمل، ويتم الاتفاق عليه معك بوضوح قبل بدء التنفيذ.`,
  },
  {
    question: "ما أنواع الخدمات الأكاديمية التي تقدمونها؟",
    answer:
      "نقدم تدقيق الواجبات، وتصميم العروض التقديمية، وإعداد الأبحاث والتقارير، والترجمة بين العربية والإنجليزية، وتنفيذ المشاريع البرمجية، إضافة إلى أي خدمة أكاديمية أخرى تحتاجها.",
  },
  {
    question: "كم يستغرق تنفيذ الطلب؟",
    answer:
      "يعتمد الوقت على نوع الخدمة وحجم العمل. بعد مراجعة طلبك نحدد لك موعد التسليم بوضوح، ونلتزم به، مع إمكانية التسليم المستعجل عند الحاجة.",
  },
  {
    question: "هل يمكنني طلب تعديلات بعد التسليم؟",
    answer:
      "نعم، يمكنك طلب التعديلات اللازمة على العمل بعد التسليم لضمان رضاك التام عن النتيجة النهائية.",
  },
  {
    question: "هل بياناتي وطلباتي سرية؟",
    answer:
      "بالتأكيد. نتعامل مع جميع الطلبات بسرية تامة، ولا نشارك بياناتك أو تفاصيل عملك مع أي طرف آخر.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      data-ocid="home.faq.section"
      className="scroll-mt-24 bg-background py-16 md:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            الأسئلة الشائعة
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            إجابات على أكثر ما يهمك
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">
            لم تجد إجابتك؟ تواصل معنا وسنسعد بمساعدتك.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3"
            data-ocid="home.faq.accordion"
          >
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index + 1}`}
                data-ocid={`home.faq.item.${index + 1}`}
                className="rounded-lg border border-border bg-card px-5 shadow-subtle"
              >
                <AccordionTrigger className="text-start font-display text-base font-semibold text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
