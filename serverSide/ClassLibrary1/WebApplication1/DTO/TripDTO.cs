namespace WebApplication1.DTO
{
    public class TripDTO
    {
        public int TripId { get; set; }

        public string? TripTitle { get; set; }

        public string? Area { get; set; }

        public string? TripDescription { get; set; }

        public DateTime? TripDate { get; set; }

        public int? FavoriteSum { get; set; }

        public byte? IsTop3 { get; set; }

        public string? TripMainPic { get; set; }

        public byte? IsPublish { get; set; }

        public string? Season { get; set; }

        public string? Tips { get; set; }

        public string? Pic1 { get; set; }

        public string? Pic2 { get; set; }

        public DateTime? PublishDate { get; set; }

        public int? GroupId { get; set; }

        public string? UserName { get; set; }

        public VisitsInDTO[] PlacesInTrip { get; set; }

        public EatsInDTO[] RestInTrip { get; set; }

        public short[] propID { get; set; }

        public short[] TypeID { get; set; }

    }
}
