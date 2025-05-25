using Microsoft.ML.Data;

namespace StudentPerformanceDashboard.Server.Models;

public class StudentData
{
    public float Familienstand { get; set; }
    public float Bewerbungsmodus { get; set; }
    public float Studiengang { get; set; }
    public float TagesAbendsStudium { get; set; }
    public float VorherigerBildungsabschluss { get; set; }
    public float NoteVorherigerAbschluss { get; set; }
    public float Nationalität { get; set; }
    public float BildungsstandMutter { get; set; }
    public float BildungsstandVater { get; set; }
    public float MutterBeruf { get; set; }
    public float VaterBeruf { get; set; }
    public float Zulassungsnote { get; set; }
    public float Vertrieben { get; set; }
    public float Förderbedarf { get; set; }
    public float StudiengebührenAktuell { get; set; }
    public float Geschlecht { get; set; }
    public float ScholarshipHolder { get; set; }
    public float Immatrikulationsalter { get; set; }
    public float International { get; set; }
    public float AngemeldeteModule1st { get; set; }
    public float PrüfungsaktiveLehrveranstaltungen1st { get; set; }
    public float BestandeneLehrveranstaltungen1st { get; set; }
    public float AngemeldeteModule2st { get; set; }
    public float PrüfungsaktiveLehrveranstaltungen2st { get; set; }
    public float BestandeneLehrveranstaltungen2st { get; set; }


    [ColumnName("Target")]  // Changed from "Label" to "Target"
    public string Target { get; set; }

}

    public class PredictionInput
    {
        // Fields from the form
        public float StudiengebuehrenAktuell { get; set; }
        public float ScholarshipHolder { get; set; }
        public float Immatrikulationsalter { get; set; }
        public float Bestandene1 { get; set; }
        public float Bestandene2 { get; set; }

        // Convert to full StudentData with default values
        public StudentData ToStudentData()
        {
            return new StudentData
            {
                // Map the form fields
                StudiengebührenAktuell = StudiengebuehrenAktuell,
                ScholarshipHolder = ScholarshipHolder,
                Immatrikulationsalter = Immatrikulationsalter,
                BestandeneLehrveranstaltungen1st = Bestandene1,
                BestandeneLehrveranstaltungen2st = Bestandene2,

                // Fill other fields with mean values or default values
                // These would ideally be calculated from your dataset
                Familienstand = 1.0f, // Mean/default value
                Bewerbungsmodus = 1.0f, // Mean/default value
                Studiengang = 1.0f, // Mean/default value
                TagesAbendsStudium = 1.0f, // Mean/default value
                VorherigerBildungsabschluss = 1.0f, // Mean/default value
                NoteVorherigerAbschluss = 2.5f, // Mean/default value
                Nationalität = 1.0f, // Mean/default value
                BildungsstandMutter = 1.0f, // Mean/default value
                BildungsstandVater = 1.0f, // Mean/default value
                MutterBeruf = 1.0f, // Mean/default value
                VaterBeruf = 1.0f, // Mean/default value
                Zulassungsnote = 2.5f, // Mean/default value
                Vertrieben = 0.0f, // Mean/default value
                Förderbedarf = 0.0f, // Mean/default value
                Geschlecht = 1.0f, // Mean/default value
                International = 0.0f, // Mean/default value
                AngemeldeteModule1st = 5.0f, // Mean/default value
                PrüfungsaktiveLehrveranstaltungen1st = 4.0f, // Mean/default value
                AngemeldeteModule2st = 5.0f, // Mean/default value
                PrüfungsaktiveLehrveranstaltungen2st = 4.0f, // Mean/default value
                Target = ""
                


            };
        }
    }


