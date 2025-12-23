import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  BookOpen, 
  Mic,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Type,
  Filter 
} from 'lucide-react';

// --- UTILIDAD: QUITAR DIACRÍTICOS (HARAKAT) ---
const removeDiacritics = (text) => {
  if (!text) return "";
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
};

// --- DATOS COMPLETOS (CON IDs NORMALIZADOS) ---
const INITIAL_DATA = [
  // Pista 1: Saludos (1000+)
  { id: 1001, category: "Pista 1: Saludos", spanish: "Hola", arabic: "مَرْحَبًا", phonetic: "Marhaban" },
  { id: 1002, category: "Pista 1: Saludos", spanish: "Buenos días", arabic: "صَبَاحُ الْخَيْر", phonetic: "Sabah al-khayr" },
  { id: 1003, category: "Pista 1: Saludos", spanish: "Buenos días (respuesta)", arabic: "صَبَاحُ النُّور", phonetic: "Sabah an-noor" },
  { id: 1004, category: "Pista 1: Saludos", spanish: "Buenas tardes", arabic: "مَسَاءُ الْخَيْر", phonetic: "Masa' al-khayr" },
  { id: 1005, category: "Pista 1: Saludos", spanish: "La paz sea contigo", arabic: "السَّلَامُ عَلَيْكُمْ", phonetic: "As-salamu alaykum" },
  { id: 1006, category: "Pista 1: Saludos", spanish: "Y con vosotros la paz", arabic: "وَعَلَيْكُمُ السَّلَام", phonetic: "Wa alaykumu as-salam" },

  // Pista 2: Despedidas (2000+)
  { id: 2001, category: "Pista 2:Despedidas", spanish: "Adiós", arabic: "مَعَ السَّلَامَة", phonetic: "maʿa as-salāma" },
  { id: 2002, category: "Pista 2:Despedidas", spanish: "Hasta la vista", arabic: "إِلَى اللِّقَاء", phonetic: "ilā al-liqāʾ" },
  { id: 2003, category: "Pista 2:Despedidas", spanish: "Hasta la vista / Adiós (respuesta)", arabic: "إِلَى اللِّقَاء / مَعَ السَّلَامَة", phonetic: "ilā al-liqāʾ / maʿa as-salāma" },

  // Pista 3: ¿Cómo estás? (3000+)
  { id: 3001, category: "Pista 3: ¿Cómo estás?", spanish: "¿Cómo estás? / ¿Qué tal?", arabic: "كَيْفَ الْحَال؟", phonetic: "kayfa al-ḥāl?" },
  { id: 3002, category: "Pista 3: ¿Cómo estás?", spanish: "Bien", arabic: "بِخَيْر", phonetic: "bijayr" },
  { id: 3003, category: "Pista 3: ¿Cómo estás?", spanish: "Bien (regular)", arabic: "لَا بَأْس", phonetic: "lā baʾs" },
  { id: 3004, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios", arabic: "الْحَمْدُ لِلَّهِ", phonetic: "al-ḥamdu lillāh" },
  { id: 3005, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios (respuesta larga)", arabic: "بِخَيْر وَالْحَمْدُ لِلَّهِ", phonetic: "bijayr wa-l-ḥamdu lillāh" },
  { id: 3006, category: "Pista 3: ¿Cómo estás?", spanish: "Bien, gracias a Dios (respuesta larga 2)", arabic: "لَا بَأْس وَالْحَمْدُ لِلَّهِ", phonetic: "lā baʾs wa-l-ḥamdu lillāh" },

  // Pista 4: Pronombres personales (4000+)
  { id: 4001, category: "Pista 4: Pronombres personales", spanish: "Yo", arabic: "أَنَا", phonetic: "anā" },
  { id: 4002, category: "Pista 4: Pronombres personales", spanish: "Tú (masculino)", arabic: "أَنْتَ", phonetic: "anta" },
  { id: 4003, category: "Pista 4: Pronombres personales", spanish: "Tú (femenino)", arabic: "أَنْتِ", phonetic: "anti" },
  { id: 4004, category: "Pista 4: Pronombres personales", spanish: "Él", arabic: "هُوَ", phonetic: "huwa" },
  { id: 4005, category: "Pista 4: Pronombres personales", spanish: "Ella", arabic: "هِيَ", phonetic: "hiya" },
  { id: 4006, category: "Pista 4: Pronombres personales", spanish: "Nosotros / nosotras", arabic: "نَحْنُ", phonetic: "naḥnu" },
  { id: 4007, category: "Pista 4: Pronombres personales", spanish: "Vosotros", arabic: "أَنْتُمْ", phonetic: "antum" },
  { id: 4008, category: "Pista 4: Pronombres personales", spanish: "Vosotras", arabic: "أَنْتُنَّ", phonetic: "antunna" },
  { id: 4009, category: "Pista 4: Pronombres personales", spanish: "Ellos", arabic: "هُمْ", phonetic: "hum" },
  { id: 4010, category: "Pista 4: Pronombres personales", spanish: "Ellas", arabic: "هُنَّ", phonetic: "hunna" },

  // Pista 5: Quién eres (5000+)
  { id: 5001, category: "Pista 5: Quién eres", spanish: "¿Quién eres? (m)", arabic: "مَنْ أَنْتَ؟", phonetic: "man anta?" },
  { id: 5002, category: "Pista 5: Quién eres", spanish: "Soy Marwán", arabic: "أَنَا مَرْوَان", phonetic: "anā marwān" },
  { id: 5003, category: "Pista 5: Quién eres", spanish: "¿Quién eres? (f)", arabic: "مَنْ أَنْتِ؟", phonetic: "man anti?" },
  { id: 5004, category: "Pista 5: Quién eres", spanish: "Soy Fátima", arabic: "أَنَا فَاطِمَة", phonetic: "anā fāṭima" },
  { id: 5005, category: "Pista 5: Quién eres", spanish: "¿Quién es? (masculino)", arabic: "مَنْ هُوَ؟", phonetic: "man huwa?" },
  { id: 5006, category: "Pista 5: Quién eres", spanish: "Es Mústafa", arabic: "هُوَ مُصْطَفَى", phonetic: "huwa muṣṭafā" },
  { id: 5007, category: "Pista 5: Quién eres", spanish: "¿Quién es? (femenino)", arabic: "مَنْ هِيَ؟", phonetic: "man hiya?" },
  { id: 5008, category: "Pista 5: Quién eres", spanish: "Es Layla", arabic: "هِيَ لَيْلَى", phonetic: "hiya laylā" },

  // Pista 6: De dónde eres (6000+)
  { id: 6001, category: "Pista 6: De dónde eres", spanish: "¿De dónde eres? (m)", arabic: "مِنْ أَيْنَ أَنْتَ؟", phonetic: "min ayna anta?" },
  { id: 6002, category: "Pista 6: De dónde eres", spanish: "Soy de España", arabic: "أَنَا مِنْ إِسْبَانِيَا", phonetic: "anā min isbāniyā" },
  { id: 6003, category: "Pista 6: De dónde eres", spanish: "Soy español", arabic: "أَنَا إِسْبَانِيّ", phonetic: "anā isbānī" },
  { id: 6004, category: "Pista 6: De dónde eres", spanish: "¿De dónde eres? (f)", arabic: "مِنْ أَيْنَ أَنْتِ؟", phonetic: "min ayna anti?" },
  { id: 6005, category: "Pista 6: De dónde eres", spanish: "Soy de Francia", arabic: "أَنَا مِنْ فَرَنْسَا", phonetic: "anā min faransā" },
  { id: 6006, category: "Pista 6: De dónde eres", spanish: "Soy francesa", arabic: "أَنَا فَرَنْسِيَّة", phonetic: "anā faransiyya" },
  { id: 6007, category: "Pista 6: De dónde eres", spanish: "¿De dónde es? (m)", arabic: "مِنْ أَيْنَ هُوَ؟", phonetic: "min ayna huwa?" },
  { id: 6008, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "هُوَ مِنْ إِيطَالِيَا", phonetic: "huwa min īṭāliyā" },
  { id: 6009, category: "Pista 6: De dónde eres", spanish: "Es italiano", arabic: "هُوَ إِيطَالِيّ", phonetic: "huwa īṭālī" },
  { id: 6010, category: "Pista 6: De dónde eres", spanish: "¿De dónde es? (f)", arabic: "مِنْ أَيْنَ هِيَ؟", phonetic: "min ayna hiya?" },
  { id: 6011, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "هِيَ مِنْ إِيطَالِيَا", phonetic: "hiya min īṭāliyā" },
  { id: 6012, category: "Pista 6: De dónde eres", spanish: "Es italiana", arabic: "هِيَ إِيطَالِيَّة", phonetic: "hiya īṭāliyya" },

  // Pista 7: Números (7000+)
  { id: 7000, category: "Pista 7: Números", spanish: "Cero", arabic: "صِفْر", phonetic: "Sifr" },
  { id: 7001, category: "Pista 7: Números", spanish: "Uno", arabic: "وَاحِد", phonetic: "Wahid" },
  { id: 7002, category: "Pista 7: Números", spanish: "Dos", arabic: "اِثْنَان", phonetic: "Ithnan" },
  { id: 7003, category: "Pista 7: Números", spanish: "Tres", arabic: "ثَلَاثَة", phonetic: "Thalatha" },
  { id: 7004, category: "Pista 7: Números", spanish: "Cuatro", arabic: "أَرْبَعَة", phonetic: "Arba'a" },
  { id: 7005, category: "Pista 7: Números", spanish: "Cinco", arabic: "خَمْسَة", phonetic: "Khamsa" },
  { id: 7006, category: "Pista 7: Números", spanish: "Seis", arabic: "سِتَّة", phonetic: "Sitta" },
  { id: 7007, category: "Pista 7: Números", spanish: "Siete", arabic: "سَبْعَة", phonetic: "Sab'a" },
  { id: 7008, category: "Pista 7: Números", spanish: "Ocho", arabic: "ثَمَانِيَة", phonetic: "Thamaniya" },
  { id: 7009, category: "Pista 7: Números", spanish: "Nueve", arabic: "تِسْعَة", phonetic: "Tis'a" },
  { id: 7010, category: "Pista 7: Números", spanish: "Diez", arabic: "عَشَرَة", phonetic: "'Ashara" },

  // Pista 8: Demostrativos (8000+)
  { id: 8001, category: "Pista 8: Demostrativos", spanish: "Éste, esto", arabic: "هٰذَا", phonetic: "hādhā" },
  { id: 8002, category: "Pista 8: Demostrativos", spanish: "Ésta", arabic: "هٰذِهِ", phonetic: "hādhihi" },
  { id: 8003, category: "Pista 8: Demostrativos", spanish: "Aquel", arabic: "ذٰلِكَ", phonetic: "dhālika" },
  { id: 8004, category: "Pista 8: Demostrativos", spanish: "Aquella", arabic: "تِلْكَ", phonetic: "tilka" },
  { id: 8005, category: "Pista 8: Demostrativos", spanish: "¿Qué es esto?", arabic: "مَا هٰذَا؟", phonetic: "mā hādhā?" },
  { id: 8006, category: "Pista 8: Demostrativos", spanish: "Esto es un libro", arabic: "هٰذَا كِتَاب", phonetic: "hādhā kitāb" },
  { id: 8007, category: "Pista 8: Demostrativos", spanish: "Esto es un lápiz", arabic: "هٰذَا قَلَم", phonetic: "hādhā qalam" },
  { id: 8008, category: "Pista 8: Demostrativos", spanish: "Esto es una puerta", arabic: "هٰذَا بَاب", phonetic: "hādhā bāb" },
  { id: 8009, category: "Pista 8: Demostrativos", spanish: "Esto es una ventana", arabic: "هٰذَا شُبَّاك", phonetic: "hādhā shubbāk" },
  { id: 8010, category: "Pista 8: Demostrativos", spanish: "Esto es una silla", arabic: "هٰذَا كُرْسِيّ", phonetic: "hādhā kursī" },
  { id: 8011, category: "Pista 8: Demostrativos", spanish: "Esto es un teléfono", arabic: "هٰذَا تِلِيفُون", phonetic: "hādhā tilīfūn" },
  { id: 8012, category: "Pista 8: Demostrativos", spanish: "Esto es un ordenador", arabic: "هٰذَا كُمْبِيُوتَر", phonetic: "hādhā kombiyūtar" },
  { id: 8013, category: "Pista 8: Demostrativos", spanish: "Esto es una mesa", arabic: "هٰذِهِ طَاوِلَة", phonetic: "hādhihi ṭāwila" },
  { id: 8014, category: "Pista 8: Demostrativos", spanish: "Esto es una pizarra", arabic: "هٰذِهِ سَبُّورَة", phonetic: "hādhihi sabbūra" },
  { id: 8015, category: "Pista 8: Demostrativos", spanish: "Esto es una botella", arabic: "هٰذِهِ زُجَاجَة", phonetic: "hādhihi zujāja" },

  // Pista 9: Los pronombres sufijados (9000+)
  { id: 9001, category: "Pista 9: Los pronombres sufijados", spanish: "Mi", arabic: "ـي", phonetic: "-i" },
  { id: 9002, category: "Pista 9: Los pronombres sufijados", spanish: "Tu (masc.)", arabic: "ـكَ", phonetic: "-ka" },
  { id: 9003, category: "Pista 9: Los pronombres sufijados", spanish: "Tu (fem.)", arabic: "ـكِ", phonetic: "-ki" },
  { id: 9004, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de él)", arabic: "ـهُ", phonetic: "-hu" },
  { id: 9005, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de ella)", arabic: "ـهَا", phonetic: "-ha" },
  { id: 9006, category: "Pista 9: Los pronombres sufijados", spanish: "Nuestro, nuestra", arabic: "ـنَا", phonetic: "-na" },
  { id: 9007, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro (de vosotros)", arabic: "ـكُمْ", phonetic: "-kum" },
  { id: 9008, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro (de vosotras)", arabic: "ـكُنَّ", phonetic: "-kunna" },
  { id: 9009, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de ellos)", arabic: "ـهُمْ", phonetic: "-hum" },
  { id: 9010, category: "Pista 9: Los pronombres sufijados", spanish: "Su (de ellas)", arabic: "ـهُنَّ", phonetic: "-hunna" },
  { id: 9011, category: "Pista 9: Los pronombres sufijados", spanish: "Mi libro", arabic: "كِتَابِي", phonetic: "Kitabi" },
  { id: 9012, category: "Pista 9: Los pronombres sufijados", spanish: "Tu libro (masc.)", arabic: "كِتَابُكَ", phonetic: "Kitabuka" },
  { id: 9013, category: "Pista 9: Los pronombres sufijados", spanish: "Tu libro (fem.)", arabic: "كِتَابُكِ", phonetic: "Kitabuki" },
  { id: 9014, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de él)", arabic: "كِتَابُهُ", phonetic: "Kitabuhu" },
  { id: 9015, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de ella)", arabic: "كِتَابُهَا", phonetic: "Kitabuha" },
  { id: 9016, category: "Pista 9: Los pronombres sufijados", spanish: "Nuestro libro", arabic: "كِتَابُنَا", phonetic: "Kitabuna" },
  { id: 9017, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro libro (de vosotros)", arabic: "كِتَابُكُمْ", phonetic: "Kitabukum" },
  { id: 9018, category: "Pista 9: Los pronombres sufijados", spanish: "Vuestro libro (de vosotras)", arabic: "كِتَابُكُنَّ", phonetic: "Kitabukunna" },
  { id: 9019, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de ellos)", arabic: "كِتَابُهُمْ", phonetic: "Kitabuhum" },
  { id: 9020, category: "Pista 9: Los pronombres sufijados", spanish: "Su libro (de ellas)", arabic: "كِتَابُهُنَّ", phonetic: "Kitabuhunna" },

  // Pista 10: ¿Cómo te llamas? (10000+)
  { id: 10001, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo te llamas? (masc.)", arabic: "مَا اسْمُكَ؟", phonetic: "Ma ismuka?" },
  { id: 10002, category: "Pista 10: ¿Cómo te llamas?", spanish: "Me llamo Latif", arabic: "اِسْمِي لَطِيف", phonetic: "Ismi Latif" },
  { id: 10003, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo te llamas? (fem.)", arabic: "مَا اسْمُكِ؟", phonetic: "Ma ismuki?" },
  { id: 10004, category: "Pista 10: ¿Cómo te llamas?", spanish: "Me llamo Latifa", arabic: "اِسْمِي لَطِيفَة", phonetic: "Ismi Latifa" },
  { id: 10005, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo se llama? (él)", arabic: "مَا اسْمُهُ؟", phonetic: "Ma ismuhu?" },
  { id: 10006, category: "Pista 10: ¿Cómo te llamas?", spanish: "Se llama Samir", arabic: "اِسْمُهُ سَمِير", phonetic: "Ismuhu Samir" },
  { id: 10007, category: "Pista 10: ¿Cómo te llamas?", spanish: "¿Cómo se llama? (ella)", arabic: "مَا اسْمُهَا؟", phonetic: "Ma ismuha?" },
  { id: 10008, category: "Pista 10: ¿Cómo te llamas?", spanish: "Se llama Samira", arabic: "اِسْمُهَا سَمِيرَة", phonetic: "Ismuha Samira" },

  // Pista 11: Concordancias (11000+)
  { id: 11001, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Un libro grande", arabic: "كِتَابٌ كَبِيرٌ", phonetic: "Kitabun kabir" },
  { id: 11002, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "El libro grande", arabic: "الْكِتَابُ الْكَبِيرُ", phonetic: "Al-kitabu l-kabir" },
  { id: 11003, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "El libro es grande", arabic: "الْكِتَابُ كَبِيرٌ", phonetic: "Al-kitabu kabir" },
  { id: 11004, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Este libro", arabic: "هَذَا الْكِتَابُ", phonetic: "Hadha l-kitab" },
  { id: 11005, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esto es un libro", arabic: "هَذَا كِتَابٌ", phonetic: "Hadha kitab" },
  { id: 11006, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Este libro es grande", arabic: "هَذَا الْكِتَابُ كَبِيرٌ", phonetic: "Hadha l-kitabu kabir" },
  { id: 11007, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Éste es un libro grande", arabic: "هَذَا كِتَابٌ كَبِيرٌ", phonetic: "Hadha kitabun kabir" },
  { id: 11008, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Una pelota grande", arabic: "كُرَةٌ كَبِيرَةٌ", phonetic: "Kuratun kabira" },
  { id: 11009, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "La pelota grande", arabic: "الْكُرَةُ الْكَبِيرَةُ", phonetic: "Al-kuratu l-kabira" },
  { id: 11010, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "La pelota es grande", arabic: "الْكُرَةُ كَبِيرَةٌ", phonetic: "Al-kuratu kabira" },
  { id: 11011, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esta pelota", arabic: "هَذِهِ الْكُرَةُ", phonetic: "Hadhihi l-kura" },
  { id: 11012, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esto es una pelota", arabic: "هَذِهِ كُرَةٌ", phonetic: "Hadhihi kura" },
  { id: 11013, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Esta pelota es grande", arabic: "هَذِهِ الْكُرَةُ كَبِيرَةٌ", phonetic: "Hadhihi l-kuratu kabira" },
  { id: 11014, category: "Pista 11: Concordancias entre sustantivo y adjetivo", spanish: "Ésta es una pelota grande", arabic: "هَذِهِ كُرَةٌ كَبِيرَةٌ", phonetic: "Hadhihi kuratun kabira" },

  // Pista 12: La anexión (12000+)
  { id: 12001, category: "Pista 12: La anexión", spanish: "Mi libro", arabic: "كِتَابِي", phonetic: "Kitabi" },
  { id: 12002, category: "Pista 12: La anexión", spanish: "Tu libro (masc.)", arabic: "كِتَابُكَ", phonetic: "Kitabuka" },
  { id: 12003, category: "Pista 12: La anexión", spanish: "Su libro (de él)", arabic: "كِتَابُهُ", phonetic: "Kitabuhu" },
  { id: 12004, category: "Pista 12: La anexión", spanish: "El libro del profesor", arabic: "كِتَابُ الْأُسْتَاذِ", phonetic: "Kitabu l-ustadh" },
  { id: 12005, category: "Pista 12: La anexión", spanish: "Su libro grande", arabic: "كِتَابُهُ الْكَبِيرُ", phonetic: "Kitabuhu l-kabir" },
  { id: 12006, category: "Pista 12: La anexión", spanish: "Su libro es grande", arabic: "كِتَابُهُ كَبِيرٌ", phonetic: "Kitabuhu kabir" },
  { id: 12007, category: "Pista 12: La anexión", spanish: "El libro grande del profesor", arabic: "كِتَابُ الْأُسْتَاذِ الْكَبِيرُ", phonetic: "Kitabu l-ustadhi l-kabir" },
  { id: 12008, category: "Pista 12: La anexión", spanish: "El libro del profesor es grande", arabic: "كِتَابُ الْأُسْتَاذِ كَبِيرٌ", phonetic: "Kitabu l-ustadhi kabir" },
  { id: 12009, category: "Pista 12: La anexión", spanish: "El libro del profesor de árabe", arabic: "كِتَابُ أُسْتَاذِ الْعَرَبِيَّةِ", phonetic: "Kitabu ustadhi l-arabiyya" },
  { id: 12010, category: "Pista 12: La anexión", spanish: "Mi pelota", arabic: "كُرَتِي", phonetic: "Kurati" },
  { id: 12011, category: "Pista 12: La anexión", spanish: "Tu pelota (masc.)", arabic: "كُرَتُكَ", phonetic: "Kuratuka" },
  { id: 12012, category: "Pista 12: La anexión", spanish: "Su pelota (de él)", arabic: "كُرَتُهُ", phonetic: "Kuratuhu" },
  { id: 12013, category: "Pista 12: La anexión", spanish: "La pelota del niño", arabic: "كُرَةُ الْوَلَدِ", phonetic: "Kuratu l-walad" },
  { id: 12014, category: "Pista 12: La anexión", spanish: "Mi pelota grande", arabic: "كُرَتِي الْكَبِيرَةُ", phonetic: "Kurati l-kabira" },
  { id: 12015, category: "Pista 12: La anexión", spanish: "Su pelota grande", arabic: "كُرَتُهُ الْكَبِيرَةُ", phonetic: "Kuratuhu l-kabira" },
  { id: 12016, category: "Pista 12: La anexión", spanish: "Su pelota es grande", arabic: "كُرَتُهُ كَبِيرَةٌ", phonetic: "Kuratuhu kabira" },
  { id: 12017, category: "Pista 12: La anexión", spanish: "La pelota grande del niño", arabic: "كُرَةُ الْوَلَدِ الْكَبِيرَةُ", phonetic: "Kuratu l-waladi l-kabira" },
  { id: 12018, category: "Pista 12: La anexión", spanish: "La pelota del niño es grande", arabic: "كُرَةُ الْوَلَدِ كَبِيرَةٌ", phonetic: "Kuratu l-waladi kabira" },

  // Pista 13: Escribir (13000+)
  { id: 13001, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Escribir", arabic: "يَكْتُبُ", phonetic: "Yaktubu" },
  { id: 13002, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Yo escribo", arabic: "أَنَا أَكْتُبُ", phonetic: "Ana aktubu" },
  { id: 13003, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Tú escribes (masc.)", arabic: "أَنْتَ تَكْتُبُ", phonetic: "Anta taktubu" },
  { id: 13004, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Tú escribes (fem.)", arabic: "أَنْتِ تَكْتُبِينَ", phonetic: "Anti taktubina" },
  { id: 13005, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Él escribe", arabic: "هُوَ يَكْتُبُ", phonetic: "Huwa yaktubu" },
  { id: 13006, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Ella escribe", arabic: "هِيَ تَكْتُبُ", phonetic: "Hiya taktubu" },
  { id: 13007, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Nosotros escribimos", arabic: "نَحْنُ نَكْتُبُ", phonetic: "Nahnu naktubu" },
  { id: 13008, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Vosotros escribís", arabic: "أَنْتُمْ تَكْتُبُونَ", phonetic: "Antum taktubuna" },
  { id: 13009, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Vosotras escribís", arabic: "أَنْتُنَّ تَكْتُبْنَ", phonetic: "Antunna taktubna" },
  { id: 13010, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Ellos escriben", arabic: "هُمْ يَكْتُبُونَ", phonetic: "Hum yaktubuna" },
  { id: 13011, category: "Pista 13: El verbo en presente (Escribir)", spanish: "Ellas escriben", arabic: "هُنَّ يَكْتُبْنَ", phonetic: "Hunna yaktubna" },

  // Pista 14: Vivir (14000+)
  { id: 14001, category: "Pista 14: Verbo vivir", spanish: "Vivir", arabic: "يَسْكُنُ", phonetic: "Yaskunu" },
  { id: 14002, category: "Pista 14: Verbo vivir", spanish: "Yo vivo", arabic: "أَنَا أَسْكُنُ", phonetic: "Ana askunu" },
  { id: 14003, category: "Pista 14: Verbo vivir", spanish: "Tú vives (masc.)", arabic: "أَنْتَ تَسْكُنُ", phonetic: "Anta taskunu" },
  { id: 14004, category: "Pista 14: Verbo vivir", spanish: "Tú vives (fem.)", arabic: "أَنْتِ تَسْكُنِينَ", phonetic: "Anti taskunina" },
  { id: 14005, category: "Pista 14: Verbo vivir", spanish: "Él vive", arabic: "هُوَ يَسْكُنُ", phonetic: "Huwa yaskunu" },
  { id: 14006, category: "Pista 14: Verbo vivir", spanish: "Ella vive", arabic: "هِيَ تَسْكُنُ", phonetic: "Hiya taskunu" },
  { id: 14007, category: "Pista 14: Verbo vivir", spanish: "Nosotros vivimos", arabic: "نَحْنُ نَسْكُنُ", phonetic: "Nahnu naskunu" },
  { id: 14008, category: "Pista 14: Verbo vivir", spanish: "Vosotros vivís", arabic: "أَنْتُمْ تَسْكُنُونَ", phonetic: "Antum taskununa" },
  { id: 14009, category: "Pista 14: Verbo vivir", spanish: "Vosotras vivís", arabic: "أَنْتُنَّ تَسْكُنَّ", phonetic: "Antunna taskunna" },
  { id: 14010, category: "Pista 14: Verbo vivir", spanish: "Ellos viven", arabic: "هُمْ يَسْكُنُونَ", phonetic: "Hum yaskununa" },
  { id: 14011, category: "Pista 14: Verbo vivir", spanish: "Ellas viven", arabic: "هُنَّ يَسْكُنَّ", phonetic: "Hunna yaskunna" },
  { id: 14012, category: "Pista 14: Verbo vivir", spanish: "¿Dónde vives, Nabil?", arabic: "أَيْنَ تَسْكُنُ يَا نَبِيلُ؟", phonetic: "Ayna taskunu ya Nabil?" },
  { id: 14013, category: "Pista 14: Verbo vivir", spanish: "Vivo en Valencia", arabic: "أَسْكُنُ فِي بَلَنْسِيَةَ", phonetic: "Askunu fi Balansiya" },
  { id: 14014, category: "Pista 14: Verbo vivir", spanish: "¿Dónde vives, Fátima?", arabic: "أَيْنَ تَسْكُنِينَ يَا فَاطِمَةُ؟", phonetic: "Ayna taskunina ya Fatima?" },
  { id: 14015, category: "Pista 14: Verbo vivir", spanish: "Vivo en Madrid", arabic: "أَسْكُنُ فِي مَدْرِيدَ", phonetic: "Askunu fi Madrid" },
  { id: 14016, category: "Pista 14: Verbo vivir", spanish: "¿En qué calle vives, Marwán?", arabic: "فِي أَيِّ شَارِعٍ تَسْكُنُ يَا مَرْوَانُ؟", phonetic: "Fi ayyi shari'in taskunu ya Marwan?" },
  { id: 14017, category: "Pista 14: Verbo vivir", spanish: "Vivo en la calle Jesús", arabic: "أَسْكُنُ فِي شَارِعِ خِيسُوس", phonetic: "Askunu fi shari' Jesus" },
  { id: 14018, category: "Pista 14: Verbo vivir", spanish: "¿Y en qué número?", arabic: "وَفِي أَيِّ رَقْمٍ؟", phonetic: "Wa fi ayyi raqmin?" },
  { id: 14019, category: "Pista 14: Verbo vivir", spanish: "En el número diez", arabic: "فِي رَقْمِ عَشَرَة", phonetic: "Fi raqm 'ashara" },
  { id: 14020, category: "Pista 14: Verbo vivir", spanish: "¿Vives en una casa o en un piso?", arabic: "أَتَسْكُنُ فِي بَيْتٍ أَمْ فِي شَقَّةٍ؟", phonetic: "A-taskunu fi baytin am fi shaqqa?" },
  { id: 14021, category: "Pista 14: Verbo vivir", spanish: "Vivo en un piso", arabic: "أَسْكُنُ فِي شَقَّةٍ", phonetic: "Askunu fi shaqqa" },
  { id: 14022, category: "Pista 14: Verbo vivir", spanish: "Soy de Cuenca pero vivo en Valencia", arabic: "أَنَا مِنْ كُوِينْكَا وَلَكِنْ أَسْكُنُ فِي بَلَنْسِيَةَ", phonetic: "Ana min Cuenca wa lakin askunu fi Balansiya" },

  // Pista 15: Estudiar (15000+)
  { id: 15001, category: "Pista 15: Verbo estudiar", spanish: "Estudiar", arabic: "يَدْرُسُ", phonetic: "Yadrusu" },
  { id: 15002, category: "Pista 15: Verbo estudiar", spanish: "Yo estudio", arabic: "أَنَا أَدْرُسُ", phonetic: "Ana adrusu" },
  { id: 15003, category: "Pista 15: Verbo estudiar", spanish: "Tú estudias (masc.)", arabic: "أَنْتَ تَدْرُسُ", phonetic: "Anta tadrusu" },
  { id: 15004, category: "Pista 15: Verbo estudiar", spanish: "Tú estudias (fem.)", arabic: "أَنْتِ تَدْرُسِينَ", phonetic: "Anti tadrusina" },
  { id: 15005, category: "Pista 15: Verbo estudiar", spanish: "Él estudia", arabic: "هُوَ يَدْرُسُ", phonetic: "Huwa yadrusu" },
  { id: 15006, category: "Pista 15: Verbo estudiar", spanish: "Ella estudia", arabic: "هِيَ تَدْرُسُ", phonetic: "Hiya tadrusu" },
  { id: 15007, category: "Pista 15: Verbo estudiar", spanish: "Nosotros estudiamos", arabic: "نَحْنُ نَدْرُسُ", phonetic: "Nahnu nadrusu" },
  { id: 15008, category: "Pista 15: Verbo estudiar", spanish: "Vosotros estudiáis", arabic: "أَنْتُمْ تَدْرُسُونَ", phonetic: "Antum tadrusuna" },
  { id: 15009, category: "Pista 15: Verbo estudiar", spanish: "Vosotras estudiáis", arabic: "أَنْتُنَّ تَدْرُسْنَ", phonetic: "Antunna tadrusna" },
  { id: 15010, category: "Pista 15: Verbo estudiar", spanish: "Ellos estudian", arabic: "هُمْ يَدْرُسُونَ", phonetic: "Hum yadrusuna" },
  { id: 15011, category: "Pista 15: Verbo estudiar", spanish: "Ellas estudian", arabic: "هُنَّ يَدْرُسْنَ", phonetic: "Hunna yadrusna" },
  { id: 15012, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudias, Muhammad?", arabic: "مَاذَا تَدْرُسُ يَا مُحَمَّدُ؟", phonetic: "Madha tadrusu ya Muhammad?" },
  { id: 15013, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe", arabic: "أَدْرُسُ الْعَرَبِيَّةَ", phonetic: "Adrusu al-arabiyya" },
  { id: 15014, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudias, Samira?", arabic: "مَاذَا تَدْرُسِينَ يَا سَمِيرَةُ؟", phonetic: "Madha tadrusina ya Samira?" },
  { id: 15015, category: "Pista 15: Verbo estudiar", spanish: "Estudio Lengua Inglesa", arabic: "أَدْرُسُ اللُّغَةَ الْإِنْجِلِيزِيَّةَ", phonetic: "Adrusu al-lugha al-injiliziyya" },
  { id: 15016, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudia Latif?", arabic: "مَاذَا يَدْرُسُ لَطِيفٌ؟", phonetic: "Madha yadrusu Latif?" },
  { id: 15017, category: "Pista 15: Verbo estudiar", spanish: "Estudia Lengua Francesa", arabic: "هُوَ يَدْرُسُ اللُّغَةَ الْفَرَنْسِيَّةَ", phonetic: "Huwa yadrusu al-lugha al-faransiyya" },
  { id: 15018, category: "Pista 15: Verbo estudiar", spanish: "¿Qué estudia Munira?", arabic: "مَاذَا تَدْرُسُ مُنِيرَةُ؟", phonetic: "Madha tadrusu Munira?" },
  { id: 15019, category: "Pista 15: Verbo estudiar", spanish: "Estudia Lengua Portuguesa", arabic: "هِيَ تَدْرُسُ اللُّغَةَ الْبُرْتُغَالِيَّةَ", phonetic: "Hiya tadrusu al-lugha al-burtughaliyya" },
  { id: 15020, category: "Pista 15: Verbo estudiar", spanish: "¿Dónde estudias Árabe, Nabil?", arabic: "أَيْنَ تَدْرُسُ الْعَرَبِيَّةَ يَا نَبِيلُ؟", phonetic: "Ayna tadrusu al-arabiyya ya Nabil?" },
  { id: 15021, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe en la Escuela de Idiomas", arabic: "أَدْرُسُ الْعَرَبِيَّةَ فِي مَدْرَسَةِ اللُّغَاتِ", phonetic: "Adrusu al-arabiyya fi madrasat al-lughat" },
  { id: 15022, category: "Pista 15: Verbo estudiar", spanish: "¿Dónde estudias Inglés, Karima?", arabic: "أَيْنَ تَدْرُسِينَ الْإِنْجِلِيزِيَّةَ يَا كَرِيمَةُ؟", phonetic: "Ayna tadrusina al-injiliziyya ya Karima?" },
  { id: 15023, category: "Pista 15: Verbo estudiar", spanish: "Estudio Inglés en la Universidad", arabic: "أَدْرُسُ الْإِنْجِلِيزِيَّةَ فِي الْجَامِعَةِ", phonetic: "Adrusu al-injiliziyya fi al-jami'a" },
  { id: 15024, category: "Pista 15: Verbo estudiar", spanish: "¿Cuándo estudias Árabe, Marwán?", arabic: "مَتَى تَدْرُسُ الْعَرَبِيَّةَ يَا مَرْوَانُ؟", phonetic: "Mata tadrusu al-arabiyya ya Marwan?" },
  { id: 15025, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe por la mañana", arabic: "أَدْرُسُ الْعَرَبِيَّةَ فِي الصَّبَاحِ", phonetic: "Adrusu al-arabiyya fi as-sabah" },
  { id: 15026, category: "Pista 15: Verbo estudiar", spanish: "¿Cuándo estudias Árabe, Rashida?", arabic: "مَتَى تَدْرُسِينَ الْعَرَبِيَّةَ يَا رَشِيدَةُ؟", phonetic: "Mata tadrusina ya Rashida?" },
  { id: 15027, category: "Pista 15: Verbo estudiar", spanish: "Estudio Árabe por la tarde", arabic: "أَدْرُسُ الْعَرَبِيَّةَ فِي الْمَسَاءِ", phonetic: "Adrusu al-arabiyya fi al-masa'" },

  // Pista 16: Hablar (16000+)
  { id: 16001, category: "Pista 16: Verbo hablar", spanish: "Hablar", arabic: "يَتَكَلَّمُ", phonetic: "Yatakallamu" },
  { id: 16002, category: "Pista 16: Verbo hablar", spanish: "Yo hablo", arabic: "أَنَا أَتَكَلَّمُ", phonetic: "Ana atakallamu" },
  { id: 16003, category: "Pista 16: Verbo hablar", spanish: "Tú hablas (masc.)", arabic: "أَنْتَ تَتَكَلَّمُ", phonetic: "Anta tatakallamu" },
  { id: 16004, category: "Pista 16: Verbo hablar", spanish: "Tú hablas (fem.)", arabic: "أَنْتِ تَتَكَلَّمِينَ", phonetic: "Anti tatakallamina" },
  { id: 16005, category: "Pista 16: Verbo hablar", spanish: "Él habla", arabic: "هُوَ يَتَكَلَّمُ", phonetic: "Huwa yatakallamu" },
  { id: 16006, category: "Pista 16: Verbo hablar", spanish: "Ella habla", arabic: "هِيَ تَتَكَلَّمُ", phonetic: "Hiya tatakallamu" },
  { id: 16007, category: "Pista 16: Verbo hablar", spanish: "Nosotros hablamos", arabic: "نَحْنُ نَتَكَلَّمُ", phonetic: "Nahnu natakallamu" },
  { id: 16008, category: "Pista 16: Verbo hablar", spanish: "Vosotros habláis", arabic: "أَنْتُمْ تَتَكَلَّمُونَ", phonetic: "Antum tatakallamuna" },
  { id: 16009, category: "Pista 16: Verbo hablar", spanish: "Vosotras habláis", arabic: "أَنْتُنَّ تَتَكَلَّمْنَ", phonetic: "Antunna tatakallamna" },
  { id: 16010, category: "Pista 16: Verbo hablar", spanish: "Ellos hablan", arabic: "هُمْ يَتَكَلَّمُونَ", phonetic: "Hum yatakallamuna" },
  { id: 16011, category: "Pista 16: Verbo hablar", spanish: "Ellas hablan", arabic: "هُنَّ يَتَكَلَّمْنَ", phonetic: "Hunna tatakallamna" },
  { id: 16012, category: "Pista 16: Verbo hablar", spanish: "¿Qué idiomas hablas, Karim?", arabic: "أَيُّ لُغَاتٍ تَتَكَلَّمُ يَا كَرِيمُ؟", phonetic: "Ayyu lughatin tatakallamu ya Karim?" },
  { id: 16013, category: "Pista 16: Verbo hablar", spanish: "Hablo español, árabe y francés", arabic: "أَتَكَلَّمُ الْإِسْبَانِيَّةَ وَالْعَرَبِيَّةَ وَالْفَرَنْسِيَّةَ", phonetic: "Atakallamu al-isbaniyya wa al-arabiyya wa al-faransiyya" },
  { id: 16014, category: "Pista 16: Verbo hablar", spanish: "¿Qué lenguas hablas, Fátima?", arabic: "أَيُّ لُغَاتٍ تَتَكَلَّمِينَ يَا فَاطِمَةُ؟", phonetic: "Ayyu lughatin tatakallamina ya Fatima?" },
  { id: 16015, category: "Pista 16: Verbo hablar", spanish: "Hablo ruso, alemán e italiano", arabic: "أَتَكَلَّمُ الرُّوسِيَّةَ وَالْأَلْمَانِيَّةَ وَالْإِيطَالِيَّةَ", phonetic: "Atakallamu ar-rusiyya wa al-almaniyya wa al-italiyya" },
  { id: 16016, category: "Pista 16: Verbo hablar", spanish: "¿Cómo hablas el inglés, Samir?", arabic: "كَيْفَ تَتَكَلَّمُ الْإِنْجِلِيزِيَّةَ يَا سَمِيرُ؟", phonetic: "Kayfa tatakallamu al-injiliziyya ya Samir?" },
  { id: 16017, category: "Pista 16: Verbo hablar", spanish: "Hablo inglés muy bien", arabic: "أَتَكَلَّمُ الْإِنْجِلِيزِيَّةَ جَيِّدًا", phonetic: "Atakallamu al-injiliziyya jayyidan" },
  { id: 16018, category: "Pista 16: Verbo hablar", spanish: "¿Cómo hablas el francés, Habiba?", arabic: "كَيْفَ تَتَكَلَّمِينَ الْفَرَنْسِيَّةَ يَا حَبِيبَةُ؟", phonetic: "Kayfa tatakallamina al-faransiyya ya Habiba?" },
  { id: 16019, category: "Pista 16: Verbo hablar", spanish: "Hablo francés regular", arabic: "أَتَكَلَّمُ الْفَرَنْسِيَّةَ بَيْنَ بَيْنَ", phonetic: "Atakallamu al-faransiyya bayna bayna" },
  { id: 16020, category: "Pista 16: Verbo hablar", spanish: "¿Cómo hablas el ruso, Latifa?", arabic: "كَيْفَ تَتَكَلَّمِينَ الرُّوسِيَّةَ يَا لَطِيفَةُ؟", phonetic: "Kayfa tatakallamina ar-rusiyya ya Latifa?" },
  { id: 16021, category: "Pista 16: Verbo hablar", spanish: "Hablo ruso un poco", arabic: "أَتَكَلَّمُ الرُّوسِيَّةَ قَلِيلًا", phonetic: "Atakallamu ar-rusiyya qalilan" },

  // Pista 17: Ir (17000+)
  { id: 17001, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ir", arabic: "يَذْهَبُ", phonetic: "Yadhabu" },
  { id: 17002, category: "Pista 17: Verbo ir (يذهب)", spanish: "Yo voy", arabic: "أَنَا أَذْهَبُ", phonetic: "Ana adhabu" },
  { id: 17003, category: "Pista 17: Verbo ir (يذهب)", spanish: "Tú vas (masc.)", arabic: "أَنْتَ تَذْهَبُ", phonetic: "Anta tadhabu" },
  { id: 17004, category: "Pista 17: Verbo ir (يذهب)", spanish: "Tú vas (fem.)", arabic: "أَنْتِ تَذْهَبِينَ", phonetic: "Anti tadhabina" },
  { id: 17005, category: "Pista 17: Verbo ir (يذهب)", spanish: "Él va", arabic: "هُوَ يَذْهَبُ", phonetic: "Huwa yadhabu" },
  { id: 17006, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ella va", arabic: "هِيَ تَذْهَبُ", phonetic: "Hiya tadhabu" },
  { id: 17007, category: "Pista 17: Verbo ir (يذهب)", spanish: "Nosotros vamos", arabic: "نَحْنُ نَذْهَبُ", phonetic: "Nahnu nadhabu" },
  { id: 17008, category: "Pista 17: Verbo ir (يذهب)", spanish: "Vosotros vais", arabic: "أَنْتُمْ تَذْهَبُونَ", phonetic: "Antum tadhabuna" },
  { id: 17009, category: "Pista 17: Verbo ir (يذهب)", spanish: "Vosotras vais", arabic: "أَنْتُنَّ تَذْهَبْنَ", phonetic: "Antunna tadhabna" },
  { id: 17010, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ellos van", arabic: "هُمْ يَذْهَبُونَ", phonetic: "Hum yadhabuna" },
  { id: 17011, category: "Pista 17: Verbo ir (يذهب)", spanish: "Ellas van", arabic: "هُنَّ يَذْهَبْنَ", phonetic: "Hunna tadhabna" },
  { id: 17012, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿A dónde vas, Nabil?", arabic: "إِلَى أَيْنَ تَذْهَبُ يَا نَبِيلُ؟", phonetic: "Ila ayna tadhabu ya Nabil?" },
  { id: 17013, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la escuela", arabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ", phonetic: "Adhabu ila al-madrasa" },
  { id: 17014, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿A dónde vas, Samira?", arabic: "إِلَى أَيْنَ تَذْهَبِينَ يَا سَمِيرَةُ؟", phonetic: "Ila ayna tadhabina ya Samira?" },
  { id: 17015, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a casa", arabic: "أَذْهَبُ إِلَى الْبَيْتِ", phonetic: "Adhabu ila al-bayt" },
  { id: 17016, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas a la escuela, Karim?", arabic: "كَيْفَ تَذْهَبُ إِلَى الْمَدْرَسَةِ يَا كَرِيمُ؟", phonetic: "Kayfa tadhabu ila al-madrasa ya Karim?" },
  { id: 17017, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la escuela en autobús", arabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالْبَاصِ", phonetic: "Adhabu ila al-madrasa bil-bas" },
  { id: 17018, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas a la escuela, Yamila?", arabic: "كَيْفَ تَذْهَبِينَ إِلَى الْمَدْرَسَةِ يَا جَمِيلَةُ؟", phonetic: "Kayfa tadhabina ila al-madrasa ya Jamila?" },
  { id: 17019, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la escuela en coche", arabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالسَّيَّارَةِ", phonetic: "Adhabu ila al-madrasa bis-sayyara" },
  { id: 17020, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas al cine, Yamal?", arabic: "كَيْفَ تَذْهَبُ إِلَى السِّينِمَا يَا جَمَالُ؟", phonetic: "Kayfa tadhabu ila as-sinima ya Jamal?" },
  { id: 17021, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy al cine andando", arabic: "أَذْهَبُ إِلَى السِّينِمَا مَشْيًا", phonetic: "Adhabu ila as-sinima mashyan" },
  { id: 17022, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas a la Universidad, Nadia?", arabic: "كَيْفَ تَذْهَبِينَ إِلَى الْجَامِعَةِ يَا نَادِيَةُ؟", phonetic: "Kayfa tadhabina ila al-jami'a ya Nadia?" },
  { id: 17023, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy a la Universidad en metro", arabic: "أَذْهَبُ إِلَى الْجَامِعَةِ بِالْمِتْرُو", phonetic: "Adhabu ila al-jami'a bil-mitru" },
  { id: 17024, category: "Pista 17: Verbo ir (يذهب)", spanish: "¿Cómo vas de tu casa a la escuela?", arabic: "كَيْفَ تَذْهَبُ مِنْ بَيْتِكَ إِلَى الْمَدْرَسَةِ؟", phonetic: "Kayfa tadhabu min baytika ila al-madrasa?" },
  { id: 17025, category: "Pista 17: Verbo ir (يذهب)", spanish: "Voy de mi casa a la escuela en coche", arabic: "أَذْهَبُ مِنْ بَيْتِي إِلَى الْمَدْرَسَةِ بِالسَّيَّارَةِ", phonetic: "Adhabu min bayti ila al-madrasa bis-sayyara" },

  // Pista 18: Clase (18000+)
  { id: 18001, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Qué significa 'Saa'?", arabic: "مَا مَعْنَى سَاعَة؟", phonetic: "Ma ma'na sa'a?" },
  { id: 18002, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Cómo decimos en árabe 'reloj'?", arabic: "كَيْفَ نَقُولُ بِالْعَرَبِيَّة 'reloj'؟", phonetic: "Kayfa naqulu bil-arabiyya 'reloj'?" },
  { id: 18003, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Cómo escribimos en árabe 'reloj'?", arabic: "كَيْفَ نَكْتُبُ بِالْعَرَبِيَّة 'reloj'؟", phonetic: "Kayfa naktubu bil-arabiyya 'reloj'?" },
  { id: 18004, category: "Pista 18: Expresiones útiles para clase", spanish: "No sé", arabic: "لَا أَعْرِفُ", phonetic: "La a'rifu" },
  { id: 18005, category: "Pista 18: Expresiones útiles para clase", spanish: "No (lo) entiendo", arabic: "لَا أَفْهَمُ", phonetic: "La afhamu" },
  { id: 18006, category: "Pista 18: Expresiones útiles para clase", spanish: "¿Puedes repetir(lo)?", arabic: "مُمْكِن التِّكْرَار؟", phonetic: "Mumkin at-tikrar?" },
  { id: 18007, category: "Pista 18: Expresiones útiles para clase", spanish: "Tengo una pregunta", arabic: "عِنْدِي سُؤَال", phonetic: "Indi su'al" },
  { id: 18008, category: "Pista 18: Expresiones útiles para clase", spanish: "Adelante (masc. / fem. / pl.)", arabic: "تَفَضَّلْ / تَفَضَّلِي / تَفَضَّلُوا", phonetic: "Tafaddal / Tafaddali / Tafaddalu" },
  { id: 18009, category: "Pista 18: Expresiones útiles para clase", spanish: "Palabra", arabic: "كَلِمَة", phonetic: "Kalima" },
  { id: 18010, category: "Pista 18: Expresiones útiles para clase", spanish: "Frase", arabic: "جُمْلَة", phonetic: "Jumla" },
  { id: 18011, category: "Pista 18: Expresiones útiles para clase", spanish: "Página", arabic: "صَفْحَة", phonetic: "Safha" },
  { id: 18012, category: "Pista 18: Expresiones útiles para clase", spanish: "Ejercicio", arabic: "تَمْرِين", phonetic: "Tamrin" },
  { id: 18013, category: "Pista 18: Expresiones útiles para clase", spanish: "Ejercicios", arabic: "تَمَارِين", phonetic: "Tamarin" },
  { id: 18014, category: "Pista 18: Expresiones útiles para clase", spanish: "Escribe (masc.)", arabic: "اُكْتُبْ", phonetic: "Uktub" },
  { id: 18015, category: "Pista 18: Expresiones útiles para clase", spanish: "Escribe (fem.)", arabic: "اُكْتُبِي", phonetic: "Uktubi" },
  { id: 18016, category: "Pista 18: Expresiones útiles para clase", spanish: "Escribid", arabic: "اُكْتُبُوا", phonetic: "Uktubu" },
  { id: 18017, category: "Pista 18: Expresiones útiles para clase", spanish: "Lee (masc.)", arabic: "اِقْرَأْ", phonetic: "Iqra'" },
  { id: 18018, category: "Pista 18: Expresiones útiles para clase", spanish: "Lee (fem.)", arabic: "اِقْرَئِي", phonetic: "Iqra'i" },
  { id: 18019, category: "Pista 18: Expresiones útiles para clase", spanish: "Leed", arabic: "اِقْرَؤُوا", phonetic: "Iqra'u" },
  { id: 18020, category: "Pista 18: Expresiones útiles para clase", spanish: "Escucha (masc.)", arabic: "اِسْمَعْ", phonetic: "Isma'" },
  { id: 18021, category: "Pista 18: Expresiones útiles para clase", spanish: "Escucha (fem.)", arabic: "اِسْمَعِي", phonetic: "Isma'i" },
  { id: 18022, category: "Pista 18: Expresiones útiles para clase", spanish: "Escuchad", arabic: "اِسْمَعُوا", phonetic: "Isma'u" },

  // Pista 19: Estado civil (19000+)
  { id: 19001, category: "Pista 19: El estado civil", spanish: "Soltero", arabic: "عَازِب", phonetic: "Azib" },
  { id: 19002, category: "Pista 19: El estado civil", spanish: "Soltera", arabic: "عَازِبَة", phonetic: "Aziba" },
  { id: 19003, category: "Pista 19: El estado civil", spanish: "Casado", arabic: "مُتَزَوِّج", phonetic: "Mutazawwij" },
  { id: 19004, category: "Pista 19: El estado civil", spanish: "Casada", arabic: "مُتَزَوِّجَة", phonetic: "Mutazawwija" },
  { id: 19005, category: "Pista 19: El estado civil", spanish: "Divorciado", arabic: "مُطَلَّق", phonetic: "Mutallaq" },
  { id: 19006, category: "Pista 19: El estado civil", spanish: "Divorciada", arabic: "مُطَلَّقَة", phonetic: "Mutallaqa" },
  { id: 19007, category: "Pista 19: El estado civil", spanish: "Viudo", arabic: "أَرْمَل", phonetic: "Armal" },
  { id: 19008, category: "Pista 19: El estado civil", spanish: "Viuda", arabic: "أَرْمَلَة", phonetic: "Armala" },
  { id: 19009, category: "Pista 19: El estado civil", spanish: "¿Estás casado, Karim?", arabic: "هَلْ أَنْتَ مُتَزَوِّجٌ يَا كَرِيمُ؟", phonetic: "Hal anta mutazawwijun ya Karim?" },
  { id: 19010, category: "Pista 19: El estado civil", spanish: "No, soy soltero", arabic: "لَا، أَنَا عَازِبٌ", phonetic: "La, ana azib" },
  { id: 19011, category: "Pista 19: El estado civil", spanish: "¿Estás casada, Latifa?", arabic: "هَلْ أَنْتِ مُتَزَوِّجَةٌ يَا لَطِيفَةُ؟", phonetic: "Hal anti mutazawwijatun ya Latifa?" },
  { id: 19012, category: "Pista 19: El estado civil", spanish: "No, soy soltera", arabic: "لَا، أَنَا عَازِبَةٌ", phonetic: "La, ana aziba" },
  { id: 19013, category: "Pista 19: El estado civil", spanish: "¿Y cuál es tu número de teléfono?", arabic: "وَمَا رَقْمُ تِلِيفُونِكَ؟", phonetic: "Wa ma raqmu tilifunik?" },
  { id: 19014, category: "Pista 19: El estado civil", spanish: "Mi número de teléfono es el 6924851", arabic: "رَقْمُ تِلِيفُونِي: 6924851", phonetic: "Raqmu tilifuni: ..." },
  { id: 19015, category: "Pista 19: El estado civil", spanish: "Gracias", arabic: "شُكْرًا", phonetic: "Shukran" },
  { id: 19016, category: "Pista 19: El estado civil", spanish: "De nada", arabic: "عَفْوًا", phonetic: "Afwan" },

  // Pista 20: La casa (20000+)
  { id: 20001, category: "Pista 20: La casa", spanish: "Entrada", arabic: "مَدْخَل", phonetic: "Madkhal" },
  { id: 20002, category: "Pista 20: La casa", spanish: "Pasillo", arabic: "مَمَرّ", phonetic: "Mamarr" },
  { id: 20003, category: "Pista 20: La casa", spanish: "Habitación", arabic: "غُرْفَة", phonetic: "Ghurfa" },
  { id: 20004, category: "Pista 20: La casa", spanish: "Cuarto de estar", arabic: "غُرْفَة جُلُوس", phonetic: "Ghurfat julus" },
  { id: 20005, category: "Pista 20: La casa", spanish: "Salón", arabic: "صَالُون", phonetic: "Salun" },
  { id: 20006, category: "Pista 20: La casa", spanish: "Dormitorio", arabic: "غُرْفَة نَوْم", phonetic: "Ghurfat nawm" },
  { id: 20007, category: "Pista 20: La casa", spanish: "Comedor", arabic: "غُرْفَة أَكْل", phonetic: "Ghurfat akl" },
  { id: 20008, category: "Pista 20: La casa", spanish: "Baño", arabic: "حَمَّام", phonetic: "Hammam" },
  { id: 20009, category: "Pista 20: La casa", spanish: "Retrete", arabic: "مِرْحَاض", phonetic: "Mirhad" },
  { id: 20010, category: "Pista 20: La casa", spanish: "Garaje", arabic: "كَرَاج", phonetic: "Kraj" },
  { id: 20011, category: "Pista 20: La casa", spanish: "Balcón", arabic: "شُرْفَة", phonetic: "Shurfa" },
  { id: 20012, category: "Pista 20: La casa", spanish: "Despacho", arabic: "مَكْتَب", phonetic: "Maktab" },
  { id: 20013, category: "Pista 20: La casa", spanish: "Cocina", arabic: "مَطْبَخ", phonetic: "Matbakh" },
  { id: 20014, category: "Pista 20: La casa", spanish: "Habitación de invitados", arabic: "غُرْفَة ضُيُوف", phonetic: "Ghurfat duyuf" },
  { id: 20015, category: "Pista 20: La casa", spanish: "Jardín", arabic: "حَدِيقَة", phonetic: "Hadiqa" },
  { id: 20016, category: "Pista 20: La casa", spanish: "¿Marwan, qué hay en tu casa?", arabic: "يَا مَرْوَانُ، مَاذَا يُوجَدُ فِي بَيْتِكَ؟", phonetic: "Ya Marwan, madha yujadu fi baytika?" },
  { id: 20017, category: "Pista 20: La casa", spanish: "En mi casa hay una pequeña entrada...", arabic: "فِي بَيْتِي مَدْخَلٌ صَغِيرٌ...", phonetic: "Fi bayti madkhalun..." },
  { id: 20018, category: "Pista 20: La casa", spanish: "¿Latifa, qué hay en tu dormitorio?", arabic: "يَا لَطِيفَةُ، مَاذَا يُوجَدُ فِي غُرْفَةِ نَوْمِكِ؟", phonetic: "Ya Latifa, madha yujadu..." },
  { id: 20019, category: "Pista 20: La casa", spanish: "En mi dormitorio hay una cama...", arabic: "فِي غُرْفَةِ نَوْمِي سَرِيرٌ...", phonetic: "Fi ghurfati nawmi..." },
  { id: 20020, category: "Pista 20: La casa", spanish: "¿Dónde vives Rashid?", arabic: "أَيْنَ تَسْكُنُ يَا رَشِيدُ؟", phonetic: "Ayna taskunu ya Rashid?" },
  { id: 20021, category: "Pista 20: La casa", spanish: "Vivo en un edificio antiguo...", arabic: "أَسْكُنُ فِي بِنَايَةٍ قَدِيمَةٍ...", phonetic: "Askunu fi binayatin..." },

  // Pista 21: Establecimientos (21000+)
  { id: 21001, category: "Pista 21: Establecimientos", spanish: "Carnicería", arabic: "مَجْزَرَة", phonetic: "Majzara" },
  { id: 21002, category: "Pista 21: Establecimientos", spanish: "Panadería", arabic: "مَخْبَزَة", phonetic: "Makhbaza" },
  { id: 21003, category: "Pista 21: Establecimientos", spanish: "Biblioteca; librería", arabic: "مَكْتَبَة", phonetic: "Maktaba" },
  { id: 21004, category: "Pista 21: Establecimientos", spanish: "Cafetería", arabic: "مَقْهًى", phonetic: "Maqha" },
  { id: 21005, category: "Pista 21: Establecimientos", spanish: "Ayuntamiento", arabic: "بَلَدِيَّة", phonetic: "Baladiyya" },
  { id: 21006, category: "Pista 21: Establecimientos", spanish: "Restaurante", arabic: "مَطْعَم", phonetic: "Mat'am" },
  { id: 21007, category: "Pista 21: Establecimientos", spanish: "Hotel", arabic: "فُنْدُق", phonetic: "Funduq" },
  { id: 21008, category: "Pista 21: Establecimientos", spanish: "Escuela", arabic: "مَدْرَسَة", phonetic: "Madrasa" },
  { id: 21009, category: "Pista 21: Establecimientos", spanish: "Banco", arabic: "بَنْك", phonetic: "Bank" },
  { id: 21010, category: "Pista 21: Establecimientos", spanish: "Hospital", arabic: "مُسْتَشْفًى", phonetic: "Mustashfa" },
  { id: 21011, category: "Pista 21: Establecimientos", spanish: "Farmacia", arabic: "صَيْدَلِيَّة", phonetic: "Saydaliyya" },
  { id: 21012, category: "Pista 21: Establecimientos", spanish: "Tienda", arabic: "دُكَّان", phonetic: "Dukkan" },
  { id: 21013, category: "Pista 21: Establecimientos", spanish: "Baño público", arabic: "حَمَّام عَامّ", phonetic: "Hammam 'amm" },
  { id: 21014, category: "Pista 21: Establecimientos", spanish: "Cine", arabic: "سِينِمَا", phonetic: "Sinima" },
  { id: 21015, category: "Pista 21: Establecimientos", spanish: "Mezquita", arabic: "مَسْجِد", phonetic: "Masjid" },
  { id: 21016, category: "Pista 21: Establecimientos", spanish: "Iglesia", arabic: "كَنِيسَة", phonetic: "Kanisa" },
  { id: 21017, category: "Pista 21: Establecimientos", spanish: "Peluquero", arabic: "حَلَّاق", phonetic: "Hallaq" },
  { id: 21018, category: "Pista 21: Establecimientos", spanish: "Peluquería", arabic: "حِلَاقَة", phonetic: "Hilaqa" },
  { id: 21019, category: "Pista 21: Establecimientos", spanish: "Tienda, establecimiento", arabic: "مَحَلّ", phonetic: "Mahall" },
  { id: 21020, category: "Pista 21: Establecimientos", spanish: "¿Samira, hay hospital cerca?", arabic: "يَا سَمِيرَةُ، هَلْ هُنَاكَ مُسْتَشْفًى...؟", phonetic: "Ya Samira, hal..." },
  { id: 21021, category: "Pista 21: Establecimientos", spanish: "No hay hospital, pero hay farmacia", arabic: "لَا، لَيْسَ هُنَاكَ... لَكِنْ هُنَاكَ صَيْدَلِيَّةٌ...", phonetic: "La, laysa..." },
  { id: 21022, category: "Pista 21: Establecimientos", spanish: "¿Karim, hay restaurante árabe?", arabic: "يَا كَرِيمُ، هَلْ فِي حَيِّكَ مَطْعَمٌ...؟", phonetic: "Ya Karim, hal..." },
  { id: 21023, category: "Pista 21: Establecimientos", spanish: "Hay un restaurante italiano", arabic: "لَا، لَيْسَ... وَلَكِنْ فِيهِ مَطْعَمٌ إِيطَالِيٌّ", phonetic: "La, laysa..." },
  { id: 21024, category: "Pista 21: Establecimientos", spanish: "¿Nadia, hay baño público?", arabic: "يَا نَادِيَةُ، هَلْ فِي مَدِينَتِكِ حَمَّامٌ...؟", phonetic: "Ya Nadia, hal..." },
  { id: 21025, category: "Pista 21: Establecimientos", spanish: "No, pero hay un cine", arabic: "لَا، لَيْسَ... لَكِنْ فِيهَا سِينِمَا", phonetic: "La, laysa..." },

  // Pista 22: Adverbios (22000+)
  { id: 22001, category: "Pista 22: Adverbios de lugar", spanish: "Debajo", arabic: "تَحْتَ", phonetic: "Tahta" },
  { id: 22002, category: "Pista 22: Adverbios de lugar", spanish: "Delante", arabic: "أَمَامَ", phonetic: "Amama" },
  { id: 22003, category: "Pista 22: Adverbios de lugar", spanish: "Entre", arabic: "بَيْنَ", phonetic: "Bayna" },
  { id: 22004, category: "Pista 22: Adverbios de lugar", spanish: "Sobre", arabic: "عَلَى", phonetic: "Ala" },
  { id: 22005, category: "Pista 22: Adverbios de lugar", spanish: "Encima", arabic: "فَوْقَ", phonetic: "Fawqa" },
  { id: 22006, category: "Pista 22: Adverbios de lugar", spanish: "Detrás (khalfa)", arabic: "خَلْفَ", phonetic: "Khalfa" },
  { id: 22007, category: "Pista 22: Adverbios de lugar", spanish: "Detrás (wara')", arabic: "وَرَاءَ", phonetic: "Wara'a" },
  { id: 22008, category: "Pista 22: Adverbios de lugar", spanish: "Al lado de…", arabic: "بِجَانِبِ...", phonetic: "Bijanibi..." },
  { id: 22009, category: "Pista 22: Adverbios de lugar", spanish: "A la derecha", arabic: "عَلَى الْيَمِينِ", phonetic: "Ala al-yamin" },
  { id: 22010, category: "Pista 22: Adverbios de lugar", spanish: "A la derecha de…", arabic: "عَلَى يَمِينِ...", phonetic: "Ala yamini..." },
  { id: 22011, category: "Pista 22: Adverbios de lugar", spanish: "A la izquierda", arabic: "عَلَى الْيَسَارِ", phonetic: "Ala al-yasar" },
  { id: 22012, category: "Pista 22: Adverbios de lugar", spanish: "A la izquierda de…", arabic: "عَلَى يَسَارِ...", phonetic: "Ala yasari..." },
  { id: 22013, category: "Pista 22: Adverbios de lugar", spanish: "En el centro/medio", arabic: "فِي الْوَسَطِ", phonetic: "Fi al-wasat" },
  { id: 22014, category: "Pista 22: Adverbios de lugar", spanish: "En el centro de…", arabic: "فِي وَسَطِ...", phonetic: "Fi wasati..." },
  { id: 22015, category: "Pista 22: Adverbios de lugar", spanish: "En", arabic: "فِي", phonetic: "Fi" },
  { id: 22016, category: "Pista 22: Adverbios de lugar", spanish: "Dentro", arabic: "دَاخِلَ", phonetic: "Dakhila" },
  { id: 22017, category: "Pista 22: Adverbios de lugar", spanish: "Fuera", arabic: "خَارِجَ", phonetic: "Kharija" },
  { id: 22018, category: "Pista 22: Adverbios de lugar", spanish: "¿Nabil, dónde está la maleta?", arabic: "يَا نَبِيلُ، أَيْنَ الْحَقِيبَةُ؟", phonetic: "Ya Nabil, ayna al-haqiba?" },
  { id: 22019, category: "Pista 22: Adverbios de lugar", spanish: "Está sobre el armario", arabic: "هِيَ عَلَى الْخِزَانَةِ", phonetic: "Hiya 'ala al-khizana" },
  { id: 22020, category: "Pista 22: Adverbios de lugar", spanish: "¿Nadia, donde está el cuadro?", arabic: "يَا نَادِيَةُ، أَيْنَ الصُّورَةُ؟", phonetic: "Ya Nadia, ayna as-sura?" },
  { id: 22021, category: "Pista 22: Adverbios de lugar", spanish: "Está encima de la televisión", arabic: "هِيَ فَوْقَ التِّلْفِزْيُونِ", phonetic: "Hiya fawqa at-tilfizyun" },
  { id: 22022, category: "Pista 22: Adverbios de lugar", spanish: "¿Hasan, dónde está la mesa?", arabic: "يَا حَسَنُ، أَيْنَ الطَّاوِلَةُ؟", phonetic: "Ya Hasan, ayna at-tawila?" },
  { id: 22023, category: "Pista 22: Adverbios de lugar", spanish: "Está entre la cama y la silla", arabic: "هِيَ بَيْنَ السَّرِيرِ وَالْكُرْسِيِّ", phonetic: "Hiya bayna..." },
  { id: 22024, category: "Pista 22: Adverbios de lugar", spanish: "¿Rashida, dónde está la puerta?", arabic: "يَا رَشِيدَةُ، أَيْنَ الْبَابُ؟", phonetic: "Ya Rashida, ayna al-bab?" },
  { id: 22025, category: "Pista 22: Adverbios de lugar", spanish: "Está a la izquierda del armario", arabic: "هُوَ عَلَى يَسَارِ الْخِزَانَةِ", phonetic: "Huwa 'ala yasari..." },
  { id: 22026, category: "Pista 22: Adverbios de lugar", spanish: "¿Rashid, dónde está la alfombra?", arabic: "يَا رَشِيدُ، أَيْنَ السَّجَّادَةُ؟", phonetic: "Ya Rashid, ayna as-sajjada?" },
  { id: 22027, category: "Pista 22: Adverbios de lugar", spanish: "Está debajo de la cama", arabic: "هِيَ تَحْتَ السَّرِيرِ", phonetic: "Hiya tahta as-sarir" },
  { id: 22028, category: "Pista 22: Adverbios de lugar", spanish: "Está en medio de la habitación", arabic: "هِيَ فِي وَسَطِ الْغُرْفَةِ", phonetic: "Hiya fi wasati..." },
  { id: 22029, category: "Pista 22: Adverbios de lugar", spanish: "¿Latif, dónde está la lámpara?", arabic: "يَا لَطِيفُ، أَيْنَ الْمِصْبَاحُ؟", phonetic: "Ya Latif, ayna al-misbah?" },
  { id: 22030, category: "Pista 22: Adverbios de lugar", spanish: "Está sobre la mesita", arabic: "هُوَ عَلَى الْمَائِدَةِ الصَّغِيرَةِ", phonetic: "Huwa 'ala al-ma'ida..." },
  { id: 22031, category: "Pista 22: Adverbios de lugar", spanish: "¿Fátima, dónde está el sofá?", arabic: "يَا فَاطِمَةُ، أَيْنَ الصُّوفَا؟", phonetic: "Ya Fatima, ayna as-sofa?" },
  { id: 22032, category: "Pista 22: Adverbios de lugar", spanish: "Está delante de la puerta", arabic: "هُوَ أَمَامَ الْبَابِ", phonetic: "Huwa amama al-bab" },
  { id: 22033, category: "Pista 22: Adverbios de lugar", spanish: "¿Sabes dónde está el periódico?", arabic: "يَا حَبِيبِي، هَلْ تَعْرِفُ...؟", phonetic: "Ya habibi, hal..." },
  { id: 22034, category: "Pista 22: Adverbios de lugar", spanish: "Está sobre la mesa del salón", arabic: "نَعَمْ... هِيَ عَلَى طَاوِلَةِ الصَّالُونِ", phonetic: "Na'am... hiya 'ala..." },

  // Pista 23: Familia (23000+)
  { id: 23001, category: "Pista 23: La familia", spanish: "Familia", arabic: "عَائِلَة", phonetic: "A'ila" },
  { id: 23002, category: "Pista 23: La familia", spanish: "Padre", arabic: "أَب", phonetic: "Ab" },
  { id: 23003, category: "Pista 23: La familia", spanish: "Madre", arabic: "أُمّ", phonetic: "Umm" },
  { id: 23004, category: "Pista 23: La familia", spanish: "Hijo", arabic: "اِبْن", phonetic: "Ibn" },
  { id: 23005, category: "Pista 23: La familia", spanish: "Hijo, niño", arabic: "وَلَد", phonetic: "Walad" },
  { id: 23006, category: "Pista 23: La familia", spanish: "Hijos", arabic: "أَبْنَاء", phonetic: "Abna'" },
  { id: 23007, category: "Pista 23: La familia", spanish: "Hijos, niños", arabic: "أَوْلَاد", phonetic: "Awlad" },
  { id: 23008, category: "Pista 23: La familia", spanish: "Hija", arabic: "اِبْنَة", phonetic: "Ibna" },
  { id: 23009, category: "Pista 23: La familia", spanish: "Hija, chica, niña", arabic: "بِنْت", phonetic: "Bint" },
  { id: 23010, category: "Pista 23: La familia", spanish: "Hijas, niñas, chicas", arabic: "بَنَات", phonetic: "Banat" },
  { id: 23011, category: "Pista 23: La familia", spanish: "Abuelo", arabic: "جَدّ", phonetic: "Jadd" },
  { id: 23012, category: "Pista 23: La familia", spanish: "Abuela", arabic: "جَدَّة", phonetic: "Jadda" },
  { id: 23013, category: "Pista 23: La familia", spanish: "Hermano", arabic: "أَخ", phonetic: "Akh" },
  { id: 23014, category: "Pista 23: La familia", spanish: "Hermanos", arabic: "إِخْوَة", phonetic: "Ikhwa" },
  { id: 23015, category: "Pista 23: La familia", spanish: "Hermana", arabic: "أُخْت", phonetic: "Ukht" },
  { id: 23016, category: "Pista 23: La familia", spanish: "Hermanas", arabic: "أَخَوَات", phonetic: "Akhawat" },
  { id: 23017, category: "Pista 23: La familia", spanish: "Esposo", arabic: "زَوْج", phonetic: "Zawj" },
  { id: 23018, category: "Pista 23: La familia", spanish: "Esposa", arabic: "زَوْجَة", phonetic: "Zawja" },
  { id: 23019, category: "Pista 23: La familia", spanish: "Nieto", arabic: "حَفِيد", phonetic: "Hafid" },
  { id: 23020, category: "Pista 23: La familia", spanish: "Nieta", arabic: "حَفِيدَة", phonetic: "Hafida" },
  { id: 23021, category: "Pista 23: La familia", spanish: "Tío (paterno)", arabic: "عَمّ", phonetic: "Amm" },
  { id: 23022, category: "Pista 23: La familia", spanish: "Tíos (paternos)", arabic: "أَعْمَام", phonetic: "A'mam" },
  { id: 23023, category: "Pista 23: La familia", spanish: "Tía (paterna)", arabic: "عَمَّة", phonetic: "Amma" },
  { id: 23024, category: "Pista 23: La familia", spanish: "Tías (paternas)", arabic: "عَمَّات", phonetic: "Ammat" },
  { id: 23025, category: "Pista 23: La familia", spanish: "Tío (materno)", arabic: "خَال", phonetic: "Khal" },
  { id: 23026, category: "Pista 23: La familia", spanish: "Tíos (maternos)", arabic: "أَخْوَال", phonetic: "Akhwal" },
  { id: 23027, category: "Pista 23: La familia", spanish: "Tía (materna)", arabic: "خَالَة", phonetic: "Khala" },
  { id: 23028, category: "Pista 23: La familia", spanish: "Tías (maternas)", arabic: "خَالَات", phonetic: "Khalat" },
  { id: 23029, category: "Pista 23: La familia", spanish: "¿Cómo se llama tu padre?", arabic: "أَبُوكَ، مَا اسْمُهُ؟", phonetic: "Abuka, ma ismuhu?" },
  { id: 23030, category: "Pista 23: La familia", spanish: "Mi padre se llama Rashid", arabic: "أَبِي اسْمُهُ رَشِيد", phonetic: "Abi ismuhu Rashid" },
  { id: 23031, category: "Pista 23: La familia", spanish: "¿Cómo se llama tu madre?", arabic: "أُمُّكَ، مَا اسْمُهَا؟", phonetic: "Ummuka, ma ismuha?" },
  { id: 23032, category: "Pista 23: La familia", spanish: "Mi madre se llama Bushra", arabic: "أُمِّي اسْمُهَا بُشْرَى", phonetic: "Ummi ismuha Bushra" },

  // Pista 24: Negación (24000+)
  { id: 24001, category: "Pista 24: Negación con ليس", spanish: "¿Rashid es el padre de Mustafa?", arabic: "هَلْ رَشِيدٌ أَبُو مُصْطَفَى؟", phonetic: "Hal Rashid abu Mustafa?" },
  { id: 24002, category: "Pista 24: Negación con ليس", spanish: "No, no es su padre, es su hijo", arabic: "لَا، هُوَ لَيْسَ أَبَاهُ، هُوَ ابْنُهُ", phonetic: "La, huwa laysa abahu, huwa ibnuhu" },
  { id: 24003, category: "Pista 24: Negación con ليس", spanish: "¿Bushra es la hermana de Latifa?", arabic: "هَلْ بُشْرَى أُخْتُ لَطِيفَة؟", phonetic: "Hal Bushra ukhtu Latifa?" },
  { id: 24004, category: "Pista 24: Negación con ليس", spanish: "No, no es su hermana, es su madre", arabic: "لَا، هِيَ لَيْسَتْ أُخْتَهَا، هِيَ أُمُّهَا", phonetic: "La, hiya laysat ukhtaha, hiya ummuha" },
  { id: 24005, category: "Pista 24: Negación con ليس", spanish: "¿Hasan es el hermano de Rashid?", arabic: "هَلْ حَسَنٌ أَخُو رَشِيد؟", phonetic: "Hal Hasan akhu Rashid?" },
  { id: 24006, category: "Pista 24: Negación con ليس", spanish: "No, no es su hermano, es su hijo", arabic: "لَا، هُوَ لَيْسَ أَخَاهُ، هُوَ ابْنُهُ", phonetic: "La, huwa laysa akhahu, huwa ibnuhu" },
  { id: 24007, category: "Pista 24: Negación con ليس", spanish: "¿Yamila es la madre de Said?", arabic: "هَلْ جَمِيلَةُ أُمُّ سَعِيد؟", phonetic: "Hal Jamila ummu Said?" },
  { id: 24008, category: "Pista 24: Negación con ليس", spanish: "No, no es su madre, es su abuela", arabic: "لَا، هِيَ لَيْسَتْ أُمَّهُ، هِيَ جَدَّتُهُ", phonetic: "La, hiya laysat ummahu, hiya jaddatuhu" },
  { id: 24009, category: "Pista 24: Negación con ليس", spanish: "¿Said es el hijo de Yamila?", arabic: "هَلْ سَعِيدٌ ابْنُ جَمِيلَة؟", phonetic: "Hal Said ibnu Jamila?" },
  { id: 24010, category: "Pista 24: Negación con ليس", spanish: "No, no es su hijo, es su nieto", arabic: "لَا، هُوَ لَيْسَ ابْنَهَا، هُوَ حَفِيدُهَا", phonetic: "La, huwa laysa ibnaha, huwa hafiduhua" },
  { id: 24011, category: "Pista 24: Negación con ليس", spanish: "¿Latifa es la hija de Mustafa?", arabic: "هَلْ لَطِيفَةُ ابْنَةُ مُصْطَفَى؟", phonetic: "Hal Latifa ibnat Mustafa?" },
  { id: 24012, category: "Pista 24: Negación con ليس", spanish: "No, no es su hija, es su nieta", arabic: "لَا، هِيَ لَيْسَتْ ابْنَتَهُ، هِيَ حَفِيدَتُهُ", phonetic: "La, hiya laysat ibnatahu, hiya hafidatuhu" },

  // Pista 25: Decenas (25000+)
  { id: 25001, category: "Pista 25: Las decenas", spanish: "Once", arabic: "أَحَدَ عَشَرَ", phonetic: "Ahada 'ashara" },
  { id: 25002, category: "Pista 25: Las decenas", spanish: "Doce", arabic: "اِثْنَا عَشَرَ", phonetic: "Ithna 'ashara" },
  { id: 25003, category: "Pista 25: Las decenas", spanish: "Trece", arabic: "ثَلَاثَةَ عَشَرَ", phonetic: "Thalathata 'ashara" },
  { id: 25004, category: "Pista 25: Las decenas", spanish: "Catorce", arabic: "أَرْبَعَةَ عَشَرَ", phonetic: "Arba'ata 'ashara" },
  { id: 25005, category: "Pista 25: Las decenas", spanish: "Quince", arabic: "خَمْسَةَ عَشَرَ", phonetic: "Khamsata 'ashara" },
  { id: 25006, category: "Pista 25: Las decenas", spanish: "Dieciséis", arabic: "سِتَّةَ عَشَرَ", phonetic: "Sittata 'ashara" },
  { id: 25007, category: "Pista 25: Las decenas", spanish: "Diecisiete", arabic: "سَبْعَةَ عَشَرَ", phonetic: "Sab'ata 'ashara" },
  { id: 25008, category: "Pista 25: Las decenas", spanish: "Dieciocho", arabic: "ثَمَانِيَةَ عَشَرَ", phonetic: "Thamaniyata 'ashara" },
  { id: 25009, category: "Pista 25: Las decenas", spanish: "Diecinueve", arabic: "تِسْعَةَ عَشَرَ", phonetic: "Tis'ata 'ashara" },
  { id: 25010, category: "Pista 25: Las decenas", spanish: "Veinte", arabic: "عِشْرُونَ", phonetic: "'Ishrun" },
  { id: 25011, category: "Pista 25: Las decenas", spanish: "Treinta", arabic: "ثَلَاثُونَ", phonetic: "Thalathun" },
  { id: 25012, category: "Pista 25: Las decenas", spanish: "Cuarenta", arabic: "أَرْبَعُونَ", phonetic: "Arba'un" },
  { id: 25013, category: "Pista 25: Las decenas", spanish: "Cincuenta", arabic: "خَمْسُونَ", phonetic: "Khamsun" },
  { id: 25014, category: "Pista 25: Las decenas", spanish: "Sesenta", arabic: "سِتُّونَ", phonetic: "Sittun" },
  { id: 25015, category: "Pista 25: Las decenas", spanish: "Setenta", arabic: "سَبْعُونَ", phonetic: "Sab'un" },
  { id: 25016, category: "Pista 25: Las decenas", spanish: "Ochenta", arabic: "ثَمَانُونَ", phonetic: "Thamanun" },
  { id: 25017, category: "Pista 25: Las decenas", spanish: "Noventa", arabic: "تِسْعُونَ", phonetic: "Tis'un" },
  { id: 25018, category: "Pista 25: Las decenas", spanish: "Veintiuno", arabic: "وَاحِدٌ وَعِشْرُونَ", phonetic: "Wahidun wa 'ishrun" },
  { id: 25019, category: "Pista 25: Las decenas", spanish: "Treinta y dos", arabic: "اِثْنَانِ وَثَلَاثُونَ", phonetic: "Ithnani wa thalathun" },
  { id: 25020, category: "Pista 25: Las decenas", spanish: "Cuarenta y tres", arabic: "ثَلَاثَةٌ وَأَرْبَعُونَ", phonetic: "Thalathatun wa arba'un" },
  { id: 25021, category: "Pista 25: Las decenas", spanish: "Cincuenta y cuatro", arabic: "أَرْبَعَةٌ وَخَمْسُونَ", phonetic: "Arba'atun wa khamsun" },

  // Pista 26: Edad (26000+)
  { id: 26001, category: "Pista 26: La edad", spanish: "¿Qué edad tienes Rashid?", arabic: "كَمْ عُمْرُكَ يَا رَشِيدُ؟", phonetic: "Kam 'umruka ya Rashid?" },
  { id: 26002, category: "Pista 26: La edad", spanish: "Tengo (mi edad es) 43 años", arabic: "عُمْرِي ثَلَاثَةٌ وَأَرْبَعُونَ سَنَةً", phonetic: "'Umri thalathatun..." },
  { id: 26003, category: "Pista 26: La edad", spanish: "¿Qué edad tienes Latifa?", arabic: "كَمْ عُمْرُكِ يَا لَطِيفَةُ؟", phonetic: "Kam 'umruki ya Latifa?" },
  { id: 26004, category: "Pista 26: La edad", spanish: "Tengo (mi edad es) 5 años", arabic: "عُمْرِي خَمْسُ سَنَوَاتٍ", phonetic: "'Umri khamsu..." },
  { id: 26005, category: "Pista 26: La edad", spanish: "¿Qué edad tiene Yamal?", arabic: "جَمَال، كَمْ عُمْرُهُ؟", phonetic: "Jamal, kam 'umruhu?" },
  { id: 26006, category: "Pista 26: La edad", spanish: "Tiene (su edad es) dos años", arabic: "عُمْرُهُ سَنَتَانِ", phonetic: "'Umruhu sanatani" },
  { id: 26007, category: "Pista 26: La edad", spanish: "¿Qué edad tiene Nadia?", arabic: "نَادِيَة، كَمْ عُمْرُهَا؟", phonetic: "Nadia, kam 'umruha?" },
  { id: 26008, category: "Pista 26: La edad", spanish: "Tiene (su edad es) un año", arabic: "عُمْرُهَا سَنَةٌ", phonetic: "'Umruha sanatun" },
  { id: 26009, category: "Pista 26: La edad", spanish: "¿Qué edad tienes Said?", arabic: "كَمْ عُمْرُكَ يَا سَعِيدُ؟", phonetic: "Kam 'umruka ya Said?" },
  { id: 26010, category: "Pista 26: La edad", spanish: "Tengo (mi edad es) 15 años", arabic: "عُمْرِي خَمْسَةَ عَشَرَ سَنَةً", phonetic: "'Umri khamsata..." },

  // Pista 27: Tener (ل) (27000+)
  { id: 27001, category: "Pista 27: Tener, con ل", spanish: "Tengo (para mí hay)", arabic: "لِي", phonetic: "Li" },
  { id: 27002, category: "Pista 27: Tener, con ل", spanish: "Tienes (masc.)", arabic: "لَكَ", phonetic: "Laka" },
  { id: 27003, category: "Pista 27: Tener, con ل", spanish: "Tienes (fem.)", arabic: "لَكِ", phonetic: "Laki" },
  { id: 27004, category: "Pista 27: Tener, con ل", spanish: "Tiene (él)", arabic: "لَهُ", phonetic: "Lahu" },
  { id: 27005, category: "Pista 27: Tener, con ل", spanish: "Tiene (ella)", arabic: "لَهَا", phonetic: "Laha" },
  { id: 27006, category: "Pista 27: Tener, con ل", spanish: "Tenemos", arabic: "لَنَا", phonetic: "Lana" },
  { id: 27007, category: "Pista 27: Tener, con ل", spanish: "Tenéis (vosotros)", arabic: "لَكُمْ", phonetic: "Lakum" },
  { id: 27008, category: "Pista 27: Tener, con ل", spanish: "Tenéis (vosotras)", arabic: "لَكُنَّ", phonetic: "Lakunna" },
  { id: 27009, category: "Pista 27: Tener, con ل", spanish: "Tienen (ellos)", arabic: "لَهُمْ", phonetic: "Lahum" },
  { id: 27010, category: "Pista 27: Tener, con ل", spanish: "Tienen (ellas)", arabic: "لَهُنَّ", phonetic: "Lahunna" },
  { id: 27011, category: "Pista 27: Tener, con ل", spanish: "Tenéis (dos)", arabic: "لَكُمَا", phonetic: "Lakuma" },
  { id: 27012, category: "Pista 27: Tener, con ل", spanish: "Tienen (dos)", arabic: "لَهُمَا", phonetic: "Lahuma" },
  { id: 27013, category: "Pista 27: Tener, con ل", spanish: "¿Tienes coche, Marwan?", arabic: "هَلْ لَكَ سَيَّارَةٌ...؟", phonetic: "Hal laka..." },
  { id: 27014, category: "Pista 27: Tener, con ل", spanish: "Sí, tengo coche", arabic: "نَعَمْ، لِي سَيَّارَةٌ", phonetic: "Na'am, li..." },
  { id: 27015, category: "Pista 27: Tener, con ل", spanish: "No, no tengo coche", arabic: "لَا، لَيْسَ لِي سَيَّارَةٌ", phonetic: "La, laysa..." },
  { id: 27016, category: "Pista 27: Tener, con ل", spanish: "¿Tienes hijos, Samira?", arabic: "هَلْ لَكِ أَوْلَادٌ...؟", phonetic: "Hal laki..." },
  { id: 27017, category: "Pista 27: Tener, con ل", spanish: "Sí, tengo dos hijos...", arabic: "نَعَمْ، لِي وَلَدَانِ...", phonetic: "Na'am, li..." },
  { id: 27018, category: "Pista 27: Tener, con ل", spanish: "¿Tienes hermanos, Nabil?", arabic: "هَلْ لَكَ إِخْوَةٌ...؟", phonetic: "Hal laka..." },
  { id: 27019, category: "Pista 27: Tener, con ل", spanish: "Sí, tengo tres hermanas...", arabic: "نَعَمْ، لِي ثَلَاثُ...", phonetic: "Na'am, li..." },
  { id: 27020, category: "Pista 27: Tener, con ل", spanish: "¿Tienes novia, Marwan?", arabic: "هَلْ لَكَ خَطِيبَةٌ...؟", phonetic: "Hal laka..." },
  { id: 27021, category: "Pista 27: Tener, con ل", spanish: "No, no tengo novia", arabic: "لَا، لَيْسَ لِي خَطِيبَةٌ", phonetic: "La, laysa..." },
  { id: 27022, category: "Pista 27: Tener, con ل", spanish: "Éste es mi libro", arabic: "هَذَا كِتَابِي", phonetic: "Hadha kitabi" },
  { id: 27023, category: "Pista 27: Tener, con ل", spanish: "Este libro es mío", arabic: "هَذَا الْكِتَابُ لِي", phonetic: "Hadha al-kitabu li" },
  { id: 27024, category: "Pista 27: Tener, con ل", spanish: "Éste es mi amigo", arabic: "هَذَا صَدِيقِي", phonetic: "Hadha sadiqi" },
  { id: 27025, category: "Pista 27: Tener, con ل", spanish: "Éste es un amigo mío", arabic: "هَذَا صَدِيقٌ لِي", phonetic: "Hadha sadiqun li" },
  { id: 27026, category: "Pista 27: Tener, con ل", spanish: "Tengo un amigo", arabic: "لِي صَدِيقٌ", phonetic: "Li sadiqun" },

  // Pista 28: Tener (عندي) (28000+)
  { id: 28001, category: "Pista 28: Tener, con عن د", spanish: "Tengo (para mí hay)", arabic: "عِنْدِي", phonetic: "'Indi" },
  { id: 28002, category: "Pista 28: Tener, con عن د", spanish: "Tienes (masc.)", arabic: "عِنْدَكَ", phonetic: "'Indaka" },
  { id: 28003, category: "Pista 28: Tener, con عن د", spanish: "Tienes (fem.)", arabic: "عِنْدَكِ", phonetic: "'Indaki" },
  { id: 28004, category: "Pista 28: Tener, con عن د", spanish: "Tiene (él)", arabic: "عِنْدَهُ", phonetic: "'Indahu" },
  { id: 28005, category: "Pista 28: Tener, con عن د", spanish: "Tiene (ella)", arabic: "عِنْدَهَا", phonetic: "'Indaha" },
  { id: 28006, category: "Pista 28: Tener, con عن د", spanish: "Tenemos", arabic: "عِنْدَنَا", phonetic: "'Indana" },
  { id: 28007, category: "Pista 28: Tener, con عن د", spanish: "Tenéis (vosotros)", arabic: "عِنْدَكُمْ", phonetic: "'Indakum" },
  { id: 28008, category: "Pista 28: Tener, con عن د", spanish: "Tenéis (vosotras)", arabic: "عِنْدَكُنَّ", phonetic: "'Indakunnah" },
  { id: 28009, category: "Pista 28: Tener, con عن د", spanish: "Tienen (ellos)", arabic: "عِنْدَهُمْ", phonetic: "'Indahum" },
  { id: 28010, category: "Pista 28: Tener, con عن د", spanish: "Tienen (ellas)", arabic: "عِنْدَهُنَّ", phonetic: "'Indahunna" },
  { id: 28011, category: "Pista 28: Tener, con عن د", spanish: "Tenéis (dos)", arabic: "عِنْدَكُمَا", phonetic: "'Indakuma" },
  { id: 28012, category: "Pista 28: Tener, con عن د", spanish: "Tienen (dos)", arabic: "عِنْدَهُمَا", phonetic: "'Indahuma" },
  { id: 28013, category: "Pista 28: Tener, con عن د", spanish: "¿Tienes casa, Nabil?", arabic: "هَلْ عِنْدَكَ بَيْتٌ...؟", phonetic: "Hal 'indaka..." },
  { id: 28014, category: "Pista 28: Tener, con عن د", spanish: "Sí, tengo casa", arabic: "نَعَمْ، عِنْدِي بَيْتٌ", phonetic: "Na'am, 'indi..." },
  { id: 28015, category: "Pista 28: Tener, con عن د", spanish: "¿Tienes casa, Latifa?", arabic: "هَلْ عِنْدَكِ بَيْتٌ...؟", phonetic: "Hal 'indaki..." },
  { id: 28016, category: "Pista 28: Tener, con عن د", spanish: "No, no tengo casa", arabic: "لَا، لَيْسَ عِنْدِي بَيْتٌ", phonetic: "La, laysa..." },
  { id: 28017, category: "Pista 28: Tener, con عن د", spanish: "¿Tiene novia Yamal?", arabic: "هَلْ جَمَال عِنْدَهُ خَطِيبَةٌ؟", phonetic: "Hal Jamal..." },
  { id: 28018, category: "Pista 28: Tener, con عن د", spanish: "No, no tiene novia", arabic: "لَا، لَيْسَ عِنْدَهُ خَطِيبَةٌ", phonetic: "La, laysa..." },

  // Pista 29: Profesiones (29000+)
  { id: 29001, category: "Pista 29: El trabajo, las profesiones", spanish: "Estudiante", arabic: "طَالِب", phonetic: "Talib" },
  { id: 29002, category: "Pista 29: El trabajo, las profesiones", spanish: "Portero", arabic: "بَوَّاب", phonetic: "Bawwab" },
  { id: 29003, category: "Pista 29: El trabajo, las profesiones", spanish: "Azafata", arabic: "مُضِيفَة", phonetic: "Mudifa" },
  { id: 29004, category: "Pista 29: El trabajo, las profesiones", spanish: "Empleada, funcionaria", arabic: "مُوَظَّفَة", phonetic: "Muwazzafa" },
  { id: 29005, category: "Pista 29: El trabajo, las profesiones", spanish: "Hombre de negocios", arabic: "رَجُل أَعْمَال", phonetic: "Rajul a'mal" },
  { id: 29006, category: "Pista 29: El trabajo, las profesiones", spanish: "Ingeniero", arabic: "مُهَنْدِس", phonetic: "Muhandis" },
  { id: 29007, category: "Pista 29: El trabajo, las profesiones", spanish: "Médico", arabic: "طَبِيب", phonetic: "Tabib" },
  { id: 29008, category: "Pista 29: El trabajo, las profesiones", spanish: "Enfermero", arabic: "مُمَرِّض", phonetic: "Mumarrid" },
  { id: 29009, category: "Pista 29: El trabajo, las profesiones", spanish: "Policía (agente)", arabic: "شُرْطِيّ", phonetic: "Shurtiyy" },
  { id: 29010, category: "Pista 29: El trabajo, las profesiones", spanish: "Ama de casa", arabic: "رَبَّة بَيْت", phonetic: "Rabbat bayt" },
  { id: 29011, category: "Pista 29: El trabajo, las profesiones", spanish: "Electricista", arabic: "كَهْرَبَائِيّ", phonetic: "Kahraba'iyy" },
  { id: 29012, category: "Pista 29: El trabajo, las profesiones", spanish: "Camarero", arabic: "نَادِل", phonetic: "Nadil" },
  { id: 29013, category: "Pista 29: El trabajo, las profesiones", spanish: "Cocinero", arabic: "طَبَّاخ", phonetic: "Tabbakh" },
  { id: 29014, category: "Pista 29: El trabajo, las profesiones", spanish: "Director", arabic: "مُدِير", phonetic: "Mudir" },
  { id: 29015, category: "Pista 29: El trabajo, las profesiones", spanish: "Secretaria", arabic: "سِكْرِتِيرَة", phonetic: "Sikritira" },
  { id: 29016, category: "Pista 29: El trabajo, las profesiones", spanish: "Maestro, profesor", arabic: "مُدَرِّس", phonetic: "Mudarris" },
  { id: 29017, category: "Pista 29: El trabajo, las profesiones", spanish: "Profesor", arabic: "أُسْتَاذ", phonetic: "Ustadh" },
  { id: 29018, category: "Pista 29: El trabajo, las profesiones", spanish: "Abogada", arabic: "مُحَامِيَة", phonetic: "Muhamiya" },
  { id: 29019, category: "Pista 29: El trabajo, las profesiones", spanish: "Traductora", arabic: "مُتَرْجِمَة", phonetic: "Mutarjima" },
  { id: 29020, category: "Pista 29: El trabajo, las profesiones", spanish: "Piloto", arabic: "طَيَّار", phonetic: "Tayyar" },
  { id: 29021, category: "Pista 29: El trabajo, las profesiones", spanish: "Carnicero", arabic: "جَزَّار", phonetic: "Jazzar" },
  { id: 29022, category: "Pista 29: El trabajo, las profesiones", spanish: "Panadero", arabic: "خَبَّاز", phonetic: "Khabbaz" },
  { id: 29023, category: "Pista 29: El trabajo, las profesiones", spanish: "Albañil", arabic: "بَنَّاء", phonetic: "Banna'" },
  { id: 29024, category: "Pista 29: El trabajo, las profesiones", spanish: "Campesino", arabic: "فَلَّاح", phonetic: "Fallah" },
  { id: 29025, category: "Pista 29: El trabajo, las profesiones", spanish: "Carpintero", arabic: "نَجَّار", phonetic: "Najjar" },
  { id: 29026, category: "Pista 29: El trabajo, las profesiones", spanish: "Vendedor", arabic: "بَائِع", phonetic: "Ba'i'" },
  { id: 29027, category: "Pista 29: El trabajo, las profesiones", spanish: "Peluquero", arabic: "حَلَّاق", phonetic: "Hallaq" },
  { id: 29028, category: "Pista 29: El trabajo, las profesiones", spanish: "Oficina", arabic: "مَكْتَب", phonetic: "Maktab" },
  { id: 29029, category: "Pista 29: El trabajo, las profesiones", spanish: "Empresa", arabic: "شَرِكَة", phonetic: "Sharika" },
  { id: 29030, category: "Pista 29: El trabajo, las profesiones", spanish: "Aeropuerto", arabic: "مَطَار", phonetic: "Matar" },
  { id: 29031, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo (amal)", arabic: "عَمَل", phonetic: "Amal" },
  { id: 29032, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo (shughl)", arabic: "شُغْل", phonetic: "Shughl" },
  { id: 29033, category: "Pista 29: El trabajo, las profesiones", spanish: "Profesión", arabic: "مِهْنَة", phonetic: "Mihna" },
  { id: 29034, category: "Pista 29: El trabajo, las profesiones", spanish: "¿De qué trabajas, Marwán?", arabic: "مَاذَا تَعْمَلُ يَا مَرْوَانُ؟", phonetic: "Madha ta'malu..." },
  { id: 29035, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo de ingeniero", arabic: "أَنَا أَعْمَلُ مُهَنْدِسًا", phonetic: "Ana a'malu..." },
  { id: 29036, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Cuál es tu profesión, Samira?", arabic: "مَا مِهْنَتُكِ يَا سَمِيرَةُ؟", phonetic: "Ma mihnatuki..." },
  { id: 29037, category: "Pista 29: El trabajo, las profesiones", spanish: "Soy traductora", arabic: "أَنَا مُتَرْجِمَةٌ", phonetic: "Ana mutarjima" },
  { id: 29038, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Con quién trabajas, Latif?", arabic: "مَعَ مَنْ تَعْمَلُ يَا لَطِيفُ؟", phonetic: "Ma'a man..." },
  { id: 29039, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo con mi hermano", arabic: "أَعْمَلُ مَعَ أَخِي", phonetic: "A'malu ma'a akhi" },
  { id: 29040, category: "Pista 29: El trabajo, las profesiones", spanish: "¿De qué trabajas, Nabil?", arabic: "مَاذَا تَشْتَغِلُ يَا نَبِيلُ؟", phonetic: "Madha tashtaghilu..." },
  { id: 29041, category: "Pista 29: El trabajo, las profesiones", spanish: "No trabajo, estoy parado", arabic: "أَنَا لَا أَشْتَغِلُ... عَاطِلٌ...", phonetic: "Ana la..." },
  { id: 29042, category: "Pista 29: El trabajo, las profesiones", spanish: "¿En qué sitio trabajas?", arabic: "فِي أَيِّ مَكَانٍ تَعْمَلِينَ...؟", phonetic: "Fi ayyi..." },
  { id: 29043, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajo en una empresa francesa", arabic: "أَعْمَلُ فِي شَرِكَةٍ فَرَنْسِيَّةٍ", phonetic: "A'malu fi..." },
  { id: 29044, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Qué haces esta tarde?", arabic: "مَاذَا تَفْعَلُ هَذَا الْمَسَاءَ؟", phonetic: "Madha taf'alu..." },
  { id: 29045, category: "Pista 29: El trabajo, las profesiones", spanish: "Esta tarde no hago nada", arabic: "هَذَا الْمَسَاءَ لَا أَفْعَلُ شَيْئًا", phonetic: "Hadha al-masa'a..." },
  { id: 29046, category: "Pista 29: El trabajo, las profesiones", spanish: "¿Tienes experiencia, Samira?", arabic: "هَلْ عِنْدَكِ خِبْرَةٌ...؟", phonetic: "Hal 'indaki..." },
  { id: 29047, category: "Pista 29: El trabajo, las profesiones", spanish: "Lo siento, no tengo experiencia", arabic: "أَنَا آسِفَةٌ، لَيْسَ عِنْدِي...", phonetic: "Ana asifatun..." },
  { id: 29048, category: "Pista 29: El trabajo, las profesiones", spanish: "No eres la persona apropiada", arabic: "إِذًا، لَسْتِ أَنْتِ الشَّخْصَ...", phonetic: "Idhan, lasti..." },
  { id: 29049, category: "Pista 29: El trabajo, las profesiones", spanish: "Uzmán vende carne", arabic: "عُثْمَان يَبِيعُ اللَّحْمَ...", phonetic: "Uthman yabi'u..." },
  { id: 29050, category: "Pista 29: El trabajo, las profesiones", spanish: "Samih hace pan", arabic: "سَامِح يَصْنَعُ الْخُبْزَ...", phonetic: "Samih yasna'u..." },
  { id: 29051, category: "Pista 29: El trabajo, las profesiones", spanish: "El director no está", arabic: "الْمُدِيرُ غَيْرُ مَوْجُودٍ", phonetic: "Al-mudiru..." },
  { id: 29052, category: "Pista 29: El trabajo, las profesiones", spanish: "La compañía no tiene oficina en París", arabic: "الشَّرِكَةُ لَيْسَ لَهَا مَكْتَبٌ...", phonetic: "Ash-sharikatu..." },
  { id: 29053, category: "Pista 29: El trabajo, las profesiones", spanish: "No tiene experiencia exigida", arabic: "لَيْسَ عِنْدَهَا خِبْرَةٌ...", phonetic: "Laysa 'indaha..." },
  { id: 29054, category: "Pista 29: El trabajo, las profesiones", spanish: "Tengo una entrevista", arabic: "عِنْدِي مُقَابَلَةُ عَمَلٍ", phonetic: "'Indi muqabalatu..." },
  { id: 29055, category: "Pista 29: El trabajo, las profesiones", spanish: "Trabajamos juntos", arabic: "نَعْمَلُ مَعًا فِي نَفْسِ الشَّرِكَةِ", phonetic: "Na'malu ma'an..." },
  { id: 29056, category: "Pista 29: El trabajo, las profesiones", spanish: "Un momento por favor", arabic: "لَحْظَةً مِنْ فَضْلِكَ", phonetic: "Lahzatan..." },

  // Pista 30: Colores (30000+)
  { id: 30001, category: "Pista 30: Los colores", spanish: "Negro", arabic: "أَسْوَد", phonetic: "Aswad" },
  { id: 30002, category: "Pista 30: Los colores", spanish: "Negra", arabic: "سَوْدَاء", phonetic: "Sawda'" },
  { id: 30003, category: "Pista 30: Los colores", spanish: "Blanco", arabic: "أَبْيَض", phonetic: "Abyad" },
  { id: 30004, category: "Pista 30: Los colores", spanish: "Blanca", arabic: "بَيْضَاء", phonetic: "Bayda'" },
  { id: 30005, category: "Pista 30: Los colores", spanish: "Rojo", arabic: "أَحْمَر", phonetic: "Ahmar" },
  { id: 30006, category: "Pista 30: Los colores", spanish: "Roja", arabic: "حَمْرَاء", phonetic: "Hamra'" },
  { id: 30007, category: "Pista 30: Los colores", spanish: "Azul", arabic: "أَزْرَق", phonetic: "Azraq" },
  { id: 30008, category: "Pista 30: Los colores", spanish: "Azul (fem.)", arabic: "زَرْقَاء", phonetic: "Zarqa'" },
  { id: 30009, category: "Pista 30: Los colores", spanish: "Azul claro", arabic: "أَزْرَق فَاتِح", phonetic: "Azraq fatih" },
  { id: 30010, category: "Pista 30: Los colores", spanish: "Azul oscuro", arabic: "أَزْرَق دَاكِن", phonetic: "Azraq dakin" },
  { id: 30011, category: "Pista 30: Los colores", spanish: "Azul marino", arabic: "أَزْرَق بَحْرِيّ", phonetic: "Azraq bahriyy" },
  { id: 30012, category: "Pista 30: Los colores", spanish: "Verde", arabic: "أخضر", phonetic: "Akhdar" },
  { id: 30013, category: "Pista 30: Los colores", spanish: "Verde (fem.)", arabic: "خَضْرَاء", phonetic: "Khadra'" },
  { id: 30014, category: "Pista 30: Los colores", spanish: "Amarillo", arabic: "أَصْفَر", phonetic: "Asfar" },
  { id: 30015, category: "Pista 30: Los colores", spanish: "Amarilla", arabic: "صَفْرَاء", phonetic: "Safra'" },
  { id: 30016, category: "Pista 30: Los colores", spanish: "Moreno", arabic: "أَسْمَر", phonetic: "Asmar" },
  { id: 30017, category: "Pista 30: Los colores", spanish: "Morena", arabic: "سَمْرَاء", phonetic: "Samra'" },
  { id: 30018, category: "Pista 30: Los colores", spanish: "Rubio", arabic: "أَشْقَر", phonetic: "Ashqar" },
  { id: 30019, category: "Pista 30: Los colores", spanish: "Rubia", arabic: "شَقْرَاء", phonetic: "Shaqra'" },
  { id: 30020, category: "Pista 30: Los colores", spanish: "Rosa", arabic: "وَرْدِيّ", phonetic: "Wardiyy" },
  { id: 30021, category: "Pista 30: Los colores", spanish: "Rosa (fem.)", arabic: "وَرْدِيَّة", phonetic: "Wardiyya" },
  { id: 30022, category: "Pista 30: Los colores", spanish: "Naranja", arabic: "بُرْتُقَالِيّ", phonetic: "Burtuqaliyy" },
  { id: 30023, category: "Pista 30: Los colores", spanish: "Naranja (fem.)", arabic: "بُرْتُقَالِيَّة", phonetic: "Burtuqaliyya" },
  { id: 30024, category: "Pista 30: Los colores", spanish: "Gris", arabic: "رَمَادِيّ", phonetic: "Ramadiyy" },
  { id: 30025, category: "Pista 30: Los colores", spanish: "Gris (fem.)", arabic: "رَمَادِيَّة", phonetic: "Ramadiyya" },
  { id: 30026, category: "Pista 30: Los colores", spanish: "Violeta", arabic: "بَنَفْسَجِيّ", phonetic: "Banafajiyy" },
  { id: 30027, category: "Pista 30: Los colores", spanish: "Violeta (fem.)", arabic: "بَنَفْسَجِيَّة", phonetic: "Banafajiyya" },
  { id: 30028, category: "Pista 30: Los colores", spanish: "Marrón", arabic: "بُنِّيّ", phonetic: "Bunniyy" },
  { id: 30029, category: "Pista 30: Los colores", spanish: "Marrón (fem.)", arabic: "بُنِّيَّة", phonetic: "Bunniyya" },
  { id: 30030, category: "Pista 30: Los colores", spanish: "El limón es amarillo", arabic: "لَوْنُ اللَّيْمُونِ أَصْفَرُ", phonetic: "Lawnu al-laymuni..." },
  { id: 30031, category: "Pista 30: Los colores", spanish: "La aceituna es verde", arabic: "لَوْنُ الزَّيْتُونَةِ أَخْضَرُ", phonetic: "Lawnu az-zaytunati..." },
  { id: 30032, category: "Pista 30: Los colores", spanish: "El café es negro", arabic: "لَوْنُ الْقَهْوَةِ أَسْوَدُ", phonetic: "Lawnu al-qahwati..." },
  { id: 30033, category: "Pista 30: Los colores", spanish: "El petróleo es negro", arabic: "إِنَّ الْبِتْرُولَ أَسْوَدُ", phonetic: "Inna al-bitrula..." },
  { id: 30034, category: "Pista 30: Los colores", spanish: "El mar es azul", arabic: "إِنَّ الْبَحْرَ أَزْرَقُ", phonetic: "Inna al-bahra..." },
  { id: 30035, category: "Pista 30: Los colores", spanish: "La leche es blanca", arabic: "إِنَّ الْحَلِيبَ أَبْيَضُ", phonetic: "Inna al-haliba..." },
  { id: 30036, category: "Pista 30: Los colores", spanish: "El sol es amarillo", arabic: "إِنَّ الشَّمْسَ صَفْرَاءُ", phonetic: "Inna ash-shamsa..." },
  { id: 30037, category: "Pista 30: Los colores", spanish: "¿Cuál es tu color preferido?", arabic: "مَا لَوْنُكَ الْمُفَضَّلُ؟", phonetic: "Ma lawnuka..." },
  { id: 30038, category: "Pista 30: Los colores", spanish: "Mi color preferido es verde", arabic: "لَوْنِيَ الْمُفَضَّلُ هُوَ الْأَخْضَرُ", phonetic: "Lawniya al-mufaddalu..." },

  // Pista 31: Descripción física (31000+)
  { id: 31001, category: "Pista 31: La descripción física", spanish: "El cuerpo humano", arabic: "جِسْمُ الْإِنْسَانِ", phonetic: "Jismu al-insan" },
  { id: 31002, category: "Pista 31: La descripción física", spanish: "Cabeza", arabic: "رَأْس", phonetic: "Ra's" },
  { id: 31003, category: "Pista 31: La descripción física", spanish: "Cara, rostro", arabic: "وَجْه", phonetic: "Wajh" },
  { id: 31004, category: "Pista 31: La descripción física", spanish: "Ojo", arabic: "عَيْن", phonetic: "Ayn" },
  { id: 31005, category: "Pista 31: La descripción física", spanish: "Nariz", arabic: "أَنْف", phonetic: "Anf" },
  { id: 31006, category: "Pista 31: La descripción física", spanish: "Oreja", arabic: "أُذُن", phonetic: "Udhun" },
  { id: 31007, category: "Pista 31: La descripción física", spanish: "Boca", arabic: "فَم", phonetic: "Fam" },
  { id: 31008, category: "Pista 31: La descripción física", spanish: "Pelo", arabic: "شَعْر", phonetic: "Sha'r" },
  { id: 31009, category: "Pista 31: La descripción física", spanish: "Bigote", arabic: "شَارِب", phonetic: "Sharib" },
  { id: 31010, category: "Pista 31: La descripción física", spanish: "Barba", arabic: "لِحْيَة", phonetic: "Lihya" },
  { id: 31011, category: "Pista 31: La descripción física", spanish: "Pecho", arabic: "صَدْر", phonetic: "Sadr" },
  { id: 31012, category: "Pista 31: La descripción física", spanish: "Cuello", arabic: "عُنُق", phonetic: "'Unuq" },
  { id: 31013, category: "Pista 31: La descripción física", spanish: "Espalda", arabic: "ظَهْر", phonetic: "Zahr" },
  { id: 31014, category: "Pista 31: La descripción física", spanish: "Mano", arabic: "يَد", phonetic: "Yad" },
  { id: 31015, category: "Pista 31: La descripción física", spanish: "Brazo", arabic: "ذِرَاع", phonetic: "Dhira'" },
  { id: 31016, category: "Pista 31: La descripción física", spanish: "Vientre", arabic: "بَطْن", phonetic: "Batn" },
  { id: 31017, category: "Pista 31: La descripción física", spanish: "Pierna", arabic: "رِجْل", phonetic: "Rijl" },
  { id: 31018, category: "Pista 31: La descripción física", spanish: "Pie", arabic: "قَدَم", phonetic: "Qadam" },
  { id: 31019, category: "Pista 31: La descripción física", spanish: "Alto", arabic: "طَوِيل", phonetic: "Tawil" },
  { id: 31020, category: "Pista 31: La descripción física", spanish: "Bajo", arabic: "قَصِير", phonetic: "Qasir" },
  { id: 31021, category: "Pista 31: La descripción física", spanish: "Grande", arabic: "كَبِير", phonetic: "Kabir" },
  { id: 31022, category: "Pista 31: La descripción física", spanish: "Pequeño", arabic: "صَغِير", phonetic: "Saghir" },
  { id: 31023, category: "Pista 31: La descripción física", spanish: "Delgado", arabic: "نَحِيل", phonetic: "Nahil" },
  { id: 31024, category: "Pista 31: La descripción física", spanish: "Delgado (nahif)", arabic: "نَحِيف", phonetic: "Nahif" },
  { id: 31025, category: "Pista 31: La descripción física", spanish: "Delgado, esbelto", arabic: "رَشِيق", phonetic: "Rashiq" },
  { id: 31026, category: "Pista 31: La descripción física", spanish: "Gordo", arabic: "سَمِين", phonetic: "Samin" },
  { id: 31027, category: "Pista 31: La descripción física", spanish: "Gordo (badin)", arabic: "بَدِين", phonetic: "Badin" },
  { id: 31028, category: "Pista 31: La descripción física", spanish: "Joven", arabic: "شَابّ", phonetic: "Shabb" },
  { id: 31029, category: "Pista 31: La descripción física", spanish: "Viejo/a, anciano/a", arabic: "عَجُوز", phonetic: "'Ajuz" },
  { id: 31030, category: "Pista 31: La descripción física", spanish: "Contento", arabic: "مَسْرُور", phonetic: "Masrur" },
  { id: 31031, category: "Pista 31: La descripción física", spanish: "Feliz", arabic: "سَعِيد", phonetic: "Sa'id" },
  { id: 31032, category: "Pista 31: La descripción física", spanish: "Triste", arabic: "حَزِين", phonetic: "Hazin" },
  { id: 31033, category: "Pista 31: La descripción física", spanish: "Hambriento", arabic: "جَائِع", phonetic: "Ja'i'" },
  { id: 31034, category: "Pista 31: La descripción física", spanish: "Sediento", arabic: "عَطْشَان", phonetic: "Atshan" },
  { id: 31035, category: "Pista 31: La descripción física", spanish: "Enfadado", arabic: "غَضْبَان", phonetic: "Ghadban" },
  { id: 31036, category: "Pista 31: La descripción física", spanish: "Disgustado", arabic: "زَعْلَان", phonetic: "Za'lan" },
  { id: 31037, category: "Pista 31: La descripción física", spanish: "Cansado (mut'ab)", arabic: "مُتْعَب", phonetic: "Mut'ab" },
  { id: 31038, category: "Pista 31: La descripción física", spanish: "Cansado (ta'ban)", arabic: "تَعْبَان", phonetic: "Ta'ban" },
  { id: 31039, category: "Pista 31: La descripción física", spanish: "Guapa", arabic: "جَمِيلَة", phonetic: "Jamila" },
  { id: 31040, category: "Pista 31: La descripción física", spanish: "Guapo", arabic: "وَسِيم", phonetic: "Wasim" },
  { id: 31041, category: "Pista 31: La descripción física", spanish: "Empañolada", arabic: "مُحَجَّبَة", phonetic: "Muhajjaba" },
  { id: 31042, category: "Pista 31: La descripción física", spanish: "Calvo", arabic: "أَصْلَع", phonetic: "Asla'" },
  { id: 31043, category: "Pista 31: La descripción física", spanish: "Calva", arabic: "صَلْعَاء", phonetic: "Sal'a'" },
  { id: 31044, category: "Pista 31: La descripción física", spanish: "Es gordo, bajo y moreno", arabic: "إِنَّهُ بَدِينٌ وَقَصِيرٌ وَشَعْرُهُ أَسْمَرُ", phonetic: "Innahu badinun..." },
  { id: 31045, category: "Pista 31: La descripción física", spanish: "Ella es alta, delgada y rubia", arabic: "إِنَّهَا طَوِيلَةٌ وَرَشِيقَةٌ وَشَعْرُهَا أَشْقَرُ", phonetic: "Innaha tawilatun..." },
  { id: 31046, category: "Pista 31: La descripción física", spanish: "Rashida es morena, guapa...", arabic: "رَشِيدَة هِيَ شَابَّةٌ سَمْرَاءُ...", phonetic: "Rashida hiya..." },
  { id: 31047, category: "Pista 31: La descripción física", spanish: "Nabil es anciano...", arabic: "نَبِيل رَجُلٌ عَجُوزٌ...", phonetic: "Nabil rajulun..." },
  { id: 31048, category: "Pista 31: La descripción física", spanish: "¿Cómo es el hombre de tus sueños?", arabic: "كَيْفَ هُوَ رَجُلُ أَحْلَامِكِ...؟", phonetic: "Kayfa huwa..." },
  { id: 31049, category: "Pista 31: La descripción física", spanish: "Es alto, delgado, rubio...", arabic: "إِنَّهُ طَوِيلٌ، نَحِيلٌ...", phonetic: "Innahu tawilun..." },
  { id: 31050, category: "Pista 31: La descripción física", spanish: "Latifa no es gorda ni flaca", arabic: "لَطِيفَة لَيْسَتْ بَدِينَةً وَلَا رَشِيقَةً", phonetic: "Latifa laysat..." },
  { id: 31051, category: "Pista 31: La descripción física", spanish: "Rashid no es alto ni bajo", arabic: "رَشِيد لَيْسَ طَوِيلًا وَلَا قَصِيرًا", phonetic: "Rashid laysa..." }
];


export default function App() {
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem('flashcards-data-v7');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      console.error("Error cargando datos, reseteando...", e);
      return INITIAL_DATA;
    }
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isImporting, setIsImporting] = useState(false);
  const [frontLanguage, setFrontLanguage] = useState("spanish");
  const [showDiacritics, setShowDiacritics] = useState(true);

  const categories = useMemo(() => {
    const validCards = cards.filter(c => c && c.category);
    const cats = new Set(validCards.map(c => c.category));
    return ["Todos", ...Array.from(cats).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))];
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (!card) return false;
      const s = (card.spanish || "").toLowerCase();
      const a = removeDiacritics(card.arabic || "");
      const p = (card.phonetic || "").toLowerCase();
      const term = searchTerm.toLowerCase();
      
      const matchesSearch = s.includes(term) || a.includes(term) || p.includes(term);
      const matchesCategory = selectedCategory === "Todos" || card.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [cards, searchTerm, selectedCategory]);

  useEffect(() => {
    try {
      localStorage.setItem('flashcards-data-v7', JSON.stringify(cards));
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  }, [cards]);

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
      <header className="bg-emerald-700 text-white shadow-md z-20">
        <div className="w-full px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            <h1 className="text-xl font-bold">Aprende Árabe</h1>
          </div>
          
          <div className="flex-1 w-full max-w-4xl flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-200" />
              <input 
                type="text"
                placeholder="Buscar palabra..."
                className="w-full pl-9 pr-4 py-2 bg-emerald-800/50 border border-emerald-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative md:w-64">
                <Filter className="absolute left-3 top-2.5 w-4 h-4 text-emerald-200" />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-emerald-800/50 border border-emerald-600/50 rounded-lg text-white appearance-none cursor-pointer"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat} className="text-slate-800 bg-white">{cat}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2 bg-emerald-800/50 rounded-lg p-1">
                <button onClick={() => setFrontLanguage('spanish')} className={`px-2 py-1 text-xs rounded-md ${frontLanguage === 'spanish' ? 'bg-white text-emerald-800' : 'text-emerald-100'}`}>ES</button>
                <button onClick={() => setFrontLanguage('arabic')} className={`px-2 py-1 text-xs rounded-md ${frontLanguage === 'arabic' ? 'bg-white text-emerald-800' : 'text-emerald-100'}`}>AR</button>
                <button onClick={() => setShowDiacritics(!showDiacritics)} className={`px-2 py-1 text-xs rounded-md ${showDiacritics ? 'bg-white text-emerald-800' : 'text-emerald-100'}`}>
                    <Type className="w-3.5 h-3.5 inline mr-1" /> {showDiacritics ? "Signos" : "Simple"}
                </button>
            </div>
          </div>

          <button onClick={() => setIsImporting(true)} className="bg-emerald-800/50 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" /> Importar
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedCategory}</h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {filteredCards.length} tarjetas
              </span>
            </div>

            {filteredCards.length === 0 ? (
              <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                <BookOpen className="w-8 h-8 mx-auto opacity-20 text-emerald-600 mb-2" />
                <p>No se encontraron tarjetas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCards.map(card => (
                  <Flashcard key={card.id} data={card} frontLanguage={frontLanguage} showDiacritics={showDiacritics} />
                ))}
              </div>
            )}
          </div>
      </main>

      {isImporting && <ImportModal onClose={() => setIsImporting(false)} onImport={handleImport} />}
    </div>
  );
}

function Flashcard({ data, frontLanguage, showDiacritics }) {
  const [flipState, setFlipState] = useState(0);

  useEffect(() => {
    setFlipState(0);
  }, [frontLanguage]);

  const playAudio = (e) => {
    e.stopPropagation();
    try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.arabic);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8; 
        window.speechSynthesis.speak(utterance);
    } catch (err) { console.error(err); }
  };

  const getStyle = () => {
    if (flipState === 0) return "bg-orange-50 border-orange-100";
    if (flipState === 1) return "bg-emerald-50 border-emerald-200";
    return "bg-amber-100 border-amber-200";
  };

  return (
    <div 
      onClick={() => setFlipState((prev) => (prev + 1) % 3)}
      className={`relative h-32 md:h-52 w-full rounded-2xl shadow-sm border p-4 text-center cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-center items-center ${getStyle()}`}
    >
      <div className="absolute top-3 right-3 flex gap-1">
        {[0, 1, 2].map(s => (
          <div key={s} className={`w-1.5 h-1.5 rounded-full ${flipState === s ? 'bg-current' : 'bg-slate-300'}`} />
        ))}
      </div>

      <div className="w-full">
        {flipState === 2 ? (
            <div>
                <p className="text-[10px] uppercase text-amber-600 font-bold mb-1">Fonética</p>
                <h3 className="text-lg italic font-mono">{data.phonetic}</h3>
            </div>
        ) : (frontLanguage === 'spanish' ? flipState === 0 : flipState === 1) ? (
            <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Español</p>
                <h3 className="text-xl font-bold">{data.spanish}</h3>
            </div>
        ) : (
            <div>
                <p className="text-[10px] uppercase text-emerald-600 font-bold mb-1">Árabe</p>
                <h3 className="text-2xl font-arabic mb-2" dir="rtl">{showDiacritics ? data.arabic : removeDiacritics(data.arabic)}</h3>
                <button onClick={playAudio} className="mx-auto px-3 py-1 bg-emerald-200/50 rounded-full text-xs font-bold text-emerald-800">
                    <Volume2 className="w-3.5 h-3.5 inline mr-1" /> Escuchar
                </button>
            </div>
        )}
      </div>
      <div className="absolute bottom-2 text-[8px] uppercase opacity-40 font-bold">
        {flipState === 2 ? "Reiniciar" : flipState === 0 ? "Ver reverso" : "Ver fonética"}
      </div>
    </div>
  );
}

function ImportModal({ onClose, onImport }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState(null);

  const handleProcess = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImport(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (err) { setError("JSON inválido"); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Importar Datos</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <textarea 
          className="w-full h-40 p-3 font-mono text-xs bg-slate-50 border rounded-lg mb-4"
          placeholder='[{"spanish": "Hola", "arabic": "مَرْحَبًا"}]'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">Cancelar</button>
          <button onClick={handleProcess} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg">Importar</button>
        </div>
      </div>
    </div>
  );
}