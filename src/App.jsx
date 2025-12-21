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
  Languages // Nuevo icono importado
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

   // Pista 5:  Quién eres

{ id: 618392, category: "Pista 5:  Quién eres", spanish: "¿Quién eres?", arabic: "من أنت؟", phonetic: "man anta?" },
{ id: 905174, category: "Pista 5:  Quién eres", spanish: "Soy Marwán", arabic: "أنا مروان", phonetic: "anā marwān" },
{ id: 742681, category: "Pista 5:  Quién eres", spanish: "¿Quién eres?", arabic: "من أنت؟", phonetic: "man anti?" },
{ id: 381950, category: "Pista 5:  Quién eres", spanish: "Soy Fátima", arabic: "أنا فاطمة", phonetic: "anā fāṭima" },
{ id: 569204, category: "Pista 5:  Quién eres", spanish: "¿Quién es? (masculino)", arabic: "من هو؟", phonetic: "man huwa?" },
{ id: 827613, category: "Pista 5:  Quién eres", spanish: "Es Mústafa", arabic: "هو مصطفى", phonetic: "huwa muṣṭafā" },
{ id: 194508, category: "Pista 5:  Quién eres", spanish: "¿Quién es? (femenino)", arabic: "من هي؟", phonetic: "man hiya?" },
{ id: 760381, category: "Pista 5:  Quién eres", spanish: "Es Layla", arabic: "هي ليلى", phonetic: "hiya laylā" },

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
{ id: 418639, category: "Pista 6: De dónde eres", spanish: "Es de Italia", arabic: "