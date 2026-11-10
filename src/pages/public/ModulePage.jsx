import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, PlayCircle, Globe, ChevronLeft, 
  Sparkles, BookOpen, Layers, Award, Terminal, Cpu, Lightbulb, 
  Puzzle, Zap, Timer, Compass, Feather, Compass as Palette
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api, { getMediaUrl } from '../../api/axios';
import { updatePageSeo } from '../../utils/seo';

const SYMBOLS = {
  'quran': ['آيات', 'بسم الله', '🌙', '⭐', '🕌', '📖'],
  'memory': ['🧠', '1 0 1', '🔗', '✨', '⚡', '💡'],
  'soroban': ['1+2=3', '🧮', 'x', '÷', '⚡', '🎯'],
  'قسم-التدرب-على-حل-المكعبات-السحرية': ['🧊', '🧩', '3x3', '🎲', '⚡', '✨'],
  'قسم-اساسيات-البرمجة-والروبوتيك': ['🤖', '💻', '<code/>', '⚙️', '🚀', '0101'],
  'languages': ['ع', 'ABC', 'Bonjour', 'Türkçe', 'Español', 'Deutsch'],
  'psychology': ['〰️', '⭕', '∞', '✨', '🧘', '🌟'],
  'history': ['🏛', '1954', '📜', '🏺', '⚔️', '👑'],
  'ورشة-الخط-العربي': ['✒️', '📜', 'خط الرقعة', 'خط النسخ', 'ديواني', '✨'],
  'health': ['❤️', '🌿', '⚛', 'DNA', '🥗', '🏃'],
  'talents': ['🎨', '{ }', '✒️', '💡', '🎭', '⭐'],
  'problem-solving': ['π', '√', '∑', '△'],
};

const MODULE_DEFAULTS = {
  'quran': {
    name: 'قسم التعليم القرآني',
    description: 'حفظ وتجويد بطرق تفاعلية مبتكرة لترسيخ القرآن الكريم في النفوس.',
    icon: '🕌',
    color_primary: '#10B981',
    price: 0,
  },
  'memory': {
    name: 'الذاكرة الخارقة',
    description: 'تطوير مهارات الحفظ السريع والاستيعاب الفائق ومضاعفة التركيز والذكاء.',
    icon: '🧠',
    color_primary: '#8B5CF6',
    price: 3000,
  },
  'soroban': {
    name: 'الحساب الذهني (السوروبان)',
    description: 'تطوير سرعة الحساب والبديهة والدقة في حل العمليات الرياضية ذهنياً.',
    icon: '🧮',
    color_primary: '#F59E0B',
    price: 2000,
  },
  'قسم-التدرب-على-حل-المكعبات-السحرية': {
    name: 'قسم التدرب على حل المجسمات السحرية',
    description: 'رحلة تفاعلية مشوقة لاحتراف حل مكعب روبيك 3×3 والمجسمات السحرية المختلفة وتطوير الذاكرة العضلية وسرعة البديهة والتركيز الفائق.',
    icon: '🧊',
    color_primary: '#2563EB',
    price: 500,
    learning_outcomes: [
      'إتقان خوارزميات وقواعد حل مكعب روبيك 3×3 من الصفر حتى الاحتراف الكامل.',
      'فهم آلية حركة الطبقات والزوايا والأطراف بطريقة هندسية منطقية وسلسة.',
      'تعلم استراتيجيات تقليل وقت الحل وتطوير الذاكرة العضلية وحركات الأصابع السريعة.',
      'القدرة على حل مختلف الأشكال والمجسمات السحرية المتنوعة بثقة وإتقان.'
    ],
    benefits: [
      'مضاعفة سرعة البديهة والتركيز البصري والذاكرة العضلية لدى الطالب.',
      'تطوير التفكير المكاني ثلاثي الأبعاد وإدراك العلاقات الهندسية المعقدة.',
      'تدريب الصبر، الإصرار، والمثابرة على حل التحديات المعقدة ذاتياً.',
      'تقليل الاعتماد على الشاشات بنشاط ذهني حركي ممتع ومثمر ومحفز.'
    ]
  },
  'قسم-اساسيات-البرمجة-والروبوتيك': {
    name: 'قسم أساسيات البرمجة والروبوتيك',
    description: 'تأهيل الجيل الصاعد لعالم التكنولوجيا والذكاء الاصطناعي من خلال فهم الخوارزميات، البرمجة المرئية، والتحكم بالروبوتات الذكية بأسلوب ممتع وتطبيقي.',
    icon: '🤖',
    color_primary: '#0D9488',
    price: 1500,
    learning_outcomes: [
      'فهم المبادئ الأساسية للتفكير البرمجي وبناء الخوارزميات خطوة بخطوة.',
      'التعرف على مكونات الروبوتات والحساسات وكيفية برمجتها لتنفيذ مهام ذكية.',
      'برمجة ألعاب ومشاريع تفاعلية محفزة للإبداع والابتكار التكنولوجي.',
      'حل المشكلات التقنية وتطوير عقلية المهندس الصغير والمبتكر.'
    ],
    benefits: [
      'تجهيز الطالب لعصر الذكاء الاصطناعي والمهارات التقنية المستقبلية.',
      'تنمية التفكير المنطقي والرياضي ومهارات التحليل والتركيز الذهني.',
      'مشاريع عملية تطبيقية تمنح الطفل ثقة فورية وإحساساً بالإنجاز.',
      'بيئة تدريبية تفاعلية ومحفزة تشجع على التعاون والعمل الجماعي.'
    ]
  },
  'languages': {
    name: 'قسم اللغات والتواصل',
    description: 'منظومة لغوية شاملة تمكّن الطفل من التحدث بطلاقة وثقة بست لغات عالمية حية، عبر مسارات تدريبية مقسمة لثلاثة مستويات احترافية.',
    icon: '🗣️',
    color_primary: '#EC4899',
    price: 2000,
    learning_outcomes: [
      'اكتساب مهارات الاستماع والتحدث والنطق السليم في 6 لغات عالمية.',
      'بناء الحصيلة اللغوية والمفردات اليومية الأساسية والمتقدمة لكل لغة.',
      'إتقان قواعد التعبير وتكوين الجمل الحوارية بثقة ودون تردد.',
      'اجتياز المستويات الثلاثة (المبتدئ، المتوسط، المتقدم) بنجاح واقتدار.'
    ],
    benefits: [
      'الانفتاح الثقافي والمعرفي على العالم واكتساب ميزة تنافسية مبكرة.',
      'تطوير المرونة الإدراكية وسرعة التفكير المتعدد اللغات.',
      'تخطي حاجز الخوف والتردد من التحدث باللغات الأجنبية أمام الآخرين.',
      'محتوى تفاعلي شيق يناسب أعمار الطلاب ويشجعهم على الممارسة المستمرة.'
    ]
  },
  'psychology': {
    name: 'قسم المتابعة النفسية',
    description: 'تعزيز الثقة بالنفس، إدارة المشاعر، وبناء شخصية قيادية إيجابية متوازنة.',
    icon: '🧘',
    color_primary: '#6366F1',
    price: 1000,
  },
  'history': {
    name: 'قسم التاريخ',
    description: 'استكشاف البطولات والقصص الملهمة والحضارات العريقة بأسلوب تفاعلي مشوق.',
    icon: '🏛️',
    color_primary: '#D97706',
    price: 0,
  },
  'ورشة-الخط-العربي': {
    name: 'ورشة الخط العربي',
    description: 'ورشة متخصصة ومجانية لاكتشاف أسرار وفنون الخطوط العربية الأصيلة، تحسين خط اليد بالقلم العادي وقلم الخط، والتعبير الفني الراقي.',
    icon: '✒️',
    color_primary: '#B45309',
    price: 0,
    learning_outcomes: [
      'التعرف على أصول الخطوط العربية الأصيلة (خط النسخ، الرقعة، والديواني).',
      'إتقان مسكة القلم وزوايا الكتابة وموازين الحروف بنسبها الصحيحة.',
      'التدرب على اتصالات الحروف وجماليات التركيب والتناغم البصري.',
      'إنجاز لوحات خطية جمالية متكاملة تعتز بالهوية العربية والإسلامية.'
    ],
    benefits: [
      'تحسين وتجميل الخط اليدوي للطفل في المدرسة والدراسة والحياة اليومية.',
      'غرس الهدوء، الصبر، والدقة، والتذوق الفني والجمالي الراقي.',
      'الاعتزاز باللغة العربية ورسم القرآن الكريم والهوية الإسلامية الأصيلة.',
      'ورشة مجانية بالكامل ومفتوحة لكل المواهب الطموحة.'
    ]
  },
  'health': {
    name: 'قسم الآداب العامة والعادات الصحية',
    description: 'غرس الأخلاق الرفيعة وبناء نمط حياة صحي ومتوازن للجسم والعقل للأبطال الصغار.',
    icon: '🌿',
    color_primary: '#EF4444',
    price: 0,
  },
  'talents': {
    name: 'قسم اكتشاف المواهب',
    description: 'صقل المهارات الإبداعية وتفجير الطاقات الابتكارية والفنية في شتى المجالات.',
    icon: '⭐',
    color_primary: '#06B6D4',
    price: 0,
  },
};

