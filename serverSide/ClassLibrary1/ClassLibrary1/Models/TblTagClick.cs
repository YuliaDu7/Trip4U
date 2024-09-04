using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTagClick
{
    public short TagId { get; set; }

    public string UserName { get; set; } = null!;

    public int? Click { get; set; }

    public virtual TblTag Tag { get; set; } = null!;

    public virtual TblUser UserNameNavigation { get; set; } = null!;
}
