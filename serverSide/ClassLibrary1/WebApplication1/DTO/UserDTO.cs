namespace WebApplication1.DTO
{
    public class UserDTO
    {


        public string UserName { get; set; } = null!;

        public string? Password { get; set; }

        public string? FirstName { get; set; }

        public string? InstagramUrl { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? UserPic { get; set; }

        public string? Email { get; set; }

        public short[] propID { get; set; }

        public short[] TypeID { get; set; }

    }
}
