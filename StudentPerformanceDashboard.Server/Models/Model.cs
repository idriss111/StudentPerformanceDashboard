using Microsoft.ML.Data;

public class Model
{
    // Column 0
    [LoadColumn(0)]
    public float Familienstand { get; set; }  // Marital status

    // Column 1
    [LoadColumn(1)]
    public float Bewerbungsmodus { get; set; }  // Application mode

    // Column 2
    [LoadColumn(2)]
    public float Studiengang { get; set; }  // Course

    // Column 3
    [LoadColumn(3)]
    public float TagesAbendsStudium { get; set; }  // Daytime/evening attendance

    // Column 4
    [LoadColumn(4)]
    public float VorherigerBildungsabschluss { get; set; }  // Previous qualification

    // Column 5
    [LoadColumn(5)]
    public float NoteVorherigerAbschluss { get; set; }  // Previous qualification grade

    // Column 6
    [LoadColumn(6)]
    public float Nationalität { get; set; }  // Nationality

    // Column 7
    [LoadColumn(7)]
    public float BildungsstandMutter { get; set; }  // Mother's qualification

    // Column 8
    [LoadColumn(8)]
    public float BildungsstandVater { get; set; }  // Father's qualification

    // Column 9
    [LoadColumn(9)]
    public float MutterBeruf { get; set; }  // Mother's occupation

    // Column 10
    [LoadColumn(10)]
    public float VaterBeruf { get; set; }  // Father's occupation

    // Column 11
    [LoadColumn(11)]
    public float Zulassungsnote { get; set; }  // Admission grade

    // Column 12
    [LoadColumn(12)]
    public float Vertrieben { get; set; }  // Displaced

    // Column 13
    [LoadColumn(13)]
    public float Förderbedarf { get; set; }  // Educational special needs

    // Column 14
    [LoadColumn(14)]
    public float StudiengebührenAktuell { get; set; }  // Tuition fees up to date

    // Column 15
    [LoadColumn(15)]
    public float Geschlecht { get; set; }  // Gender

    // Column 16
    [LoadColumn(16)]
    public float ScholarshipHolder { get; set; }  // Scholarship holder

    // Column 17
    [LoadColumn(17)]
    public float Immatrikulationsalter { get; set; }  // Age at enrollment

    // Column 18
    [LoadColumn(18)]
    public float International { get; set; }  // International

    // Column 19
    [LoadColumn(19)]
    public float AngemeldeteModule1st { get; set; }  // Curricular units 1st sem enrolled

    // Column 20
    [LoadColumn(20)]
    public float PrüfungsaktiveLehrveranstaltungen1st { get; set; }  // Curricular units 1st sem evaluations

    // Column 21
    [LoadColumn(21)]
    public float BestandeneLehrveranstaltungen1st { get; set; }  // Curricular units 1st sem approved

    // Column 22
    [LoadColumn(22)]
    public float AngemeldeteModule2st { get; set; }  // Curricular units 2nd sem enrolled

    // Column 23
    [LoadColumn(23)]
    public float PrüfungsaktiveLehrveranstaltungen2st { get; set; }  // Curricular units 2nd sem evaluations

    // Column 24
    [LoadColumn(24)]
    public float BestandeneLehrveranstaltungen2st { get; set; }  // Curricular units 2nd sem approved

    // Column 25 (Target variable)
    [LoadColumn(25)]
    public string Target { get; set; }
}