// 6 Languages Paths data
const LANGUAGE_PATHS = [
  {
    id: 'en',
    name: 'اللغة الإنجليزية',
    subName: 'English Language',
    flag: '🇬🇧',
    color: '#3B82F6',
    description: 'اللغة الأكثر انتشاراً عالمياً. مسار تدريبي يركز على المحادثة اليومية، بناء المفردات، واكتساب الطلاقة والاستماع.',
    levels: [
      {
        level: 'المستوى المبتدئ',
        sub: 'Level 1 - Starter & Foundations',
        summary: 'تأسيس الحروف والأصوات، المفردات اليومية الشائعة، التحيات، تكوين الجمل البسيطة، والتغلب على حاجز النطق الأولي.',
        topics: [
          'الأبجدية والأصوات الصوتية (Phonics)',
          'التعريف بالنفس والتحيات اليومية',
          'الأرقام والألوان وأيام الأسبوع',
          'أفراد العائلة والمهن والأماكن المحيطة',
          'الأفعال الأساسية والضمائر',
          'تكوين جمل يومية بسيطة بثقة'
        ]
      },
      {
        level: 'المستوى المتوسط',
        sub: 'Level 2 - Practical Communication',
        summary: 'تطوير الطلاقة في المحادثات الروتينية، توسيع القاموس اللغوي، التعبير عن المشاعر والآراء، وفهم النصوص المسموعة والمقروءة.',
        topics: [
          'الأزمنة الأساسية (الماضي، الحاضر، المستقبل)',
          'الحوارات اليومية في المتجر والمطعم والسفر',
          'السرد القصصي ووصف الأحداث اليومية',
          'قواعد صياغة الأسئلة والإجابة المطولة',
          'التعبير عن التفضيلات والآراء الشخصية',
          'تمارين الاستماع التفاعلي'
        ]
      },
      {
        level: 'المستوى المتقدم',
        sub: 'Level 3 - Fluency & Mastery',
        summary: 'الطلاقة التامة والمناقشة الشفوية الواثقة، المصطلحات الاصطلاحية، المحادثات المتقدمة، والكتابة التعبيرية المتماسكة.',
        topics: [
          'التعابير الاصطلاحية (Idioms) والمجازات الشائعة',
          'المناظرات المصغرة والمناقشات التفاعلية',
          'تحليل المقاطع الصوتية والنصوص المركبة',
          'العروض التقديمية والتحدث أمام الجمهور',
          'صياغة المقالات التعبيرية والقصص',
          'المحاكاة اللغوية لمواقف الحياة الواقعية'
        ]
      }
    ]
  },
  {
    id: 'fr',
    name: 'اللغة الفرنسية',
    subName: 'Langue Française',
    flag: '🇫🇷',
    color: '#6366F1',
    description: 'لغة الفصاحة والأناقة. مسار متكامل لتثبيت قواعد اللغة، تحسين النطق الصوتي، والتمكن الدراسي والتواصلي.',
    levels: [
      {
        level: 'المستوى المبتدئ',
        sub: 'Niveau 1 - Débutant',
        summary: 'الأصوات الفرنسية المميزة، أدوات التعريف والتنكير، المفردات المدرسية والعائلية، وبناء الجمل الحوارية البسيطة.',
        topics: [
          'L\'alphabet et la prononciation',
          'Salutations et présentations',
          'Les nombres et le calendrier',
          'La famille et la maison',
          'Les verbes Être et Avoir au présent',
          'Phrases simples du quotidien'
        ]
      },
      {
        level: 'المستوى المتوسط',
        sub: 'Niveau 2 - Intermédiaire',
        summary: 'تصريف الأفعال بالأزمنة الأساسية، إدارة حوارات في مواقف الحياة اليومية، وفهم نصوص متنوعة بسلاسة.',
        topics: [
          'Le passé composé et l\'imparfait',
          'Dialogues en ville et voyages',
          'Exprimer des opinions et sentiments',
          'Les adjectifs et la description',
          'Compréhension orale interactive',
          'Production écrite guidée'
        ]
      },
      {
        level: 'المستوى المتقدم',
        sub: 'Niveau 3 - Avancé',
        summary: 'التمكن من التعبير الشفهي والكتابي المعمق، مناقشة الأفكار المعقدة، والطلاقة اللغوية بثقة عالية.',
        topics: [
          'Expressions idiomatiques françaises',
          'Le futur et le conditionnel',
          'Débats et prises de parole en public',
          'Analyse de textes et de dialogues',
          'Rédaction libre et argumentation',
          'Perfectionnement phonétique'
        ]
      }
    ]
  },
  {
    id: 'tr',
    name: 'اللغة التركية',
    subName: 'Türkçe',
    flag: '🇹🇷',
    color: '#EF4444',
    description: 'لغة الحضارة والتواصل مع تركيا. مسار ميسر وممتع يركز على بنية الجملة ولواحقها التوافقية والحوارات الحية.',
    levels: [
      {
        level: 'المستوى المبتدئ',
        sub: 'Seviye 1 - Başlangıç',
        summary: 'الأبجدية التركية وقواعد التوافق الصوتي، التحيات والتعارف، الأرقام والأشياء المحيطة، وتكوين الجمل الاسمية.',
        topics: [
          'Türk Alfabesi ve ses uyumu',
          'Tanışma ve selamlaşma',
          'Sayılar ve zaman ifadeleri',
          'Günlük nesneler ve mekânlar',
          'Temel ekler ve iyelik ekleri',
          'Basit günlük diyaloglar'
        ]
      },
      {
        level: 'المستوى المتوسط',
        sub: 'Seviye 2 - Orta',
        summary: 'الأفعال وأزمنة الحاضر والماضي والمستقبل، صياغة الأسئلة، والمحادثة في الأسواق والمطاعم والمناسبات.',
        topics: [
          'Şimdiki Zaman ve Geçmiş Zaman',
          'Alışveriş ve seyahat konuşmaları',
          'Yön sorma ve tarif etme',
          'Fiil çekimleri ve olumsuzluk ekleri',
          'Orta seviye dinleme alıştırmaları',
          'Kısa kompozisyon yazma'
        ]
      },
      {
        level: 'المستوى المتقدم',
        sub: 'Seviye 3 - İleri',
        summary: 'اللواحق المتقدمة، الطلاقة الحوارية السريعة، فهم الأخبار والمقاطع الصوتية الطبيعية، والمناقشات الثقافية.',
        topics: [
          'Geniş Zaman ve Gelecek Zaman ekleri',
          'Deyimler ve atasözleri',
          'Akıcı konuşma ve münazaralar',
          'Karmaşık metin anlama',
          'Düşünce ve fikir sunumu',
          'Doغal Türkçe pratikleri'
        ]
      }
    ]
  },
  {
    id: 'es',
    name: 'اللغة الإسبانية',
    subName: 'Español',
    flag: '🇪🇸',
    color: '#F59E0B',
    description: 'ثاني أكثر اللغات تحدثاً حول العالم. مسار حيوي ومحفز للتعرف على أصول النطق والتواصل التلقائي والممتع.',
    levels: [
      {
        level: 'المستوى المبتدئ',
        sub: 'Nivel 1 - Inicial',
        summary: 'الحروف الإسبانية وقواعد النطق الواضحة، التحيات والتعارف، الألوان والوجبات، والحديث عن النفس والهوايات.',
        topics: [
          'El abecedario y la fonética',
          'Saludos y presentaciones',
          'Los números y la familia',
          'Verbos básicos: Ser, Estar, Tener',
          'La rutina diaria y gustos',
          'Frases cotidianas básicas'
        ]
      },
      {
        level: 'المستوى المتوسط',
        sub: 'Nivel 2 - Intermedio',
        summary: 'الماضي والحاضر والمستقبل، إجراء محادثات واسعة، طلب الخدمات، ووصف الرحلات والأماكن بحرية.',
        topics: [
          'El pretérito perfecto e indefinido',
          'Conversaciones en viajes y tiendas',
          'Expresar planes y proyectos futuros',
          'Concordancia y adjetivos',
          'Comprensión auditiva en español',
          'Expresión escrita práctica'
        ]
      },
      {
        level: 'المستوى المتقدم',
        sub: 'Nivel 3 - Avanzado',
        summary: 'الطلاقة الحوارية العالية، التعبيرات الشعبية، قراءة القصص والمقالات، ومناقشة المواضيع المجتمعية والثقافية.',
        topics: [
          'Modismos y expresiones populares',
          'El subjuntivo en contextos reales',
          'Debates orales y argumentación',
          'Cultura hispana y narraciones',
          'Redacción avanzada',
          'Fluidez espontánea'
        ]
      }
    ]
  },
  {
    id: 'de',
    name: 'اللغة الألمانية',
    subName: 'Deutsch',
    flag: '🇩🇪',
    color: '#10B981',
    description: 'لغة العلوم والدقة والتفكير المنطقي. مسار منظم يدرّب الطالب على مخارج الحروف، التراكيب السليمة، والطلاقة.',
    levels: [
      {
        level: 'المستوى المبتدئ',
        sub: 'Stufe 1 - Grundstufe',
        summary: 'مخارج الأصوات الألمانية المميزة، التعريف بالنفس والتحيات، الأرقام والوقت، وأدوات التعريف والتنكير.',
        topics: [
          'Das deutsche Alphabet und Aussprache',
          'Begrüßung und Kennenlernen',
          'Zahlen, Uhrzeit und Wochentage',
          'Artikel: der, die, das',
          'Verben im Präsens: sein und haben',
          'Einfache Sätze im Alltag'
        ]
      },
      {
        level: 'المستوى المتوسط',
        sub: 'Stufe 2 - Mittelstufe',
        summary: 'بناء الجمل الألمانية، حالات الإعراب (Nominativ, Akkusativ, Dativ)، وإجراء حوارات عملية في مختلف المواقف.',
        topics: [
          'Akkusativ und Dativ im Überblick',
          'Alltagsdialoge und Orientierung',
          'Modalverben und Satzstruktur',
          'Perfekt und Vergangenheit',
          'Hörverständnis und Dialoge',
          'Einfache Textproduktion'
        ]
      },
      {
        level: 'المستوى المتقدم',
        sub: 'Stufe 3 - Oberstufe',
        summary: 'الطلاقة اللغوية، تراكيب الجمل المعقدة، التعبير عن الرأي بموضوعية، ومناقشة الموضوعات العلمية والثقافية.',
        topics: [
          'Redewendungen und Ausdrücke',
          'Nebensätze mit weil, dass, wenn',
          'Freies Sprechen und Diskussionen',
          'Lesen und Verstehen von Berichten',
          'Präsentationen auf Deutsch',
          'Verfeinerung der Aussprache'
        ]
      }
    ]
  },
  {
    id: 'ar',
    name: 'اللغة العربية',
    subName: 'الفصحى المعاصرة والبيان',
    flag: '🇩🇿',
    color: '#0D9488',
    description: 'لغة القرآن الكريم والبيان الساحر. مسار أصيل لغرس الفصاحة وسلامة اللسان والقدرة على الخطابة والتعبير الأدبي الراقي.',
    levels: [
      {
        level: 'المستوى المبتدئ',
        sub: 'المستوى التأسيسي - سلامة النطق والإملاء',
        summary: 'مخارج الحروف العربية وضبط الحركات، القواعد الإملائية الأساسية، القراءة المعبرة، وإثراء الرصيد اللغوي بالمفردات الفصيحة.',
        topics: [
          'مخارج الحروف والصفات الصوتية',
          'الهمزات والتاء المربوطة والمفتوحة',
          'أقسام الكلمة (اسم، فعل، حرف)',
          'الجملة الاسمية والجملة الفعلية',
          'القراءة الجهرية السليمة',
          'تكوين جمل فصيحة ومترابطة'
        ]
      },
      {
        level: 'المستوى المتوسط',
        sub: 'المستوى التمكيني - التراكيب والأساليب البلاغية',
        summary: 'إعراب الجمل والأساليب النحوية، التمييز بين الأساليب البلاغية (الاستفهام، التعجب، النداء)، والتعبير الكتابي السليم.',
        topics: [
          'علامات الإعراب الأصلية والفرعية',
          'أساليب البيان والتعبير المتنوعة',
          'التقديم والتأخير وجماليات النظم',
          'فهم المقروء والتلخيص الذكي',
          'كتابة الفقرات والرسائل والقصص',
          'تنمية الإلقاء والتحدث الفصيح'
        ]
      },
      {
        level: 'المستوى المتقدم',
        sub: 'المستوى الإتقاني - الفصاحة والخطابة والإنشاء',
        summary: 'الطلاقة الشفوية والخطابة الواثقة، تذوق البلاغة (التشبيه والاستعارة والكناية)، وكتابة المقالات الأدبية الرفيعة.',
        topics: [
          'فنون البلاغة: البيان والبديع والمعاني',
          'مهارات الخطابة والإلقاء المنبري والتأثير',
          'المناظرات الفكرية والأدبية',
          'النقد والتذوق الجمالي للنصوص',
          'الإنشاء الأدبي المتكامل',
          'الإتقان النحوي التلقائي في الكلام'
        ]
      }
    ]
  }
];

