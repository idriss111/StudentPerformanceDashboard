# Student Performance Data Dictionary (Datenwörterbuch)

## Target Variable (Zielvariable)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Target | Target | Categorical | Student's final status | Endstatus des Studierenden | "dropout : 1", "enrolled : 2", "graduate : 3" | "Abbruch : 1", "eingeschrieben : 2", "Abschluss : 3" |

## Demographic Information (Demografische Informationen)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Marital Status | Familienstand | Integer | Current marital status | Aktueller Familienstand | 1-Single, 2-Married, 3-Widower, 4-Divorced, 5-De facto union, 6-Legally separated | 1-Ledig, 2-Verheiratet, 3-Verwitwet, 4-Geschieden, 5-Faktische Lebensgemeinschaft, 6-Rechtlich getrennt |
| Gender | Geschlecht | Integer | Biological sex | Biologisches Geschlecht | 1-Male, 0-Female | 1-Männlich, 0-Weiblich |
| Nacionality | Nationalität | Integer | Country of origin | Herkunftsland | 1-Portuguese, 2-German, 6-Spanish, etc. | 1-Portugiesisch, 2-Deutsch, 6-Spanisch, etc. |
| Age at enrollment | Immatrikulationsalter | Integer | Age when starting the program | Alter bei Studienbeginn | Numerical value (17-60) | Numerischer Wert (17-60) |
| International | International | Integer | International student status | Status als internationaler Student | 1-Yes, 0-No | 1-Ja, 0-Nein |

## Academic Background (Akademischer Hintergrund)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Application mode | Bewerbungsmodus | Integer | How student applied | Bewerbungsmethode | 1-1st phase general contingent, 2-Ordinance No. 612/93, etc. | 1-1. Phase allgemeines Kontingent, 2-Verordnung Nr. 612/93, etc. |
| Course | Studiengang | Integer | Program enrolled in | Eingeschriebener Studiengang | 33-Biofuel Production, 171-Animation, etc. | 33-Biokraftstoffproduktion, 171-Animation, etc. |
| Daytime/evening attendance | Tages/Abends Studium | Integer | Time of day for classes | Unterrichtszeit | 1-Daytime, 0-Evening | 1-Tagesstudium, 0-Abendstudium |
| Previous qualification | Vorheriger Bildungsabschluss | Integer | Highest prior education | Höchster bisheriger Abschluss | 1-Secondary education, 2-Bachelor's, etc. | 1-Sekundarschulabschluss, 2-Bachelor, etc. |
| Previous qualification (grade) | Note des vorherigen Abschlusses | Continuous | Grade of prior qualification | Note des vorherigen Abschlusses | 0-200 scale | Skala 0-200 |
| Admission grade | Zulassungsnote | Continuous | Admission score | Zulassungsnote | 0-200 scale | Skala 0-200 |

## Family Background (Familienhintergrund)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Mother's qualification | Bildungsstand der Mutter | Integer | Mother's education level | Bildungsniveau der Mutter | 1-Secondary, 2-Bachelor, etc. | 1-Sekundarschule, 2-Bachelor, etc. |
| Father's qualification | Bildungsstand des Vaters | Integer | Father's education level | Bildungsniveau des Vaters | 1-Secondary, 2-Bachelor, etc. | 1-Sekundarschule, 2-Bachelor, etc. |
| Mother's occupation | Mutter Beruf | Integer | Mother's profession | Beruf der Mutter | 0-Student, 1-Executive, etc. | 0-Student, 1-Führungskraft, etc. |
| Father's occupation | Vater Beruf | Integer | Father's profession | Beruf des Vaters | 0-Student, 1-Executive, etc. | 0-Student, 1-Führungskraft, etc. |

## Academic Performance (Leistungsdaten)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Curricular units 1st sem (enrolled) | Angemeldete Module 1st | Integer | Courses enrolled in 1st semester | Im 1. Semester eingeschriebene Kurse | Count (0-20) | Anzahl (0-20) |
| Curricular units 1st sem (evaluations) | Prüfungsaktive Lehrveranstaltungen 1st | Integer | Courses with exams in 1st semester | Kurse mit Prüfungen im 1. Semester | Count (0-20) | Anzahl (0-20) |
| Curricular units 1st sem (approved) | Bestandene Lehrveranstaltungen 1st | Integer | Courses passed in 1st semester | Bestandene Kurse im 1. Semester | Count (0-20) | Anzahl (0-20) |
| Curricular units 2nd sem (enrolled) | Angemeldete Module 2st | Integer | Courses enrolled in 2nd semester | Im 2. Semester eingeschriebene Kurse | Count (0-20) | Anzahl (0-20) |
| Curricular units 2nd sem (evaluations) | Prüfungsaktive Lehrveranstaltungen 2st | Integer | Courses with exams in 2nd semester | Kurse mit Prüfungen im 2. Semester | Count (0-20) | Anzahl (0-20) |
| Curricular units 2nd sem (approved) | Bestandene Lehrveranstaltungen 2st | Integer | Courses passed in 2nd semester | Bestandene Kurse im 2. Semester | Count (0-20) | Anzahl (0-20) |

## Financial & Social Factors (Finanzielle & Soziale Faktoren)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Educational special needs | Förderbedarf | Integer | Special needs status | Förderbedarf | 1-Yes, 0-No | 1-Ja, 0-Nein |
| Tuition fees up to date | Studiengebühren aktuell | Integer | Fee payment status | Status der Gebührenzahlung | 1-Yes, 0-No | 1-Ja, 0-Nein |
| Scholarship holder | Stipendiat | Integer | Scholarship status | Stipendienstatus | 1-Yes, 0-No | 1-Ja, 0-Nein |

## Economic Indicators (Wirtschaftliche Indikatoren)
| Column Name (EN) | Column Name (DE) | Type | Description (EN) | Beschreibung (DE) | Values/Notes (EN) | Werte/Hinweise (DE) |
|------------------|------------------|------|------------------|-------------------|-------------------|--------------------|
| Unemployment rate | Arbeitslosenquote | Continuous | National unemployment rate | Nationale Arbeitslosenquote | Percentage (0-100) | Prozentsatz (0-100) |
| Inflation rate | Inflationsrate | Continuous | National inflation rate | Nationale Inflationsrate | Percentage (0-100) | Prozentsatz (0-100) |
| GDP | BIP | Continuous | Gross Domestic Product | Bruttoinlandsprodukt | Numerical value | Numerischer Wert |

## System Diagrams
The following diagrams describe the system workflow:

1. **Login Flow**: `Documentation/Diagrams/Login_Flow.png`
   - Shows authentication process from welcome page to dashboard

2. **Prediction Flow**: `Documentation/Diagrams/Prediction_Flow.png`
   - Illustrates the prediction process from feature input to result display

3. **User Journey**: `Documentation/Diagrams/User_Journey.png`
   - Maps complete user interaction from registration to prediction
