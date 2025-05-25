using Microsoft.AspNetCore.Mvc;
using Microsoft.ML;
using Microsoft.ML.Data;
using StudentPerformanceDashboard.Server.ML;
using StudentPerformanceDashboard.Server.Models;
using System;

namespace StudentPerformanceDashboard.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredictionController : ControllerBase
    {
        private readonly ModelTrainer _modelTrainer;
        private readonly DataLoader _dataLoader;
        private readonly MLContext _mlContext;

        public PredictionController(
            ModelTrainer modelTrainer,
            DataLoader dataLoader)
        {
            _modelTrainer = modelTrainer;
            _dataLoader = dataLoader;
            _mlContext = new MLContext(seed: 42);
        }

        public class PredictionRequest
        {
            public float StudiengebuehrenAktuell { get; set; }
            public float ScholarshipHolder { get; set; }
            public float Immatrikulationsalter { get; set; }
            public float Bestandene1 { get; set; }
            public float Bestandene2 { get; set; }
        }

        [HttpPost("lightgbm")]
        public IActionResult Predict([FromBody] PredictionRequest request)
        {
            try
            {
                // Get or train the model
                var model = GetOrTrainModel();
                if (model == null)
                {
                    return StatusCode(500, new { message = "Failed to load or train model" });
                }

                var studentData = new StudentData
                {
                    // Map the fields from the form
                    StudiengebührenAktuell = request.StudiengebuehrenAktuell,
                    ScholarshipHolder = request.ScholarshipHolder,
                    Immatrikulationsalter = request.Immatrikulationsalter,
                    BestandeneLehrveranstaltungen1st = request.Bestandene1,
                    BestandeneLehrveranstaltungen2st = request.Bestandene2,

                    // Default values for other fields
                    Familienstand = 1.0f,
                    Bewerbungsmodus = 1.0f,
                    Studiengang = 1.0f,
                    TagesAbendsStudium = 1.0f,
                    VorherigerBildungsabschluss = 1.0f,
                    NoteVorherigerAbschluss = 2.5f,
                    Nationalität = 1.0f,
                    BildungsstandMutter = 1.0f,
                    BildungsstandVater = 1.0f,
                    MutterBeruf = 1.0f,
                    VaterBeruf = 1.0f,
                    Zulassungsnote = 2.5f,
                    Vertrieben = 0.0f,
                    Förderbedarf = 0.0f,
                    Geschlecht = 1.0f,
                    International = 0.0f,
                    AngemeldeteModule1st = 5.0f,
                    PrüfungsaktiveLehrveranstaltungen1st = 4.0f,
                    AngemeldeteModule2st = 5.0f,
                    PrüfungsaktiveLehrveranstaltungen2st = 4.0f,
                    Target = ""  // This is required but won't be used for prediction
                };

                // Create prediction engine
                var predictionEngine = _mlContext.Model.CreatePredictionEngine<StudentData, PredictionOutput>(model);

                // Make prediction
                var prediction = predictionEngine.Predict(studentData);

                return Ok(new
                {
                    target = prediction.PredictedLabel,
                    scores = prediction.Score,
                    probability = prediction.Score.Max()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Prediction error: {ex.Message}" });
            }
        }

        private ITransformer GetOrTrainModel()
        {
            // First, check if we have a cached model from training
            if (_modelTrainer.TrainingResult?.Model != null &&
                _modelTrainer.TrainingResult.Success)
            {
                return _modelTrainer.TrainingResult.Model;
            }

            // If no cached model, train a new one
            var result = _modelTrainer.TrainLightGbm();

            if (result.Success)
            {
                return result.Model;
            }

            return null;
        }
    }

    public class PredictionOutput
    {
        [ColumnName("PredictedLabel")]
        public string PredictedLabel { get; set; }

        [ColumnName("Score")]
        public float[] Score { get; set; }
    }
}