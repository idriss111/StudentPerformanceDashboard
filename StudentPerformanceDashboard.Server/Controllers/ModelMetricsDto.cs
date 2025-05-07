namespace StudentPerformanceDashboard.Server.Controllers;

    public class ModelMetricsDto
    {
    public double MacroAccuracy { get; set; }
    public double MicroAccuracy { get; set; }
    public double LogLoss { get; set; }
    public double LogLossReduction { get; set; }
    public double TopKAccuracy { get; set; }
}

