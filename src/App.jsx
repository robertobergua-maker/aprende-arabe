import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  BookOpen, 
  Mic,
  Menu,
  FolderOpen,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// --- DATOS COMPLETOS EXTRAÍDOS DEL PDF ---
const INITIAL_DATA = [
  // Pista 1: Saludos
  { id: 101, category: "Pista 1: Saludos", spanish: "Hola", arabic: "مرحبا", phonetic: "Marhaban" },
  { id: 102, category: "Pista 1: Saludos", spanish: "Buenos días", arabic: "صباح الخير", phonetic: "Sabah al-khayr" },
  { id: 103, category: "Pista 1: Saludos", spanish: "Buenos días (respuesta)", arabic: "صباح النور", phonetic: "Sabah an-noor" },
  { id: 104, category: "Pista 1: Saludos", spanish: "Buenas tardes", arabic: "مساء الخير", phonetic: "Masa' al-khayr" },
  { id: 105, category: "Pista 1: Saludos", spanish: "La paz sea contigo", arabic: "السلام عليكم", phonetic: "As-salamu alaykum" },
  { id: 106, category: "Pista 1: Saludos", spanish: "Y con vosotros la paz", arabic: "وعليكم السلام", phonetic: "Wa alaykumu as-salam" },

  // Pista 2: Despedidas
{ id: 738492, category: "Despedidas", spanish: "Adiós", arabic: "مع السلامة", phonetic: "maʿa as-salāma" },
{ id: 915374, category: "Despedidas", spanish: "Hasta la vista", arabic: "إلى اللقاء", phonetic: "ilā al-liqāʾ" },
{ id: 264981, category: "Despedidas", spanish: "Hasta la vista / Adiós (respuesta)", arabic: "إلى اللقاء / مع السلامة", phonetic: "ilā al-liqāʾ / maʿa as-salāma" },

  // Pista 3: ¿Cómo estás?
{ id: 582913, category: "Cómo estás", spanish: "¿Cómo estás? / ¿Qué tal?", arabic: "كيف الحال؟", phonetic: "kayfa al-ḥāl?" },
{ id: 194820, category: "Cómo estás", spanish: "Bien", arabic: "بخير", phonetic: "bijayr" },
{ id: 739105, category: "Cómo estás", spanish: "Bien", arabic: "لا بأس", phonetic: "lā baʾs" },
{ id: 860274, category: "Cómo estás", spanish: "Bien, gracias a Dios", arabic: "الحمد لله", phonetic: "al-ḥamdu lillāh" },
{ id: 317496, category: "Cómo estás", spanish: "Bien, gracias a Dios (respuesta larga)", arabic: "بخير والحمد لله", phonetic: "bijayr wa-l-ḥamdu lillāh" },
{ id: 925781, category: "Cómo estás", spanish: "Bien, gracias a Dios (respuesta larga)", arabic: "لا بأس والحمد لله", phonetic: "lā baʾs wa-l-ḥamdu lillāh" }
,

  // Pista 4: Pronombres personales
{ id: 504918, category: "Pronombres personales", spanish: "Yo", arabic: "أنا", phonetic: "anā" },
{ id: 839274, category: "Pronombres personales", spanish: "Tú (masculino)", arabic: "أنتَ", phonetic: "anta" },
{ id: 126705, category: "Pronombres personales", spanish: "Tú (femenino)", arabic: "أنتِ", phonetic: "anti" },
{ id: 790361, category: "Pronombres personales", spanish: "Él", arabic: "هو", phonetic: "huwa" },
{ id: 248693, category: "Pronombres personales", spanish: "Ella", arabic: "هي", phonetic: "hiya" },
{ id: 671820, category: "Pronombres personales", spanish: "Nosotros / nosotras", arabic: "نحن", phonetic: "naḥnu" },
{ id: 935174, category: "Pronombres personales", spanish: "Vosotros", arabic: "أنتم", phonetic: "antum" },
{ id: 380592, category: "Pronombres personales", spanish: "Vosotras", arabic: "أنتن", phonetic: "antunna" },
{ id: 814269, category: "Pronombres personales", spanish: "Ellos", arabic: "هم", phonetic: "hum" },
{ id: 592047, category: "Pronombres personales", spanish: "Ellas", arabic: "هن", phonetic: "hunna" },

{ id: 618392, category: "Quién eres", spanish: "¿Quién eres?", arabic: "من أنت؟", phonetic: "man anta?" },
{ id: 905174, category: "Quién eres", spanish: "Soy Marwán", arabic: "أنا مروان", phonetic: "anā marwān" },
{ id: 742681, category: "Quién eres", spanish: "¿Quién eres?", arabic: "من أنت؟", phonetic: "man anti?" },
{ id: 381950, category: "Quién eres", spanish: "Soy Fátima", arabic: "أنا فاطمة", phonetic: "anā fāṭima" },
{ id: 569204, category: "Quién eres", spanish: "¿Quién es? (masculino)", arabic: "من هو؟", phonetic: "man huwa?" },
{ id: 827613, category: "Quién eres", spanish: "Es Mústafa", arabic: "هو مصطفى", phonetic: "huwa muṣṭafā" },
{ id: 194508, category: "Quién eres", spanish: "¿Quién es? (femenino)", arabic: "من هي؟", phonetic: "man hiya?" },
{ id: 760381, category: "Quién eres", spanish: "Es Layla", arabic: "هي ليلى", phonetic: "hiya laylā" },

  // Pista 6: De dónde eres
  { id: 704318, category: "De dónde eres", spanish: "¿De dónde eres?", arabic: "من أين أنت؟", phonetic: "min ayna anta?" },
{ id: 219847, category: "De dónde eres", spanish: "Soy de España", arabic: "أنا من إسبانيا", phonetic: "anā min isbāniyā" },
{ id: 865204, category: "De dónde eres", spanish: "Soy español", arabic: "أنا إسباني", phonetic: "anā isbānī" },

{ id: 593781, category: "De dónde eres", spanish: "¿De dónde eres?", arabic: "من أين أنت؟", phonetic: "min ayna anti?" },
{ id: 148906, category: "De dónde eres", spanish: "Soy de Francia", arabic: "أنا من فرنسا", phonetic: "anā min faransā" },
{ id: 920463, category: "De dónde eres", spanish: "Soy francesa", arabic: "أنا فرنسية", phonetic: "anā faransiyya" },

{ id: 376195, category: "De dónde eres", spanish: "¿De dónde es? (masculino)", arabic: "من أين هو؟", phonetic: "min ayna huwa?" },
{ id: 681429, category: "De dónde eres", spanish: "Es de Italia", arabic: "هو من إيطاليا", phonetic: "huwa min īṭāliyā" },
{ id: 254870, category: "De dónde eres", spanish: "Es italiano", arabic: "هو إيطالي", phonetic: "huwa īṭālī" },

{ id: 937502, category: "De dónde eres", spanish: "¿De dónde es? (femenino)", arabic: "من أين هي؟", phonetic: "min ayna hiya?" },
{ id: 418639, category: "De dónde eres", spanish: "Es de Italia", arabic: "هي من إيطاليا", phonetic: "hiya min īṭāliyā" },
{ id: 760184, category: "De dónde eres", spanish: "Es italiana", arabic: "هي إيطالية", phonetic: "hiya īṭāliyya" },

  // Pista 7: Números 0-10
  { id: 700, category: "Pista 7: Números", spanish: "Cero", arabic: "صفر", phonetic: "Sifr" },
  { id: 701, category: "Pista 7: Números", spanish: "Uno", arabic: "واحد", phonetic: "Wahid" },
  { id: 702, category: "Pista 7: Números", spanish: "Dos", arabic: "اثنان", phonetic: "Ithnan" },
  { id: 703, category: "Pista 7: Números", spanish: "Tres", arabic: "ثلاثة", phonetic: "Thalatha" },
  { id: 704, category: "Pista 7: Números", spanish: "Cuatro", arabic: "أربعة", phonetic: "Arba'a" },
  { id: 705, category: "Pista 7: Números", spanish: "Cinco", arabic: "خمسة", phonetic: "Khamsa" },
  { id: 706, category: "Pista 7: Números", spanish: "Seis", arabic: "ستة", phonetic: "Sitta" },
  { id: 707, category: "Pista 7: Números", spanish: "Siete", arabic: "سبعة", phonetic: "Sab'a" },
  { id: 708, category: "Pista 7: Números", spanish: "Ocho", arabic: "ثمانية", phonetic: "Thamaniya" },
  { id: 709, category: "Pista 7: Números", spanish: "Nueve", arabic: "تسعة", phonetic: "Tis'a" },
  { id: 710, category: "Pista 7: Números", spanish: "Diez", arabic: "عشرة", phonetic: "'Ashara" },

  // Pista 8: Demostrativos
 { id: 615482, category: "Demostrativos", spanish: "Éste, ese, esto, eso", arabic: "هذا", phonetic: "hādhā" },
{ id: 903174, category: "Demostrativos", spanish: "Ésta, esa", arabic: "هذه", phonetic: "hādhihi" },
{ id: 487209, category: "Demostrativos", spanish: "Aquel, aquello, ese, eso", arabic: "ذلك", phonetic: "dhālika" },
{ id: 762910, category: "Demostrativos", spanish: "Aquella, esa", arabic: "تلك", phonetic: "tilka" },

{ id: 351648, category: "Demostrativos", spanish: "¿Qué es esto?", arabic: "ما هذا؟", phonetic: "mā hādhā?" },
{ id: 820593, category: "Demostrativos", spanish: "Esto es un libro", arabic: "هذا كتاب", phonetic: "hādhā kitāb" },
{ id: 194762, category: "Demostrativos", spanish: "Esto es un lápiz", arabic: "هذا قلم", phonetic: "hādhā qalam" },
{ id: 673905, category: "Demostrativos", spanish: "Esto es una puerta", arabic: "هذا باب", phonetic: "hādhā bāb" },
{ id: 508341, category: "Demostrativos", spanish: "Esto es una ventana", arabic: "هذا شباك", phonetic: "hādhā shubbāk" },
{ id: 946207, category: "Demostrativos", spanish: "Esto es una silla", arabic: "هذا كرسي", phonetic: "hādhā kursī" },
{ id: 731854, category: "Demostrativos", spanish: "Esto es un teléfono", arabic: "هذا تليفون", phonetic: "hādhā tilīfūn" },
{ id: 284691, category: "Demostrativos", spanish: "Esto es un ordenador", arabic: "هذا كمبيوتر", phonetic: "hādhā kombiyūtar" },
{ id: 659120, category: "Demostrativos", spanish: "Esto es una mesa", arabic: "هذه طاولة", phonetic: "hādhihi ṭāwila" },
{ id: 817346, category: "Demostrativos", spanish: "Esto es una pizarra", arabic: "هذه سبورة", phonetic: "hādhihi sabbūra" },
{ id: 492805, category: "Demostrativos", spanish: "Esto es una botella", arabic: "هذه زجاجة", phonetic: "hādhihi zujāja" },

{ id: 570318, category: "Demostrativos", spanish: "¿Quién es éste?", arabic: "من هذا؟", phonetic: "man hādhā?" },
{ id: 903652, category: "Demostrativos", spanish: "Éste es Nabil", arabic: "هذا نبيل", phonetic: "hādhā nabīl" },
{ id: 168974, category: "Demostrativos", spanish: "¿Quién es ésta?", arabic: "من هذه؟", phonetic: "man hādhihi?" },
{ id: 745291, category: "Demostrativos", spanish: "Ésta es Yamila", arabic: "هذه جميلة", phonetic: "hādhihi jamīla" },
  
  // Pista 20: La Casa
  { id: 2001, category: "Pista 20: La Casa", spanish: "Casa", arabic: "بيت", phonetic: "Bayt" },
  { id: 2002, category: "Pista 20: La Casa", spanish: "Habitación", arabic: "غرفة", phonetic: "Ghurfa" },
  { id: 2003, category: "Pista 20: La Casa", spanish: "Cocina", arabic: "مطبخ", phonetic: "Matbakh" },
  { id: 2004, category: "Pista 20: La Casa", spanish: "Baño", arabic: "حمام", phonetic: "Hammam" },
  { id: 2005, category: "Pista 20: La Casa", spanish: "Puerta", arabic: "باب", phonetic: "Bab" },
  { id: 2006, category: "Pista 20: La Casa", spanish: "Ventana", arabic: "شباك", phonetic: "Shubbak" },
  { id: 2007, category: "Pista 20: La Casa", spanish: "Cama", arabic: "سرير", phonetic: "Sarir" },
  { id: 2008, category: "Pista 20: La Casa", spanish: "Salón", arabic: "صالون", phonetic: "Salon" },

  // Pista 21: Establecimientos
  { id: 2101, category: "Pista 21: Establecimientos", spanish: "Escuela", arabic: "مدرسة", phonetic: "Madrasa" },
  { id: 2102, category: "Pista 21: Establecimientos", spanish: "Hospital", arabic: "مستشفى", phonetic: "Mustashfa" },
  { id: 2103, category: "Pista 21: Establecimientos", spanish: "Farmacia", arabic: "صيدلية", phonetic: "Saydaliyya" },
  { id: 2104, category: "Pista 21: Establecimientos", spanish: "Restaurante", arabic: "مطعم", phonetic: "Mat'am" },
  { id: 2105, category: "Pista 21: Establecimientos", spanish: "Hotel", arabic: "فندق", phonetic: "Funduq" },
  { id: 2106, category: "Pista 21: Establecimientos", spanish: "Banco", arabic: "بنك", phonetic: "Bank" },

  // Pista 23: La Familia
  { id: 2301, category: "Pista 23: La Familia", spanish: "Familia", arabic: "عائلة", phonetic: "'Aila" },
  { id: 2302, category: "Pista 23: La Familia", spanish: "Padre", arabic: "أب", phonetic: "Ab" },
  { id: 2303, category: "Pista 23: La Familia", spanish: "Madre", arabic: "أم", phonetic: "Umm" },
  { id: 2304, category: "Pista 23: La Familia", spanish: "Hijo", arabic: "ابن", phonetic: "Ibn" },
  { id: 2305, category: "Pista 23: La Familia", spanish: "Hija", arabic: "ابنة", phonetic: "Ibna" },
  { id: 2306, category: "Pista 23: La Familia", spanish: "Hermano", arabic: "أخ", phonetic: "Akh" },
  { id: 2307, category: "Pista 23: La Familia", spanish: "Hermana", arabic: "أخت", phonetic: "Ukht" },
  { id: 2308, category: "Pista 23: La Familia", spanish: "Abuelo", arabic: "جد", phonetic: "Jadd" },
  { id: 2309, category: "Pista 23: La Familia", spanish: "Abuela", arabic: "جدة", phonetic: "Jadda" },

  // Pista 29: Profesiones
  { id: 2901, category: "Pista 29: Profesiones", spanish: "Estudiante", arabic: "طالب", phonetic: "Talib" },
  { id: 2902, category: "Pista 29: Profesiones", spanish: "Profesor", arabic: "مدرس", phonetic: "Mudarris" },
  { id: 2903, category: "Pista 29: Profesiones", spanish: "Ingeniero", arabic: "مهندس", phonetic: "Muhandis" },
  { id: 2904, category: "Pista 29: Profesiones", spanish: "Médico", arabic: "طبيب", phonetic: "Tabib" },
  { id: 2905, category: "Pista 29: Profesiones", spanish: "Enfermero", arabic: "ممرض", phonetic: "Mumarrid" },
  { id: 2906, category: "Pista 29: Profesiones", spanish: "Policía", arabic: "شرطي", phonetic: "Shurti" },
  { id: 2907, category: "Pista 29: Profesiones", spanish: "Cocinero", arabic: "طباخ", phonetic: "Tabbakh" },

  // Pista 30: Colores
  { id: 3001, category: "Pista 30: Colores", spanish: "Negro", arabic: "أسود", phonetic: "Aswad" },
  { id: 3002, category: "Pista 30: Colores", spanish: "Blanco", arabic: "أبيض", phonetic: "Abyad" },
  { id: 3003, category: "Pista 30: Colores", spanish: "Rojo", arabic: "أحمر", phonetic: "Ahmar" },
  { id: 3004, category: "Pista 30: Colores", spanish: "Verde", arabic: "أخضر", phonetic: "Akhdar" },
  { id: 3005, category: "Pista 30: Colores", spanish: "Azul", arabic: "أزرق", phonetic: "Azraq" },
  { id: 3006, category: "Pista 30: Colores", spanish: "Amarillo", arabic: "أصفر", phonetic: "Asfar" },

  // Pista 31: Cuerpo Humano
  { id: 3101, category: "Pista 31: Cuerpo", spanish: "Cabeza", arabic: "رأس", phonetic: "Ra's" },
  { id: 3102, category: "Pista 31: Cuerpo", spanish: "Ojo", arabic: "عين", phonetic: "'Ayn" },
  { id: 3103, category: "Pista 31: Cuerpo", spanish: "Nariz", arabic: "أنف", phonetic: "Anf" },
  { id: 3104, category: "Pista 31: Cuerpo", spanish: "Boca", arabic: "فم", phonetic: "Fam" },
  { id: 3105, category: "Pista 31: Cuerpo", spanish: "Pelo", arabic: "شعر", phonetic: "Sha'r" },
  { id: 3106, category: "Pista 31: Cuerpo", spanish: "Mano", arabic: "يد", phonetic: "Yad" },
  { id: 3107, category: "Pista 31: Cuerpo", spanish: "Pie", arabic: "قدم", phonetic: "Qadam" },
  { id: 3108, category: "Pista 31: Cuerpo", spanish: "Alto", arabic: "طويل", phonetic: "Tawil" },
  { id: 3109, category: "Pista 31: Cuerpo", spanish: "Bajo", arabic: "قصير", phonetic: "Qasir" },
  { id: 3110, category: "Pista 31: Cuerpo", spanish: "Guapo", arabic: "وسيم", phonetic: "Wasim" }
];

