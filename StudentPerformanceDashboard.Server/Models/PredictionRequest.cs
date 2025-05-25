namespace StudentPerformanceDashboard.Server.Models;

public class PredictionRequest
{
    public float Zulassungsnote { get; set; }
    public float NoteVorherigerAbschluss { get; set; }
    public float Immatrikulationsalter { get; set; }
    public float BestandeneLehrveranstaltungen1st { get; set; }
    public float BestandeneLehrveranstaltungen2st { get; set; }
}