// Special Calligraphy Styles for Arabic Calligraphy unit
const CALLIGRAPHY_STYLES = [
  {
    name: 'خط النسخ',
    title: 'خط المصاحف والوضوح المدرسي',
    description: 'أساس كل كاتب؛ يتميز باعتدال حروفه، وضوح قراءته، وجمال ضبط حركاته، وهو الخط المعتمد في طباعة القرآن الكريم والكتب المدرسية.',
    icon: '📖',
    accent: '#D97706'
  },
  {
    name: 'خط الرقعة',
    title: 'خط السرعة والتدوين اليومي',
    description: 'خط الحيوية والإنجاز السريع؛ يمتاز باستقامة خطوطه وسهولة حروفه وملاءمته الفائقة للكتابة اليومية بالقلم العادي.',
    icon: '📝',
    accent: '#F59E0B'
  },
  {
    name: 'الخط الديواني',
    title: 'سحر المخطوطات والمنحنيات',
    description: 'خط الفخامة العثمانية والشهادات الملكية؛ يتميز بتداخل كلماته ومرونة حروفه الدائرية الباهرة التي تشبه اللوحات الموسيقية.',
    icon: '📜',
    accent: '#EAB308'
  },
  {
    name: 'الخط الكوفي',
    title: 'هيبة العمارة والزخرفة الإسلامية',
    description: 'أعرق الخطوط العربية؛ ذو طابع هندسي صلب ومستقيم يزين جدران المساجد التاريخية والمآذن الشامخة وعملات الحضارة الإسلامية.',
    icon: '🏛️',
    accent: '#CA8A04'
  },
  {
    name: 'خط الثلث',
    title: 'أم الخطوط وسلطان الزخارف',
    description: 'قمة الإتقان والفخر العربي؛ أصعب الخطوط وأجملها، يُستخدم في تزيين قِباب المساجد وكسوة الكعبة المشرفة وتيجان اللوحات.',
    icon: '👑',
    accent: '#B45309'
  }
];