export default function App() {
  // --- ESTADOS ---
  const [cards, setCards] = useState(() => {
    try {
      // Uso una nueva clave 'v4' para resetear datos antiguos que pudieran dar error
      const saved = localStorage.getItem('flashcards-data-v4');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      console.error("Error cargando datos, reseteando...", e);
      return INITIAL_DATA;
    }
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // --- DERIVADOS ---
  const categories = useMemo(() => {
    // Filtrado de seguridad: solo tomar categorías válidas
    const validCards = cards.filter(c => c && c.category);
    const cats = new Set(validCards.map(c => c.category));
    return ["Todos", ...Array.from(cats).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))];
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (!card) return false; // Protección contra tarjetas nulas

      // Protección contra campos vacíos (.toLowerCase() fallaría si el campo no existe)
      const s = (card.spanish || "").toLowerCase();
      const a = (card.arabic || "");
      const p = (card.phonetic || "").toLowerCase();
      const term = searchTerm.toLowerCase();
      
      const matchesSearch = s.includes(term) || a.includes(term) || p.includes(term);
      const matchesCategory = selectedCategory === "Todos" || card.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [cards, searchTerm, selectedCategory]);

  // --- EFECTOS ---
  useEffect(() => {
    try {
      localStorage.setItem('flashcards-data-v4', JSON.stringify(cards));
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  }, [cards]);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // --- FUNCIONES ---
  const handleImport = (newCards) => {
    // Asegurar que todas las nuevas tarjetas tengan los campos mínimos
    const processedNewCards = newCards.map(c => ({
      ...c,
      id: c.id || Date.now() + Math.random(),
      spanish: c.spanish || "",
      arabic: c.arabic || "",
      phonetic: c.phonetic || "", // Evitar undefined
      category: c.category || "General"
    }));
    setCards(prev => [...prev, ...processedNewCards]);
    setIsImporting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* HEADER SUPERIOR */}
      <header className="bg-emerald-700 text-white shadow-md z-20">
        <div className="w-full px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             {/* Botón menú móvil */}
            <button 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden p-1 hover:bg-emerald-600 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            <BookOpen className="w-7 h-7" />
            <h1 className="text-xl font-bold hidden sm:block">Aprende Árabe</h1>
          </div>
          
          {/* BARRA DE BÚSQUEDA CENTRAL */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-200" />
              <input 
                type="text"
                placeholder="Buscar palabra..."
                className="w-full pl-9 pr-4 py-2 bg-emerald-800/50 border border-emerald-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-200/70 text-sm text-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={() => setIsImporting(true)}
            className="flex items-center gap-2 bg-emerald-800/50 hover:bg-emerald-800 px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm whitespace-nowrap border border-emerald-600/30"
            title="Importar lista de palabras"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importar</span>
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL (LAYOUT) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* SIDEBAR IZQUIERDA (Escritorio) */}
        <aside className={`
          absolute inset-y-0 left-0 z-10 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${showMobileSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <div className="p-4 h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 sticky top-0 bg-white z-10 py-2">
              Temas
            </h2>
            <nav className="space-y-1 pb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowMobileSidebar(false); 
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                  }`}
                >
                  <FolderOpen className={`w-4 h-4 flex-shrink-0 ${selectedCategory === cat ? 'fill-emerald-200' : 'text-slate-400'}`} />
                  <span className="truncate text-left flex-1 leading-tight">{cat}</span>
                  {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* OVERLAY para móvil */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/20 z-0 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* ZONA DE TARJETAS (DERECHA) */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedCategory}
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shadow-sm">
                {filteredCards.length} {filteredCards.length === 1 ? 'tarjeta' : 'tarjetas'}
              </span>
            </div>

            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                   <BookOpen className="w-8 h-8 opacity-20 text-emerald-600" />
                </div>
                <p className="text-lg font-medium">No se encontraron tarjetas.</p>
                <p className="text-sm opacity-60">Intenta con otra búsqueda o categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredCards.map(card => (
                  <Flashcard key={card.id} data={card} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL DE IMPORTACIÓN */}
      {isImporting && (
        <ImportModal 
          onClose={() => setIsImporting(false)} 
          onImport={handleImport} 
        />
      )}
    </div>
  );
}

// --- COMPONENTE TARJETA (FLASHCARD) ---
function Flashcard({ data }) {
  const [flipState, setFlipState] = useState(0);

  const handleNextFace = (e) => {
    e.stopPropagation();
    setFlipState((prev) => (prev + 1) % 3);
  };

  const playAudio = (e) => {
    e.stopPropagation();
    
    // Bloque de seguridad: Si falla el audio, no rompemos la web
    try {
        if (!('speechSynthesis' in window)) {
        alert("Tu navegador no soporta la síntesis de voz.");
        return;
        }
        window.speechSynthesis.cancel();
        
        // Texto a leer con fallback
        const textToSpeak = data.arabic || "";
        if (!textToSpeak) return;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(voice => voice.lang.includes('ar'));

        if (arabicVoice) {
        utterance.voice = arabicVoice;
        utterance.lang = arabicVoice.lang;
        } else {
        // console.warn("Usando voz por defecto");
        utterance.lang = 'ar-SA';
        }

        utterance.rate = 0.8; 
        window.speechSynthesis.speak(utterance);
    } catch (err) {
        console.error("Error al reproducir audio:", err);
    }
  };

  const getCardStyle = () => {
    switch(flipState) {
      case 0: return "bg-white border-slate-200 text-slate-800";
      case 1: return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case 2: return "bg-amber-50 border-amber-200 text-amber-900";
      default: return "";
    }
  };

  return (
    <div 
      onClick={handleNextFace}
      className={`relative h-60 w-full rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border flex flex-col items-center justify-center p-4 text-center select-none group ${getCardStyle()}`}
    >
      <div className="absolute top-3 right-3 flex gap-1.5">
        {[0, 1, 2].map(step => (
          <div key={step} className={`w-1.5 h-1.5 rounded-full transition-colors ${flipState === step ? 'bg-current opacity-100' : 'bg-slate-300 opacity-50'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {flipState === 0 && (
          <div className="animate-fade-in-up w-full">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Español</p>
            <h3 className="text-xl font-bold leading-tight break-words">{data.spanish || "?"}</h3>
          </div>
        )}

        {flipState === 1 && (
          <div className="animate-fade-in-up w-full">
            <p className="text-[10px] uppercase tracking-widest text-emerald-600/60 font-bold mb-2">Árabe</p>
            <h3 className="text-3xl font-arabic mb-4 break-words" dir="rtl">{data.arabic || "..."}</h3>
            <button 
              onClick={playAudio}
              className="mx-auto flex items-center gap-2 px-3 py-1.5 bg-emerald-200/50 hover:bg-emerald-200 rounded-full text-xs font-bold uppercase tracking-wide text-emerald-800 transition active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" /> Escuchar
            </button>
          </div>
        )}

        {flipState === 2 && (
          <div className="animate-fade-in-up w-full">
            <p className="text-[10px] uppercase tracking-widest text-amber-600/60 font-bold mb-2">Fonética</p>
            <h3 className="text-lg font-mono text-amber-800 italic break-words">{data.phonetic || "-"}</h3>
            <p className="mt-3 text-[10px] opacity-50 flex items-center justify-center gap-1">
              <Mic className="w-3 h-3" /> Pronunciación
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 text-[10px] uppercase tracking-widest opacity-30 font-bold">
        {flipState === 0 && "Ver traducción"}
        {flipState === 1 && "Ver fonética"}
        {flipState === 2 && "Reiniciar"}
      </div>
    </div>
  );
}

// --- MODAL DE IMPORTACIÓN ---
function ImportModal({ onClose, onImport }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState(null);

  const handleProcess = () => {
    try {
      const parsed = JSON.parse(jsonText);
      let items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) throw new Error("La lista está vacía.");
      
      // Validar un poco más flexible, pero asegurarse de que no rompa
      const sanitizedItems = items.filter(item => item && (item.spanish || item.arabic));
      
      if (sanitizedItems.length === 0) throw new Error("No se encontraron tarjetas válidas.");
      
      onImport(sanitizedItems);
    } catch (err) {
      setError("Formato inválido. Asegúrate de copiar el bloque JSON completo. Detalles: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="bg-emerald-700 px-6 py-4 flex justify-between items-center text-white flex-shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Upload className="w-5 h-5" /> Importar Lista de Palabras
          </h2>
          <button onClick={onClose} className="hover:bg-emerald-600 p-1.5 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-4 text-xs flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>Asegúrate de que el código tenga este formato: <code>[{"{"}"category": "...", "spanish": "...", "arabic": "..."{"}"}, ...]</code></p>
          </div>

          <textarea 
            className="w-full flex-1 min-h-[200px] p-4 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            placeholder={`Ejemplo válido:
[
  { 
    "category": "Frutas", 
    "spanish": "Manzana", 
    "arabic": "تفاحة", 
    "phonetic": "Tuffaha" 
  },
  ...
]`}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-slate-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            Cancelar
          </button>
          <button 
            onClick={handleProcess}
            disabled={!jsonText.trim()}
            className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Procesar e Importar
          </button>
        </div>
      </div>
    </div>
  );
}