using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblPropsClick
{
    public short PropertyId { get; set; }

    public string UserName { get; set; } = null!;

    public int? Click { get; set; }

    public virtual TblProperty Property { get; set; } = null!;

    public virtual TblUser UserNameNavigation { get; set; } = null!;
}
