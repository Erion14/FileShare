using System.Security.Cryptography;
using FileSharing.Data;
using FileSharing.Entities;
using FileSharing.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FileSharing.Configuration
{
    public static class Configuration
    {
        public static void ConfigureServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            services.AddScoped<TokenService>();
            services.AddScoped<IPFSService>();
            services.AddHttpClient<IPFSService>();
            services.Configure<IPFSSettings>(configuration.GetSection("IPFS"));

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    npgsqlOptions =>
                    {
                        npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                        npgsqlOptions.EnableRetryOnFailure();
                        npgsqlOptions.CommandTimeout(180);
                    }
                )
            );

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "NextFrontend",
                    policy =>
                    {
                        policy
                            .WithOrigins("http://localhost:3000")
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    }
                );
            });

            services
                .AddIdentity<AppUser, IdentityRole>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequiredLength = 6;
                    options.Password.RequiredUniqueChars = 1;
                    options.User.RequireUniqueEmail = true;
                })
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services
                .AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new RsaSecurityKey(GetRsaKey()),
                        ValidateAudience = false,
                        ValidateIssuer = false,
                    };
                })
                .AddGoogle(options =>
                {
                    options.ClientId = configuration["Google:ClientId"]!;
                    options.ClientSecret = configuration["Google:ClientSecret"]!;
                    options.CallbackPath = "/signin-google";
                });

            RSA GetRsaKey()
            {
                if (!File.Exists("key"))
                {
                    var rsa = RSA.Create(2048);
                    File.WriteAllBytes("key", rsa.ExportRSAPrivateKey());
                    return rsa;
                }

                var keyBytes = File.ReadAllBytes("key");
                var rsaKey = RSA.Create();
                rsaKey.ImportRSAPrivateKey(keyBytes, out _);
                return rsaKey;
            }
        }
    }
}
