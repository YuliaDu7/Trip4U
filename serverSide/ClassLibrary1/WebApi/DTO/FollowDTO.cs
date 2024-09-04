namespace WebApi.DTO
{
    public class FollowDTO
    {
        public string UserName { get; set; }
        public string FollowingUserName { get; set; }

        public bool? isInfluencer { get; set; }
        public string? Bio { get; set; }

    }
}
