import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const SCENARIO = [
  {
    id: "timing",
    time: "09:30",
    duration: "Весь день",
    title: "Тайминг дня",
    emoji: "🕐",
    color: "#8B7355",
    blocks: [
      { t: "09:30", label: "Сбор гостей и прессы" },
      { t: "10:00", label: "Мастер-классы для детей" },
      { t: "11:00", label: "Речи гостей" },
      { t: "11:30", label: "Торжественное открытие" },
      { t: "12:00", label: "Фотосессия с персонажами" },
      { t: "12:30", label: "Пресс-подход" },
      { t: "13:00", label: "Финал. Свободное посещение" },
    ],
  },
  {
    id: "gathering",
    time: "09:30",
    duration: "30 мин",
    title: "Зона сбора",
    emoji: "🎪",
    color: "#C4956A",
    content: `Гости и пресса собираются у главного входа. Встречают аниматоры в образах **Чебурашки**, **кота Матроскина** и **пса Шарика**.

Фоновая музыка — треки из советских мультфильмов. Трансляция заставок и отрывков на экранах в фойе.

Детям вручаются именные бейджи и маленькие подарки — значки с персонажами.`,
    note: "Ответственный: администратор входной группы",
  },
  {
    id: "masterclass",
    time: "10:00",
    duration: "60 мин",
    title: "Мастер-классы",
    emoji: "🎨",
    color: "#7A9E7E",
    items: [
      {
        char: "🐻",
        name: "Чебурашка",
        title: "Лепим из глины",
        desc: "Дети лепят фигурку Чебурашки под руководством аниматора. Возраст 4–10 лет.",
      },
      {
        char: "🐱",
        name: "Матроскин",
        title: "Рисуем мультик",
        desc: "Создание покадровой анимации на планшете. Возраст 7–12 лет.",
      },
      {
        char: "🐕",
        name: "Шарик",
        title: "Фотоатье",
        desc: "Костюмированные снимки в декорациях Простоквашино. Все возрасты.",
      },
    ],
    note: "Площадки работают параллельно. Вместимость каждой — 15 детей.",
  },
  {
    id: "speeches",
    time: "11:00",
    duration: "30 мин",
    title: "Речи гостей",
    emoji: "🎙",
    color: "#7B8FA1",
    speakers: [
      {
        order: "01",
        name: "Директор выставки",
        duration: "7 мин",
        note: "Приветствие, история проекта",
      },
      {
        order: "02",
        name: "Представитель администрации города",
        duration: "5 мин",
        note: "Официальное слово",
      },
      {
        order: "03",
        name: "Куратор выставки",
        duration: "7 мин",
        note: "О концепции и экспонатах",
      },
      {
        order: "04",
        name: "Партнёры и спонсоры",
        duration: "5 мин",
        note: "Благодарности",
      },
    ],
    note: "Модератор: ведущий церемонии. Микрофон — проводной и петличный.",
  },
  {
    id: "opening",
    time: "11:30",
    duration: "15 мин",
    title: "Открытие",
    emoji: "✂️",
    color: "#B5604A",
    content: `Торжественная церемония перерезания красной ленты. На сцене — **директор**, **представитель администрации** и три персонажа-аниматора.

Звучит финальная тема из мультфильма «Простоквашино». Запускаются воздушные шары в цветах выставки.

На экранах — трансляция короткого ролика об истории советской анимации (3 минуты).`,
    note: "Пиротехника: не предусмотрена. Шары: 200 штук.",
  },
  {
    id: "photo",
    time: "12:00",
    duration: "30 мин",
    title: "Фотосессия",
    emoji: "📸",
    color: "#9B7BB5",
    content: `Организованная фотосессия для официальных гостей и прессы у главного баннера выставки.

**Очерёдность:**
— Официальные лица (5 мин)
— Официальные лица с персонажами (5 мин)
— Свободная фотосессия для всех гостей (20 мин)

Фотограф и видеооператор — штатные, по отдельному договору.`,
    note: "Реквизит: большие буквы с названием выставки, рамки для фото.",
  },
  {
    id: "press",
    time: "12:30",
    duration: "20 мин",
    title: "Пресс-подход",
    emoji: "🎤",
    color: "#4A7B9D",
    content: `Пресс-подход для СМИ в специально обозначенной зоне у задника с логотипом выставки.

Спикеры: **директор** и **куратор**. Ограничений по вопросам нет. Модератор контролирует хронометраж.

Аккредитованные издания: список у пресс-секретаря. Фото- и видеосъёмка — свободная.`,
    note: "Пресс-кит: папки с материалами для всех аккредитованных журналистов.",
  },
  {
    id: "finale",
    time: "13:00",
    duration: "∞",
    title: "Финал",
    emoji: "🎉",
    color: "#5C7A3E",
    content: `Официальная программа завершена. Выставка открыта для свободного посещения.

Аниматоры продолжают работу до **15:00**, мастер-классы — по расписанию до **17:00**.

Дети, посетившие мастер-класс, получают **памятный диплом** и небольшой подарок от партнёров выставки.`,
    note: "Режим работы выставки: 10:00–20:00 ежедневно.",
  },
];

function formatContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="mb-2 last:mb-0">
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-medium text-stone-800">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

function TimingSection({ blocks }: { blocks: { t: string; label: string }[] }) {
  return (
    <div className="mt-6 space-y-0">
      {blocks.map((b, i) => (
        <div key={i} className="flex items-stretch group">
          <div className="flex flex-col items-center mr-5">
            <div
              className="w-px bg-stone-200 flex-1"
              style={{ minHeight: i === 0 ? 12 : 0 }}
            />
            <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-stone-600 transition-colors shrink-0 mt-1 mb-1" />
            <div
              className="w-px bg-stone-200 flex-1"
              style={{ minHeight: i === blocks.length - 1 ? 12 : 0 }}
            />
          </div>
          <div className="flex items-center gap-4 py-2.5 border-b border-stone-100 last:border-0 flex-1">
            <span className="font-mono text-xs text-stone-400 w-12 shrink-0">{b.t}</span>
            <span className="text-sm text-stone-700">{b.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MasterclassSection({
  items,
}: {
  items: { char: string; name: string; title: string; desc: string }[];
}) {
  return (
    <div className="mt-6 grid gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-stone-100 rounded-xl p-4 bg-stone-50/70 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{item.char}</span>
            <div>
              <div className="text-xs text-stone-400 uppercase tracking-widest font-light">
                {item.name}
              </div>
              <div className="font-cormorant text-lg text-stone-800 font-semibold leading-tight">
                {item.title}
              </div>
            </div>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SpeakersSection({
  speakers,
}: {
  speakers: { order: string; name: string; duration: string; note: string }[];
}) {
  return (
    <div className="mt-6 space-y-3">
      {speakers.map((s, i) => (
        <div key={i} className="flex items-start gap-4">
          <span className="font-mono text-xs text-stone-300 mt-0.5 w-6 shrink-0">
            {s.order}
          </span>
          <div className="flex-1 border-b border-stone-100 pb-3 last:border-0">
            <div className="flex items-baseline gap-3 justify-between">
              <span className="font-cormorant text-base font-semibold text-stone-800">
                {s.name}
              </span>
              <span className="font-mono text-xs text-stone-400 shrink-0">{s.duration}</span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 italic">{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  section,
  index,
}: {
  section: (typeof SCENARIO)[0];
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 py-5 text-left group"
      >
        <span className="text-xl w-8 shrink-0 text-center">{section.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight">
              {section.title}
            </h2>
            <span className="font-mono text-xs text-stone-400 shrink-0">{section.time}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full shrink-0"
              style={{
                backgroundColor: `${section.color}18`,
                color: section.color,
              }}
            >
              {section.duration}
            </span>
          </div>
        </div>
        <Icon
          name={open ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0"
        />
      </button>

      {open && (
        <div className="pb-6 pl-12">
          {"blocks" in section && section.blocks && (
            <TimingSection blocks={section.blocks} />
          )}
          {"items" in section && section.items && (
            <MasterclassSection items={section.items} />
          )}
          {"speakers" in section && section.speakers && (
            <SpeakersSection speakers={section.speakers} />
          )}
          {"content" in section && section.content && (
            <div className="mt-4 text-sm text-stone-600 leading-relaxed">
              {formatContent(section.content)}
            </div>
          )}
          {"note" in section && section.note && (
            <div className="mt-4 flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-stone-300 mt-2 shrink-0" />
              <p className="text-xs text-stone-400 italic">{section.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <header
        className={`sticky top-0 z-10 transition-all duration-300 ${
          scrolled
            ? "bg-stone-50/95 backdrop-blur border-b border-stone-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🎬</span>
            <span className="font-cormorant text-sm font-semibold text-stone-500 tracking-wide uppercase">
              Сценарий открытия
            </span>
          </div>
          <span className="font-mono text-xs text-stone-400">2026</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <div className="pt-12 pb-10">
          <div className="mb-2 font-mono text-xs text-stone-400 uppercase tracking-widest">
            Выставка
          </div>
          <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-stone-800 leading-[1.15] mb-3">
            Мир советской
            <br />
            <em>анимации</em>
          </h1>
          <p className="text-sm text-stone-500 font-light leading-relaxed max-w-md">
            Торжественное открытие · Программа для детей и взрослых
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Чебурашка", "Матроскин", "Шарик"].map((char) => (
              <span
                key={char}
                className="text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-full text-stone-600"
              >
                {char}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-5 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Icon name="Clock" size={12} />
              09:30 – 13:00
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} />
              Главный зал
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="Users" size={12} />
              Все возрасты
            </span>
          </div>
        </div>

        <div className="border border-stone-100 rounded-2xl bg-white px-6 mb-16 shadow-sm">
          {SCENARIO.map((section, i) => (
            <Section key={section.id} section={section} index={i} />
          ))}
        </div>

        <footer className="pb-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-stone-300">
            <div className="w-8 h-px bg-stone-200" />
            <span>Рабочий сценарий · Конфиденциально</span>
            <div className="w-8 h-px bg-stone-200" />
          </div>
        </footer>
      </main>
    </div>
  );
}
