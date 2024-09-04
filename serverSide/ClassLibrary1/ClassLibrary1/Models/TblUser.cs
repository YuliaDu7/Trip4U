using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblUser
{
    public string UserName { get; set; } = null!;

    public string? Password { get; set; }

    public string? FirstName { get; set; }

    public string? InstagramUrl { get; set; }

    public DateTime? BirthDate { get; set; }

    public string? UserPic { get; set; }

    public string? Email { get; set; }

    public byte? IsInfluencer { get; set; }

    public string? Bio { get; set; }

    public virtual ICollection<TblAction> TblActions { get; set; } = new List<TblAction>();

    public virtual ICollection<TblFollow> TblFollows { get; set; } = new List<TblFollow>();

    public virtual ICollection<TblGroup> TblGroups { get; set; } = new List<TblGroup>();

    public virtual ICollection<TblInterested> TblInteresteds { get; set; } = new List<TblInterested>();

    public virtual ICollection<TblLike> TblLikes { get; set; } = new List<TblLike>();

    public virtual ICollection<TblPropsClick> TblPropsClicks { get; set; } = new List<TblPropsClick>();

    public virtual ICollection<TblSavedBy> TblSavedBies { get; set; } = new List<TblSavedBy>();

    public virtual ICollection<TblTagClick> TblTagClicks { get; set; } = new List<TblTagClick>();

    public virtual ICollection<TblTypeClick> TblTypeClicks { get; set; } = new List<TblTypeClick>();
}
