using Microsoft.ML;
using Microsoft.ML.Calibrators;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using Microsoft.ML.Trainers.LightGbm;
using StudentPerformanceDashboard.Server.ML;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace StudentPerformanceDashboard.Server.ML;

public class DataLoader
{
    private readonly string trainPath;
    private readonly MLContext context;
    private const string TargetColumnName = "Target";
    private const string FamilienColumnName = "Familienstand";
    public DataLoader() 
    {
        context = new MLContext();
       
        string basePath = Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.FullName;
        trainPath = Path.Combine(basePath, "Data", "DATA.csv");
        
    }

    public DataStats LoadAndAnalyzeData()
    {
        var stats = new DataStats();

        // Validate files
        if (!File.Exists(trainPath)) stats.Errors.Add("Data file not found");
        if (stats.Errors.Count > 0) return stats;

        try
        {
            // Load data
            IDataView trainData = context.Data.LoadFromTextFile<Model>(
                path: trainPath,
                hasHeader: true,
                separatorChar: ';');

           

            // Basic stats
            stats.TrainRowCount = trainData.GetColumn<float>("Familienstand").Count();

            // Column analysis
            foreach (var column in trainData.Schema)
            {
                stats.Columns.Add(new ColumnInfo
                {
                    Name = column.Name,
                    Type = column.Type.RawType.Name
                });
            }

            // Data preview
            stats.TrainPreview = GetDataPreview(trainData, 10);

            stats.NumericStats = GetBasicNumericStats(trainData);
            stats.CorrelationMatrix = CalculateCorrelationMatrix(trainData);
            stats.FeatureTargetAnalysis = AnalyzeFeatureTargetRelationships(trainData, TargetColumnName);
            stats.CramersvMatrix = CalculateCramersVMatrix(trainData);
            //   stats.FamilienstandDistribution = GetCategoryDistribution(trainData, "Familienstand");
            //stats.BewerbungsmodusDistribution = GetCategoryDistribution(trainData, "Bewerbungsmodus");

            // Target variable analysis (using GetColumnOrNull)
            var targetCol = trainData.Schema.GetColumnOrNull(TargetColumnName);
            var familieCol = trainData.Schema.GetColumnOrNull(FamilienColumnName);

            if (targetCol != null)
            {
                stats.TargetVariableAnalysis = new TargetVariableAnalysis
                {
                    TargetColumn = TargetColumnName,
                    ClassDistribution = GetClassDistribution(trainData, TargetColumnName)
                };
            }
            

            else
            {
                stats.Errors.Add($"Required target column '{FamilienColumnName}' not found");

            }

            stats.Message = "Data loaded successfully";
        }
        catch (Exception ex)
        {
            stats.Errors.Add($"Error: {ex.Message}");
        }

        return stats;
    }

    private List<Dictionary<string, object>> GetDataPreview(IDataView data, int maxRows)
    {
        var preview = data.Preview(maxRows);
        return preview.RowView
            .Select(row => row.Values
                .ToDictionary(col => col.Key, col => col.Value ?? "NULL"))
            .ToList();
    }

    private Dictionary<string, NumericColumnStats> GetBasicNumericStats(IDataView data)

    {
        var stats = new Dictionary<string, NumericColumnStats>();
        foreach (var column in data.Schema.Where(c => c.Type == NumberDataViewType.Single))
        {
            var values = data.GetColumn<float>(column.Name).Where(v => !float.IsNaN(v)).ToArray();
            if (values.Length == 0) continue;
            float median = values.Length % 2 == 0
            ? (values[values.Length / 2 - 1] + values[values.Length / 2]) / 2.0f
            : values[values.Length / 2];

            // Simple histogram with 5 bins
            var min = values.Min();
            var max = values.Max();
            var binSize = (max - min) / 5;
            var histogram = new Dictionary<string, int>();

            for (int i = 0; i < 5; i++)
            {
                var lower = min + i * binSize;
                var upper = lower + binSize;
                var count = values.Count(v => v >= lower && v < upper);
                histogram[$"{lower:F1}-{upper:F1}"] = count;
            }

            stats[column.Name] = new NumericColumnStats
            {
                Min = min,
                Max = max,
                Mean = values.Average(),
                Median = median,
                Histogram = histogram, // Add this
                MissingValues = data.GetColumn<float>(column.Name).Count(float.IsNaN)
            };
        }
        return stats;
    }


