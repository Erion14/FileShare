using FileSharing.Data;
using FileSharing.Entities;
using FileSharing.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Storage.Internal.Mapping;
using Microsoft.Extensions.Logging;

namespace FileSharing.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/files")]
    
    public class FileController(
        IPFSService ipfs,
        AppDbContext context,
        UserManager<AppUser> userManager,
        ILogger<FileController> logger
    ) : ControllerBase
    {
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try 
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file was provided" });
                }
                
                var allowedTypes = new[] { ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx" };
                var fileExt = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedTypes.Contains(fileExt))
                {
                    return BadRequest(new { message = "File type not allowed" });
                }

                if (file.Length > 5 * 1024 * 1024) 
                {
                    return BadRequest(new { message = "File size exceeds limit" });
                }

                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(new { message = "Unauthorized access" });
                }

                using var stream = file.OpenReadStream();
                var cid = await ipfs.AddFileAsync(stream);

                await context.Files.AddAsync(
                    new FileMetadata
                    {
                        UserId = user.Id,
                        IPFSHash = cid,
                        FileName = file.FileName,
                        FileSize = file.Length,
                        CreateTime = DateTime.UtcNow,
                        FileType = Path.GetExtension(file.FileName).ToLowerInvariant(),
                    }
                );

                await context.SaveChangesAsync();
                return Ok(new { CID = cid });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing file upload");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("upload/{cid}")]
        public async Task<IActionResult> Download(string cid)
        {
            try
            {
                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(new { message = "Unauthorized access" });
                }

                var file = await context.Files.FirstOrDefaultAsync(f =>
                    f.IPFSHash == cid && f.UserId == user.Id
                );
                
                if (file == null)
                {
                    return NotFound(new { message = "File not found" });
                }

                logger.LogInformation($"Retrieving file {file.FileName} with CID {cid} from IPFS");
                var stream = await ipfs.GetFileAsync(cid);
                
                var contentType = GetContentType(file.FileType);
                
                return File(stream, contentType, file.FileName);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error downloading file with CID {cid}");
                return StatusCode(500, new { message = "Error downloading file" });
            }
        }

        private string GetContentType(string fileExtension)
        {
            return fileExtension.ToLower() switch
            {
                ".pdf" => "application/pdf",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream"
            };
        }

        [HttpDelete("{cid}")]
        public async Task<IActionResult> Delete(string cid)
        {
            var user = await userManager.GetUserAsync(User);
            var file = await context.Files.FirstOrDefaultAsync(f =>
                f.IPFSHash == cid && f.UserId == user.Id
            );

            if (file == null)
            {
                return NotFound(new { message = "File not found" });
            }

            await ipfs.UnpinFileAsync(cid);
            context.Files.Remove(file);
            await context.SaveChangesAsync();
            return Ok(new { message = "File deleted successfully" });
        }
    }
}
