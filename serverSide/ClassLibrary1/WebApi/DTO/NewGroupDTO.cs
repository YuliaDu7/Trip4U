namespace WebApi.DTO
{
    public class NewGroupDTO
    {
        public List<string> userNames { get; set; }

        //public DateTime? GroupDate { get; set; }

        public string? GroupName { get; set; }

        //public DateTime? ChangeDate { get; set; }

        //public string? LastUserChange { get; set; }

        public string Manager { get; set; } = null!;
    }
}