    private Dictionary<string, int> GetClassDistribution(IDataView data, string columnName)
    {
        var distribution = new Dictionary<string, int>();
        var column = data.Schema[columnName];

        if (column.Type == TextDataViewType.Instance)
        {
            var values = data.GetColumn<string>(columnName);
            foreach (var value in values)
            {
                string key = value ?? "NULL";
                distribution[key] = distribution.ContainsKey(key) ? distribution[key] + 1 : 1;
            }
        }
       

        return distribution;
    }

    private Dictionary<string, Dictionary<string, float>> CalculateCorrelationMatrix(IDataView data)
    {
        var correlationMatrix = new Dictionary<string, Dictionary<string, float>>();

        // Get all numeric columns PLUS the Target column
        var numericColumns = data.Schema.Where(col =>
            col.Type == NumberDataViewType.Single || col.Name == "Target").ToList();

        // Get all numeric columns as arrays
        var columnData = new Dictionary<string, float[]>();
        foreach (var column in numericColumns)
        {
            if (column.Name == "Target")
            {
                // Convert string Target to numeric values
                var targetStrings = data.GetColumn<string>(column.Name).ToArray();
                columnData[column.Name] = targetStrings.Select(x => float.Parse(x)).ToArray();
            }
            else
            {
                columnData[column.Name] = data.GetColumn<float>(column.Name).ToArray();
            }
        }

        // Rest of your correlation calculation remains the same
        foreach (var col1 in numericColumns)
        {
            correlationMatrix[col1.Name] = new Dictionary<string, float>();
            var col1Data = columnData[col1.Name];

            foreach (var col2 in numericColumns)
            {
                if (col1.Name == col2.Name)
                {
                    correlationMatrix[col1.Name][col2.Name] = 1.0f;
                    continue;
                }

                var col2Data = columnData[col2.Name];
                correlationMatrix[col1.Name][col2.Name] = CalculatePearsonCorrelation(col1Data, col2Data);
            }
        }

        return correlationMatrix;
    }

    private float CalculatePearsonCorrelation(float[] values1, float[] values2)
    {
        if (values1.Length != values2.Length || values1.Length == 0)
            return 0;

        // Calculate means
        float sum1 = 0, sum2 = 0;
        for (int i = 0; i < values1.Length; i++)
        {
            sum1 += values1[i];
            sum2 += values2[i];
        }
        float mean1 = sum1 / values1.Length;
        float mean2 = sum2 / values2.Length;

        // Calculate covariance and standard deviations
        float covariance = 0;
        float stdDev1 = 0;
        float stdDev2 = 0;

        for (int i = 0; i < values1.Length; i++)
        {
            float diff1 = values1[i] - mean1;
            float diff2 = values2[i] - mean2;

            covariance += diff1 * diff2;
            stdDev1 += diff1 * diff1;
            stdDev2 += diff2 * diff2;
        }

        // Handle division by zero
        if (stdDev1 == 0 || stdDev2 == 0)
            return 0;

        return covariance / (float)(Math.Sqrt(stdDev1) * Math.Sqrt(stdDev2));
    }




    private FeatureTargetStats AnalyzeFeatureTargetRelationships(IDataView data, string targetColumn)
    {
        var stats = new FeatureTargetStats();
        var targetValues = data.GetColumn<string>(targetColumn).ToArray();

        // Get all numeric features (excluding target)
        var numericFeatures = data.Schema
            .Where(col => col.Type == NumberDataViewType.Single && col.Name != targetColumn)
            .ToList();

        // Prepare feature data
        var featureData = new List<float[]>();
        var featureNames = new List<string>();

        foreach (var feature in numericFeatures)
        {
            featureData.Add(data.GetColumn<float>(feature.Name).ToArray());
            featureNames.Add(feature.Name);
        }

        // Calculate statistics
        stats.AnovaResults = CalculateANOVA(featureData, targetValues)
            .ToDictionary(kvp => featureNames[int.Parse(kvp.Key.Split('_')[1])], kvp => kvp.Value);

        stats.KruskalWallisResults = CalculateKruskalWallis(featureData, targetValues)
            .ToDictionary(kvp => featureNames[int.Parse(kvp.Key.Split('_')[1])], kvp => kvp.Value);

        stats.CorrelationRatios = CalculateCorrelationRatio(featureData, targetValues)
            .ToDictionary(kvp => featureNames[int.Parse(kvp.Key.Split('_')[1])], kvp => kvp.Value);

        return stats;
    }

