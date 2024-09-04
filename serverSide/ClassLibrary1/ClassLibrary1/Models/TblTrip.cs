using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTrip
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

    public virtual ICollection<TblAction> TblActions { get; set; } = new List<TblAction>();

    public virtual ICollection<TblEatsIn> TblEatsIns { get; set; } = new List<TblEatsIn>();

    public virtual ICollection<TblSavedBy> TblSavedBies { get; set; } = new List<TblSavedBy>();

    public virtual ICollection<TblTripProperty> TblTripProperties { get; set; } = new List<TblTripProperty>();

    public virtual ICollection<TblTripTag> TblTripTags { get; set; } = new List<TblTripTag>();

    public virtual ICollection<TblTripType> TblTripTypes { get; set; } = new List<TblTripType>();

    public virtual ICollection<TblVisitsIn> TblVisitsIns { get; set; } = new List<TblVisitsIn>();
}
