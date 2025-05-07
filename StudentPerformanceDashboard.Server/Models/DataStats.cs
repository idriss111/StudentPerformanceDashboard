using StudentPerformanceDashboard.Server.ML;

public class DataStats
{
    public string Message { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = new();
    public long TrainRowCount { get; set; }
    
    public List<ColumnInfo> Columns { get; set; } = new();
    public List<Dictionary<string, object>> TrainPreview { get; set; } = new();
    public Dictionary<string, NumericColumnStats> NumericStats { get; set; } = new();
    public Dictionary<string, int> FamilienstandDistribution { get; set; } = new();
    public Dictionary<string, int> BewerbungsmodusDistribution { get; set; } = new();
    public TargetVariableAnalysis? TargetVariableAnalysis { get; set; }
    public Dictionary<string, Dictionary<string, float>> CorrelationMatrix { get; set; } = new();
    public FeatureTargetStats FeatureTargetAnalysis { get; set; } = new();
    public Dictionary<string, Dictionary<string, double>> CramersvMatrix { get; set; } = new();
    public ModelTrainingResult? TrainingResult { get; set; }


}

public class ColumnInfo
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public class NumericColumnStats
{
    public float Min { get; set; }
    public float Max { get; set; }
    public float Mean { get; set; }
    public int MissingValues { get; set; }
    public Dictionary<string, int> Histogram { get; set; } = new(); 
}
public class TargetVariableAnalysis
{
 
    public Dictionary<string, int> ClassDistribution { get; set; } = new();
    public string? TargetColumn { get; set; }
}
public class FeatureTargetStats
{
    public Dictionary<string, double> AnovaResults { get; set; } = new();
    public Dictionary<string, double> KruskalWallisResults { get; set; } = new();
    public Dictionary<string, double> CorrelationRatios { get; set; } = new();
}