    private Dictionary<string, double> CalculateANOVA(List<float[]> features, string[] targetClasses)
    {
        var uniqueClasses = targetClasses.Distinct().ToList();
        var results = new Dictionary<string, double>();

        for (int i = 0; i < features.Count; i++)
        {
            var featureValues = features[i];
            var groups = uniqueClasses.Select(c =>
                featureValues.Where((_, idx) => targetClasses[idx] == c).ToArray()).ToList();

            double overallMean = featureValues.Average();
            double ssb = groups.Sum(g => g.Length * Math.Pow(g.Average() - overallMean, 2));
            double ssw = groups.Sum(g => g.Sum(x => Math.Pow(x - g.Average(), 2)));

            double fValue = (ssb / (uniqueClasses.Count - 1)) /
                           (ssw / (featureValues.Length - uniqueClasses.Count));
            results[$"Feature_{i}"] = fValue;
        }

        return results;
    }

    private Dictionary<string, double> CalculateKruskalWallis(List<float[]> features, string[] targetClasses)
    {
        var uniqueClasses = targetClasses.Distinct().ToList();
        var results = new Dictionary<string, double>();

        foreach (var (feature, idx) in features.Select((f, i) => (f, i)))
        {
            // Rank all values (handling ties)
            var rankedData = feature.Select((x, i) => new { Value = x, Class = targetClasses[i] })
                                  .OrderBy(x => x.Value)
                                  .Select((x, rank) => new { x.Value, Rank = (double)rank + 1, x.Class })
                                  .GroupBy(x => x.Value)
                                  .SelectMany(g => g.Select(x => new { x.Value, AdjustedRank = g.Average(y => y.Rank), x.Class }))
                                  .ToList();

            // Calculate sum of ranks per group
            var groupRanks = uniqueClasses.ToDictionary(
                c => c,
                c => rankedData.Where(x => x.Class == c).Sum(x => x.AdjustedRank));

            int N = feature.Length;
            double h = (12.0 / (N * (N + 1))) *
                      groupRanks.Sum(g => Math.Pow(g.Value, 2) / rankedData.Count(x => x.Class == g.Key)) -
                      3 * (N + 1);

            results[$"Feature_{idx}"] = h;
        }

        return results;
    }

