using System.Security.Claims;
using System.Security.Cryptography;
using FileSharing.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace FileSharing.Service
{
    public class TokenService(UserManager<AppUser> userManager)
    {
        public async Task<string> CreateToken(AppUser user)
        {
            var rsaKey = RSA.Create();
            byte[] privateKeyBytes = await File.ReadAllBytesAsync("key");
            rsaKey.ImportRSAPrivateKey(privateKeyBytes, out _);

            var roles = await userManager.GetRolesAsync(user);
            var handler = new JsonWebTokenHandler();
            var key = new RsaSecurityKey(rsaKey);

            var token = handler.CreateToken(
                new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(
                        new Claim[]
                        {
                            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                            new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? string.Empty),
                        }
                    ),
                    Expires = DateTime.UtcNow.AddHours(2),
                    SigningCredentials = new SigningCredentials(
                        key,
                        SecurityAlgorithms.RsaSha256 // Use RSA algorithm
                    ),
                }
            );

            return token;
        }
    }
}
