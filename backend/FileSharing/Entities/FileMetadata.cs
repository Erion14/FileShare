using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileSharing.Entities
{
    public class FileMetadata
    {
        [Key]
        public Guid FileId { get; set; }
        public string? UserId { get; set; }
        public string FileName { get; set; }
        public string IPFSHash { get; set; }
        public DateTime CreateTime { get; set; }
        public long FileSize { get; set; }
        public string FileType { get; set; }
        public TimeSpan ExpirationDuration { get; set; } = TimeSpan.FromHours(24);

        [ForeignKey(nameof(UserId))]
        public virtual AppUser? User { get; set; }

    }
}