    private Dictionary<string, double> CalculateCorrelationRatio(List<float[]> features, string[] targetClasses)
    {
        var uniqueClasses = targetClasses.Distinct().ToList();
        var results = new Dictionary<string, double>();

        foreach (var (feature, idx) in features.Select((f, i) => (f, i)))
        {
            double overallMean = feature.Average();
            var groups = uniqueClasses.Select(c =>
                feature.Where((_, i) => targetClasses[i] == c).ToArray()).ToList();

            double betweenVar = groups.Sum(g => g.Length * Math.Pow(g.Average() - overallMean, 2));
            double totalVar = feature.Sum(x => Math.Pow(x - overallMean, 2));

            double eta = Math.Sqrt(betweenVar / totalVar);
            results[$"Feature_{idx}"] = eta;
        }

        return results;
    }



private Dictionary<string, Dictionary<string, double>> CalculateCramersVMatrix(IDataView data)
{
    var cramersVMatrix = new Dictionary<string, Dictionary<string, double>>();

    // Get columns to analyze
    var columnsToAnalyze = data.Schema
        .Select(col => col.Name)
        .ToList();

    Console.WriteLine($"Analyzing {columnsToAnalyze.Count} columns: {string.Join(", ", columnsToAnalyze)}");

    if (columnsToAnalyze.Count < 2)
    {
        Console.WriteLine("Insufficient columns for matrix (need at least 2)");
        return cramersVMatrix;
    }

    // Dictionary to store the converted categorical values for each column
    var columnCategories = columnsToAnalyze.ToDictionary(col => col, _ => new List<string>());

    // Read data row by row
    using (var cursor = data.GetRowCursor(data.Schema))
    {
        var getters = new Dictionary<string, Delegate>();
        var buffers = new Dictionary<string, object>();

        foreach (var col in columnsToAnalyze)
        {
            var column = data.Schema[col];
            if (column.Type.RawType == typeof(float))
            {
                var buffer = new float[1];
                buffers[col] = buffer;
                getters[col] = cursor.GetGetter<float>(column);
            }
            else
            {
                var buffer = default(string);
                buffers[col] = buffer;
                getters[col] = cursor.GetGetter<ReadOnlyMemory<char>>(column);
            }
        }

        var numericValues = columnsToAnalyze
            .Where(col => data.Schema[col].Type.RawType == typeof(float))
            .ToDictionary(col => col, col => new List<float>());

        while (cursor.MoveNext())
        {
            foreach (var col in columnsToAnalyze)
            {
                if (getters[col] is ValueGetter<float> floatGetter)
                {
                    var buffer = new float[1];
                    floatGetter(ref buffer[0]);
                    numericValues[col].Add(buffer[0]);
                }
                else if (getters[col] is ValueGetter<ReadOnlyMemory<char>> stringGetter)
                {
                    ReadOnlyMemory<char> value = default;
                    stringGetter(ref value);
                    columnCategories[col].Add(value.ToString());
                }
            }
        }

        // Bin numeric columns into categories
        foreach (var col in numericValues.Keys)
        {
            var values = numericValues[col];
            var min = values.Min();
            var max = values.Max();
            var range = max - min;
            columnCategories[col] = values.Select(v =>
                range > 0 ? Math.Min(4, (int)(5 * (v - min) / range)).ToString() : "0"
            ).ToList();
        }
    }

    // Compute pairwise Cramér's V
    foreach (var col1 in columnsToAnalyze)
    {
        cramersVMatrix[col1] = new Dictionary<string, double>();
        var col1Cats = columnCategories[col1];
        var unique1 = col1Cats.Distinct().ToList();

        foreach (var col2 in columnsToAnalyze)
        {
            if (col1 == col2)
            {
                cramersVMatrix[col1][col2] = 1.0;
                continue;
            }

            var col2Cats = columnCategories[col2];
            var unique2 = col2Cats.Distinct().ToList();

            if (unique1.Count < 2 || unique2.Count < 2)
            {
                cramersVMatrix[col1][col2] = 0;
                continue;
            }

            var table = new int[unique1.Count, unique2.Count];
            int n = col1Cats.Count;

            for (int i = 0; i < n; i++)
            {
                int r = unique1.IndexOf(col1Cats[i]);
                int c = unique2.IndexOf(col2Cats[i]);
                if (r >= 0 && c >= 0)
                    table[r, c]++;
            }

            cramersVMatrix[col1][col2] = CalculateCramersV(table);
        }
    }

    return cramersVMatrix;
}

private double CalculateCramersV(int[,] contingencyTable)
{
    int rows = contingencyTable.GetLength(0);
    int cols = contingencyTable.GetLength(1);
    double n = 0;

    var rowTotals = new double[rows];
    var colTotals = new double[cols];

    for (int i = 0; i < rows; i++)
    {
        for (int j = 0; j < cols; j++)
        {
            rowTotals[i] += contingencyTable[i, j];
            colTotals[j] += contingencyTable[i, j];
            n += contingencyTable[i, j];
        }
    }

    double chi2 = 0;
    for (int i = 0; i < rows; i++)
    {
        for (int j = 0; j < cols; j++)
        {
            double expected = rowTotals[i] * colTotals[j] / n;
            if (expected > 0)
            {
                double diff = contingencyTable[i, j] - expected;
                chi2 += (diff * diff) / expected;
            }
        }
    }

    if (n == 0 || chi2 <= 0) return 0;

    double phi2 = chi2 / n;
    double k = Math.Min(rows - 1, cols - 1);

    return k > 0 ? Math.Min(1.0, Math.Sqrt(phi2 / k)) : 0;
}

