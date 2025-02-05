using System.Security.Cryptography;
using FileSharing.Data;
using FileSharing.Entities;
using FileSharing.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new RsaSecurityKey(GetRsaKey()),
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                    
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine($"Authentication failed: {context.Exception}");
                            return Task.CompletedTask;
                        },
                        OnMessageReceived = context =>
                        {
                            Console.WriteLine($"Token received: {context.Token}");
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization();

     

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
