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
  Type
} from 'lucide-react';

// --- UTILIDAD: QUITAR DIACRÍTICOS (HARAKAT) ---
const removeDiacritics = (text) => {
  if (!text) return "";
  // Elimina Fatha, Damma, Kasra, Sukun, Shadda, Tanween, etc.
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
};

// --- DATOS COMPLETOS (AHORA CON VOCALES/SIGNOS) ---
const INITIAL_DATA = [
  // Pista 1: Saludos
  { id: 101, category: "Pista 1: Saludos", spanish: "Hola", arabic: "مَرْحَبًا", phonetic: "Marhaban" },
  { id: 102, category: "Pista 1: Saludos", spanish: "Buenos días", arabic: "صَبَاحُ الْخَيْر", phonetic: "Sabah al-khayr" },
  { id: 103, category: "Pista 1: Saludos", spanish: "Buenos días (respuesta)", arabic: "صَبَاحُ النُّور", phonetic: "Sabah an-noor" },
  { id: 104, category: "Pista 1: Saludos", spanish: "Buenas tardes", arabic: "مَسَاءُ الْخَيْر", phonetic: "Masa' al-khayr" },
  { id: 105, category: "Pista 1: Saludos", spanish: "La paz sea contigo", arabic: "السَّلَامُ عَلَيْكُمْ", phonetic: "As-salamu alaykum" },
  { id: 106, category: "Pista 1: Saludos", spanish: "Y con vosotros la paz", arabic: "وَعَلَيْكُمُ السَّلَام", phonetic: "Wa alaykumu as-salam" },

  // Pista 2: Despedidas
  { id: 738492, category: "Pista 2:Despedidas", spanish: "Adiós", arabic: "مَعَ السَّلَامَة", phonetic: "maʿa as-salāma" },
  { id: 915374, category: "Pista 2:Despedidas", spanish: "Hasta la vista", arabic: "إِلَى اللِّقَاء", phonetic: "ilā al-liqāʾ" },
  { id: 264981, category: "Pista 2:Despedidas", spanish: "Hasta la vista / Adiós (respuesta)", arabic: "إِلَى اللِّقَاء / مَعَ السَّلَامَة", phonetic: "ilā al-liqāʾ / maʿa as-salāma" },

  // Pista 3: ¿Cómo estás?
  { id: 582913, category: "Pista 3: ¿Cómo estás?", spanish: "¿Cómo estás? / ¿Qué tal?", arabic: "كَيْفَ الْحَال؟", phonetic: "kayfa al-ḥāl?" },
  { id: 194820, category: "Pista 3: ¿Cómo estás?", spanish: "Bien", arabic: "بِخَيْر", phonetic: "bijayr" },
  { id: 739105, category: "Pista 3: ¿Cómo estás?", spanish: "Bien (regular)", arabic: "لَا بَأْس", phonetic: "lā baʾs" },
  { id: 860274, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios", arabic: "الْحَمْدُ لِلَّهِ", phonetic: "al-ḥamdu lillāh" },
  { id: 317496, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios (respuesta larga)", arabic: "بِخَيْر وَالْحَمْدُ لِلَّهِ", phonetic: "bijayr wa-l-ḥamdu lillāh" },
  { id: 925781, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios (respuesta larga 2)", arabic: "لَا بَأْس وَالْحَمْدُ لِلَّهِ", phonetic: "lā baʾs wa-l-ḥamdu lillāh" },

  // Pista 4: Pronombres personales
  { id: 504918, category: "Pista 4: Pronombres personales", spanish: "Yo", arabic: "أَنَا", phonetic: "anā" },
  { id: 839274, category: "Pista 4: Pronombres personales", spanish: "Tú (masculino)", arabic: "أَنْتَ", phonetic: "anta" },
  { id: 126705, category: "Pista 4: Pronombres personales", spanish: "Tú (femenino)", arabic: "أَنْتِ", phonetic: "anti" },
  { id: 790361, category: "Pista 4: Pronombres personales", spanish: "Él", arabic: "هُوَ", phonetic: "huwa" },
  { id: 248693, category: "Pista 4: Pronombres personales", spanish: "Ella", arabic: "هِيَ", phonetic: "hiya" },
  { id: 671820, category: "Pista 4: Pronombres personales", spanish: "Nosotros / nosotras", arabic: "نَحْنُ", phonetic: "naḥnu" },
  { id: 935174, category: "Pista 4: Pronombres personales", spanish: "Vosotros", arabic: "أَنْتُمْ", phonetic: "antum" },
  { id: 380592, category: "Pista 4: Pronombres personales", spanish: "Vosotras", arabic: "أَنْتُنَّ", phonetic: "antunna" },
  { id: 814269, category: "Pista 4: Pronombres personales", spanish: "Ellos", arabic: "هُمْ", phonetic: "hum" },
  { id: 592047, category: "Pista 4: Pronombres personales", spanish: "Ellas", arabic: "هُنَّ", phonetic: "hunna" },

  // Pista 5: Quién eres
  { id: 618392, category: "Pista 5: Quién eres", spanish: "¿Quién eres? (m)", arabic: "مَنْ أَنْتَ؟", phonetic: "man anta?" },
  { id: 905174, category: "Pista 5: Quién eres", spanish: "Soy Marwán", arabic: "أَنَا مَرْوَان", phonetic: "anā marwān" },
  { id: 742681, category: "Pista 5: Quién eres", spanish: "¿Quién eres? (f)", arabic: "مَنْ أَنْتِ؟", phonetic: "man anti?" },
  { id: 381950, category: "Pista 5: Quién eres", spanish: "Soy Fátima", arabic: "أَنَا فَاطِمَة", phonetic: "anā fāṭima" },
  { id: 569204, category: "Pista 5: Quién eres", spanish: "¿Quién es? (masculino)", arabic: "مَنْ هُوَ؟", phonetic: "man huwa?" },
  { id: 827613, category: "Pista 5: Quién eres", spanish: "Es Mústafa", arabic: "هُوَ مُصْطَفَى", phonetic: "huwa muṣṭafā" },
  { id: 194508, category: "Pista 5: Quién eres", spanish: "¿Quién es? (femenino)", arabic: "مَنْ هِيَ؟", phonetic: "man hiya?" },
  { id: 760381, category: "Pista 5: Quién eres", spanish: "Es Layla", arabic: "هِيَ لَيْلَى", phonetic: "hiya laylā" },

  // Pista 6: De dónde eres
  { id: 704318, category: "Pista 6: De dónde eres", spanish: "¿De dónde eres? (m)", arabic: "مِنْ أَيْنَ أَنْتَ؟", phonetic: "min ayna anta?" },
  { id: 219847, category: "Pista 6: De dónde eres", spanish: "Soy de España", arabic: "أَنَا مِنْ إِسْبَانِيَا", phonetic: "anā min isbāniyā" },
  { id: 865204, category: "Pista 6: De dónde eres", spanish: "Soy español", arabic: "أَنَا إِسْبَانِيّ", phonetic: "anā isbānī" },
  { id: 593781, category: "Pista 6: De dónde eres", spanish: "¿De dónde eres? (f)", arabic: "مِنْ أَيْنَ أَنْتِ؟", phonetic: "min ayna anti?" },
  { id: 148906, category: "Pista 6: De dónde eres", spanish: "Soy de Francia", arabic: "أَنَا مِنْ فَرَنْسَا", phonetic: "anā min faransā" },
  { id: 920463, category: "Pista 6: De dónde eres", spanish: "Soy francesa", arabic: "أَنَا فَرَنْسِيَّة", phonetic: "anā faransiyya" },
  { id: 376195, category: "Pista 6: De dónde eres", spanish: "¿De dónde es? (m)", arabic: "مِنْ أَيْنَ هُوَ؟", phonetic: "min ayna huwa?" },
  { id: 681429, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "هُوَ مِنْ إِيطَالِيَا", phonetic: "huwa min īṭāliyā" },
  { id: 254870, category: "Pista 6: De dónde eres", spanish: "Es italiano", arabic: "هُوَ إِيطَالِيّ", phonetic: "huwa īṭālī" },
  { id: 937502, category: "Pista 6: De dónde eres", spanish: "¿De dónde es? (f)", arabic: "مِنْ أَيْنَ هِيَ؟", phonetic: "min ayna hiya?" },
  { id: 418639, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "هِيَ مِنْ إِيطَالِيَا", phonetic: "hiya min īṭāliyā" },
  { id: 760184, category: "Pista 6: De dónde eres", spanish: "Es italiana", arabic: "هِيَ إِيطَالِيَّة", phonetic: "hiya īṭāliyya" },

  // Pista 7: Números 0-10
  { id: 700, category: "Pista 7: Números", spanish: "Cero", arabic: "صِفْر", phonetic: "Sifr" },
  { id: 701, category: "Pista 7: Números", spanish: "Uno", arabic: "وَاحِد", phonetic: "Wahid" },
  { id: 702, category: "Pista 7: Números", spanish: "Dos", arabic: "اِثْنَان", phonetic: "Ithnan" },
  { id: 703, category: "Pista 7: Números", spanish: "Tres", arabic: "ثَلَاثَة", phonetic: "Thalatha" },
  { id: 704, category: "Pista 7: Números", spanish: "Cuatro", arabic: "أَرْبَعَة", phonetic: "Arba'a" },
  { id: 705, category: "Pista 7: Números", spanish: "Cinco", arabic: "خَمْسَة", phonetic: "Khamsa" },
  { id: 706, category: "Pista 7: Números", spanish: "Seis", arabic: "سِتَّة", phonetic: "Sitta" },
  { id: 707, category: "Pista 7: Números", spanish: "Siete", arabic: "سَبْعَة", phonetic: "Sab'a" },
  { id: 708, category: "Pista 7: Números", spanish: "Ocho", arabic: "ثَمَانِيَة", phonetic: "Thamaniya" },
  { id: 709, category: "Pista 7: Números", spanish: "Nueve", arabic: "تِسْعَة", phonetic: "Tis'a" },
  { id: 710, category: "Pista 7: Números", spanish: "Diez", arabic: "عَشَرَة", phonetic: "'Ashara" },

  // Pista 8: Demostrativos
  { id: 615482, category: "Pista 8: Demostrativos", spanish: "Éste, esto", arabic: "هٰذَا", phonetic: "hādhā" },
  { id: 903174, category: "Pista 8: Demostrativos", spanish: "Ésta", arabic: "هٰذِهِ", phonetic: "hādhihi" },
  { id: 487209, category: "Pista 8: Demostrativos", spanish: "Aquel", arabic: "ذٰلِكَ", phonetic: "dhālika" },
  { id: 762910, category: "Pista 8: Demostrativos", spanish: "Aquella", arabic: "تِلْكَ", phonetic: "tilka" },
  { id: 351648, category: "Pista 8: Demostrativos", spanish: "¿Qué es esto?", arabic: "مَا هٰذَا؟", phonetic: "mā hādhā?" },
  { id: 820593, category: "Pista 8: Demostrativos", spanish: "Esto es un libro", arabic: "هٰذَا كِتَاب", phonetic: "hādhā kitāb" },
  { id: 194762, category: "Pista 8: Demostrativos", spanish: "Esto es un lápiz", arabic: "هٰذَا قَلَم", phonetic: "hādhā qalam" },
  { id: 673905, category: "Pista 8: Demostrativos", spanish: "Esto es una puerta", arabic: "هٰذَا بَاب", phonetic: "hādhā bāb" },
  { id: 508341, category: "Pista 8: Demostrativos", spanish: "Esto es una ventana", arabic: "هٰذَا شُبَّاك", phonetic: "hādhā shubbāk" },
  { id: 946207, category: "Pista 8: Demostrativos", spanish: "Esto es una silla", arabic: "هٰذَا كُرْسِيّ", phonetic: "hādhā kursī" },
  { id: 731854, category: "Pista 8: Demostrativos", spanish: "Esto es un teléfono", arabic: "هٰذَا تِلِيفُون", phonetic: "hādhā tilīfūn" },
  { id: 284691, category: "Pista 8: Demostrativos", spanish: "Esto es un ordenador", arabic: "هٰذَا كُمْبِيُوتَر", phonetic: "hādhā kombiyūtar" },
  { id: 659120, category: "Pista 8: Demostrativos", spanish: "Esto es una mesa", arabic: "هٰذِهِ طَاوِلَة", phonetic: "hādhihi ṭāwila" },
  { id: 817346, category: "Pista 8: Demostrativos", spanish: "Esto es una pizarra", arabic: "هٰذِهِ سَبُّورَة", phonetic: "hādhihi sabbūra" },
  { id: 492805, category: "Pista 8: Demostrativos", spanish: "Esto es una botella", arabic: "هٰذِهِ زُجَاجَة", phonetic: "hādhihi zujāja" },
  
  // Pista 9: Los pronombres sufijados
{ id: 918234, category: "Pista 9: Los pronombres sufijados", spanish: "Mi", arabic: "ـي", phonetic: "-i" },
{ id: 567123, category: "Pista 9: Los pronombres sufijados", spanish: "Tu (masc.)", arabic: "ـكَ", phonetic: "-ka" },
{ id: 238945, category: "Pista 9: Los pronombres sufijados", spanish: "Tu (fem.)", arabic: "ـكِ", phonetic: "-ki" },
{ id: 745102, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de él)", arabic: "ـهُ", phonetic: "-hu" },
{ id: 392817, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de ella)", arabic: "ـهَا", phonetic: "-ha" },
{ id: 856291, category: "Pista 9: Los pronombres sufijados", spanish: "Nuestro, nuestra", arabic: "ـنَا", phonetic: "-na" },
{ id: 412389, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro (de vosotros)", arabic: "ـكُمْ", phonetic: "-kum" },
{ id: 678452, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro (de vosotras)", arabic: "ـكُنَّ", phonetic: "-kunna" },
{ id: 193847, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de ellos)", arabic: "ـهُمْ", phonetic: "-hum" },
{ id: 504938, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de ellas)", arabic: "ـهُنَّ", phonetic: "-hunna" },
{ id: 284756, category: "Pista 9: Los pronombres sufijados", spanish: "Mi libro", arabic: "كِتَابِي", phonetic: "Kitabi" },
{ id: 935612, category: "Pista 9: Los pronombres sufijados", spanish: "Tu libro (masc.)", arabic: "كِتَابُكَ", phonetic: "Kitabuka" },
{ id: 362819, category: "Pista 9: Los pronombres sufijados", spanish: "Tu libro (fem.)", arabic: "كِتَابُكِ", phonetic: "Kitabuki" },
{ id: 719284, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de él)", arabic: "كِتَابُهُ", phonetic: "Kitabuhu" },
{ id: 483726, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de ella)", arabic: "كِتَابُهَا", phonetic: "Kitabuha" },
{ id: 159283, category: "Pista 9: Los pronombres sufijados", spanish: "Nuestro libro", arabic: "كِتَابُنَا", phonetic: "Kitabuna" },
{ id: 628374, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro libro (de vosotros)", arabic: "كِتَابُكُمْ", phonetic: "Kitabukum" },
{ id: 891723, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro libro (de vosotras)", arabic: "كِتَابُكُنَّ", phonetic: "Kitabukunna" },
{ id: 273849, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de ellos)", arabic: "كِتَابُهُمْ", phonetic: "Kitabuhum" },
{ id: 546192, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de ellas)", arabic: "كِتَابُهُنَّ", phonetic: "Kitabuhunna" },

// Pista 10: ¿Cómo te llamas?
{ id: 482918, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo te llamas? (masc.)", arabic: "مَا اسْمُكَ؟", phonetic: "Ma ismuka?" },
{ id: 938422, category: "Pista 10: ¿Cómo te llamas?", spanish: "Me llamo Latif", arabic: "اِسْمِي لَطِيف", phonetic: "Ismi Latif" },
{ id: 102939, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo te llamas? (fem.)", arabic: "مَا اسْمُكِ؟", phonetic: "Ma ismuki?" },
{ id: 554830, category: "Pista 10: ¿Cómo te llamas?", spanish: "Me llamo Latifa", arabic: "اِسْمِي لَطِيفَة", phonetic: "Ismi Latifa" },
{ id: 772104, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo se llama? (él)", arabic: "مَا اسْمُهُ؟", phonetic: "Ma ismuhu?" },
{ id: 310295, category: "Pista 10: ¿Cómo te llamas?", spanish: "Se llama Samir", arabic: "اِسْمُهُ سَمِير", phonetic: "Ismuhu Samir" },
{ id: 884921, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo se llama? (ella)", arabic: "مَا اسْمُهَا؟", phonetic: "Ma ismuha?" },
{ id: 662911, category: "Pista 10: ¿Cómo te llamas?", spanish: "Se llama Samira", arabic: "اِسْمُهَا سَمِيرَة", phonetic: "Ismuha Samira" },

// Pista 11: Concordancias entre sustantivo y adjetivo
{ id: 382910, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Un libro grande", arabic: "كِتَابٌ كَبِيرٌ", phonetic: "Kitabun kabir" },
{ id: 910238, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "El libro grande", arabic: "الْكِتَابُ الْكَبِيرُ", phonetic: "Al-kitabu l-kabir" },
{ id: 556192, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "El libro es grande", arabic: "الْكِتَابُ كَبِيرٌ", phonetic: "Al-kitabu kabir" },
{ id: 728394, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Este libro", arabic: "هَذَا الْكِتَابُ", phonetic: "Hadha l-kitab" },
{ id: 119283, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esto es un libro", arabic: "هَذَا كِتَابٌ", phonetic: "Hadha kitab" },
{ id: 448291, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Este libro es grande", arabic: "هَذَا الْكِتَابُ كَبِيرٌ", phonetic: "Hadha l-kitabu kabir" },
{ id: 663829, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Éste es un libro grande", arabic: "هَذَا كِتَابٌ كَبِيرٌ", phonetic: "Hadha kitabun kabir" },
{ id: 220193, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Una pelota grande", arabic: "كُرَةٌ كَبِيرَةٌ", phonetic: "Kuratun kabira" },
{ id: 884710, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "La pelota grande", arabic: "الْكُرَةُ الْكَبِيرَةُ", phonetic: "Al-kuratu l-kabira" },
{ id: 339281, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "La pelota es grande", arabic: "الْكُرَةُ كَبِيرَةٌ", phonetic: "Al-kuratu kabira" },
{ id: 550192, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esta pelota", arabic: "هَذِهِ الْكُرَةُ", phonetic: "Hadhihi l-kura" },
{ id: 991823, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esto es una pelota", arabic: "هَذِهِ كُرَةٌ", phonetic: "Hadhihi kura" },
{ id: 772834, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esta pelota es grande", arabic: "هَذِهِ الْكُرَةُ كَبِيرَةٌ", phonetic: "Hadhihi l-kuratu kabira" },
{ id: 443920, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Ésta es una pelota grande", arabic: "هَذِهِ كُرَةٌ كَبِيرَةٌ", phonetic: "Hadhihi kuratun kabira" },

// Pista 12: La anexión
{ id: 482915, category: "Pista 12: La anexión", spanish: "Mi libro", arabic: "كِتَابِي", phonetic: "Kitabi" },
{ id: 739284, category: "Pista 12: La anexión", spanish: "Tu libro (masc.)", arabic: "كِتَابُكَ", phonetic: "Kitabuka" },
{ id: 192837, category: "Pista 12: La anexión", spanish: "Su libro (de él)", arabic: "كِتَابُهُ", phonetic: "Kitabuhu" },
{ id: 567382, category: "Pista 12: La anexión", spanish: "El libro del profesor", arabic: "كِتَابُ الْأُسْتَاذِ", phonetic: "Kitabu l-ustadh" },
{ id: 918276, category: "Pista 12: La anexión", spanish: "Su libro grande", arabic: "كِتَابُهُ الْكَبِيرُ", phonetic: "Kitabuhu l-kabir" },
{ id: 339105, category: "Pista 12: La anexión", spanish: "Su libro es grande", arabic: "كِتَابُهُ كَبِيرٌ", phonetic: "Kitabuhu kabir" },
{ id: 884723, category: "Pista 12: La anexión", spanish: "El libro grande del profesor", arabic: "كِتَابُ الْأُسْتَاذِ الْكَبِيرُ", phonetic: "Kitabu l-ustadhi l-kabir" },
{ id: 221938, category: "Pista 12: La anexión", spanish: "El libro del profesor es grande", arabic: "كِتَابُ الْأُسْتَاذِ كَبِيرٌ", phonetic: "Kitabu l-ustadhi kabir" },
{ id: 662919, category: "Pista 12: La anexión", spanish: "El libro del profesor de árabe", arabic: "كِتَابُ أُسْتَاذِ الْعَرَبِيَّةِ", phonetic: "Kitabu ustadhi l-arabiyya" },
{ id: 441059, category: "Pista 12: La anexión", spanish: "Mi pelota", arabic: "كُرَتِي", phonetic: "Kurati" },
{ id: 772960, category: "Pista 12: La anexión", spanish: "Tu pelota (masc.)", arabic: "كُرَتُكَ", phonetic: "Kuratuka" },
{ id: 110295, category: "Pista 12: La anexión", spanish: "Su pelota (de él)", arabic: "كُرَتُهُ", phonetic: "Kuratuhu" },
{ id: 998132, category: "Pista 12: La anexión", spanish: "La pelota del niño", arabic: "كُرَةُ الْوَلَدِ", phonetic: "Kuratu l-walad" },
{ id: 550219, category: "Pista 12: La anexión", spanish: "Mi pelota grande", arabic: "كُرَتِي الْكَبِيرَةُ", phonetic: "Kurati l-kabira" },
{ id: 284731, category: "Pista 12: La anexión", spanish: "Su pelota grande", arabic: "كُرَتُهُ الْكَبِيرَةُ", phonetic: "Kuratuhu l-kabira" },
{ id: 628379, category: "Pista 12: La anexión", spanish: "Su pelota es grande", arabic: "كُرَتُهُ كَبِيرَةٌ", phonetic: "Kuratuhu kabira" },
{ id: 374821, category: "Pista 12: La anexión", spanish: "La pelota grande del niño", arabic: "كُرَةُ الْوَلَدِ الْكَبِيرَةُ", phonetic: "Kuratu l-waladi l-kabira" },
{ id: 859134, category: "Pista 12: La anexión", spanish: "La pelota del niño es grande", arabic: "كُرَةُ الْوَلَدِ كَبِيرَةٌ", phonetic: "Kuratu l-waladi kabira" },

// Pista 13: El verbo en presente (Escribir)
{ id: 482101, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Escribir", arabic: "يَكْتُبُ", phonetic: "Yaktubu" },
{ id: 193442, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Yo escribo", arabic: "أَنَا أَكْتُبُ", phonetic: "Ana aktubu" },
{ id: 572119, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Tú escribes (masc.)", arabic: "أَنْتَ تَكْتُبُ", phonetic: "Anta taktubu" },
{ id: 293247, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Tú escribes (fem.)", arabic: "أَنْتِ تَكْتُبِينَ", phonetic: "Anti taktubina" },
{ id: 847301, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Él escribe", arabic: "هُوَ يَكْتُبُ", phonetic: "Huwa yaktubu" },
{ id: 384429, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Ella escribe", arabic: "هِيَ تَكْتُبُ", phonetic: "Hiya taktubu" },
{ id: 928574, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Nosotros escribimos", arabic: "نَحْنُ نَكْتُبُ", phonetic: "Nahnu naktubu" },
{ id: 102638, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Vosotros escribís", arabic: "أَنْتُمْ تَكْتُبُونَ", phonetic: "Antum taktubuna" },
{ id: 564838, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Vosotras escribís", arabic: "أَنْتُنَّ تَكْتُبْنَ", phonetic: "Antunna taktubna" },
{ id: 283946, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Ellos escriben", arabic: "هُمْ يَكْتُبُونَ", phonetic: "Hum yaktubuna" },
{ id: 748091, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Ellas escriben", arabic: "هُنَّ يَكْتُبْنَ", phonetic: "Hunna yaktubna" },

// Pista 14: Verbo vivir
{ id: 637181, category: "Pista 14: Verbo vivir", spanish: "Vivir", arabic: "يَسْكُنُ", phonetic: "Yaskunu" },
{ id: 192037, category: "Pista 14: Verbo vivir", spanish: "Yo vivo", arabic: "أَنَا أَسْكُنُ", phonetic: "Ana askunu" },
{ id: 473129, category: "Pista 14: Verbo vivir", spanish: "Tú vives (masc.)", arabic: "أَنْتَ تَسْكُنُ", phonetic: "Anta taskunu" },
{ id: 827564, category: "Pista 14: Verbo vivir", spanish: "Tú vives (fem.)", arabic: "أَنْتِ تَسْكُنِينَ", phonetic: "Anti taskunina" },
{ id: 283949, category: "Pista 14: Verbo vivir", spanish: "Él vive", arabic: "هُوَ يَسْكُنُ", phonetic: "Huwa yaskunu" },
{ id: 918073, category: "Pista 14: Verbo vivir", spanish: "Ella vive", arabic: "هِيَ تَسْكُنُ", phonetic: "Hiya taskunu" },
{ id: 374129, category: "Pista 14: Verbo vivir", spanish: "Nosotros vivimos", arabic: "نَحْنُ نَسْكُنُ", phonetic: "Nahnu naskunu" },
{ id: 563228, category: "Pista 14: Verbo vivir", spanish: "Vosotros vivís", arabic: "أَنْتُمْ تَسْكُنُونَ", phonetic: "Antum taskununa" },
{ id: 109583, category: "Pista 14: Verbo vivir", spanish: "Vosotras vivís", arabic: "أَنْتُنَّ تَسْكُنَّ", phonetic: "Antunna taskunna" },
{ id: 837762, category: "Pista 14: Verbo vivir", spanish: "Ellos viven", arabic: "هُمْ يَسْكُنُونَ", phonetic: "Hum yaskununa" },
{ id: 463128, category: "Pista 14: Verbo vivir", spanish: "Ellas viven", arabic: "هُنَّ يَسْكُنَّ", phonetic: "Hunna yaskunna" },
{ id: 293340, category: "Pista 14: Verbo vivir", spanish: "¿Dónde vives, Nabil?", arabic: "أَيْنَ تَسْكُنُ يَا نَبِيلُ؟", phonetic: "Ayna taskunu ya Nabil?" },
{ id: 728594, category: "Pista 14: Verbo vivir", spanish: "Vivo en Valencia", arabic: "أَسْكُنُ فِي بَلَنْسِيَةَ", phonetic: "Askunu fi Balansiya" },
{ id: 384056, category: "Pista 14: Verbo vivir", spanish: "¿Dónde vives, Fátima?", arabic: "أَيْنَ تَسْكُنِينَ يَا فَاطِمَةُ؟", phonetic: "Ayna taskunina ya Fatima?" },
{ id: 928771, category: "Pista 14: Verbo vivir", spanish: "Vivo en Madrid", arabic: "أَسْكُنُ فِي مَدْرِيدَ", phonetic: "Askunu fi Madrid" },
{ id: 182136, category: "Pista 14: Verbo vivir", spanish: "¿En qué calle vives, Marwán?", arabic: "فِي أَيِّ شَارِعٍ تَسْكُنُ يَا مَرْوَانُ؟", phonetic: "Fi ayyi shari'in taskunu ya Marwan?" },
{ id: 564939, category: "Pista 14: Verbo vivir", spanish: "Vivo en la calle Jesús", arabic: "أَسْكُنُ فِي شَارِعِ خِيسُوس", phonetic: "Askunu fi shari' Jesus" },
{ id: 283145, category: "Pista 14: Verbo vivir", spanish: "¿Y en qué número?", arabic: "وَفِي أَيِّ رَقْمٍ؟", phonetic: "Wa fi ayyi raqmin?" },
{ id: 748690, category: "Pista 14: Verbo vivir", spanish: "En el número diez", arabic: "فِي رَقْمِ عَشَرَة", phonetic: "Fi raqm 'ashara" },
{ id: 374020, category: "Pista 14: Verbo vivir", spanish: "¿Vives en una casa o en un piso?", arabic: "أَتَسْكُنُ فِي بَيْتٍ أَمْ فِي شَقَّةٍ؟", phonetic: "A-taskunu fi baytin am fi shaqqa?" },
{ id: 192230, category: "Pista 14: Verbo vivir", spanish: "Vivo en un piso", arabic: "أَسْكُنُ فِي شَقَّةٍ", phonetic: "Askunu fi shaqqa" },
{ id: 637880, category: "Pista 14: Verbo vivir", spanish: "Soy de Cuenca pero vivo en Valencia", arabic: "أَنَا مِنْ كُوِينْكَا وَلَكِنْ أَسْكُنُ فِي بَلَنْسِيَةَ", phonetic: "Ana min Cuenca wa lakin askunu fi Balansiya" },

// Pista 15: Verbo estudiar
{ id: 827961, category: "Pista 15: Verbo estudiar", spanish: "Estudiar", arabic: "يَدْرُسُ", phonetic: "Yadrusu" },
{ id: 463321, category: "Pista 15: Verbo estudiar", spanish: "Yo estudio", arabic: "أَنَا أَدْرُسُ", phonetic: "Ana adrusu" },
{ id: 293041, category: "Pista 15: Verbo estudiar", spanish: "Tú estudias (masc.)", arabic: "أَنْتَ تَدْرُسُ", phonetic: "Anta tadrusu" },
{ id: 728991, category: "Pista 15: Verbo estudiar", spanish: "Tú estudias (fem.)", arabic: "أَنْتِ تَدْرُسِينَ", phonetic: "Anti tadrusina" },
{ id: 182331, category: "Pista 15: Verbo estudiar", spanish: "Él estudia", arabic: "هُوَ يَدْرُسُ", phonetic: "Huwa yadrusu" },
{ id: 564131, category: "Pista 15: Verbo estudiar", spanish: "Ella estudia", arabic: "هِيَ تَدْرُسُ", phonetic: "Hiya tadrusu" },
{ id: 283341, category: "Pista 15: Verbo estudiar", spanish: "Nosotros estudiamos", arabic: "نَحْنُ نَدْرُسُ", phonetic: "Nahnu nadrusu" },
{ id: 918871, category: "Pista 15: Verbo estudiar", spanish: "Vosotros estudiáis", arabic: "أَنْتُمْ تَدْرُسُونَ", phonetic: "Antum tadrusuna" },
{ id: 374421, category: "Pista 15: Verbo estudiar", spanish: "Vosotras estudiáis", arabic: "أَنْتُنَّ تَدْرُسْنَ", phonetic: "Antunna tadrusna" },
{ id: 637682, category: "Pista 15: Verbo estudiar", spanish: "Ellos estudian", arabic: "هُمْ يَدْرُسُونَ", phonetic: "Hum yadrusuna" },
{ id: 192232, category: "Pista 15: Verbo estudiar", spanish: "Ellas estudian", arabic: "هُنَّ يَدْرُسْنَ", phonetic: "Hunna yadrusna" },
{ id: 473422, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudias, Muhammad?", arabic: "مَاذَا تَدْرُسُ يَا مُحَمَّدُ؟", phonetic: "Madha tadrusu ya Muhammad?" },
{ id: 827162, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe", arabic: "أَدْرُسُ الْعَرَبِيَّةَ", phonetic: "Adrusu al-arabiyya" },
{ id: 293242, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudias, Samira?", arabic: "مَاذَا تَدْرُسِينَ يَا سَمِيرَةُ؟", phonetic: "Madha tadrusina ya Samira?" },
{ id: 728192, category: "Pista 15: Verbo estudiar", spanish: "Estudio Lengua Inglesa", arabic: "أَدْرُسُ اللُّغَةَ الْإِنْجِلِيزِيَّةَ", phonetic: "Adrusu al-lugha al-injiliziyya" },
{ id: 182032, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudia Latif?", arabic: "مَاذَا يَدْرُسُ لَطِيفٌ؟", phonetic: "Madha yadrusu Latif?" },
{ id: 564332, category: "Pista 15: Verbo estudiar", spanish: "Estudia Lengua Francesa", arabic: "هُوَ يَدْرُسُ اللُّغَةَ الْفَرَنْسِيَّةَ", phonetic: "Huwa yadrusu al-lugha al-faransiyya" },
{ id: 283542, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudia Munira?", arabic: "مَاذَا تَدْرُسُ مُنِيرَةُ؟", phonetic: "Madha tadrusu Munira?" },
{ id: 918472, category: "Pista 15: Verbo estudiar", spanish: "Estudia Lengua Portuguesa", arabic: "هِيَ تَدْرُسُ اللُّغَةَ الْبُرْتُغَالِيَّةَ", phonetic: "Hiya tadrusu al-lugha al-burtughaliyya" },
{ id: 374222, category: "Pista 15: Verbo estudiar", spanish: "¿Dónde estudias Árabe, Nabil?", arabic: "أَيْنَ تَدْرُسُ الْعَرَبِيَّةَ يَا نَبِيلُ؟", phonetic: "Ayna tadrusu al-arabiyya ya Nabil?" },
{ id: 637083, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe en la Escuela de Idiomas", arabic: "أَدْرُسُ الْعَرَبِيَّةَ فِي مَدْرَسَةِ اللُّغَاتِ", phonetic: "Adrusu al-arabiyya fi madrasat al-lughat" },
{ id: 192633, category: "Pista 15: Verbo estudiar", spanish: "¿Dónde estudias Inglés, Karima?", arabic: "أَيْنَ تَدْرُسِينَ الْإِنْجِلِيزِيَّةَ يَا كَرِيمَةُ؟", phonetic: "Ayna tadrusina al-injiliziyya ya Karima?" },
{ id: 473223, category: "Pista 15: Verbo estudiar", spanish: "Estudio Inglés en la Universidad", arabic: "أَدْرُسُ الْإِنْجِلِيزِيَّةَ فِي الْجَامِعَةِ", phonetic: "Adrusu al-injiliziyya fi al-jami'a" },
{ id: 827863, category: "Pista 15: Verbo estudiar", spanish: "¿Cuándo estudias Árabe, Marwán?", arabic: "مَتَى تَدْرُسُ الْعَرَبِيَّةَ يَا مَرْوَانُ؟", phonetic: "Mata tadrusu al-arabiyya ya Marwan?" },
{ id: 293643, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe por la mañana", arabic: "أَدْرُسُ الْعَرَبِيَّةَ فِي الصَّبَاحِ", phonetic: "Adrusu al-arabiyya fi as-sabah" },
{ id: 728893, category: "Pista 15: Verbo estudiar", spanish: "¿Cuándo estudias Árabe, Rashida?", arabic: "مَتَى تَدْرُسِينَ الْعَرَبِيَّةَ يَا رَشِيدَةُ؟", phonetic: "Mata tadrusina al-arabiyya ya Rashida?" },
{ id: 182933, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe por la tarde", arabic: "أَدْرُسُ الْعَرَبِيَّةَ فِي الْمَسَاءِ", phonetic: "Adrusu al-arabiyya fi al-masa'" },

// Pista 16: Verbo hablar
{ id: 564533, category: "Pista 16: Verbo hablar", spanish: "Hablar", arabic: "يَتَكَلَّمُ", phonetic: "Yatakallamu" },
{ id: 283143, category: "Pista 16: Verbo hablar", spanish: "Yo hablo", arabic: "أَنَا أَتَكَلَّمُ", phonetic: "Ana atakallamu" },
{ id: 918674, category: "Pista 16: Verbo hablar", spanish: "Tú hablas (masc.)", arabic: "أَنْتَ تَتَكَلَّمُ", phonetic: "Anta tatakallamu" },
{ id: 374923, category: "Pista 16: Verbo hablar", spanish: "Tú hablas (fem.)", arabic: "أَنْتِ تَتَكَلَّمِينَ", phonetic: "Anti tatakallamina" },
{ id: 637484, category: "Pista 16: Verbo hablar", spanish: "Él habla", arabic: "هُوَ يَتَكَلَّمُ", phonetic: "Huwa yatakallamu" },
{ id: 192734, category: "Pista 16: Verbo hablar", spanish: "Ella habla", arabic: "هِيَ تَتَكَلَّمُ", phonetic: "Hiya tatakallamu" },
{ id: 473524, category: "Pista 16: Verbo hablar", spanish: "Nosotros hablamos", arabic: "نَحْنُ نَتَكَلَّمُ", phonetic: "Nahnu natakallamu" },
{ id: 827265, category: "Pista 16: Verbo hablar", spanish: "Vosotros habláis", arabic: "أَنْتُمْ تَتَكَلَّمُونَ", phonetic: "Antum tatakallamuna" },
{ id: 293744, category: "Pista 16: Verbo hablar", spanish: "Vosotras habláis", arabic: "أَنْتُنَّ تَتَكَلَّمْنَ", phonetic: "Antunna tatakallamna" },
{ id: 728095, category: "Pista 16: Verbo hablar", spanish: "Ellos hablan", arabic: "هُمْ يَتَكَلَّمُونَ", phonetic: "Hum yatakallamuna" },
{ id: 182634, category: "Pista 16: Verbo hablar", spanish: "Ellas hablan", arabic: "هُنَّ يَتَكَلَّمْنَ", phonetic: "Hunna tatakallamna" },
{ id: 564234, category: "Pista 16: Verbo hablar", spanish: "¿Qué idiomas hablas, Karim?", arabic: "أَيُّ لُغَاتٍ تَتَكَلَّمُ يَا كَرِيمُ؟", phonetic: "Ayyu lughatin tatakallamu ya Karim?" },
{ id: 283844, category: "Pista 16: Verbo hablar", spanish: "Hablo español, árabe y francés", arabic: "أَتَكَلَّمُ الْإِسْبَانِيَّةَ وَالْعَرَبِيَّةَ وَالْفَرَنْسِيَّةَ", phonetic: "Atakallamu al-isbaniyya wa al-arabiyya wa al-faransiyya" },
{ id: 918175, category: "Pista 16: Verbo hablar", spanish: "¿Qué lenguas hablas, Fátima?", arabic: "أَيُّ لُغَاتٍ تَتَكَلَّمِينَ يَا فَاطِمَةُ؟", phonetic: "Ayyu lughatin tatakallamina ya Fatima?" },
{ id: 374524, category: "Pista 16: Verbo hablar", spanish: "Hablo ruso, alemán e italiano", arabic: "أَتَكَلَّمُ الرُّوسِيَّةَ وَالْأَلْمَانِيَّةَ وَالْإِيطَالِيَّةَ", phonetic: "Atakallamu ar-rusiyya wa al-almaniyya wa al-italiyya" },
{ id: 637985, category: "Pista 16: Verbo hablar", spanish: "¿Cómo hablas el inglés, Samir?", arabic: "كَيْفَ تَتَكَلَّمُ الْإِنْجِلِيزِيَّةَ يَا سَمِيرُ؟", phonetic: "Kayfa tatakallamu al-injiliziyya ya Samir?" },
{ id: 192435, category: "Pista 16: Verbo hablar", spanish: "Hablo inglés muy bien", arabic: "أَتَكَلَّمُ الْإِنْجِلِيزِيَّةَ جَيِّدًا", phonetic: "Atakallamu al-injiliziyya jayyidan" },
{ id: 473625, category: "Pista 16: Verbo hablar", spanish: "¿Cómo hablas el francés, Habiba?", arabic: "كَيْفَ تَتَكَلَّمِينَ الْفَرَنْسِيَّةَ يَا حَبِيبَةُ؟", phonetic: "Kayfa tatakallamina al-faransiyya ya Habiba?" },
{ id: 827466, category: "Pista 16: Verbo hablar", spanish: "Hablo francés regular", arabic: "أَتَكَلَّمُ الْفَرَنْسِيَّةَ بَيْنَ بَيْنَ", phonetic: "Atakallamu al-faransiyya bayna bayna" },
{ id: 293145, category: "Pista 16: Verbo hablar", spanish: "¿Cómo hablas el ruso, Latifa?", arabic: "كَيْفَ تَتَكَلَّمِينَ الرُّوسِيَّةَ يَا لَطِيفَةُ؟", phonetic: "Kayfa tatakallamina ar-rusiyya ya Latifa?" },
{ id: 728696, category: "Pista 16: Verbo hablar", spanish: "Hablo ruso un poco", arabic: "أَتَكَلَّمُ الرُّوسِيَّةَ قَلِيلًا", phonetic: "Atakallamu ar-rusiyya qalilan" },

// Pista 17: Verbo ir (يذهب)
{ id: 482915, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ir", arabic: "يَذْهَبُ", phonetic: "Yadhabu" },
{ id: 193847, category: "Pista 17: Verbo ir (يذهب)", spanish: "Yo voy", arabic: "أَنَا أَذْهَبُ", phonetic: "Ana adhabu" },
{ id: 572814, category: "Pista 17: Verbo ir (يذهب)", spanish: "Tú vas (masc.)", arabic: "أَنْتَ تَذْهَبُ", phonetic: "Anta tadhabu" },
{ id: 293842, category: "Pista 17: Verbo ir (يذهب)", spanish: "Tú vas (fem.)", arabic: "أَنْتِ تَذْهَبِينَ", phonetic: "Anti tadhabina" },
{ id: 847206, category: "Pista 17: Verbo ir (يذهب)", spanish: "Él va", arabic: "هُوَ يَذْهَبُ", phonetic: "Huwa yadhabu" },
{ id: 384724, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ella va", arabic: "هِيَ تَذْهَبُ", phonetic: "Hiya tadhabu" },
{ id: 928379, category: "Pista 17: Verbo ir (يذهب)", spanish: "Nosotros vamos", arabic: "نَحْنُ نَذْهَبُ", phonetic: "Nahnu nadhabu" },
{ id: 102933, category: "Pista 17: Verbo ir (يذهب)", spanish: "Vosotros vais", arabic: "أَنْتُمْ تَذْهَبُونَ", phonetic: "Antum tadhabuna" },
{ id: 564733, category: "Pista 17: Verbo ir (يذهب)", spanish: "Vosotras vais", arabic: "أَنْتُنَّ تَذْهَبْنَ", phonetic: "Antunna tadhabna" },
{ id: 283741, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ellos van", arabic: "هُمْ يَذْهَبُونَ", phonetic: "Hum yadhabuna" },
{ id: 748296, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ellas van", arabic: "هُنَّ يَذْهَبْنَ", phonetic: "Hunna tadhabna" },
{ id: 637289, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿A dónde vas, Nabil?", arabic: "إِلَى أَيْنَ تَذْهَبُ يَا نَبِيلُ؟", phonetic: "Ila ayna tadhabu ya Nabil?" },
{ id: 192838, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la escuela", arabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ", phonetic: "Adhabu ila al-madrasa" },
{ id: 473827, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿A dónde vas, Samira?", arabic: "إِلَى أَيْنَ تَذْهَبِينَ يَا سَمِيرَةُ؟", phonetic: "Ila ayna tadhabina ya Samira?" },
{ id: 827369, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a casa", arabic: "أَذْهَبُ إِلَى الْبَيْتِ", phonetic: "Adhabu ila al-bayt" },
{ id: 283748, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas a la escuela, Karim?", arabic: "كَيْفَ تَذْهَبُ إِلَى الْمَدْرَسَةِ يَا كَرِيمُ؟", phonetic: "Kayfa tadhabu ila al-madrasa ya Karim?" },
{ id: 918270, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la escuela en autobús", arabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالْبَاصِ", phonetic: "Adhabu ila al-madrasa bil-bas" },
{ id: 374825, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas a la escuela, Yamila?", arabic: "كَيْفَ تَذْهَبِينَ إِلَى الْمَدْرَسَةِ يَا جَمِيلَةُ؟", phonetic: "Kayfa tadhabina ila al-madrasa ya Jamila?" },
{ id: 637286, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la escuela en coche", arabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالسَّيَّارَةِ", phonetic: "Adhabu ila al-madrasa bis-sayyara" },
{ id: 192839, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas al cine, Yamal?", arabic: "كَيْفَ تَذْهَبُ إِلَى السِّينِمَا يَا جَمَالُ؟", phonetic: "Kayfa tadhabu ila as-sinima ya Jamal?" },
{ id: 473820, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy al cine andando", arabic: "أَذْهَبُ إِلَى السِّينِمَا مَشْيًا", phonetic: "Adhabu ila as-sinima mashyan" },
{ id: 827360, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas a la Universidad, Nadia?", arabic: "كَيْفَ تَذْهَبِينَ إِلَى الْجَامِعَةِ يَا نَادِيَةُ؟", phonetic: "Kayfa tadhabina ila al-jami'a ya Nadia?" },
{ id: 293849, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la Universidad en metro", arabic: "أَذْهَبُ إِلَى الْجَامِعَةِ بِالْمِتْرُو", phonetic: "Adhabu ila al-jami'a bil-mitru" },
{ id: 728399, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas de tu casa a la escuela?", arabic: "كَيْفَ تَذْهَبُ مِنْ بَيْتِكَ إِلَى الْمَدْرَسَةِ؟", phonetic: "Kayfa tadhabu min baytika ila al-madrasa?" },
{ id: 182739, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy de mi casa a la escuela en coche", arabic: "أَذْهَبُ مِنْ بَيْتِي إِلَى الْمَدْرَسَةِ بِالسَّيَّارَةِ", phonetic: "Adhabu min bayti ila al-madrasa bis-sayyara" },

// Pista 18: Expresiones útiles para clase
{ id: 564730, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Qué significa 'Saa'?", arabic: "مَا مَعْنَى سَاعَة؟", phonetic: "Ma ma'na sa'a?" },
{ id: 283740, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Cómo decimos en árabe 'reloj'?", arabic: "كَيْفَ نَقُولُ بِالْعَرَبِيَّة 'reloj'؟", phonetic: "Kayfa naqulu bil-arabiyya 'reloj'?" },
{ id: 918279, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Cómo escribimos en árabe 'reloj'?", arabic: "كَيْفَ نَكْتُبُ بِالْعَرَبِيَّة 'reloj'؟", phonetic: "Kayfa naktubu bil-arabiyya 'reloj'?" },
{ id: 374826, category: "Pista 18: Expresiones útiles para clase", spanish: "No sé", arabic: "لَا أَعْرِفُ", phonetic: "La a'rifu" },
{ id: 637287, category: "Pista 18: Expresiones útiles para clase", spanish: "No (lo) entiendo", arabic: "لَا أَفْهَمُ", phonetic: "La afhamu" },
{ id: 192836, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Puedes repetir(lo)?", arabic: "مُمْكِن التِّكْرَار؟", phonetic: "Mumkin at-tikrar?" },
{ id: 473826, category: "Pista 18: Expresiones útiles para clase", spanish: "Tengo una pregunta", arabic: "عِنْدِي سُؤَال", phonetic: "Indi su'al" },
{ id: 827367, category: "Pista 18: Expresiones útiles para clase", spanish: "Adelante (masc. / fem. / pl.)", arabic: "تَفَضَّلْ / تَفَضَّلِي / تَفَضَّلُوا", phonetic: "Tafaddal / Tafaddali / Tafaddalu" },
{ id: 293846, category: "Pista 18: Expresiones útiles para clase", spanish: "Palabra", arabic: "كَلِمَة", phonetic: "Kalima" },
{ id: 728397, category: "Pista 18: Expresiones útiles para clase", spanish: "Frase", arabic: "جُمْلَة", phonetic: "Jumla" },
{ id: 182737, category: "Pista 18: Expresiones útiles para clase", spanish: "Página", arabic: "صَفْحَة", phonetic: "Safha" },
{ id: 564736, category: "Pista 18: Expresiones útiles para clase", spanish: "Ejercicio", arabic: "تَمْرِين", phonetic: "Tamrin" },
{ id: 283747, category: "Pista 18: Expresiones útiles para clase", spanish: "Ejercicios", arabic: "تَمَارِين", phonetic: "Tamarin" },
{ id: 918276, category: "Pista 18: Expresiones útiles para clase", spanish: "Escribe (masc.)", arabic: "اُكْتُبْ", phonetic: "Uktub" },
{ id: 374827, category: "Pista 18: Expresiones útiles para clase", spanish: "Escribe (fem.)", arabic: "اُكْتُبِي", phonetic: "Uktubi" },
{ id: 637288, category: "Pista 18: Expresiones útiles para clase", spanish: "Escribid", arabic: "اُكْتُبُوا", phonetic: "Uktubu" },
{ id: 192831, category: "Pista 18: Expresiones útiles para clase", spanish: "Lee (masc.)", arabic: "اِقْرَأْ", phonetic: "Iqra'" },
{ id: 473828, category: "Pista 18: Expresiones útiles para clase", spanish: "Lee (fem.)", arabic: "اِقْرَئِي", phonetic: "Iqra'i" },
{ id: 827368, category: "Pista 18: Expresiones útiles para clase", spanish: "Leed", arabic: "اِقْرَؤُوا", phonetic: "Iqra'u" },
{ id: 293848, category: "Pista 18: Expresiones útiles para clase", spanish: "Escucha (masc.)", arabic: "اِسْمَعْ", phonetic: "Isma'" },
{ id: 728398, category: "Pista 18: Expresiones útiles para clase", spanish: "Escucha (fem.)", arabic: "اِسْمَعِي", phonetic: "Isma'i" },
{ id: 182738, category: "Pista 18: Expresiones útiles para clase", spanish: "Escuchad", arabic: "اِسْمَعُوا", phonetic: "Isma'u" },

// Pista 19: El estado civil
{ id: 564737, category: "Pista 19: El estado civil", spanish: "Soltero", arabic: "عَازِب", phonetic: "Azib" },
{ id: 283739, category: "Pista 19: El estado civil", spanish: "Soltera", arabic: "عَازِبَة", phonetic: "Aziba" },
{ id: 918278, category: "Pista 19: El estado civil", spanish: "Casado", arabic: "مُتَزَوِّج", phonetic: "Mutazawwij" },
{ id: 374828, category: "Pista 19: El estado civil", spanish: "Casada", arabic: "مُتَزَوِّجَة", phonetic: "Mutazawwija" },
{ id: 637299, category: "Pista 19: El estado civil", spanish: "Divorciado", arabic: "مُطَلَّق", phonetic: "Mutallaq" },
{ id: 192849, category: "Pista 19: El estado civil", spanish: "Divorciada", arabic: "مُطَلَّقَة", phonetic: "Mutallaqa" },
{ id: 473839, category: "Pista 19: El estado civil", spanish: "Viudo", arabic: "أَرْمَل", phonetic: "Armal" },
{ id: 827379, category: "Pista 19: El estado civil", spanish: "Viuda", arabic: "أَرْمَلَة", phonetic: "Armala" },
{ id: 293859, category: "Pista 19: El estado civil", spanish: "¿Estás casado, Karim?", arabic: "هَلْ أَنْتَ مُتَزَوِّجٌ يَا كَرِيمُ؟", phonetic: "Hal anta mutazawwijun ya Karim?" },
{ id: 728409, category: "Pista 19: El estado civil", spanish: "No, soy soltero", arabic: "لَا، أَنَا عَازِبٌ", phonetic: "La, ana azib" },
{ id: 182749, category: "Pista 19: El estado civil", spanish: "¿Estás casada, Latifa?", arabic: "هَلْ أَنْتِ مُتَزَوِّجَةٌ يَا لَطِيفَةُ؟", phonetic: "Hal anti mutazawwijatun ya Latifa?" },
{ id: 564749, category: "Pista 19: El estado civil", spanish: "No, soy soltera", arabic: "لَا، أَنَا عَازِبَةٌ", phonetic: "La, ana aziba" },
{ id: 283759, category: "Pista 19: El estado civil", spanish: "¿Y cuál es tu número de teléfono?", arabic: "وَمَا رَقْمُ تِلِيفُونِكَ؟", phonetic: "Wa ma raqmu tilifunik?" },
{ id: 918289, category: "Pista 19: El estado civil", spanish: "Mi número de teléfono es el 6924851", arabic: "رَقْمُ تِلِيفُونِي: 6924851", phonetic: "Raqmu tilifuni: ..." },
{ id: 374839, category: "Pista 19: El estado civil", spanish: "Gracias", arabic: "شُكْرًا", phonetic: "Shukran" },
{ id: 637279, category: "Pista 19: El estado civil", spanish: "De nada", arabic: "عَفْوًا", phonetic: "Afwan" },

  // Pista 20: La casa
{ id: 482920, category: "Pista 20: La casa", spanish: "Entrada", arabic: "مَدْخَل", phonetic: "Madkhal" },
{ id: 193850, category: "Pista 20: La casa", spanish: "Pasillo", arabic: "مَمَرّ", phonetic: "Mamarr" },
{ id: 572820, category: "Pista 20: La casa", spanish: "Habitación", arabic: "غُرْفَة", phonetic: "Ghurfa" },
{ id: 293850, category: "Pista 20: La casa", spanish: "Cuarto de estar", arabic: "غُرْفَة جُلُوس", phonetic: "Ghurfat julus" },
{ id: 847210, category: "Pista 20: La casa", spanish: "Salón", arabic: "صَالُون", phonetic: "Salun" },
{ id: 384730, category: "Pista 20: La casa", spanish: "Dormitorio", arabic: "غُرْفَة نَوْم", phonetic: "Ghurfat nawm" },
{ id: 928380, category: "Pista 20: La casa", spanish: "Comedor", arabic: "غُرْفَة أَكْل", phonetic: "Ghurfat akl" },
{ id: 102940, category: "Pista 20: La casa", spanish: "Baño", arabic: "حَمَّام", phonetic: "Hammam" },
{ id: 564740, category: "Pista 20: La casa", spanish: "Retrete", arabic: "مِرْحَاض", phonetic: "Mirhad" },
{ id: 283750, category: "Pista 20: La casa", spanish: "Garaje", arabic: "كَرَاج", phonetic: "Kraj" },
{ id: 748300, category: "Pista 20: La casa", spanish: "Balcón", arabic: "شُرْفَة", phonetic: "Shurfa" },
{ id: 637290, category: "Pista 20: La casa", spanish: "Despacho", arabic: "مَكْتَب", phonetic: "Maktab" },
{ id: 192840, category: "Pista 20: La casa", spanish: "Cocina", arabic: "مَطْبَخ", phonetic: "Matbakh" },
{ id: 473830, category: "Pista 20: La casa", spanish: "Habitación de invitados", arabic: "غُرْفَة ضُيُوف", phonetic: "Ghurfat duyuf" },
{ id: 827370, category: "Pista 20: La casa", spanish: "Jardín", arabic: "حَدِيقَة", phonetic: "Hadiqa" },
{ id: 283751, category: "Pista 20: La casa", spanish: "¿Marwan, qué hay en tu casa?", arabic: "يَا مَرْوَانُ، مَاذَا يُوجَدُ فِي بَيْتِكَ؟", phonetic: "Ya Marwan, madha yujadu fi baytika?" },
{ id: 918280, category: "Pista 20: La casa", spanish: "En mi casa hay una pequeña entrada, un pasillo largo, un cuarto de estar grande, dos baños (uno grande y otro pequeño), una bonita cocina, tres dormitorios y dos balcones", arabic: "فِي بَيْتِي مَدْخَلٌ صَغِيرٌ، مَمَرٌّ طَوِيلٌ، غُرْفَةُ جُلُوسٍ كَبِيرَةٌ، حَمَّامَانِ (وَاحِدٌ كَبِيرٌ وَآخَرُ صَغِيرٌ)، مَطْبَخٌ جَمِيلٌ، ثَلَاثُ غُرَفِ نَوْمٍ وَشُرْفَتَانِ", phonetic: "Fi bayti madkhalun saghirun, mamarrun tawilun, ghurfatu julusin kabiratun, hammamani (wahidun kabirun wa akharu saghirun), matbakhun jamilun, thalathu ghurafi nawmin wa shurfatan" },
{ id: 374830, category: "Pista 20: La casa", spanish: "¿Latifa, qué hay en tu dormitorio?", arabic: "يَا لَطِيفَةُ، مَاذَا يُوجَدُ فِي غُرْفَةِ نَوْمِكِ؟", phonetic: "Ya Latifa, madha yujadu fi ghurfati nawmiki?" },
{ id: 637291, category: "Pista 20: La casa", spanish: "En mi dormitorio hay una cama y sobre ella dos cojines, un armario ropero, una mesa y sobre ella una lámpara, una silla, un espejo, una ventana con cortinas (lit.: que tiene cortinas) y una televisión", arabic: "فِي غُرْفَةِ نَوْمِي سَرِيرٌ وَعَلَيْهِ وِسَادَتَانِ، خِزَانَةُ مَلَابِسَ، طَاوِلَةٌ وَعَلَيْهَا مِصْبَاحٌ، كُرْسِيٌّ، مِرْآةٌ، شُبَّاكٌ لَهُ سَتَائِرُ وَتِلْفِزْيُون", phonetic: "Fi ghurfati nawmi sarirun wa 'alayhi wisadatani, khizanatu malabisa, tawilatun wa 'alayha misbahun, kursiyyun, mir'atun, shubbakun lahu sata'iru wa tilfizyun" },
{ id: 192841, category: "Pista 20: La casa", spanish: "¿Dónde vives Rashid?", arabic: "أَيْنَ تَسْكُنُ يَا رَشِيدُ؟", phonetic: "Ayna taskunu ya Rashid?" },
{ id: 473831, category: "Pista 20: La casa", spanish: "Vivo en un edificio antiguo, pero mi piso es muy bonito, tiene (lit.: en él hay) un balcón muy grande", arabic: "أَسْكُنُ فِي بِنَايَةٍ قَدِيمَةٍ وَلَكِنَّ شَقَّتِي جَمِيلَةٌ جِدًّا، فِيهَا شُرْفَةٌ كَبِيرَةٌ جِدًّا", phonetic: "Askunu fi binayatin qadimatin wa lakinna shaqqati jamilatun jiddan, fiha shurfatun kabiratun jiddan" },

// Pista 21: Establecimientos
{ id: 827371, category: "Pista 21: Establecimientos", spanish: "Carnicería", arabic: "مَجْزَرَة", phonetic: "Majzara" },
{ id: 293851, category: "Pista 21: Establecimientos", spanish: "Panadería", arabic: "مَخْبَزَة", phonetic: "Makhbaza" },
{ id: 728400, category: "Pista 21: Establecimientos", spanish: "Biblioteca; librería", arabic: "مَكْتَبَة", phonetic: "Maktaba" },
{ id: 182740, category: "Pista 21: Establecimientos", spanish: "Cafetería", arabic: "مَقْهًى", phonetic: "Maqha" },
{ id: 564741, category: "Pista 21: Establecimientos", spanish: "Ayuntamiento", arabic: "بَلَدِيَّة", phonetic: "Baladiyya" },
{ id: 283752, category: "Pista 21: Establecimientos", spanish: "Restaurante", arabic: "مَطْعَم", phonetic: "Mat'am" },
{ id: 918281, category: "Pista 21: Establecimientos", spanish: "Hotel", arabic: "فُنْدُق", phonetic: "Funduq" },
{ id: 374831, category: "Pista 21: Establecimientos", spanish: "Escuela", arabic: "مَدْرَسَة", phonetic: "Madrasa" },
{ id: 637292, category: "Pista 21: Establecimientos", spanish: "Banco", arabic: "بَنْك", phonetic: "Bank" },
{ id: 192842, category: "Pista 21: Establecimientos", spanish: "Hospital", arabic: "مُسْتَشْفًى", phonetic: "Mustashfa" },
{ id: 473832, category: "Pista 21: Establecimientos", spanish: "Farmacia", arabic: "صَيْدَلِيَّة", phonetic: "Saydaliyya" },
{ id: 827372, category: "Pista 21: Establecimientos", spanish: "Tienda", arabic: "دُكَّان", phonetic: "Dukkan" },
{ id: 293852, category: "Pista 21: Establecimientos", spanish: "Baño público", arabic: "حَمَّام عَامّ", phonetic: "Hammam 'amm" },
{ id: 728401, category: "Pista 21: Establecimientos", spanish: "Cine", arabic: "سِينِمَا", phonetic: "Sinima" },
{ id: 182741, category: "Pista 21: Establecimientos", spanish: "Mezquita", arabic: "مَسْجِد", phonetic: "Masjid" },
{ id: 564742, category: "Pista 21: Establecimientos", spanish: "Iglesia", arabic: "كَنِيسَة", phonetic: "Kanisa" },
{ id: 283753, category: "Pista 21: Establecimientos", spanish: "Peluquero", arabic: "حَلَّاق", phonetic: "Hallaq" },
{ id: 918282, category: "Pista 21: Establecimientos", spanish: "Peluquería", arabic: "حِلَاقَة", phonetic: "Hilaqa" },
{ id: 374832, category: "Pista 21: Establecimientos", spanish: "Tienda, establecimiento", arabic: "مَحَلّ", phonetic: "Mahall" },
{ id: 637293, category: "Pista 21: Establecimientos", spanish: "¿Samira, hay [algún] hospital cerca de tu casa?", arabic: "يَا سَمِيرَةُ، هَلْ هُنَاكَ مُسْتَشْفًى قَرِيبٌ مِنْ بَيْتِكِ؟", phonetic: "Ya Samira, hal hunaka mustashfan qaribun min baytiki?" },
{ id: 192843, category: "Pista 21: Establecimientos", spanish: "No, no hay [ningún] hospital cerca de mi casa, pero cerca de mi casa hay una farmacia", arabic: "لَا، لَيْسَ هُنَاكَ مُسْتَشْفًى قَرِيبٌ مِنْ بَيْتِي لَكِنْ هُنَاكَ صَيْدَلِيَّةٌ قَرِيبَةٌ مِنْ بَيْتِي", phonetic: "La, laysa hunaka mustashfan qaribun min bayti lakin hunaka saydaliyyatun qaribatun min bayti" },
{ id: 473833, category: "Pista 21: Establecimientos", spanish: "¿Karim, hay en tu barrio [algún] restaurante árabe?", arabic: "يَا كَرِيمُ، هَلْ فِي حَيِّكَ مَطْعَمٌ عَرَبِيٌّ؟", phonetic: "Ya Karim, hal fi hayyika mat'amun arabiyyun?" },
{ id: 827373, category: "Pista 21: Establecimientos", spanish: "No, no hay en mi barrio [ningún] restaurante árabe, pero (en él) hay un restaurante italiano", arabic: "لَا، لَيْسَ فِي حَيِّي مَطْعَمٌ عَرَبِيٌّ وَلَكِنْ فِيهِ مَطْعَمٌ إِيطَالِيٌّ", phonetic: "La, laysa fi hayyi mat'amun arabiyyun wa lakin fihi mat'amun italiyyun" },
{ id: 293853, category: "Pista 21: Establecimientos", spanish: "¿Nadia, en tu ciudad hay [algún] baño público?", arabic: "يَا نَادِيَةُ، هَلْ فِي مَدِينَتِكِ حَمَّامٌ عَامٌّ؟", phonetic: "Ya Nadia, hal fi madinatiki hammamun 'ammun?" },
{ id: 728402, category: "Pista 21: Establecimientos", spanish: "No, no hay en mi ciudad [ningún] baño público, pero (en ella) hay un cine", arabic: "لَا، لَيْسَ فِي مَدِينَتِي حَمَّامٌ عَامٌّ لَكِنْ فِيهَا سِينِمَا", phonetic: "La, laysa fi madinati hammamun 'ammun lakin fiha sinima" },

// Pista 22: Adverbios de lugar
{ id: 182742, category: "Pista 22: Adverbios de lugar", spanish: "Debajo", arabic: "تَحْتَ", phonetic: "Tahta" },
{ id: 564743, category: "Pista 22: Adverbios de lugar", spanish: "Delante", arabic: "أَمَامَ", phonetic: "Amama" },
{ id: 283754, category: "Pista 22: Adverbios de lugar", spanish: "Entre", arabic: "بَيْنَ", phonetic: "Bayna" },
{ id: 918283, category: "Pista 22: Adverbios de lugar", spanish: "Sobre", arabic: "عَلَى", phonetic: "Ala" },
{ id: 374833, category: "Pista 22: Adverbios de lugar", spanish: "Encima", arabic: "فَوْقَ", phonetic: "Fawqa" },
{ id: 637294, category: "Pista 22: Adverbios de lugar", spanish: "Detrás (khalfa)", arabic: "خَلْفَ", phonetic: "Khalfa" },
{ id: 192844, category: "Pista 22: Adverbios de lugar", spanish: "Detrás (wara')", arabic: "وَرَاءَ", phonetic: "Wara'a" },
{ id: 473834, category: "Pista 22: Adverbios de lugar", spanish: "Al lado de…", arabic: "بِجَانِبِ...", phonetic: "Bijanibi..." },
{ id: 827374, category: "Pista 22: Adverbios de lugar", spanish: "A la derecha", arabic: "عَلَى الْيَمِينِ", phonetic: "Ala al-yamin" },
{ id: 293854, category: "Pista 22: Adverbios de lugar", spanish: "A la derecha de…", arabic: "عَلَى يَمِينِ...", phonetic: "Ala yamini..." },
{ id: 728403, category: "Pista 22: Adverbios de lugar", spanish: "A la izquierda", arabic: "عَلَى الْيَسَارِ", phonetic: "Ala al-yasar" },
{ id: 182743, category: "Pista 22: Adverbios de lugar", spanish: "A la izquierda de…", arabic: "عَلَى يَسَارِ...", phonetic: "Ala yasari..." },
{ id: 564744, category: "Pista 22: Adverbios de lugar", spanish: "En el centro/medio", arabic: "فِي الْوَسَطِ", phonetic: "Fi al-wasat" },
{ id: 283755, category: "Pista 22: Adverbios de lugar", spanish: "En el centro de…", arabic: "فِي وَسَطِ...", phonetic: "Fi wasati..." },
{ id: 918284, category: "Pista 22: Adverbios de lugar", spanish: "En", arabic: "فِي", phonetic: "Fi" },
{ id: 374834, category: "Pista 22: Adverbios de lugar", spanish: "Dentro", arabic: "دَاخِلَ", phonetic: "Dakhila" },
{ id: 637295, category: "Pista 22: Adverbios de lugar", spanish: "Fuera", arabic: "خَارِجَ", phonetic: "Kharija" },
{ id: 192845, category: "Pista 22: Adverbios de lugar", spanish: "¿Nabil, dónde está la maleta?", arabic: "يَا نَبِيلُ، أَيْنَ الْحَقِيبَةُ؟", phonetic: "Ya Nabil, ayna al-haqiba?" },
{ id: 473835, category: "Pista 22: Adverbios de lugar", spanish: "Está sobre el armario", arabic: "هِيَ عَلَى الْخِزَانَةِ", phonetic: "Hiya 'ala al-khizana" },
{ id: 827375, category: "Pista 22: Adverbios de lugar", spanish: "¿Nadia, donde está el cuadro?", arabic: "يَا نَادِيَةُ، أَيْنَ الصُّورَةُ؟", phonetic: "Ya Nadia, ayna as-sura?" },
{ id: 293855, category: "Pista 22: Adverbios de lugar", spanish: "Está encima de la televisión", arabic: "هِيَ فَوْقَ التِّلْفِزْيُونِ", phonetic: "Hiya fawqa at-tilfizyun" },
{ id: 728404, category: "Pista 22: Adverbios de lugar", spanish: "¿Hasan, dónde está la mesa?", arabic: "يَا حَسَنُ، أَيْنَ الطَّاوِلَةُ؟", phonetic: "Ya Hasan, ayna at-tawila?" },
{ id: 182744, category: "Pista 22: Adverbios de lugar", spanish: "Está entre la cama y la silla", arabic: "هِيَ بَيْنَ السَّرِيرِ وَالْكُرْسِيِّ", phonetic: "Hiya bayna as-sariri wal-kursiyyi" },
{ id: 564745, category: "Pista 22: Adverbios de lugar", spanish: "¿Rashida, dónde está la puerta?", arabic: "يَا رَشِيدَةُ، أَيْنَ الْبَابُ؟", phonetic: "Ya Rashida, ayna al-bab?" },
{ id: 283756, category: "Pista 22: Adverbios de lugar", spanish: "Está a la izquierda del armario", arabic: "هُوَ عَلَى يَسَارِ الْخِزَانَةِ", phonetic: "Huwa 'ala yasari al-khizana" },
{ id: 918285, category: "Pista 22: Adverbios de lugar", spanish: "¿Rashid, dónde está la alfombra?", arabic: "يَا رَشِيدُ، أَيْنَ السَّجَّادَةُ؟", phonetic: "Ya Rashid, ayna as-sajjada?" },
{ id: 374835, category: "Pista 22: Adverbios de lugar", spanish: "Está debajo de la cama", arabic: "هِيَ تَحْتَ السَّرِيرِ", phonetic: "Hiya tahta as-sarir" },
{ id: 637296, category: "Pista 22: Adverbios de lugar", spanish: "¿Samira, dónde está la alfombra?", arabic: "يَا سَمِيرَةُ، أَيْنَ السَّجَّادَةُ؟", phonetic: "Ya Samira, ayna as-sajjada?" },
{ id: 192846, category: "Pista 22: Adverbios de lugar", spanish: "Está en medio de la habitación", arabic: "هِيَ فِي وَسَطِ الْغُرْفَةِ", phonetic: "Hiya fi wasati al-ghurfa" },
{ id: 473836, category: "Pista 22: Adverbios de lugar", spanish: "¿Latif, dónde está la lámpara?", arabic: "يَا لَطِيفُ، أَيْنَ الْمِصْبَاحُ؟", phonetic: "Ya Latif, ayna al-misbah?" },
{ id: 827376, category: "Pista 22: Adverbios de lugar", spanish: "Está sobre la mesita", arabic: "هُوَ عَلَى الْمَائِدَةِ الصَّغِيرَةِ", phonetic: "Huwa 'ala al-ma'ida as-saghira" },
{ id: 293856, category: "Pista 22: Adverbios de lugar", spanish: "¿Fátima, dónde está el sofá?", arabic: "يَا فَاطِمَةُ، أَيْنَ الصُّوفَا؟", phonetic: "Ya Fatima, ayna as-sofa?" },
{ id: 728405, category: "Pista 22: Adverbios de lugar", spanish: "Está delante de la puerta", arabic: "هُوَ أَمَامَ الْبَابِ", phonetic: "Huwa amama al-bab" },
{ id: 182745, category: "Pista 22: Adverbios de lugar", spanish: "¿Querido, sabes dónde está el periódico?", arabic: "يَا حَبِيبِي، هَلْ تَعْرِفُ أَيْنَ الْجَرِيدَةُ؟", phonetic: "Ya habibi, hal ta'rifu ayna al-jarida?" },
{ id: 564746, category: "Pista 22: Adverbios de lugar", spanish: "Sí querida, está sobre la mesa del salón", arabic: "نَعَمْ يَا حَبِيبَتِي، هِيَ عَلَى طَاوِلَةِ الصَّالُونِ", phonetic: "Na'am ya habibati, hiya 'ala tawilati as-salun" },

// Pista 23: La familia
{ id: 283757, category: "Pista 23: La familia", spanish: "Familia", arabic: "عَائِلَة", phonetic: "A'ila" },
{ id: 918286, category: "Pista 23: La familia", spanish: "Padre", arabic: "أَب", phonetic: "Ab" },
{ id: 374836, category: "Pista 23: La familia", spanish: "Madre", arabic: "أُمّ", phonetic: "Umm" },
{ id: 637297, category: "Pista 23: La familia", spanish: "Hijo", arabic: "اِبْن", phonetic: "Ibn" },
{ id: 192847, category: "Pista 23: La familia", spanish: "Hijo, niño", arabic: "وَلَد", phonetic: "Walad" },
{ id: 473837, category: "Pista 23: La familia", spanish: "Hijos", arabic: "أَبْنَاء", phonetic: "Abna'" },
{ id: 827377, category: "Pista 23: La familia", spanish: "Hijos, niños", arabic: "أَوْلَاد", phonetic: "Awlad" },
{ id: 293857, category: "Pista 23: La familia", spanish: "Hija", arabic: "اِبْنَة", phonetic: "Ibna" },
{ id: 728406, category: "Pista 23: La familia", spanish: "Hija, chica, niña", arabic: "بِنْت", phonetic: "Bint" },
{ id: 182746, category: "Pista 23: La familia", spanish: "Hijas, niñas, chicas", arabic: "بَنَات", phonetic: "Banat" },
{ id: 564747, category: "Pista 23: La familia", spanish: "Abuelo", arabic: "جَدّ", phonetic: "Jadd" },
{ id: 283758, category: "Pista 23: La familia", spanish: "Abuela", arabic: "جَدَّة", phonetic: "Jadda" },
{ id: 918287, category: "Pista 23: La familia", spanish: "Hermano", arabic: "أَخ", phonetic: "Akh" },
{ id: 374837, category: "Pista 23: La familia", spanish: "Hermanos", arabic: "إِخْوَة", phonetic: "Ikhwa" },
{ id: 637298, category: "Pista 23: La familia", spanish: "Hermana", arabic: "أُخْت", phonetic: "Ukht" },
{ id: 192848, category: "Pista 23: La familia", spanish: "Hermanas", arabic: "أَخَوَات", phonetic: "Akhawat" },
{ id: 473838, category: "Pista 23: La familia", spanish: "Esposo", arabic: "زَوْج", phonetic: "Zawj" },
{ id: 827378, category: "Pista 23: La familia", spanish: "Esposa", arabic: "زَوْجَة", phonetic: "Zawja" },
{ id: 293858, category: "Pista 23: La familia", spanish: "Nieto", arabic: "حَفِيد", phonetic: "Hafid" },
{ id: 728407, category: "Pista 23: La familia", spanish: "Nieta", arabic: "حَفِيدَة", phonetic: "Hafida" },
{ id: 182747, category: "Pista 23: La familia", spanish: "Tío (paterno)", arabic: "عَمّ", phonetic: "Amm" },
{ id: 564748, category: "Pista 23: La familia", spanish: "Tíos (paternos)", arabic: "أَعْمَام", phonetic: "A'mam" },
{ id: 283760, category: "Pista 23: La familia", spanish: "Tía (paterna)", arabic: "عَمَّة", phonetic: "Amma" },
{ id: 918290, category: "Pista 23: La familia", spanish: "Tías (paternas)", arabic: "عَمَّات", phonetic: "Ammat" },
{ id: 374840, category: "Pista 23: La familia", spanish: "Tío (materno)", arabic: "خَال", phonetic: "Khal" },
{ id: 637300, category: "Pista 23: La familia", spanish: "Tíos (maternos)", arabic: "أَخْوَال", phonetic: "Akhwal" },
{ id: 192850, category: "Pista 23: La familia", spanish: "Tía (materna)", arabic: "خَالَة", phonetic: "Khala" },
{ id: 473840, category: "Pista 23: La familia", spanish: "Tías (maternas)", arabic: "خَالَات", phonetic: "Khalat" },
{ id: 827380, category: "Pista 23: La familia", spanish: "¿Cómo se llama tu padre?", arabic: "أَبُوكَ، مَا اسْمُهُ؟", phonetic: "Abuka, ma ismuhu?" },
{ id: 293860, category: "Pista 23: La familia", spanish: "Mi padre se llama Rashid", arabic: "أَبِي اسْمُهُ رَشِيد", phonetic: "Abi ismuhu Rashid" },
{ id: 728410, category: "Pista 23: La familia", spanish: "¿Cómo se llama tu madre?", arabic: "أُمُّكَ، مَا اسْمُهَا؟", phonetic: "Ummuka, ma ismuha?" },
{ id: 182750, category: "Pista 23: La familia", spanish: "Mi madre se llama Bushra", arabic: "أُمِّي اسْمُهَا بُشْرَى", phonetic: "Ummi ismuha Bushra" },

// Pista 24: Negación con ليس
{ id: 564750, category: "Pista 24: Negación con ليس", spanish: "¿Rashid es el padre de Mustafa?", arabic: "هَلْ رَشِيدٌ أَبُو مُصْطَفَى؟", phonetic: "Hal Rashid abu Mustafa?" },
{ id: 283761, category: "Pista 24: Negación con ليس", spanish: "No, no es su padre, es su hijo", arabic: "لَا، هُوَ لَيْسَ أَبَاهُ، هُوَ ابْنُهُ", phonetic: "La, huwa laysa abahu, huwa ibnuhu" },
{ id: 918291, category: "Pista 24: Negación con ليس", spanish: "¿Bushra es la hermana de Latifa?", arabic: "هَلْ بُشْرَى أُخْتُ لَطِيفَة؟", phonetic: "Hal Bushra ukhtu Latifa?" },
{ id: 374841, category: "Pista 24: Negación con ليس", spanish: "No, no es su hermana, es su madre", arabic: "لَا، هِيَ لَيْسَتْ أُخْتَهَا، هِيَ أُمُّهَا", phonetic: "La, hiya laysat ukhtaha, hiya ummuha" },
{ id: 637301, category: "Pista 24: Negación con ليس", spanish: "¿Hasan es el hermano de Rashid?", arabic: "هَلْ حَسَنٌ أَخُو رَشِيد؟", phonetic: "Hal Hasan akhu Rashid?" },
{ id: 192851, category: "Pista 24: Negación con ليس", spanish: "No, no es su hermano, es su hijo", arabic: "لَا، هُوَ لَيْسَ أَخَاهُ، هُوَ ابْنُهُ", phonetic: "La, huwa laysa akhahu, huwa ibnuhu" },
{ id: 473841, category: "Pista 24: Negación con ليس", spanish: "¿Yamila es la madre de Said?", arabic: "هَلْ جَمِيلَةُ أُمُّ سَعِيد؟", phonetic: "Hal Jamila ummu Said?" },
{ id: 827381, category: "Pista 24: Negación con ليس", spanish: "No, no es su madre, es su abuela", arabic: "لَا، هِيَ لَيْسَتْ أُمَّهُ، هِيَ جَدَّتُهُ", phonetic: "La, hiya laysat ummahu, hiya jaddatuhu" },
{ id: 293861, category: "Pista 24: Negación con ليس", spanish: "¿Said es el hijo de Yamila?", arabic: "هَلْ سَعِيدٌ ابْنُ جَمِيلَة؟", phonetic: "Hal Said ibnu Jamila?" },
{ id: 728411, category: "Pista 24: Negación con ليس", spanish: "No, no es su hijo, es su nieto", arabic: "لَا، هُوَ لَيْسَ ابْنَهَا، هُوَ حَفِيدُهَا", phonetic: "La, huwa laysa ibnaha, huwa hafiduhua" },
{ id: 182751, category: "Pista 24: Negación con ليس", spanish: "¿Latifa es la hija de Mustafa?", arabic: "هَلْ لَطِيفَةُ ابْنَةُ مُصْطَفَى؟", phonetic: "Hal Latifa ibnat Mustafa?" },
{ id: 564751, category: "Pista 24: Negación con ليس", spanish: "No, no es su hija, es su nieta", arabic: "لَا، هِيَ لَيْسَتْ ابْنَتَهُ، هِيَ حَفِيدَتُهُ", phonetic: "La, hiya laysat ibnatahu, hiya hafidatuhu" },

// Pista 25: Las decenas
{ id: 283762, category: "Pista 25: Las decenas", spanish: "Once", arabic: "أَحَدَ عَشَرَ", phonetic: "Ahada 'ashara" },
{ id: 918292, category: "Pista 25: Las decenas", spanish: "Doce", arabic: "اِثْنَا عَشَرَ", phonetic: "Ithna 'ashara" },
{ id: 374842, category: "Pista 25: Las decenas", spanish: "Trece", arabic: "ثَلَاثَةَ عَشَرَ", phonetic: "Thalathata 'ashara" },
{ id: 637302, category: "Pista 25: Las decenas", spanish: "Catorce", arabic: "أَرْبَعَةَ عَشَرَ", phonetic: "Arba'ata 'ashara" },
{ id: 192852, category: "Pista 25: Las decenas", spanish: "Quince", arabic: "خَمْسَةَ عَشَرَ", phonetic: "Khamsata 'ashara" },
{ id: 473842, category: "Pista 25: Las decenas", spanish: "Dieciséis", arabic: "سِتَّةَ عَشَرَ", phonetic: "Sittata 'ashara" },
{ id: 827382, category: "Pista 25: Las decenas", spanish: "Diecisiete", arabic: "سَبْعَةَ عَشَرَ", phonetic: "Sab'ata 'ashara" },
{ id: 293862, category: "Pista 25: Las decenas", spanish: "Dieciocho", arabic: "ثَمَانِيَةَ عَشَرَ", phonetic: "Thamaniyata 'ashara" },
{ id: 728412, category: "Pista 25: Las decenas", spanish: "Diecinueve", arabic: "تِسْعَةَ عَشَرَ", phonetic: "Tis'ata 'ashara" },
{ id: 182752, category: "Pista 25: Las decenas", spanish: "Veinte", arabic: "عِشْرُونَ", phonetic: "'Ishrun" },
{ id: 564752, category: "Pista 25: Las decenas", spanish: "Treinta", arabic: "ثَلَاثُونَ", phonetic: "Thalathun" },
{ id: 283763, category: "Pista 25: Las decenas", spanish: "Cuarenta", arabic: "أَرْبَعُونَ", phonetic: "Arba'un" },
{ id: 918293, category: "Pista 25: Las decenas", spanish: "Cincuenta", arabic: "خَمْسُونَ", phonetic: "Khamsun" },
{ id: 374843, category: "Pista 25: Las decenas", spanish: "Sesenta", arabic: "سِتُّونَ", phonetic: "Sittun" },
{ id: 637303, category: "Pista 25: Las decenas", spanish: "Setenta", arabic: "سَبْعُونَ", phonetic: "Sab'un" },
{ id: 192853, category: "Pista 25: Las decenas", spanish: "Ochenta", arabic: "ثَمَانُونَ", phonetic: "Thamanun" },
{ id: 473843, category: "Pista 25: Las decenas", spanish: "Noventa", arabic: "تِسْعُونَ", phonetic: "Tis'un" },
{ id: 827383, category: "Pista 25: Las decenas", spanish: "Veintiuno", arabic: "وَاحِدٌ وَعِشْرُونَ", phonetic: "Wahidun wa 'ishrun" },
{ id: 293863, category: "Pista 25: Las decenas", spanish: "Treinta y dos", arabic: "اِثْنَانِ وَثَلَاثُونَ", phonetic: "Ithnani wa thalathun" },
{ id: 728413, category: "Pista 25: Las decenas", spanish: "Cuarenta y tres", arabic: "ثَلَاثَةٌ وَأَرْبَعُونَ", phonetic: "Thalathatun wa arba'un" },
{ id: 182753, category: "Pista 25: Las decenas", spanish: "Cincuenta y cuatro", arabic: "أَرْبَعَةٌ وَخَمْسُونَ", phonetic: "Arba'atun wa khamsun" },

// Pista 26: La edad
{ id: 564753, category: "Pista 26: La edad", spanish: "¿Qué edad tienes Rashid?", arabic: "كَمْ عُمْرُكَ يَا رَشِيدُ؟", phonetic: "Kam 'umruka ya Rashid?" },
{ id: 283764, category: "Pista 26: La edad", spanish: "Tengo (mi edad es) 43 años", arabic: "عُمْرِي ثَلَاثَةٌ وَأَرْبَعُونَ سَنَةً", phonetic: "'Umri thalathatun wa arba'un sanatan" },
{ id: 918294, category: "Pista 26: La edad", spanish: "¿Qué edad tienes Latifa?", arabic: "كَمْ عُمْرُكِ يَا لَطِيفَةُ؟", phonetic: "Kam 'umruki ya Latifa?" },
{ id: 374844, category: "Pista 26: La edad", spanish: "Tengo (mi edad es) 5 años", arabic: "عُمْرِي خَمْسُ سَنَوَاتٍ", phonetic: "'Umri khamsu sanawatin" },
{ id: 637304, category: "Pista 26: La edad", spanish: "¿Qué edad tiene Yamal?", arabic: "جَمَال، كَمْ عُمْرُهُ؟", phonetic: "Jamal, kam 'umruhu?" },
{ id: 192854, category: "Pista 26: La edad", spanish: "Tiene (su edad es) dos años", arabic: "عُمْرُهُ سَنَتَانِ", phonetic: "'Umruhu sanatani" },
{ id: 473844, category: "Pista 26: La edad", spanish: "¿Qué edad tiene Nadia?", arabic: "نَادِيَة، كَمْ عُمْرُهَا؟", phonetic: "Nadia, kam 'umruha?" },
{ id: 827384, category: "Pista 26: La edad", spanish: "Tiene (su edad es) un año", arabic: "عُمْرُهَا سَنَةٌ", phonetic: "'Umruha sanatun" },
{ id: 293864, category: "Pista 26: La edad", spanish: "¿Qué edad tienes Said?", arabic: "كَمْ عُمْرُكَ يَا سَعِيدُ؟", phonetic: "Kam 'umruka ya Said?" },
{ id: 728414, category: "Pista 26: La edad", spanish: "Tengo (mi edad es) 15 años", arabic: "عُمْرِي خَمْسَةَ عَشَرَ سَنَةً", phonetic: "'Umri khamsata 'ashara sanatan" },

// Pista 27: Tener, con ل
{ id: 182754, category: "Pista 27: Tener, con ل", spanish: "Tengo (para mí hay)", arabic: "لِي", phonetic: "Li" },
{ id: 564754, category: "Pista 27: Tener, con ل", spanish: "Tienes (masc.)", arabic: "لَكَ", phonetic: "Laka" },
{ id: 283765, category: "Pista 27: Tener, con ل", spanish: "Tienes (fem.)", arabic: "لَكِ", phonetic: "Laki" },
{ id: 918295, category: "Pista 27: Tener, con ل", spanish: "Tiene (él)", arabic: "لَهُ", phonetic: "Lahu" },
{ id: 374845, category: "Pista 27: Tener, con ل", spanish: "Tiene (ella)", arabic: "لَهَا", phonetic: "Laha" },
{ id: 637305, category: "Pista 27: Tener, con ل", spanish: "Tenemos", arabic: "لَنَا", phonetic: "Lana" },
{ id: 192855, category: "Pista 27: Tener, con ل", spanish: "Tenéis (vosotros)", arabic: "لَكُمْ", phonetic: "Lakum" },
{ id: 473845, category: "Pista 27: Tener, con ل", spanish: "Tenéis (vosotras)", arabic: "لَكُنَّ", phonetic: "Lakunna" },
{ id: 827385, category: "Pista 27: Tener, con ل", spanish: "Tienen (ellos)", arabic: "لَهُمْ", phonetic: "Lahum" },
{ id: 293865, category: "Pista 27: Tener, con ل", spanish: "Tienen (ellas)", arabic: "لَهُنَّ", phonetic: "Lahunna" },
{ id: 728415, category: "Pista 27: Tener, con ل", spanish: "Tenéis (vosotros/as dos)", arabic: "لَكُمَا", phonetic: "Lakuma" },
{ id: 182755, category: "Pista 27: Tener, con ل", spanish: "Tienen (ellos/as dos)", arabic: "لَهُمَا", phonetic: "Lahuma" },
{ id: 564755, category: "Pista 27: Tener, con ل", spanish: "¿Tienes coche, Marwan?", arabic: "هَلْ لَكَ سَيَّارَةٌ يَا مَرْوَانُ؟", phonetic: "Hal laka sayyaratun ya Marwan?" },
{ id: 283766, category: "Pista 27: Tener, con ل", spanish: "Sí, tengo coche", arabic: "نَعَمْ، لِي سَيَّارَةٌ", phonetic: "Na'am, li sayyaratun" },
{ id: 918296, category: "Pista 27: Tener, con ل", spanish: "No, no tengo coche", arabic: "لَا، لَيْسَ لِي سَيَّارَةٌ", phonetic: "La, laysa li sayyaratun" },
{ id: 374846, category: "Pista 27: Tener, con ل", spanish: "¿Tienes hijos, Samira?", arabic: "هَلْ لَكِ أَوْلَادٌ يَا سَمِيرَةُ؟", phonetic: "Hal laki awladun ya Samira?" },
{ id: 637306, category: "Pista 27: Tener, con ل", spanish: "Sí, tengo dos hijos y tres hijas", arabic: "نَعَمْ، لِي وَلَدَانِ وَثَلَاثُ بَنَاتٍ", phonetic: "Na'am, li waladani wa thalathu banatin" },
{ id: 192856, category: "Pista 27: Tener, con ل", spanish: "¿Tienes hermanos, Nabil?", arabic: "هَلْ لَكَ إِخْوَةٌ يَا نَبِيلُ؟", phonetic: "Hal laka ikhwatun ya Nabil?" },
{ id: 473846, category: "Pista 27: Tener, con ل", spanish: "Sí, tengo tres hermanas y dos hermanos", arabic: "نَعَمْ، لِي ثَلَاثُ أَخَوَاتٍ وَأَخَوَانِ", phonetic: "Na'am, li thalathu akhawatin wa akhawani" },
{ id: 827386, category: "Pista 27: Tener, con ل", spanish: "¿Tienes novia, Marwan?", arabic: "هَلْ لَكَ خَطِيبَةٌ يَا مَرْوَانُ؟", phonetic: "Hal laka khatibatun ya Marwan?" },
{ id: 293866, category: "Pista 27: Tener, con ل", spanish: "No, no tengo novia", arabic: "لَا، لَيْسَ لِي خَطِيبَةٌ", phonetic: "La, laysa li khatibatun" },
{ id: 728416, category: "Pista 27: Tener, con ل", spanish: "Éste es mi libro", arabic: "هَذَا كِتَابِي", phonetic: "Hadha kitabi" },
{ id: 182756, category: "Pista 27: Tener, con ل", spanish: "Este libro es mío", arabic: "هَذَا الْكِتَابُ لِي", phonetic: "Hadha al-kitabu li" },
{ id: 564756, category: "Pista 27: Tener, con ل", spanish: "Éste es mi amigo", arabic: "هَذَا صَدِيقِي", phonetic: "Hadha sadiqi" },
{ id: 283767, category: "Pista 27: Tener, con ل", spanish: "Éste es un amigo mío", arabic: "هَذَا صَدِيقٌ لِي", phonetic: "Hadha sadiqun li" },
{ id: 918297, category: "Pista 27: Tener, con ل", spanish: "Tengo un amigo", arabic: "لِي صَدِيقٌ", phonetic: "Li sadiqun" },

// Pista 28: Tener, con عن د
{ id: 374847, category: "Pista 28: Tener, con عن د", spanish: "Tengo (para mí hay)", arabic: "عِنْدِي", phonetic: "'Indi" },
{ id: 637307, category: "Pista 28: Tener, con عن د", spanish: "Tienes (masc.)", arabic: "عِنْدَكَ", phonetic: "'Indaka" },
{ id: 192857, category: "Pista 28: Tener, con عن د", spanish: "Tienes (fem.)", arabic: "عِنْدَكِ", phonetic: "'Indaki" },
{ id: 473847, category: "Pista 28: Tener, con عن د", spanish: "Tiene (él)", arabic: "عِنْدَهُ", phonetic: "'Indahu" },
{ id: 827387, category: "Pista 28: Tener, con عن د", spanish: "Tiene (ella)", arabic: "عِنْدَهَا", phonetic: "'Indaha" },
{ id: 293867, category: "Pista 28: Tener, con عن د", spanish: "Tenemos", arabic: "عِنْدَنَا", phonetic: "'Indana" },
{ id: 728417, category: "Pista 28: Tener, con عن د", spanish: "Tenéis (vosotros)", arabic: "عِنْدَكُمْ", phonetic: "'Indakum" },
{ id: 182757, category: "Pista 28: Tener, con عن د", spanish: "Tenéis (vosotras)", arabic: "عِنْدَكُنَّ", phonetic: "'Indakunnah" },
{ id: 564757, category: "Pista 28: Tener, con عن د", spanish: "Tienen (ellos)", arabic: "عِنْدَهُمْ", phonetic: "'Indahum" },
{ id: 283768, category: "Pista 28: Tener, con عن د", spanish: "Tienen (ellas)", arabic: "عِنْدَهُنَّ", phonetic: "'Indahunna" },
{ id: 918298, category: "Pista 28: Tener, con عن د", spanish: "Tenéis (vosotros/as dos)", arabic: "عِنْدَكُمَا", phonetic: "'Indakuma" },
{ id: 374848, category: "Pista 28: Tener, con عن د", spanish: "Tienen (ellos/as dos)", arabic: "عِنْدَهُمَا", phonetic: "'Indahuma" },
{ id: 637308, category: "Pista 28: Tener, con عن د", spanish: "¿Tienes casa, Nabil?", arabic: "هَلْ عِنْدَكَ بَيْتٌ يَا نَبِيلُ؟", phonetic: "Hal 'indaka baytun ya Nabil?" },
{ id: 192858, category: "Pista 28: Tener, con عن د", spanish: "Sí, tengo casa", arabic: "نَعَمْ، عِنْدِي بَيْتٌ", phonetic: "Na'am, 'indi baytun" },
{ id: 473848, category: "Pista 28: Tener, con عن د", spanish: "¿Tienes casa, Latifa?", arabic: "هَلْ عِنْدَكِ بَيْتٌ، يَا لَطِيفَةُ؟", phonetic: "Hal 'indaki baytun ya Latifa?" },
{ id: 827388, category: "Pista 28: Tener, con عن د", spanish: "No, no tengo casa", arabic: "لَا، لَيْسَ عِنْدِي بَيْتٌ", phonetic: "La, laysa 'indi baytun" },
{ id: 293868, category: "Pista 28: Tener, con عن د", spanish: "¿Tiene novia Yamal?", arabic: "هَلْ جَمَال عِنْدَهُ خَطِيبَةٌ؟", phonetic: "Hal Jamal 'indahu khatibatun?" },
{ id: 728418, category: "Pista 28: Tener, con عن د", spanish: "No, no tiene novia", arabic: "لَا، لَيْسَ عِنْدَهُ خَطِيبَةٌ", phonetic: "La, laysa 'indahu khatibatun" },

// Pista 29: El trabajo, las profesiones
{ id: 182758, category: "Pista 29: El trabajo, las profesiones", spanish: "Estudiante", arabic: "طَالِب", phonetic: "Talib" },
{ id: 564758, category: "Pista 29: El trabajo, las profesiones", spanish: "Portero", arabic: "بَوَّاب", phonetic: "Bawwab" },
{ id: 283769, category: "Pista 29: El trabajo, las profesiones", spanish: "Azafata", arabic: "مُضِيفَة", phonetic: "Mudifa" },
{ id: 918299, category: "Pista 29: El trabajo, las profesiones", spanish: "Empleada, funcionaria", arabic: "مُوَظَّفَة", phonetic: "Muwazzafa" },
{ id: 374849, category: "Pista 29: El trabajo, las profesiones", spanish: "Hombre de negocios", arabic: "رَجُل أَعْمَال", phonetic: "Rajul a'mal" },
{ id: 637309, category: "Pista 29: El trabajo, las profesiones", spanish: "Ingeniero", arabic: "مُهَنْدِس", phonetic: "Muhandis" },
{ id: 192859, category: "Pista 29: El trabajo, las profesiones", spanish: "Médico", arabic: "طَبِيب", phonetic: "Tabib" },
{ id: 473849, category: "Pista 29: El trabajo, las profesiones", spanish: "Enfermero", arabic: "مُمَرِّض", phonetic: "Mumarrid" },
{ id: 827389, category: "Pista 29: El trabajo, las profesiones", spanish: "Policía (agente)", arabic: "شُرْطِيّ", phonetic: "Shurtiyy" },
{ id: 293869, category: "Pista 29: El trabajo, las profesiones", spanish: "Ama de casa", arabic: "رَبَّة بَيْت", phonetic: "Rabbat bayt" },
{ id: 728419, category: "Pista 29: El trabajo, las profesiones", spanish: "Electricista", arabic: "كَهْرَبَائِيّ", phonetic: "Kahraba'iyy" },
{ id: 182759, category: "Pista 29: El trabajo, las profesiones", spanish: "Camarero", arabic: "نَادِل", phonetic: "Nadil" },
{ id: 564759, category: "Pista 29: El trabajo, las profesiones", spanish: "Cocinero", arabic: "طَبَّاخ", phonetic: "Tabbakh" },
{ id: 283770, category: "Pista 29: El trabajo, las profesiones", spanish: "Director", arabic: "مُدِير", phonetic: "Mudir" },
{ id: 918300, category: "Pista 29: El trabajo, las profesiones", spanish: "Secretaria", arabic: "سِكْرِتِيرَة", phonetic: "Sikritira" },
{ id: 374850, category: "Pista 29: El trabajo, las profesiones", spanish: "Maestro, profesor", arabic: "مُدَرِّس", phonetic: "Mudarris" },
{ id: 637310, category: "Pista 29: El trabajo, las profesiones", spanish: "Profesor", arabic: "أُسْتَاذ", phonetic: "Ustadh" },
{ id: 192860, category: "Pista 29: El trabajo, las profesiones", spanish: "Abogada", arabic: "مُحَامِيَة", phonetic: "Muhamiya" },
{ id: 473850, category: "Pista 29: El trabajo, las profesiones", spanish: "Traductora", arabic: "مُتَرْجِمَة", phonetic: "Mutarjima" },
{ id: 827390, category: "Pista 29: El trabajo, las profesiones", spanish: "Piloto", arabic: "طَيَّار", phonetic: "Tayyar" },
{ id: 293870, category: "Pista 29: El trabajo, las profesiones", spanish: "Carnicero", arabic: "جَزَّار", phonetic: "Jazzar" },
{ id: 728420, category: "Pista 29: El trabajo, las profesiones", spanish: "Panadero", arabic: "خَبَّاز", phonetic: "Khabbaz" },
{ id: 182760, category: "Pista 29: El trabajo, las profesiones", spanish: "Albañil", arabic: "بَنَّاء", phonetic: "Banna'" },
{ id: 564760, category: "Pista 29: El trabajo, las profesiones", spanish: "Campesino", arabic: "فَلَّاح", phonetic: "Fallah" },
{ id: 283771, category: "Pista 29: El trabajo, las profesiones", spanish: "Carpintero", arabic: "نَجَّار", phonetic: "Najjar" },
{ id: 918301, category: "Pista 29: El trabajo, las profesiones", spanish: "Vendedor", arabic: "بَائِع", phonetic: "Ba'i'" },
{ id: 374851, category: "Pista 29: El trabajo, las profesiones", spanish: "Peluquero", arabic: "حَلَّاق", phonetic: "Hallaq" },
{ id: 637311, category: "Pista 29: El trabajo, las profesiones", spanish: "Oficina", arabic: "مَكْتَب", phonetic: "Maktab" },
{ id: 192861, category: "Pista 29: El trabajo, las profesiones", spanish: "Empresa, compañía", arabic: "شَرِكَة", phonetic: "Sharika" },
{ id: 473851, category: "Pista 29: El trabajo, las profesiones", spanish: "Aeropuerto", arabic: "مَطَار", phonetic: "Matar" },
{ id: 827391, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo (amal)", arabic: "عَمَل", phonetic: "Amal" },
{ id: 293871, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo (shughl)", arabic: "شُغْل", phonetic: "Shughl" },
{ id: 728421, category: "Pista 29: El trabajo, las profesiones", spanish: "Profesión", arabic: "مِهْنَة", phonetic: "Mihna" },
{ id: 182761, category: "Pista 29: El trabajo, las profesiones", spanish: "¿De qué trabajas, Marwán?", arabic: "مَاذَا تَعْمَلُ يَا مَرْوَانُ؟", phonetic: "Madha ta'malu ya Marwan?" },
{ id: 564761, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo de ingeniero", arabic: "أَنَا أَعْمَلُ مُهَنْدِسًا", phonetic: "Ana a'malu muhandisan" },
{ id: 283772, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Cuál es tu profesión, Samira?", arabic: "مَا مِهْنَتُكِ يَا سَمِيرَةُ؟", phonetic: "Ma mihnatuki ya Samira?" },
{ id: 918302, category: "Pista 29: El trabajo, las profesiones", spanish: "Soy traductora", arabic: "أَنَا مُتَرْجِمَةٌ", phonetic: "Ana mutarjima" },
{ id: 374852, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Con quién trabajas, Latif?", arabic: "مَعَ مَنْ تَعْمَلُ يَا لَطِيفُ؟", phonetic: "Ma'a man ta'malu ya Latif?" },
{ id: 637312, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo con mi hermano", arabic: "أَعْمَلُ مَعَ أَخِي", phonetic: "A'malu ma'a akhi" },
{ id: 192862, category: "Pista 29: El trabajo, las profesiones", spanish: "¿De qué trabajas, Nabil?", arabic: "مَاذَا تَشْتَغِلُ يَا نَبِيلُ؟", phonetic: "Madha tashtaghilu ya Nabil?" },
{ id: 473852, category: "Pista 29: El trabajo, las profesiones", spanish: "No trabajo, estoy parado", arabic: "أَنَا لَا أَشْتَغِلُ، أَنَا عَاطِلٌ عَنِ الْعَمَلِ", phonetic: "Ana la ashtaghilu, ana 'atilun 'ani al-'amal" },
{ id: 827392, category: "Pista 29: El trabajo, las profesiones", spanish: "¿En qué sitio trabajas, Rashida?", arabic: "فِي أَيِّ مَكَانٍ تَعْمَلِينَ يَا رَشِيدَةُ؟", phonetic: "Fi ayyi makanin ta'malina ya Rashida?" },
{ id: 293872, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo en una empresa francesa", arabic: "أَعْمَلُ فِي شَرِكَةٍ فَرَنْسِيَّةٍ", phonetic: "A'malu fi sharikatin faransiyyatin" },
{ id: 728422, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Qué haces esta tarde?", arabic: "مَاذَا تَفْعَلُ هَذَا الْمَسَاءَ؟", phonetic: "Madha taf'alu hadha al-masa'a?" },
{ id: 182762, category: "Pista 29: El trabajo, las profesiones", spanish: "Esta tarde no hago nada", arabic: "هَذَا الْمَسَاءَ لَا أَفْعَلُ شَيْئًا", phonetic: "Hadha al-masa'a la af'alu shay'an" },
{ id: 564762, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Tienes experiencia en la enseñanza, Samira?", arabic: "هَلْ عِنْدَكِ خِبْرَةٌ فِي التَّدْرِيسِ يَا سَمِيرَةُ؟", phonetic: "Hal 'indaki khibratun fi at-tadrisi ya Samira?" },
{ id: 283773, category: "Pista 29: El trabajo, las profesiones", spanish: "Lo siento, no tengo experiencia en la enseñanza", arabic: "أَنَا آسِفَةٌ، لَيْسَ عِنْدِي خِبْرَةٌ فِي التَّدْرِيسِ", phonetic: "Ana asifatun, laysa 'indi khibratun fi at-tadrisi" },
{ id: 918303, category: "Pista 29: El trabajo, las profesiones", spanish: "Entonces, no eres la persona apropiada para este trabajo", arabic: "إِذًا، لَسْتِ أَنْتِ الشَّخْصَ الْمُنَاسِبَ لِهَذَا الْعَمَلِ", phonetic: "Idhan, lasti anti ash-shakhsa al-munasiba lihadha al-'amal" },
{ id: 374853, category: "Pista 29: El trabajo, las profesiones", spanish: "Uzmán vende carne, es carnicero", arabic: "عُثْمَان يَبِيعُ اللَّحْمَ، هُوَ جَزَّارٌ", phonetic: "Uthman yabi'u al-lahma, huwa jazzarun" },
{ id: 637313, category: "Pista 29: El trabajo, las profesiones", spanish: "Samih hace pan, es panadero", arabic: "سَامِح يَصْنَعُ الْخُبْزَ، هُوَ خَبَّازٌ", phonetic: "Samih yasna'u al-khubza, huwa khabbazun" },
{ id: 192863, category: "Pista 29: El trabajo, las profesiones", spanish: "El director no está", arabic: "الْمُدِيرُ غَيْرُ مَوْجُودٍ", phonetic: "Al-mudiru ghayru mawjudin" },
{ id: 473853, category: "Pista 29: El trabajo, las profesiones", spanish: "La compañía no tiene oficina en París", arabic: "الشَّرِكَةُ لَيْسَ لَهَا مَكْتَبٌ فِي بَارِيس", phonetic: "Ash-sharikatu laysa laha maktabun fi Baris" },
{ id: 827393, category: "Pista 29: El trabajo, las profesiones", spanish: "No tiene experiencia en la profesión exigida", arabic: "لَيْسَ عِنْدَهَا خِبْرَةٌ فِي الْمِهْنَةِ الْمَطْلُوبَةِ", phonetic: "Laysa 'indaha khibratun fi al-mihnati al-matlubati" },
{ id: 293873, category: "Pista 29: El trabajo, las profesiones", spanish: "Tengo una entrevista de trabajo", arabic: "عِنْدِي مُقَابَلَةُ عَمَلٍ", phonetic: "'Indi muqabalatu 'amalin" },
{ id: 728423, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajamos juntos en la misma empresa", arabic: "نَعْمَلُ مَعًا فِي نَفْسِ الشَّرِكَةِ", phonetic: "Na'malu ma'an fi nafsi ash-sharikati" },
{ id: 182763, category: "Pista 29: El trabajo, las profesiones", spanish: "Un momento por favor", arabic: "لَحْظَةً مِنْ فَضْلِكَ", phonetic: "Lahzatan min fadlika" },

// Pista 30: Los colores
{ id: 564763, category: "Pista 30: Los colores", spanish: "Negro", arabic: "أَسْوَد", phonetic: "Aswad" },
{ id: 283774, category: "Pista 30: Los colores", spanish: "Negra", arabic: "سَوْدَاء", phonetic: "Sawda'" },
{ id: 918304, category: "Pista 30: Los colores", spanish: "Blanco", arabic: "أَبْيَض", phonetic: "Abyad" },
{ id: 374854, category: "Pista 30: Los colores", spanish: "Blanca", arabic: "بَيْضَاء", phonetic: "Bayda'" },
{ id: 637314, category: "Pista 30: Los colores", spanish: "Rojo", arabic: "أَحْمَر", phonetic: "Ahmar" },
{ id: 192864, category: "Pista 30: Los colores", spanish: "Roja", arabic: "حَمْرَاء", phonetic: "Hamra'" },
{ id: 473854, category: "Pista 30: Los colores", spanish: "Azul", arabic: "أَزْرَق", phonetic: "Azraq" },
{ id: 827394, category: "Pista 30: Los colores", spanish: "Azul (fem.)", arabic: "زَرْقَاء", phonetic: "Zarqa'" },
{ id: 293874, category: "Pista 30: Los colores", spanish: "Azul claro", arabic: "أَزْرَق فَاتِح", phonetic: "Azraq fatih" },
{ id: 728424, category: "Pista 30: Los colores", spanish: "Azul oscuro", arabic: "أَزْرَق دَاكِن", phonetic: "Azraq dakin" },
{ id: 182764, category: "Pista 30: Los colores", spanish: "Azul marino", arabic: "أَزْرَق بَحْرِيّ", phonetic: "Azraq bahriyy" },
{ id: 564764, category: "Pista 30: Los colores", spanish: "Verde", arabic: "أَخْضَر", phonetic: "Akhdar" },
{ id: 283775, category: "Pista 30: Los colores", spanish: "Verde (fem.)", arabic: "خَضْرَاء", phonetic: "Khadra'" },
{ id: 918305, category: "Pista 30: Los colores", spanish: "Amarillo", arabic: "أَصْفَر", phonetic: "Asfar" },
{ id: 374855, category: "Pista 30: Los colores", spanish: "Amarilla", arabic: "صَفْرَاء", phonetic: "Safra'" },
{ id: 637315, category: "Pista 30: Los colores", spanish: "Moreno", arabic: "أَسْمَر", phonetic: "Asmar" },
{ id: 192865, category: "Pista 30: Los colores", spanish: "Morena", arabic: "سَمْرَاء", phonetic: "Samra'" },
{ id: 473855, category: "Pista 30: Los colores", spanish: "Rubio", arabic: "أَشْقَر", phonetic: "Ashqar" },
{ id: 827395, category: "Pista 30: Los colores", spanish: "Rubia", arabic: "شَقْرَاء", phonetic: "Shaqra'" },
{ id: 293875, category: "Pista 30: Los colores", spanish: "Rosa", arabic: "وَرْدِيّ", phonetic: "Wardiyy" },
{ id: 728425, category: "Pista 30: Los colores", spanish: "Rosa (fem.)", arabic: "وَرْدِيَّة", phonetic: "Wardiyya" },
{ id: 182765, category: "Pista 30: Los colores", spanish: "Naranja", arabic: "بُرْتُقَالِيّ", phonetic: "Burtuqaliyy" },
{ id: 564765, category: "Pista 30: Los colores", spanish: "Naranja (fem.)", arabic: "بُرْتُقَالِيَّة", phonetic: "Burtuqaliyya" },
{ id: 283776, category: "Pista 30: Los colores", spanish: "Gris", arabic: "رَمَادِيّ", phonetic: "Ramadiyy" },
{ id: 918306, category: "Pista 30: Los colores", spanish: "Gris (fem.)", arabic: "رَمَادِيَّة", phonetic: "Ramadiyya" },
{ id: 374856, category: "Pista 30: Los colores", spanish: "Violeta", arabic: "بَنَفْسَجِيّ", phonetic: "Banafajiyy" },
{ id: 637316, category: "Pista 30: Los colores", spanish: "Violeta (fem.)", arabic: "بَنَفْسَجِيَّة", phonetic: "Banafajiyya" },
{ id: 192866, category: "Pista 30: Los colores", spanish: "Marrón", arabic: "بُنِّيّ", phonetic: "Bunniyy" },
{ id: 473856, category: "Pista 30: Los colores", spanish: "Marrón (fem.)", arabic: "بُنِّيَّة", phonetic: "Bunniyya" },
{ id: 827396, category: "Pista 30: Los colores", spanish: "El color del limón es amarillo", arabic: "لَوْنُ اللَّيْمُونِ أَصْفَرُ", phonetic: "Lawnu al-laymuni asfar" },
{ id: 293876, category: "Pista 30: Los colores", spanish: "El color de la aceituna es verde", arabic: "لَوْنُ الزَّيْتُونَةِ أَخْضَرُ", phonetic: "Lawnu az-zaytunati akhdar" },
{ id: 728426, category: "Pista 30: Los colores", spanish: "El color del café es negro", arabic: "لَوْنُ الْقَهْوَةِ أَسْوَدُ", phonetic: "Lawnu al-qahwati aswad" },
{ id: 182766, category: "Pista 30: Los colores", spanish: "El petróleo es negro", arabic: "إِنَّ الْبِتْرُولَ أَسْوَدُ", phonetic: "Inna al-bitrula aswad" },
{ id: 564766, category: "Pista 30: Los colores", spanish: "El mar es azul", arabic: "إِنَّ الْبَحْرَ أَزْرَقُ", phonetic: "Inna al-bahra azraq" },
{ id: 283777, category: "Pista 30: Los colores", spanish: "La leche es blanca", arabic: "إِنَّ الْحَلِيبَ أَبْيَضُ", phonetic: "Inna al-haliba abyad" },
{ id: 918307, category: "Pista 30: Los colores", spanish: "El sol es amarillo", arabic: "إِنَّ الشَّمْسَ صَفْرَاءُ", phonetic: "Inna ash-shamsa safra'" },
{ id: 374857, category: "Pista 30: Los colores", spanish: "¿Cuál es tu color preferido?", arabic: "مَا لَوْنُكَ الْمُفَضَّلُ؟", phonetic: "Ma lawnuka al-mufaddal?" },
{ id: 637317, category: "Pista 30: Los colores", spanish: "Mi color preferido es el verde", arabic: "لَوْنِيَ الْمُفَضَّلُ هُوَ الْأَخْضَرُ", phonetic: "Lawniya al-mufaddalu huwa al-akhdar" },

// Pista 31: La descripción física
{ id: 192867, category: "Pista 31: La descripción física", spanish: "El cuerpo humano", arabic: "جِسْمُ الْإِنْسَانِ", phonetic: "Jismu al-insan" },
{ id: 473857, category: "Pista 31: La descripción física", spanish: "Cabeza", arabic: "رَأْس", phonetic: "Ra's" },
{ id: 827397, category: "Pista 31: La descripción física", spanish: "Cara, rostro", arabic: "وَجْه", phonetic: "Wajh" },
{ id: 293877, category: "Pista 31: La descripción física", spanish: "Ojo", arabic: "عَيْن", phonetic: "Ayn" },
{ id: 728427, category: "Pista 31: La descripción física", spanish: "Nariz", arabic: "أَنْف", phonetic: "Anf" },
{ id: 182767, category: "Pista 31: La descripción física", spanish: "Oreja", arabic: "أُذُن", phonetic: "Udhun" },
{ id: 564767, category: "Pista 31: La descripción física", spanish: "Boca", arabic: "فَم", phonetic: "Fam" },
{ id: 283778, category: "Pista 31: La descripción física", spanish: "Pelo", arabic: "شَعْر", phonetic: "Sha'r" },
{ id: 918308, category: "Pista 31: La descripción física", spanish: "Bigote", arabic: "شَارِب", phonetic: "Sharib" },
{ id: 374858, category: "Pista 31: La descripción física", spanish: "Barba", arabic: "لِحْيَة", phonetic: "Lihya" },
{ id: 637318, category: "Pista 31: La descripción física", spanish: "Pecho", arabic: "صَدْر", phonetic: "Sadr" },
{ id: 192868, category: "Pista 31: La descripción física", spanish: "Cuello", arabic: "عُنُق", phonetic: "'Unuq" },
{ id: 473858, category: "Pista 31: La descripción física", spanish: "Espalda", arabic: "ظَهْر", phonetic: "Zahr" },
{ id: 827398, category: "Pista 31: La descripción física", spanish: "Mano", arabic: "يَد", phonetic: "Yad" },
{ id: 293878, category: "Pista 31: La descripción física", spanish: "Brazo", arabic: "ذِرَاع", phonetic: "Dhira'" },
{ id: 728428, category: "Pista 31: La descripción física", spanish: "Vientre", arabic: "بَطْن", phonetic: "Batn" },
{ id: 182768, category: "Pista 31: La descripción física", spanish: "Pierna", arabic: "رِجْل", phonetic: "Rijl" },
{ id: 564768, category: "Pista 31: La descripción física", spanish: "Pie", arabic: "قَدَم", phonetic: "Qadam" },
{ id: 283779, category: "Pista 31: La descripción física", spanish: "Alto", arabic: "طَوِيل", phonetic: "Tawil" },
{ id: 918309, category: "Pista 31: La descripción física", spanish: "Bajo", arabic: "قَصِير", phonetic: "Qasir" },
{ id: 374859, category: "Pista 31: La descripción física", spanish: "Grande", arabic: "كَبِير", phonetic: "Kabir" },
{ id: 637319, category: "Pista 31: La descripción física", spanish: "Pequeño", arabic: "صَغِير", phonetic: "Saghir" },
{ id: 192869, category: "Pista 31: La descripción física", spanish: "Delgado", arabic: "نَحِيل", phonetic: "Nahil" },
{ id: 473859, category: "Pista 31: La descripción física", spanish: "Delgado (nahif)", arabic: "نَحِيف", phonetic: "Nahif" },
{ id: 827399, category: "Pista 31: La descripción física", spanish: "Delgado, esbelto", arabic: "رَشِيق", phonetic: "Rashiq" },
{ id: 293879, category: "Pista 31: La descripción física", spanish: "Gordo", arabic: "سَمِين", phonetic: "Samin" },
{ id: 728429, category: "Pista 31: La descripción física", spanish: "Gordo (badin)", arabic: "بَدِين", phonetic: "Badin" },
{ id: 182769, category: "Pista 31: La descripción física", spanish: "Joven", arabic: "شَابّ", phonetic: "Shabb" },
{ id: 564769, category: "Pista 31: La descripción física", spanish: "Viejo/a, anciano/a", arabic: "عَجُوز", phonetic: "'Ajuz" },
{ id: 283780, category: "Pista 31: La descripción física", spanish: "Contento", arabic: "مَسْرُور", phonetic: "Masrur" },
{ id: 918310, category: "Pista 31: La descripción física", spanish: "Feliz", arabic: "سَعِيد", phonetic: "Sa'id" },
{ id: 374860, category: "Pista 31: La descripción física", spanish: "Triste", arabic: "حَزِين", phonetic: "Hazin" },
{ id: 637320, category: "Pista 31: La descripción física", spanish: "Hambriento", arabic: "جَائِع", phonetic: "Ja'i'" },
{ id: 192870, category: "Pista 31: La descripción física", spanish: "Sediento", arabic: "عَطْشَان", phonetic: "Atshan" },
{ id: 473860, category: "Pista 31: La descripción física", spanish: "Enfadado", arabic: "غَضْبَان", phonetic: "Ghadban" },
{ id: 827400, category: "Pista 31: La descripción física", spanish: "Disgustado", arabic: "زَعْلَان", phonetic: "Za'lan" },
{ id: 293880, category: "Pista 31: La descripción física", spanish: "Cansado (mut'ab)", arabic: "مُتْعَب", phonetic: "Mut'ab" },
{ id: 728430, category: "Pista 31: La descripción física", spanish: "Cansado (ta'ban)", arabic: "تَعْبَان", phonetic: "Ta'ban" },
{ id: 182770, category: "Pista 31: La descripción física", spanish: "Guapa", arabic: "جَمِيلَة", phonetic: "Jamila" },
{ id: 564770, category: "Pista 31: La descripción física", spanish: "Guapo", arabic: "وَسِيم", phonetic: "Wasim" },
{ id: 283781, category: "Pista 31: La descripción física", spanish: "Empañolada (velada)", arabic: "مُحَجَّبَة", phonetic: "Muhajjaba" },
{ id: 918311, category: "Pista 31: La descripción física", spanish: "Calvo", arabic: "أَصْلَع", phonetic: "Asla'" },
{ id: 374861, category: "Pista 31: La descripción física", spanish: "Calva", arabic: "صَلْعَاء", phonetic: "Sal'a'" },
{ id: 637321, category: "Pista 31: La descripción física", spanish: "Es gordo, bajo y tiene el pelo moreno", arabic: "إِنَّهُ بَدِينٌ وَقَصِيرٌ وَشَعْرُهُ أَسْمَرُ", phonetic: "Innahu badinun wa qasirun wa sha'ruhu asmar" },
{ id: 192871, category: "Pista 31: La descripción física", spanish: "Ella es alta, delgada y tiene el pelo rubio", arabic: "إِنَّهَا طَوِيلَةٌ وَرَشِيقَةٌ وَشَعْرُهَا أَشْقَرُ", phonetic: "Innaha tawilatun wa rashiqatun wa sha'ruha ashqar" },
{ id: 473861, category: "Pista 31: La descripción física", spanish: "Rashida es una joven morena y delgada, sus ojos son verdes y es guapa", arabic: "رَشِيدَة هِيَ شَابَّةٌ سَمْرَاءُ وَنَحِيلَةٌ، عَيْنَاهَا خَضْرَاوَانِ وَوَجْهُهَا جَمِيلٌ", phonetic: "Rashida hiya shabbatun samra'u wa nahilatu, 'aynaha khadrawani wa wajhuha jamil" },
{ id: 827401, category: "Pista 31: La descripción física", spanish: "Nabil es un hombre anciano, tiene el pelo gris, las orejas grandes, la nariz larga y los ojos marrones", arabic: "نَبِيل رَجُلٌ عَجُوزٌ، شَعْرُهُ رَمَادِيٌّ، أُذْنَاهُ كَبِيرَتَانِ، أَنْفُهُ طَوِيلٌ وَعَيْنَاهُ بُنِّيَّتَانِ", phonetic: "Nabil rajulun 'ajuzun, sha'ruhu ramadiyyun, udhnahu kabiratani, anfuhu tawilun wa 'aynahu bunniyyatani" },
{ id: 293881, category: "Pista 31: La descripción física", spanish: "¿Cómo es el hombre de tus sueños, Fátima?", arabic: "كَيْفَ هُوَ رَجُلُ أَحْلَامِكِ يَا فَاطِمَةُ؟", phonetic: "Kayfa huwa rajulu ahlamiki ya Fatima?" },
{ id: 728431, category: "Pista 31: La descripción física", spanish: "Es alto, delgado, rubio, fuerte, guapo, de ojos azules y con mucho dinero", arabic: "إِنَّهُ طَوِيلٌ، نَحِيلٌ، أَشْقَرُ، قَوِيٌّ، وَسِيمٌ، عَيْنَاهُ زَرْقَاوَانِ وَلَهُ كَثِيرٌ مِنَ الْفُلُوسِ", phonetic: "Innahu tawilun, nahilun, ashqaru, qawiyyun, wasimun, 'aynahu zarqawani wa lahu kathirun min al-fulus" },
{ id: 182771, category: "Pista 31: La descripción física", spanish: "Latifa no es gorda ni flaca", arabic: "لَطِيفَة لَيْسَتْ بَدِينَةً وَلَا رَشِيقَةً", phonetic: "Latifa laysat badinatan wa la rashiqatan" },
{ id: 564771, category: "Pista 31: La descripción física", spanish: "Rashid no es alto ni bajo", arabic: "رَشِيد لَيْسَ طَوِيلًا وَلَا قَصِيرًا", phonetic: "Rashid laysa tawilan wa la qasiran" }
];

export default function App() {
  // --- ESTADOS ---
  const [cards, setCards] = useState(() => {
    try {
      // IMPORTANTE: Cambio a 'v7' para forzar la carga de los nuevos datos con vocales
      const saved = localStorage.getItem('flashcards-data-v7');
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
  const [frontLanguage, setFrontLanguage] = useState("spanish");
  
  // ESTADO: Mostrar u ocultar diacríticos
  const [showDiacritics, setShowDiacritics] = useState(true);

  // --- DERIVADOS ---
  const categories = useMemo(() => {
    const validCards = cards.filter(c => c && c.category);
    const cats = new Set(validCards.map(c => c.category));
    return ["Todos", ...Array.from(cats).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))];
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (!card) return false;
      const s = (card.spanish || "").toLowerCase();
      // Buscamos en el árabe "limpio" (sin signos) para facilitar la búsqueda
      const a = removeDiacritics(card.arabic || "");
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
      localStorage.setItem('flashcards-data-v7', JSON.stringify(cards));
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
    const processedNewCards = newCards.map(c => ({
      ...c,
      id: c.id || Date.now() + Math.random(),
      spanish: c.spanish || "",
      arabic: c.arabic || "",
      phonetic: c.phonetic || "", 
      category: c.category || "General"
    }));
    setCards(prev => [...prev, ...processedNewCards]);
    setIsImporting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* HEADER */}
      <header className="bg-emerald-700 text-white shadow-md z-20">
        <div className="w-full px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden p-1 hover:bg-emerald-600 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            <BookOpen className="w-7 h-7" />
            <h1 className="text-xl font-bold hidden sm:block">Aprende Árabe</h1>
          </div>
          
          <div className="flex-1 max-w-xl mx-4 flex gap-2">
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

            {/* CONTENEDOR DE CONTROLES (IDIOMA + SIGNOS) */}
            <div className="flex items-center gap-2 bg-emerald-800/50 rounded-lg p-1 border border-emerald-600/30 flex-shrink-0">
                {/* SELECTOR DE IDIOMA */}
                <div className="flex border-r border-emerald-600/30 pr-2 mr-2">
                  <button
                      onClick={() => setFrontLanguage('spanish')}
                      className={`px-2 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${frontLanguage === 'spanish' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:bg-emerald-700'}`}
                      title="Frente en Español"
                  >
                      ES
                  </button>
                  <button
                      onClick={() => setFrontLanguage('arabic')}
                      className={`px-2 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${frontLanguage === 'arabic' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:bg-emerald-700'}`}
                      title="Frente en Árabe"
                  >
                      AR
                  </button>
                </div>

                {/* TOGGLE DIACRÍTICOS */}
                <button
                    onClick={() => setShowDiacritics(!showDiacritics)}
                    className={`px-2 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${showDiacritics ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:bg-emerald-700'}`}
                    title={showDiacritics ? "Ocultar signos diacríticos" : "Mostrar signos diacríticos"}
                >
                    <Type className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{showDiacritics ? "Signos" : "Simple"}</span>
                </button>
            </div>
          </div>

          <button 
            onClick={() => setIsImporting(true)}
            className="flex items-center gap-2 bg-emerald-800/50 hover:bg-emerald-800 px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm whitespace-nowrap border border-emerald-600/30"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importar</span>
          </button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
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

        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/20 z-0 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 pb-20">
                {filteredCards.map(card => (
                  <Flashcard 
                    key={card.id} 
                    data={card} 
                    frontLanguage={frontLanguage} 
                    showDiacritics={showDiacritics}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {isImporting && (
        <ImportModal 
          onClose={() => setIsImporting(false)} 
          onImport={handleImport} 
        />
      )}
    </div>
  );
}

// --- TARJETA ---
function Flashcard({ data, frontLanguage, showDiacritics }) {
  const [flipState, setFlipState] = useState(0);

  useEffect(() => {
    setFlipState(0);
  }, [frontLanguage]);

  const handleNextFace = (e) => {
    e.stopPropagation();
    setFlipState((prev) => (prev + 1) % 3);
  };

  const playAudio = (e) => {
    e.stopPropagation();
    try {
        if (!('speechSynthesis' in window)) {
          alert("Tu navegador no soporta la síntesis de voz.");
          return;
        }
        window.speechSynthesis.cancel();
        
        // IMPORTANTE: Leemos siempre el texto original (con vocales) para mejor pronunciación
        const textToSpeak = data.arabic || "";
        if (!textToSpeak) return;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(voice => voice.lang.includes('ar'));

        if (arabicVoice) {
          utterance.voice = arabicVoice;
          utterance.lang = arabicVoice.lang;
        } else {
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
      case 0: return "bg-orange-50 border-orange-100 text-slate-800"; 
      case 1: return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case 2: return "bg-amber-100 border-amber-200 text-amber-900";
      default: return "";
    }
  };

  const renderSpanishContent = () => (
    <div className="animate-fade-in-up w-full">
        <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 md:mb-2">Español</p>
        <h3 className="text-base md:text-xl font-bold leading-tight break-words">{data.spanish || "?"}</h3>
    </div>
  );

  const renderArabicContent = () => {
    // Calculamos el texto a mostrar dinámicamente
    const displayText = showDiacritics ? data.arabic : removeDiacritics(data.arabic);
    
    return (
      <div className="animate-fade-in-up w-full">
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-emerald-600/60 font-bold mb-1 md:mb-2">Árabe</p>
          <h3 className="text-xl md:text-3xl font-arabic mb-2 md:mb-4 break-words" dir="rtl">{displayText || "..."}</h3>
          <button 
              onClick={playAudio}
              className="mx-auto flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-emerald-200/50 hover:bg-emerald-200 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide text-emerald-800 transition active:scale-95"
          >
              <Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden md:inline">Escuchar</span>
          </button>
      </div>
    );
  };

  const renderPhoneticContent = () => (
    <div className="animate-fade-in-up w-full">
        <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-amber-600/60 font-bold mb-1 md:mb-2">Fonética</p>
        <h3 className="text-sm md:text-lg font-mono text-amber-800 italic break-words">{data.phonetic || "-"}</h3>
        <p className="mt-2 md:mt-3 text-[9px] md:text-[10px] opacity-50 flex items-center justify-center gap-1">
            <Mic className="w-3 h-3" /> <span className="hidden md:inline">Pronunciación</span>
        </p>
    </div>
  );

  const renderFace = () => {
    if (flipState === 2) return renderPhoneticContent();
    if (frontLanguage === 'spanish') {
        if (flipState === 0) return renderSpanishContent();
        if (flipState === 1) return renderArabicContent();
    } else {
        if (flipState === 0) return renderArabicContent();
        if (flipState === 1) return renderSpanishContent();
    }
  };

  const getFooterText = () => {
    if (flipState === 2) return "Reiniciar";
    return flipState === 0 ? "Ver reverso" : "Ver fonética";
  };

  return (
    <div 
      onClick={handleNextFace}
      className={`relative h-28 md:h-60 w-full rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border flex flex-col items-center justify-center p-2 md:p-4 text-center select-none group ${getCardStyle()}`}
    >
      <div className="absolute top-2 right-2 md:top-3 md:right-3 flex gap-1 md:gap-1.5">
        {[0, 1, 2].map(step => (
          <div key={step} className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full transition-colors ${flipState === step ? 'bg-current opacity-100' : 'bg-slate-400/30 opacity-50'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {renderFace()}
      </div>

      <div className="absolute bottom-1 md:bottom-3 text-[8px] md:text-[10px] uppercase tracking-widest opacity-30 font-bold">
        {getFooterText()}
      </div>
    </div>
  );
}

// --- MODAL IMPORTAR ---
function ImportModal({ onClose, onImport }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState(null);

  const handleProcess = () => {
    try {
      const parsed = JSON.parse(jsonText);
      let items = Array.isArray(parsed) ? parsed : [parsed];
      const sanitizedItems = items.filter(item => item && (item.spanish || item.arabic));
      if (sanitizedItems.length === 0) throw new Error("No se encontraron tarjetas válidas.");
      onImport(sanitizedItems);
    } catch (err) {
      setError("Error JSON: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="bg-emerald-700 px-6 py-4 flex justify-between items-center text-white flex-shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Upload className="w-5 h-5" /> Importar
          </h2>
          <button onClick={onClose} className="hover:bg-emerald-600 p-1.5 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-4 text-xs flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>Formato requerido: <code>[{"{"}"category": "...", "spanish": "...", "arabic": "..."{"}"}, ...]</code></p>
          </div>
          <textarea 
            className="w-full flex-1 min-h-[200px] p-4 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder='Ej: [{"spanish": "Hola", "arabic": "مَرْحَبًا"}]'
            value={jsonText}
            onChange={(e) => { setJsonText(e.target.value); setError(null); }}
          />
          {error && <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">{error}</div>}
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancelar</button>
          <button onClick={handleProcess} disabled={!jsonText.trim()} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Importar
          </button>
        </div>
      </div>
    </div>
  );
}