    public IDataView GetTrainTestSplit(out IDataView testData, float testFraction = 0.2f)
    {
        var fullData = context.Data.LoadFromTextFile<Model>(
                path: trainPath,
                hasHeader: true,
                separatorChar: ';');

        var split = context.Data.TrainTestSplit(fullData, testFraction: testFraction);
        testData = split.TestSet;
        return split.TrainSet;
    }
    public IDataView LoadDataAsIDataView()
    {
        return context.Data.LoadFromTextFile<Model>(
            path: trainPath,
            hasHeader: true,
            separatorChar: ';');
    }
}




// Machine Learning Models

public class ModelTrainer
{
    private readonly MLContext _mlContext;
    private readonly DataLoader _dataLoader;

    
    public ModelTrainingResult? TrainingResult { get; private set; }

    public ModelTrainer(DataLoader dataLoader)
    {
        _mlContext = new MLContext(seed: 42);
        _dataLoader = dataLoader;
    }

    // Train a Random Forest model
    public ModelTrainingResult TrainRandomForest()
    {
        var result = new ModelTrainingResult();

        try
        {
            var trainData = _dataLoader.LoadDataAsIDataView();
            var targetAnalysis = _dataLoader.LoadAndAnalyzeData().TargetVariableAnalysis;

            if (targetAnalysis == null)
            {
                result.Errors.Add("Target variable analysis not available.");
                return result;
            }

            // 1. Build data processing pipeline
            var pipeline = _mlContext.Transforms
                .Conversion.MapValueToKey("Label", targetAnalysis.TargetColumn)
                .Append(_mlContext.Transforms.Concatenate("Features", GetFeatureColumns(trainData)))
                .Append(_mlContext.Transforms.NormalizeMinMax("Features"))
                .AppendCacheCheckpoint(_mlContext);

            // 2. Define the multi-class trainer using OneVersusAll
            var trainer = _mlContext.MulticlassClassification.Trainers
                .OneVersusAll(_mlContext.BinaryClassification.Trainers.FastForest(new Microsoft.ML.Trainers.FastTree.FastForestBinaryTrainer.Options
                {
                    NumberOfTrees = 200,
                    LabelColumnName = "Label",
                    FeatureColumnName = "Features",
                    NumberOfThreads = 4,
                }));

            var trainingPipeline = pipeline
                .Append(trainer)
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            // 3. Train model
            result.Model = trainingPipeline.Fit(trainData);

            // 4. Evaluate model using multi-class evaluator
            var predictions = result.Model.Transform(trainData);
            result.Metrics = _mlContext.MulticlassClassification.Evaluate(predictions, labelColumnName: "Label");
            result.Success = true;
            TrainingResult = result; // Store for later reuse
        }
        catch (Exception ex)
        {
            result.Errors.Add($"Training failed: {ex.Message}");
        }

        return result;
    }

    // Train a LightGBM model
    public ModelTrainingResult TrainLightGbm()
    {
        var result = new ModelTrainingResult();

        try
        {
            var trainData = _dataLoader.LoadDataAsIDataView();
            var targetAnalysis = _dataLoader.LoadAndAnalyzeData().TargetVariableAnalysis;

            if (targetAnalysis == null)
            {
                result.Errors.Add("Target variable analysis not available.");
                return result;
            }

            var pipeline = _mlContext.Transforms
             .Conversion.MapValueToKey(
                 outputColumnName: "Target",  // Changed from "Label"
                 inputColumnName: targetAnalysis.TargetColumn)
             .Append(_mlContext.Transforms.Concatenate("Features", GetFeatureColumns(trainData)))
             .Append(_mlContext.Transforms.NormalizeMinMax("Features"))
             .AppendCacheCheckpoint(_mlContext);

            var trainerOptions = new LightGbmMulticlassTrainer.Options
            {
                LabelColumnName = "Target",  // 👈 use the mapped key column
                FeatureColumnName = "Features",
                NumberOfLeaves = 31,
                MinimumExampleCountPerLeaf = 20,
                LearningRate = 0.1,
                NumberOfIterations = 100,
                Booster = new GradientBooster.Options { L2Regularization = 0.5 },
                UseSoftmax = true
            };

            var trainingPipeline = pipeline
                  .Append(_mlContext.MulticlassClassification.Trainers.LightGbm(trainerOptions))
                  .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            result.Model = trainingPipeline.Fit(trainData);
            _mlContext.Model.Save(result.Model, trainData.Schema, "ML/lightgbm-model.zip");

            var predictions = result.Model.Transform(trainData);
            result.Metrics = _mlContext.MulticlassClassification.Evaluate(
                predictions,
                labelColumnName: "Target");

            result.Success = true;
        }
        catch (Exception ex)
        {
            result.Errors.Add($"LightGBM training failed: {ex.Message}");
        }

        return result;
    }


