using Microsoft.EntityFrameworkCore;
using StudentPerformanceDashboard.Server.ML;


var builder = WebApplication.CreateBuilder(args);

// Add CORS (simplified without credentials)
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add DbContext (NO Identity)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ApplicationDBContextConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()));
builder.Services.AddSingleton<DataLoader>();
builder.Services.AddSingleton<ModelTrainer>();

// Remove ALL Identity-related services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware pipeline (NO Identity middleware)
app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("ReactFrontend");

// Remove these Identity-related middlewares
// app.UseAuthentication();
// app.UseAuthorization();  // Only add back if you implement custom auth

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();