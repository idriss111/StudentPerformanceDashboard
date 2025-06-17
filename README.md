# Student Performance Dashboard

A web application for FH Aachen students to register, log in, track performance, and predict study outcomes using ML models.

---

## 🚀 Features

* **User Registration & Authentication**: Secure signup/login with JWT tokens for 3‑hour sessions.
* **Dashboard**: Interactive React UI with charts:

  * Distribution of final grades (Pie & Bar charts)
  * Statistical summaries (mean, median, stddev)
  * Correlation matrices and Cramér’s V associations
* **Machine Learning**:

  * Train models (Random Forest, LightGBM, SVM, SDCA) via API
  * Live prediction endpoint using LightGBM
  * Data analytics (feature/target distributions)
* **Responsive Design**: Tailwind CSS ensures mobile-friendly layouts.

---

## 🏗️ Architecture

```
Frontend (React) ⟷ Backend (ASP.NET Core + ML.NET) ⟷ SQL Server
             \\                    
               JWT Auth           ML Model Trainer
```

* **Frontend**: React with Recharts, React Router, Axios
* **Backend**: ASP.NET Core Web API; controllers for auth, analytics, ML
* **Database**: SQL Server, EF Core (Code‑First)
* **ML**: ML.NET pipelines, LightGBM, RandomForest, SVM, SDCA

---

## ⚙️ Installation

1. **Clone** repository:

   ```bash
   git clone https://github.com/idriss111/StudentPerformanceDashboard.git
   cd StudentPerformanceDashboard
   ```
2. **Configure** `appsettings.json`:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=StudentDB;Trusted_Connection=True;"
   },
   "Jwt": { "Key": "YourSecretKey", "Issuer": "YourApp", "Audience": "YourAppUsers" }
   ```
3. **Apply migrations** & **seed**:

   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
4. **Run Backend**:

   ```bash
   dotnet run --project Server
   ```
5. **Run Frontend**:

   ```bash
   cd ClientApp
   npm install
   npm start
   ```

---

## 📖 Usage

1. **Register** via `/api/students/register`
2. **Login** via `/api/students/login` → obtain JWT
3. **View Dashboard**:

   * Analytics: `GET /api/students/ml/analytics`
   * Train model: `POST /api/students/ml/train-lightgbm` (or other endpoints)
   * Predict: `POST /api/prediction/lightgbm`

---

## 🔍 API Reference

### Auth

| Endpoint                      | Method | Description              |
| ----------------------------- | ------ | ------------------------ |
| `POST /api/students/register` | POST   | Register new student     |
| `POST /api/students/login`    | POST   | Authenticate and get JWT |

### Analytics & ML

| Endpoint                               | Method | Description                        |
| -------------------------------------- | ------ | ---------------------------------- |
| `GET /api/students/ml/analytics`       | GET    | Compute data statistics            |
| `POST /api/students/ml/train-lightgbm` | POST   | Train LightGBM model               |
| `POST /api/prediction/lightgbm`        | POST   | Predict target class with LightGBM |

---

## 📚 Data Schema

| Table    | Columns                                                          |
| -------- | ---------------------------------------------------------------- |
| Students | Id (int), FirstName, LastName, Email, PasswordHash, StudyProgram |
| ...      | ...                                                              |

---

## 🎨 Frontend Structure

* **Components**:

  * `Sidebar`, `Header`, `DashboardTabs`, `Charts`, `PredictionForm`
* **State**:

  * React hooks for userData, stats, trainingMetrics, etc.
* **Routing**:

  * `/login`, `/dashboard`, protected routes via JWT

---

## 📈 ML Details

* **Data**: 4.425 records, 26 features + `Target`
* **Best model**: LightGBM (∼95% accuracy)
* **Pipeline**:

  1. Load & analyze CSV
  2. Train/test split
  3. Fit LightGBM
  4. Expose metrics via API

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/X`)
3. Commit changes (`git commit -m "Add feature X"`)
4. Push (`git push origin feature/X`)
5. Open a PR

---

## 📝 License

MIT © FH Aachen