    // Train a Support Vector Machine (SVM) model
    public ModelTrainingResult TrainSvm()
    {
        var result = new ModelTrainingResult();

        try
        {
            var trainData = _dataLoader.LoadDataAsIDataView();
            var targetAnalysis = _dataLoader.LoadAndAnalyzeData().TargetVariableAnalysis;

            if (targetAnalysis == null)
            {
                result.Errors.Add("Target variable analysis not available.");
                return result;
            }

            // 1. Data processing pipeline
            var pipeline = _mlContext.Transforms
                .Conversion.MapValueToKey("Label", targetAnalysis.TargetColumn)
                .Append(_mlContext.Transforms.Concatenate("Features", GetFeatureColumns(trainData)))
                .Append(_mlContext.Transforms.NormalizeMinMax("Features"))
                .AppendCacheCheckpoint(_mlContext);

            // 2. Define the SVM trainer wrapped in OneVersusAll
            var svmTrainer = _mlContext.MulticlassClassification.Trainers
                .OneVersusAll(_mlContext.BinaryClassification.Trainers.LinearSvm(new Microsoft.ML.Trainers.LinearSvmTrainer.Options
                {
                    LabelColumnName = "Label",
                    FeatureColumnName = "Features",
                    NumberOfIterations = 100,
                }));

            var trainingPipeline = pipeline
                .Append(svmTrainer)
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            // 3. Train the model
            result.Model = trainingPipeline.Fit(trainData);

            // 4. Evaluate
            var predictions = result.Model.Transform(trainData);
            result.Metrics = _mlContext.MulticlassClassification.Evaluate(predictions, labelColumnName: "PredictedLabel");
            result.Success = true;
            TrainingResult = result;
        }
        catch (Exception ex)
        {
            result.Errors.Add($"SVM training failed: {ex.Message}");
        }

        return result;
    }


    // Train an SDCA Maximum Entropy model
    public ModelTrainingResult TrainSdcaMaximumEntropy()
    {
        var result = new ModelTrainingResult();

        try
        {
            var trainData = _dataLoader.LoadDataAsIDataView();
            var targetAnalysis = _dataLoader.LoadAndAnalyzeData().TargetVariableAnalysis;

            if (targetAnalysis == null)
            {
                result.Errors.Add("Target variable analysis not available.");
                return result;
            }

            // 1. Preprocessing pipeline
            var pipeline = _mlContext.Transforms
                .Conversion.MapValueToKey("Label", targetAnalysis.TargetColumn)
                .Append(_mlContext.Transforms.Concatenate("Features", GetFeatureColumns(trainData)))
                .Append(_mlContext.Transforms.NormalizeMinMax("Features"))
                .AppendCacheCheckpoint(_mlContext);

            // 2. SDCA Maximum Entropy trainer
            var trainer = _mlContext.MulticlassClassification.Trainers
                .SdcaMaximumEntropy(labelColumnName: "Label", featureColumnName: "Features");

            var trainingPipeline = pipeline
                .Append(trainer)
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            // 3. Train model
            result.Model = trainingPipeline.Fit(trainData);

            // 4. Evaluate
            var predictions = result.Model.Transform(trainData);
            result.Metrics = _mlContext.MulticlassClassification.Evaluate(predictions, labelColumnName: "Label");
            result.Success = true;
            TrainingResult = result;
        }
        catch (Exception ex)
        {
            result.Errors.Add($"SDCA Maximum Entropy training failed: {ex.Message}");
        }

        return result;
    }


    private string[] GetFeatureColumns(IDataView data)
    {
        return data.Schema
            .Where(col => col.Name != "Target" && col.Type is NumberDataViewType)
            .Select(col => col.Name)
            .ToArray();
    }
}


// Machine Learning Trainer Result 
public class ModelTrainingResult
{
    public ITransformer? Model { get; set; }
    public MulticlassClassificationMetrics? Metrics { get; set; }
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new List<string>();
}











