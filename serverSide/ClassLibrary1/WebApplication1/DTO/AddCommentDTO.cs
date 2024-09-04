namespace WebApplication1.DTO
{
    public class AddCommentDTO
    {

        public int TripId { get; set; }

        public string UserName { get; set; } = null!;

        public string? Comment { get; set; } 
    }
}