// Special Tech Pillars for Robotics unit
const ROBOTICS_PILLARS = [
  {
    icon: <Cpu className="w-8 h-8 text-cyan-400" />,
    title: 'التفكير الخوارزمي المنطقي',
    subtitle: 'Algorithmic Thinking',
    desc: 'تفكيك المشكلات المعقدة لخطوات منطقية متسلسلة تمكن العقل من التخطيط المسبق وحل الألغاز البرمجية بكفاءة.'
  },
  {
    icon: <Terminal className="w-8 h-8 text-teal-400" />,
    title: 'البرمجة المرئية والألعاب',
    subtitle: 'Creative Code & Games',
    desc: 'بناء الألعاب التفاعلية والرسوم المتحركة عبر كتل الأوامر الشيقة والانتقال التدريجي لأساسيات لغة بايثون الحديثة.'
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    title: 'الروبوتات والحساسات الذكية',
    subtitle: 'Robotics & Hardware',
    desc: 'التحكم في المحركات وحساسات المسافة والألوان، وبرمجة روبوت ذكي يتفادى العوائق ويتبع المسارات بدقة.'
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-purple-400" />,
    title: 'أساسيات الذكاء الاصطناعي',
    subtitle: 'AI & Automation',
    desc: 'التعرف على كيفية تعلم الآلات واستجابتها للأصوات والصور، وتطبيق مشاريع ذكية تفتح آفاق المستقبل.'
  }
];

// Special Rubik's Cube Stages
const RUBIKS_STAGES = [
  {
    step: 'المرحلة 1',
    title: 'الصليب الأبيض (White Cross)',
    desc: 'بناء الأساس المتين من خلال توجيه الحواف الأربعة للوجه الأبيض مع مطابقة ألوان المراكز الجانبية بدقة هندسية.',
    color: 'from-amber-500 to-yellow-400'
  },
  {
    step: 'المرحلة 2',
    title: 'الطبقتان الأوليان (F2L)',
    desc: 'دمج زوايا القاعدة مع حواف الطبقة الوسطى بذكاء في حركة واحدة متناغمة دون تشتيت القطع المحلولة مسبقاً.',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    step: 'المرحلة 3',
    title: 'توجيه الطبقة الأخيرة (OLL)',
    desc: 'تطبيق خوارزميات توجيه السطح العلوي ليصبح الوجه بالكامل باللون الأصفر في لمحات زمنية قياسية.',
    color: 'from-emerald-500 to-teal-400'
  },
  {
    step: 'المرحلة 4',
    title: 'تبديل مواضع القطع (PLL)',
    desc: 'اللمسات الختامية الحاسمة؛ تبديل أماكن الزوايا والحواف الأخيرة والوصول للحل النهائي الكامل في ثوانٍ معدودة!',
    color: 'from-rose-500 to-red-400'
  }
];

