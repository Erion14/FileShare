using FileSharing.Entities;
using FileSharing.Models;
using FileSharing.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FileSharing.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        TokenService tokenService
    ) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid model state", errors = ModelState });

            if (model.Email != null)
            {
                var existingUser = await userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "User already exists" });
                }
            }

            var user = new AppUser { UserName = model.Email, Email = model.Email };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "User creation failed", errors = result.Errors });
            }

            var roleExists = await roleManager.RoleExistsAsync("user");
            if (!roleExists)
            {
                return BadRequest(new { message = "Role user does not exist" });
            }

            await userManager.AddToRoleAsync(user, "user");

            return Ok(new { message = "User created successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid model state", errors = ModelState });

            if (model.Email != null)
            {
                var existingUser = await userManager.FindByEmailAsync(model.Email);
                if (existingUser == null)
                {
                    return BadRequest(new { message = "User does not exist" });
                }

                var sc = await signInManager.CheckPasswordSignInAsync(
                    existingUser,
                    model.Password,
                    false
                );
                if (!sc.Succeeded)
                {
                    return BadRequest(new { message = "Invalid password" });
                }
                var token = await tokenService.CreateToken(existingUser);
                return Ok(new { Token = token, Expires = DateTime.UtcNow.AddHours(2) });
            }

            return BadRequest(new { message = "Email was not provided" });
        }
    }
}
