using FileSharing.Data;
using FileSharing.Entities;
using FileSharing.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Storage.Internal.Mapping;

namespace FileSharing.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/files")]
    public class FileController(
        IPFSService ipfs,
        AppDbContext context,
        UserManager<AppUser> userManager
    ) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "Unathorized access" });
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
                    CreateTime = DateTime.Now,
                }
            );

            await context.SaveChangesAsync();
            return Ok(new { CID = cid });
        }

        [HttpGet("{cid}")]
        public async Task<IActionResult> Download(string cid)
        {
            var user = await userManager.GetUserAsync(User);
            var file = await context.Files.FirstOrDefaultAsync(f =>
                f.IPFSHash == cid && f.UserId == user.Id
            );
            if (file == null)
            {
                return NotFound(new { message = "File not found" });
            }
            var stream = await ipfs.GetFileAsync(cid);
            return File(stream, "application/octet-stream", file.FileName);
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