const ModulePage = () => {
  const { slug: rawSlug } = useParams();
  const slug = decodeURIComponent(rawSlug || '');
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [activeCalligraphyStyle, setActiveCalligraphyStyle] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const defaults = MODULE_DEFAULTS[slug] || {};
    api.get(`/modules/${encodeURIComponent(slug)}/`)
      .then(res => {
        const live = res.data || {};
        setMod({
          ...defaults,
          ...live,
          name: live.name || defaults.name || slug,
          description: (live.description && live.description.trim()) || defaults.description || '',
          icon: live.icon || defaults.icon || '⭐',
          color_primary: live.color_primary || defaults.color_primary || '#1565C0',
          price: typeof live.price !== 'undefined' ? Number(live.price) : (defaults.price ?? 0),
          learning_outcomes: live.learning_outcomes || defaults.learning_outcomes || [],
          benefits: live.benefits || defaults.benefits || [],
        });
      })
      .catch(err => {
        console.error('Error fetching module:', err);
        setMod({
          slug,
          name: defaults.name || slug,
          description: defaults.description || 'الوصف الكامل للبرنامج سيظهر هنا.',
          icon: defaults.icon || '⭐',
          color_primary: defaults.color_primary || '#1565C0',
          price: defaults.price ?? 0,
          learning_outcomes: defaults.learning_outcomes || [],
          benefits: defaults.benefits || [],
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Set individual canonical URL, title and meta description for this specific module
  useEffect(() => {
    if (mod) {
      updatePageSeo({
        canonicalPath: `/modules/${encodeURIComponent(slug)}`,
        title: `${mod.name} | منصة فطنة (Minasat Fitna)`,
        description: mod.description || `${mod.name} - أحد البرامج التعليمية المتميزة في منصة فطنة للأطفال في الجزائر.`
      });
    }
    return () => {
      updatePageSeo({
        canonicalPath: '/',
        title: 'منصة فطنة | Minasat Fitna – منصة تعليمية للأطفال في الجزائر',
        description: 'منصة فطنة (Minasat Fitna) هي منصة تعليمية جزائرية للأطفال، تهدف إلى تطوير مهاراتهم وقدراتهم من خلال برامج التعليم القرآني، الذاكرة الخارقة، الحساب الذهني، اللغات، البرمجة والروبوتيك واكتشاف المواهب. نُعِدُّهم للحياة، لا للامتحانات.'
      });
    };
  }, [mod, slug]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-white bg-bgDark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accentGold border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-gray-300">جاري التحميل...</div>
      </div>
    </div>
  );

  if (!mod) return (
    <div className="min-h-[60vh] flex items-center justify-center text-white bg-bgDark">
      <div className="text-center p-12 bg-bgPurple rounded-3xl border border-white/10">
        <h2 className="text-2xl font-black mb-4">البرنامج غير موجود</h2>
        <Link to="/" className="px-6 py-2.5 bg-accentGold text-bgDark font-bold rounded-xl inline-block">العودة للرئيسية</Link>
      </div>
    </div>
  );

  const symbols = SYMBOLS[slug] || ['✨', '⭐', '🌟', '💫', '🎯', '🚀'];

  const getArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const outcomes = getArray(mod.learning_outcomes);
  const benefits = getArray(mod.benefits);
  const heroImage = mod.hero_image ? getMediaUrl(mod.hero_image) : null;

  const isCalligraphy = slug === 'ورشة-الخط-العربي';
  const isRobotics = slug === 'قسم-اساسيات-البرمجة-والروبوتيك';
  const isRubiks = slug === 'قسم-التدرب-على-حل-المكعبات-السحرية';
  const isLanguages = slug === 'languages';

  return (
    <div className="w-full bg-bgDark min-h-screen text-white overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CUSTOM HERO SECTIONS PER UNIT
      ───────────────────────────────────────────────────────────── */}
      
      {/* A. CALLIGRAPHY HERO */}
      {isCalligraphy ? (
        <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#020617] border-b border-amber-500/20">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F59E0B 1.5px, transparent 0)', backgroundSize: '36px 36px' }} />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>أكاديمية الخط العربي التراثي — ورشة مجانية بالكامل</span>
              </div>

              <h1 className="inline-block text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 leading-snug sm:leading-normal pb-4 drop-shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
                ورشة الخط العربي الأصيل
              </h1>

              <div className="text-amber-100/90 text-xl font-medium italic border-r-4 border-amber-400 pr-4 my-2">
                "الخَطُّ الحَسَنُ يَزِيدُ الحَقَّ وُضُوحًا"
              </div>

              <p className="text-lg sm:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl">
                رحلة فنية وبصرية أصيلة تفتح آفاق الطفل نحو جماليات الحرف العربي، موازين أقلام القصب، وأسرار خط النسخ، الرقعة، والديواني مع ممارسات تطبيقية تعتز بالهوية العربية والإسلامية.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  ✨ ورشة مجانية بالكامل (0 دج)
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  📜 شهادة مشاركة معتمدة
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  🎓 للأبطال من 9 إلى 18 سنة
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-10 py-5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-2xl text-xl hover:from-amber-300 hover:to-yellow-400 transition shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105"
                >
                  سجّل مجاناً الآن ✒️
                </button>
                <Link
                  to={`/modules/${encodeURIComponent(slug)}/trial`}
                  className="px-8 py-5 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-2xl text-xl hover:bg-white/20 transition flex items-center justify-center gap-2 hover:scale-105"
                >
                  <PlayCircle className="w-6 h-6 text-amber-400" />
                  <span>تصفح الدروس التمهيدية</span>
                </Link>
              </div>
            </div>

            {/* Right: 3D Calligraphy Visual */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="absolute w-80 h-80 bg-amber-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
              <motion.img
                src="/assets/units/calligraphy.png"
                alt="قلم الخط العربي والمحبرة الملكية ثلاثية الأبعاد"
                animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-[460px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none pointer-events-none"
              />
            </div>
          </div>
        </section>
      ) : isRobotics ? (
        /* B. ROBOTICS HERO */
        <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-[#022c22] via-[#042f2e] to-[#020617] border-b border-teal-500/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-sm font-bold shadow-lg">
                <Cpu className="w-4 h-4" />
                <span>أكاديمية الذكاء الاصطناعي وصنّاع المستقبل</span>
              </div>

              <h1 className="inline-block text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-400 to-blue-400 leading-snug sm:leading-normal pb-4 drop-shadow-[0_4px_20px_rgba(6,182,212,0.3)]">
                أساسيات البرمجة والروبوتيك
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl">
                نحوّل طفلك من مستهلك للتكنولوجيا إلى مبتكر ومبرمج! منهج تفاعلي مشوق يدمج التفكير الخوارزمي، بناء الألعاب الذكية، والتحكم بالروبوتات والحساسات عبر مشاريع تطبيقية واقعية.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 rounded-xl bg-accentGold/20 border border-accentGold/30 text-accentGold text-sm font-bold flex items-center gap-1.5 shadow-md">
                  رسوم البرنامج: 1500 دج
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  🤖 روبوتات وحساسات ذكية
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  🎮 برمجة ألعاب وتطبيقات
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-10 py-5 bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-black rounded-2xl text-xl hover:from-teal-300 hover:to-cyan-400 transition shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105"
                >
                  سجّل الآن في البرنامج 🤖
                </button>
                <Link
                  to={`/modules/${encodeURIComponent(slug)}/trial`}
                  className="px-8 py-5 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-2xl text-xl hover:bg-white/20 transition flex items-center justify-center gap-2 hover:scale-105"
                >
                  <PlayCircle className="w-6 h-6 text-cyan-400" />
                  <span>تجربة مجانية</span>
                </Link>
              </div>
            </div>

            {/* Right: 3D Robot Visual */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="absolute w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
              <motion.img
                src="/assets/units/robotics.png"
                alt="روبوت تعليمي وبرمجة ذكية ثلاثية الأبعاد"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-[460px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none pointer-events-none"
              />
            </div>
          </div>
        </section>
      ) : isRubiks ? (
        /* C. RUBIK'S CUBE HERO */
        <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#020617] border-b border-blue-500/20">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #60A5FA 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute -top-40 left-1/3 w-[650px] h-[650px] bg-blue-500/20 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-300/30 text-blue-200 text-sm font-bold shadow-lg">
                <Puzzle className="w-4 h-4 text-yellow-300" />
                <span>أكاديمية مكعب روبيك وتحديات السرعة الاحترافية</span>
              </div>

              <h1 className="inline-block text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-sky-300 to-blue-400 leading-snug sm:leading-normal pb-4 drop-shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
                التدرب على حل المجسمات السحرية
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 font-normal leading-relaxed max-w-2xl">
                تحدَّ عقلك واكتشف أسرار وخوارزميات حل مكعب روبيك الكلاسيكي 3×3 وأروع المجسمات الهندسية. نحوّل اللغز المعقد إلى خطوات ذكية وسلسة ليتعلم طفلك حل المكعب بالكامل في ثوانٍ معدودة!
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 rounded-xl bg-accentGold/20 border border-accentGold/30 text-accentGold text-sm font-bold flex items-center gap-1.5 shadow-md">
                  رسوم البرنامج: 500 دج
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  ⚡ خوارزميات السرعة CFOP
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-sm font-bold flex items-center gap-1.5 shadow-md">
                  🧠 تطوير الذاكرة العضلية
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-10 py-5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black rounded-2xl text-xl hover:from-amber-300 hover:to-yellow-300 transition shadow-[0_0_30px_rgba(245,197,24,0.4)] hover:scale-105"
                >
                  سجّل في التحدي (500 دج) 🧊
                </button>
                <Link
                  to={`/modules/${encodeURIComponent(slug)}/trial`}
                  className="px-8 py-5 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-2xl text-xl hover:bg-white/20 transition flex items-center justify-center gap-2 hover:scale-105"
                >
                  <PlayCircle className="w-6 h-6 text-yellow-300" />
                  <span>تجربة مجانية</span>
                </Link>
              </div>
            </div>

            {/* Right: Authentic 3D Rubik's Cube */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="absolute w-80 h-80 bg-blue-500/25 rounded-full blur-3xl -z-10 animate-pulse" />
              <motion.img
                src="/assets/units/rubiks-cube.png"
                alt="مكعب روبيك 3×3 ملون أصيل ثلاثي الأبعاد"
                animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-[450px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] select-none pointer-events-none"
              />
            </div>
          </div>
        </section>
      ) : (
        /* STANDARD HERO (FOR OTHER MODULES) */
        <section 
          className="relative pt-32 pb-24 overflow-hidden text-white"
          style={{ 
            background: heroImage 
              ? `linear-gradient(135deg, rgba(13,11,43,0.85) 0%, rgba(13,11,43,0.98) 100%), url(${heroImage}) center/cover` 
              : `linear-gradient(135deg, ${mod.color_primary || '#1B5E20'} 0%, #0D0B2B 150%)` 
          }}
        >
          {!heroImage && symbols.map((sym, i) => (
            <motion.div 
              key={i}
              animate={{ y: [0, -30, 0], opacity: [0.15, 0.45, 0.15] }} 
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute text-6xl md:text-8xl select-none pointer-events-none opacity-20 font-black drop-shadow-lg"
              style={{ 
                top: `${15 + i * 15}%`, 
                [i % 2 === 0 ? 'left' : 'right']: `${8 + i * 12}%`,
              }}
            >
              {sym}
            </motion.div>
          ))}

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
              {mod.icon}
            </motion.div>

            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black mb-4 drop-shadow-md leading-snug md:leading-normal pb-3">
              {mod.name}
            </motion.h1>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="mb-6 inline-block">
              {mod.price === 0 ? (
                <span className="bg-emerald-500/90 text-white px-5 py-2 rounded-full text-base font-black shadow-lg backdrop-blur inline-flex items-center gap-1.5 border border-emerald-400/30">
                  ✨ برنامج مجاني بالكامل
                </span>
              ) : (
                <span className="bg-accentGold text-bgDark px-5 py-2 rounded-full text-base font-black shadow-lg inline-flex items-center gap-1.5">
                  رسوم البرنامج: {mod.price} دج
                </span>
              )}
            </motion.div>

            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-xl md:text-2xl font-bold mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed">
              {mod.description}
            </motion.p>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setModalOpen(true)}
                className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl text-xl hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                سجّل الآن 🚀
              </button>
              <Link 
                to={`/modules/${encodeURIComponent(slug)}/trial`}
                className="px-10 py-5 bg-black/30 backdrop-blur border border-white/30 text-white font-bold rounded-2xl text-xl hover:bg-black/50 transition flex items-center justify-center gap-2 hover:scale-105"
              >
                <PlayCircle /> تجربة مجانية
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. CUSTOM RICH SECTIONS PER UNIT
      ───────────────────────────────────────────────────────────── */}

      {/* A. CALLIGRAPHY: STYLES & TOOLKIT SHOWCASE */}
      {isCalligraphy && (
        <section className="py-24 bg-[#070A12] border-b border-amber-500/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-amber-400 font-bold text-base mb-2 inline-block">رحلة عبر روائع التراث الإسلامي</span>
              <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-4 leading-snug pb-2">
                أنواع الخطوط العربية المدرجة في الورشة
              </h2>
              <p className="text-gray-300 font-medium text-lg max-w-2xl mx-auto">
                يتعلم الطالب خصوصيات وموازين كل خط من الخطوط الكلاسيكية وكيفية تطويع القلم لإظهار جمالها.
              </p>
            </div>

            {/* Styles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {CALLIGRAPHY_STYLES.map((st, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setActiveCalligraphyStyle(i)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                    activeCalligraphyStyle === i 
                      ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]' 
                      : 'bg-[#0E1322] border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <div>
                    <div className="text-4xl mb-4">{st.icon}</div>
                    <h3 className="text-2xl font-black text-amber-300 mb-1">{st.name}</h3>
                    <div className="text-xs font-bold text-amber-200/70 mb-3">{st.title}</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{st.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 text-xs font-bold text-amber-400 flex items-center justify-between">
                    <span>تطبيق تدريبي</span>
                    <span>المستوى {i + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* The 4-Stage Mastery Path */}
            <div className="mt-20 bg-gradient-to-r from-[#121829] to-[#1E1B4B] p-8 md:p-12 rounded-[3rem] border border-amber-400/30 shadow-2xl">
              <h3 className="text-3xl font-black text-amber-300 mb-8 text-center">المسار التدريبي للخطاط الواعد</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'مسكة القلم وزاوية القط', desc: 'ضبط زاوية القلم (45 درجة) والتحكم في ضغط اليد على الورق المصقول.' },
                  { step: '02', title: 'ميزان النقطة والأبعاد', desc: 'معرفة نسب الحروف بنظام النقاط التقليدي (نظام ابن مقلة الهندسي).' },
                  { step: '03', title: 'اتصالات الحروف والكلمات', desc: 'التدرب على وصل الحروف وسلاسة المد والتناغم البصري بين الكلمات.' },
                  { step: '04', title: 'إنجاز اللوحة الخطية', desc: 'كتابة لوحة خطية متكاملة وتذهيبها وحفظها كإنجاز يفخر به الطالب.' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/30 p-6 rounded-2xl border border-amber-500/20 text-right">
                    <div className="text-3xl font-black text-amber-400 mb-2">{item.step}</div>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* B. ROBOTICS: 4 TECH PILLARS & CODE SIMULATOR */}
      {isRobotics && (
        <section className="py-24 bg-[#050914] border-b border-teal-500/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-bold text-base mb-2 inline-block">منهجية علمية تطبيقية</span>
              <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-4 leading-snug pb-2">
                الركائز الأربعة لمسار البرمجة والروبوتيك
              </h2>
              <p className="text-gray-300 font-medium text-lg max-w-2xl mx-auto">
                نأخذ بيد الطالب خطوة بخطوة من المفاهيم المنطقية الأولى إلى صناعة وتطوير مشاريع ذكية مستقلة.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ROBOTICS_PILLARS.map((pil, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-gradient-to-b from-[#0B1528] to-[#04101E] p-8 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-6">
                      {pil.icon}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-1">{pil.title}</h3>
                    <div className="text-xs font-mono text-cyan-400 font-bold mb-4">{pil.subtitle}</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{pil.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span>مشاريع عملية</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Interactive Code Simulator Preview Card */}
            <div className="mt-16 bg-[#080E1C] rounded-[3rem] p-8 md:p-12 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-right space-y-4 max-w-xl">
                  <span className="text-cyan-400 font-mono text-sm font-bold bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/20">
                    بيئة التعلم التفاعلية
                  </span>
                  <h3 className="text-3xl font-black text-white">يكتب كوداً حقيقياً ويرى أثره فوراً</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    لا نعتمد على التلقين النظري؛ فالطالب يتعلم بناء الخوارزميات وتصحيح الأخطاء البرمجية (Debugging) في بيئة محاكاة مرئية تجعل التعلم مشابهاً للعب ألعاب الفيديو الشيقة.
                  </p>
                </div>

                {/* Simulated Terminal Window */}
                <div className="w-full max-w-lg bg-[#020617] rounded-2xl border border-cyan-500/30 overflow-hidden font-mono text-sm shadow-2xl">
                  <div className="bg-[#0F172A] px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs text-gray-400">fitna_smart_robot.py</span>
                  </div>
                  <div className="p-5 text-right space-y-2 text-xs sm:text-sm" dir="ltr">
                    <div><span className="text-pink-400">def</span> <span className="text-cyan-400">execute_mission</span>():</div>
                    <div className="pl-4 text-gray-300">robot.<span className="text-yellow-400">scan_room</span>()</div>
                    <div className="pl-4 text-gray-300"><span className="text-pink-400">if</span> robot.<span className="text-emerald-400">obstacle_ahead</span>:</div>
                    <div className="pl-8 text-gray-300">robot.<span className="text-cyan-400">turn_right</span>(angle=<span className="text-orange-400">90</span>)</div>
                    <div className="pl-4 text-gray-300"><span className="text-pink-400">return</span> <span className="text-green-300">"Target Reached!"</span></div>
                    <div className="pt-2 text-cyan-400 border-t border-white/10 font-bold">&gt; [Simulation Running: 100% Success] 🚀</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* C. RUBIK'S CUBE: 4 SPEEDCUBING STAGES & SKILLS */}
      {isRubiks && (
        <section className="py-24 bg-[#060B1A] border-b border-blue-500/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-blue-400 font-bold text-base mb-2 inline-block">خوارزميات عالمية مبسطة للأطفال</span>
              <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-4 leading-snug pb-2">
                المراحل الأربعة لاحتراف حل المكعب السحري
              </h2>
              <p className="text-gray-300 font-medium text-lg max-w-2xl mx-auto">
                ندرب الطلاب على أحدث استراتيجيات الحل السريع (CFOP Method) المقسمة لمراحل سهلة وممتعة.
              </p>
            </div>

            {/* 4 Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RUBIKS_STAGES.map((stg, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-gradient-to-b from-[#0D1A38] to-[#050D20] p-8 rounded-3xl border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stg.color} text-slate-950 font-black text-xl flex items-center justify-center mb-6 shadow-lg`}>
                      {i + 1}
                    </div>
                    <div className="text-xs font-bold text-blue-300 mb-1">{stg.step}</div>
                    <h3 className="text-xl font-black text-white mb-3">{stg.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{stg.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-blue-500/10 flex items-center justify-between text-xs font-bold text-blue-300">
                    <span>تدريب عملي مكثف</span>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Speedcuber Superpowers */}
            <div className="mt-16 bg-gradient-to-r from-[#0C1733] to-[#152B63] p-8 md:p-12 rounded-[3rem] border border-blue-400/30 shadow-2xl">
              <h3 className="text-3xl font-black text-blue-200 mb-8 text-center">القدرات الذهنية الخارقة التي يكتسبها طفلك</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Timer className="w-8 h-8 text-yellow-400" />, title: 'الذاكرة العضلية وسرعة الأصابع', desc: 'حفظ أنماط الحركات وتطوير تقنيات الـ Finger Tricks لتحريك الطبقات في أجزاء من الثانية دون تردد.' },
                  { icon: <Compass className="w-8 h-8 text-cyan-400" />, title: 'التفكير المكاني ثلاثي الأبعاد', desc: 'القدرة على توقع حركات القطع المخفية واستباق الحل (Lookahead) بمرونة عقلية استثنائية.' },
                  { icon: <Puzzle className="w-8 h-8 text-emerald-400" />, title: 'الصبر والانضباط الذهني', desc: 'بناء عادة المحاولة وتفكيك المشكلات الصعبة دون ملل، مع تعزيز الثقة بالنفس عند تحقيق أرقام قياسية جديدة.' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/40 p-6 rounded-2xl border border-blue-500/20 text-right">
                    <div className="mb-4">{item.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* D. LANGUAGES: 6 LEARNING PATHS & 3 LEVELS */}
      {isLanguages && (
        <section className="py-20 bg-bgDarker border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-accentGold font-bold text-lg mb-2 inline-block">رحلة متعددة اللغات 🌍</span>
              <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-4 leading-snug pb-2">
                المسارات التعليمية للغات الستة
              </h2>
              <p className="text-gray-300 font-bold text-lg max-w-2xl mx-auto">
                اختر اللغة التي ترغب في تعلمها واستكشف مستوياتها الثلاثة المتدرجة من التأسيس إلى الطلاقة التامة.
              </p>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {LANGUAGE_PATHS.map((lang) => {
                const isSelected = selectedLanguage?.id === lang.id;
                return (
                  <motion.div
                    key={lang.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-3xl p-8 border transition-all shadow-xl flex flex-col relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'bg-bgPurple border-accentGold shadow-[0_0_30px_rgba(245,197,24,0.3)]'
                        : 'bg-bgPurple/70 hover:bg-bgPurple border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedLanguage(isSelected ? null : lang)}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-6xl drop-shadow-md select-none">{lang.flag}</span>
                      <span className="bg-white/10 text-white/90 px-3.5 py-1.5 rounded-full text-xs font-black border border-white/15">
                        3 مستويات
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-1">{lang.name}</h3>
                    <div className="text-sm font-bold text-accentGold mb-4">{lang.subName}</div>

                    <p className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                      {lang.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLanguage(isSelected ? null : lang);
                      }}
                      className="w-full py-3.5 px-4 bg-white/10 group-hover:bg-accentGold group-hover:text-bgDark text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 group-hover:border-accentGold shadow-md"
                    >
                      <span>{isSelected ? 'إخفاء المسار' : 'دخول المسار'}</span>
                      <ChevronLeft className={`w-5 h-5 transition-transform ${isSelected ? '-rotate-90' : 'group-hover:-translate-x-1'}`} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Active Language 3-Levels Display */}
            <AnimatePresence>
              {selectedLanguage && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-16 bg-bgPurple rounded-[3rem] p-8 md:p-12 border-2 border-accentGold/50 shadow-2xl relative"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <span className="text-6xl">{selectedLanguage.flag}</span>
                      <div>
                        <div className="text-accentGold font-bold text-sm">مسار التعلم المعتمد</div>
                        <h3 className="text-3xl font-black text-white">
                          {selectedLanguage.name} - المستويات التعليمية الثلاثة
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedLanguage(null)}
                      className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition self-start md:self-auto"
                    >
                      ✕ إغلاق المسار
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {selectedLanguage.levels.map((lvl, idx) => (
                      <div
                        key={idx}
                        className="bg-bgDark p-8 rounded-3xl border border-white/10 shadow-lg flex flex-col relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="w-9 h-9 rounded-full bg-accentGold/20 text-accentGold font-black flex items-center justify-center text-lg border border-accentGold/30">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                            مستوى تدريبي
                          </span>
                        </div>

                        <h4 className="text-2xl font-black text-white mb-1">{lvl.level}</h4>
                        <div className="text-xs font-bold text-accentGold mb-4">{lvl.sub}</div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                          {lvl.summary}
                        </p>

                        <div className="mt-auto pt-4 border-t border-white/10">
                          <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-accentGold" />
                            <span>المحاور والكفاءات المكتسبة:</span>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300 mb-6">
                            {lvl.topics.map((top, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-accentGold mt-0.5 shrink-0" />
                                <span>{top}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={() => setModalOpen(true)}
                            className="w-full py-3 bg-accentGold text-bgDark font-black rounded-xl hover:scale-102 transition shadow-md text-sm"
                          >
                            سجّل في {selectedLanguage.name}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. OUTCOMES & BENEFITS (SHARED FOUNDATION)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-bgDark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {outcomes.length > 0 && (
              <div className="bg-bgPurple rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-white">
                  <span className="w-2 h-8 rounded-full" style={{ backgroundColor: mod.color_primary }} />
                  ماذا سيتعلم الطالب؟
                </h2>
                <ul className="space-y-4">
                  {outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-gray-300">
                      <CheckCircle2 className="mt-1 shrink-0 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ color: mod.color_primary }} />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {benefits.length > 0 && (
              <div className="bg-bgPurple rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-white">
                  <span className="w-2 h-8 rounded-full" style={{ backgroundColor: mod.color_primary }} />
                  الفوائد والمميزات
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-gray-300">
                      <CheckCircle2 className="mt-1 shrink-0 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ color: mod.color_primary }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && <EnrollmentModal mod={mod} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

const EnrollmentModal = ({ mod, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 9);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDateString = minDate.toISOString().split('T')[0];

  const onSubmit = async (data) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const dob = new Date(data.dob);
      let age = new Date().getFullYear() - dob.getFullYear();
      const m = new Date().getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) {
        age--;
      }

      if (age < 9 || age > 18) {
        setErrorMessage('عذراً، يجب أن يكون العمر بين 9 و 18 سنة للتسجيل.');
        setStatus('error');
        return;
      }

      await api.post('/auth/register/', {
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        password: data.password,
        phone_number: data.parent_phone,
        age: age,
        module_slug: mod.slug
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      let msg = 'حدث خطأ أثناء التسجيل. يرجى من فضلك المحاولة مرة أخرى لاحقاً.';
      if (data) {
        if (typeof data === 'string') {
          msg = data;
        } else if (data.error) {
          msg = data.error;
        } else if (data.detail) {
          msg = data.detail;
        } else if (typeof data === 'object') {
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => {
              const errorText = Array.isArray(errors) ? errors.join(' ') : errors;
              return `${field}: ${errorText}`;
            })
            .join(' | ');
          if (fieldErrors) msg = fieldErrors;
        }
      }
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-bgPurple rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative">
        <div className="p-6 text-white text-center shadow-lg" style={{ backgroundColor: mod.color_primary }}>
          <h2 className="text-2xl font-black drop-shadow-md">التسجيل في {mod.name}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>
        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8 text-white">
              <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
              <h3 className="text-3xl font-black mb-3 text-accentGold">تم استلام طلبك بنجاح!</h3>
              <p className="text-gray-300 font-bold mb-8">ستصلك رسالة على بريدك الإلكتروني عند موافقة الإدارة.</p>
              <button onClick={onClose} className="px-10 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition">إغلاق</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-300">الاسم</label>
                  <input {...register('first_name', { required: true })} className="w-full border border-white/10 rounded-xl p-3 bg-bgDark focus:border-accentGold outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-300">اللقب</label>
                  <input {...register('last_name', { required: true })} className="w-full border border-white/10 rounded-xl p-3 bg-bgDark focus:border-accentGold outline-none transition" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">البريد الإلكتروني</label>
                <input type="email" {...register('email', { required: true })} className="w-full border border-white/10 rounded-xl p-3 bg-bgDark focus:border-accentGold outline-none transition text-left" dir="ltr" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">كلمة المرور</label>
                <input type="password" {...register('password', { required: true, minLength: 6 })} className="w-full border border-white/10 rounded-xl p-3 bg-bgDark focus:border-accentGold outline-none transition text-left" dir="ltr" />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">تاريخ الميلاد</label>
                <input 
                  type="date" 
                  min={minDateString}
                  max={maxDateString}
                  {...register('dob', { required: true })} 
                  className="w-full border border-white/10 rounded-xl p-3 bg-bgDark focus:border-accentGold outline-none transition" 
                />
                <p className="text-xs text-accentGold mt-1">يجب أن يكون العمر بين 9 و 18 سنة.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-300">رقم هاتف الولي</label>
                <input type="tel" {...register('parent_phone', { required: true })} className="w-full border border-white/10 rounded-xl p-3 bg-bgDark focus:border-accentGold outline-none transition text-left" dir="ltr" />
              </div>

              {status === 'error' && <div className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">{errorMessage}</div>}

              <button type="submit" disabled={status === 'loading'} className="w-full py-4 text-white font-black rounded-xl mt-6 transition disabled:opacity-50 hover:brightness-110 shadow-lg text-xl" style={{ backgroundColor: mod.color_primary }}>
                {status === 'loading' ? 'جاري الإرسال...' : 'تأكيد التسجيل'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
