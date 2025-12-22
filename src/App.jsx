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
  AlertCircle,
  Type // Icono para los signos
} from 'lucide-react';

// --- UTILIDAD PARA QUITAR DIACRÍTICOS (HARAKAT) ---
const removeDiacritics = (text) => {
  if (!text) return "";
  // Rango Unicode para diacríticos árabes (Tashkeel)
  return text.replace(/[\u064B-\u065F]/g, '');
};

// --- DATOS COMPLETOS ---
const INITIAL_DATA = [
  // Pista 1: Saludos
  { id: 101, category: "Pista 1: Saludos", spanish: "Hola", arabic: "مرحبا", phonetic: "Marhaban" },
  { id: 102, category: "Pista 1: Saludos", spanish: "Buenos días", arabic: "صباح الخير", phonetic: "Sabah al-khayr" },
  { id: 103, category: "Pista 1: Saludos", spanish: "Buenos días (respuesta)", arabic: "صباح النور", phonetic: "Sabah an-noor" },
  { id: 104, category: "Pista 1: Saludos", spanish: "Buenas tardes", arabic: "مساء الخير", phonetic: "Masa' al-khayr" },
  { id: 105, category: "Pista 1: Saludos", spanish: "La paz sea contigo", arabic: "السلام عليكم", phonetic: "As-salamu alaykum" },
  { id: 106, category: "Pista 1: Saludos", spanish: "Y con vosotros la paz", arabic: "وعليكم السلام", phonetic: "Wa alaykumu as-salam" },

  // Pista 2: Despedidas
  { id: 738492, category: "Pista 2:Despedidas", spanish: "Adiós", arabic: "مع السلامة", phonetic: "maʿa as-salāma" },
  { id: 915374, category: "Pista 2:Despedidas", spanish: "Hasta la vista", arabic: "إلى اللقاء", phonetic: "ilā al-liqāʾ" },
  { id: 264981, category: "Pista 2:Despedidas", spanish: "Hasta la vista / Adiós (respuesta)", arabic: "إلى اللقاء / مع السلامة", phonetic: "ilā al-liqāʾ / maʿa as-salāma" },

  // Pista 3: ¿Cómo estás?
  { id: 582913, category: "Pista 3: ¿Cómo estás?", spanish: "¿Cómo estás? / ¿Qué tal?", arabic: "كيف الحال؟", phonetic: "kayfa al-ḥāl?" },
  { id: 194820, category: "Pista 3: ¿Cómo estás?", spanish: "Bien", arabic: "بخير", phonetic: "bijayr" },
  { id: 739105, category: "Pista 3: ¿Cómo estás?", spanish: "Bien", arabic: "لا بأس", phonetic: "lā baʾs" },
  { id: 860274, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios", arabic: "الحمد لله", phonetic: "al-ḥamdu lillāh" },
  { id: 317496, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios (respuesta larga)", arabic: "بخير والحمد لله", phonetic: "bijayr wa-l-ḥamdu lillāh" },
  { id: 925781, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios (respuesta larga)", arabic: "لا بأس والحمد لله", phonetic: "lā baʾs wa-l-ḥamdu lillāh" },

  // Pista 4: Pronombres personales
  { id: 504918, category: "Pista 4: Pronombres personales", spanish: "Yo", arabic: "أنا", phonetic: "anā" },
  { id: 839274, category: "Pista 4: Pronombres personales", spanish: "Tú (masculino)", arabic: "أنتَ", phonetic: "anta" },
  { id: 126705, category: "Pista 4: Pronombres personales", spanish: "Tú (femenino)", arabic: "أنتِ", phonetic: "anti" },
  { id: 790361, category: "Pista 4: Pronombres personales", spanish: "Él", arabic: "هو", phonetic: "huwa" },
  { id: 248693, category: "Pista 4: Pronombres personales", spanish: "Ella", arabic: "هي", phonetic: "hiya" },
  { id: 671820, category: "Pista 4: Pronombres personales", spanish: "Nosotros / nosotras", arabic: "نحن", phonetic: "naḥnu" },
  { id: 935174, category: "Pista 4: Pronombres personales", spanish: "Vosotros", arabic: "أنتم", phonetic: "antum" },
  { id: 380592, category: "Pista 4: Pronombres personales", spanish: "Vosotras", arabic: "أنتن", phonetic: "antunna" },
  { id: 814269, category: "Pista 4: Pronombres personales", spanish: "Ellos", arabic: "هم", phonetic: "hum" },
  { id: 592047, category: "Pista 4: Pronombres personales", spanish: "Ellas", arabic: "هن", phonetic: "hunna" },

  // Pista 5: Quién eres
  { id: 618392, category: "Pista 5: Quién eres", spanish: "¿Quién eres?", arabic: "من أنت؟", phonetic: "man anta?" },
  { id: 905174, category: "Pista 5: Quién eres", spanish: "Soy Marwán", arabic: "أنا مروان", phonetic: "anā marwān" },
  { id: 742681, category: "Pista 5: Quién eres", spanish: "¿Quién eres?", arabic: "من أنت؟", phonetic: "man anti?" },
  { id: 381950, category: "Pista 5: Quién eres", spanish: "Soy Fátima", arabic: "أنا فاطمة", phonetic: "anā fāṭima" },
  { id: 569204, category: "Pista 5: Quién eres", spanish: "¿Quién es? (masculino)", arabic: "من هو؟", phonetic: "man huwa?" },
  { id: 827613, category: "Pista 5: Quién eres", spanish: "Es Mústafa", arabic: "هو مصطفى", phonetic: "huwa muṣṭafā" },
  { id: 194508, category: "Pista 5: Quién eres", spanish: "¿Quién es? (femenino)", arabic: "من هي؟", phonetic: "man hiya?" },
  { id: 760381, category: "Pista 5: Quién eres", spanish: "Es Layla", arabic: "هي ليلى", phonetic: "hiya laylā" },

  // Pista 6: De dónde eres
  { id: 704318, category: "Pista 6: De dónde eres", spanish: "¿De dónde eres?", arabic: "من أين أنت؟", phonetic: "min ayna anta?" },
  { id: 219847, category: "Pista 6: De dónde eres", spanish: "Soy de España", arabic: "أنا من إسبانيا", phonetic: "anā min isbāniyā" },
  { id: 865204, category: "Pista 6: De dónde eres", spanish: "Soy español", arabic: "أنا إسباني", phonetic: "anā isbānī" },
  { id: 593781, category: "Pista 6: De dónde eres", spanish: "¿De dónde eres?", arabic: "من أين أنت؟", phonetic: "min ayna anti?" },
  { id: 148906, category: "Pista 6: De dónde eres", spanish: "Soy de Francia", arabic: "أنا من فرنسا", phonetic: "anā min faransā" },
  { id: 920463, category: "Pista 6: De dónde eres", spanish: "Soy francesa", arabic: "أنا فرنسية", phonetic: "anā faransiyya" },
  { id: 376195, category: "Pista 6: De dónde eres", spanish: "¿De dónde es? (masculino)", arabic: "من أين هو؟", phonetic: "min ayna huwa?" },
  { id: 681429, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "هو من إيطاليا", phonetic: "huwa min īṭāliyā" },
  { id: 254870, category: "Pista 6: De dónde eres", spanish: "Es italiano", arabic: "هو إيطالي", phonetic: "huwa īṭālī" },
  { id: 937502, category: "Pista 6: De dónde eres", spanish: "¿De dónde es? (femenino)", arabic: "من أين هي؟", phonetic: "min ayna hiya?" },
  { id: 418639, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "هي من إيطاليا", phonetic: "hiya min īṭāliyā" },
  { id: 760184, category: "Pista 6: De dónde eres", spanish: "Es italiana", arabic: "هي إيطالية", phonetic: "hiya īṭāliyya" },

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
  { id: 615482, category: "Pista 8: Demostrativos", spanish: "Éste, ese, esto, eso", arabic: "هذا", phonetic: "hādhā" },
  { id: 903174, category: "Pista 8: Demostrativos", spanish: "Ésta, esa", arabic: "هذه", phonetic: "hādhihi" },
  { id: 487209, category: "Pista 8: Demostrativos", spanish: "Aquel, aquello, ese, eso", arabic: "ذلك", phonetic: "dhālika" },
  { id: 762910, category: "Pista 8: Demostrativos", spanish: "Aquella, esa", arabic: "تلك", phonetic: "tilka" },
  { id: 351648, category: "Pista 8: Demostrativos", spanish: "¿Qué es esto?", arabic: "ما هذا؟", phonetic: "mā hādhā?" },
  { id: 820593, category: "Pista 8: Demostrativos", spanish: "Esto es un libro", arabic: "هذا كتاب", phonetic: "hādhā kitāb" },
  { id: 194762, category: "Pista 8: Demostrativos", spanish: "Esto es un lápiz", arabic: "هذا قلم", phonetic: "hādhā qalam" },
  { id: 673905, category: "Pista 8: Demostrativos", spanish: "Esto es una puerta", arabic: "هذا باب", phonetic: "hādhā bāb" },
  { id: 508341, category: "Pista 8: Demostrativos", spanish: "Esto es una ventana", arabic: "هذا شباك", phonetic: "hādhā shubbāk" },
  { id: 946207, category: "Pista 8: Demostrativos", spanish: "Esto es una silla", arabic: "هذا كرسي", phonetic: "hādhā kursī" },
  { id: 731854, category: "Pista 8: Demostrativos", spanish: "Esto es un teléfono", arabic: "هذا تليفون", phonetic: "hādhā tilīfūn" },
  { id: 284691, category: "Pista 8: Demostrativos", spanish: "Esto es un ordenador", arabic: "هذا كمبيوتر", phonetic: "hādhā kombiyūtar" },
  { id: 659120, category: "Pista 8: Demostrativos", spanish: "Esto es una mesa", arabic: "هذه طاولة", phonetic: "hādhihi ṭāwila" },
  { id: 817346, category: "Pista 8: Demostrativos", spanish: "Esto es una pizarra", arabic: "هذه سبورة", phonetic: "hādhihi sabbūra" },
  { id: 492805, category: "Pista 8: Demostrativos", spanish: "Esto es una botella", arabic: "هذه زجاجة", phonetic: "hādhihi zujāja" },
  { id: 570318, category: "Pista 8: Demostrativos", spanish: "¿Quién es éste?", arabic: "من هذا؟", phonetic: "man hādhā?" },
  { id: 903652, category: "Pista 8: Demostrativos", spanish: "Éste es Nabil", arabic: "هذا نبيل", phonetic: "hādhā nabīl" },
  { id: 168974, category: "Pista 8: Demostrativos", spanish: "¿Quién es ésta?", arabic: "من هذه؟", phonetic: "man hādhihi?" },
  { id: 745291, category: "Pista 8: Demostrativos", spanish: "Ésta es Yamila", arabic: "هذه جميلة", phonetic: "hādhihi jamīla" },
  
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
  { id: 2304, category: "Pista 23: La Familia", spanish: "Hijo", arabic: "ابn", phonetic: "Ibn" },
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
  { id: 3104, category