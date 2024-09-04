using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblRestaurant
{
    public short RestaurantId { get; set; }

    public string? RestName { get; set; }

    public string? RestDescription { get; set; }

    public string? RestUrl { get; set; }

    public string? RestMap { get; set; }

    public byte? RestRating { get; set; }

    public string? RestPic { get; set; }

    public byte? IsKosher { get; set; }

    public short? AvgCost { get; set; }

    public virtual ICollection<TblEatsIn> TblEatsIns { get; set; } = new List<TblEatsIn>();
}
