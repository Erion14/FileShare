using System.ComponentModel.DataAnnotations;

namespace FileSharing.Models
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [StringLength(
            100,
            ErrorMessage = "The password must be at least {2} characters long.",
            MinimumLength = 6
        )]
        public string Password { get; set; }

    }
}
