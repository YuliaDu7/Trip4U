using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ClassLibrary1.Models;

public partial class Trip4UContext : DbContext
{
    public Trip4UContext()
    {
    }

    public Trip4UContext(DbContextOptions<Trip4UContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TblAction> TblActions { get; set; }

    public virtual DbSet<TblContain> TblContains { get; set; }

    public virtual DbSet<TblEatsIn> TblEatsIns { get; set; }

    public virtual DbSet<TblFollow> TblFollows { get; set; }

    public virtual DbSet<TblGroup> TblGroups { get; set; }

    public virtual DbSet<TblInterested> TblInteresteds { get; set; }

    public virtual DbSet<TblLike> TblLikes { get; set; }

    public virtual DbSet<TblPartOfGroup> TblPartOfGroups { get; set; }

    public virtual DbSet<TblPlace> TblPlaces { get; set; }

    public virtual DbSet<TblProperty> TblProperties { get; set; }

    public virtual DbSet<TblPropsClick> TblPropsClicks { get; set; }

    public virtual DbSet<TblRestaurant> TblRestaurants { get; set; }

    public virtual DbSet<TblSavedBy> TblSavedBies { get; set; }

    public virtual DbSet<TblTag> TblTags { get; set; }

    public virtual DbSet<TblTagClick> TblTagClicks { get; set; }

    public virtual DbSet<TblTrip> TblTrips { get; set; }

    public virtual DbSet<TblTripProperty> TblTripProperties { get; set; }

    public virtual DbSet<TblTripTag> TblTripTags { get; set; }

    public virtual DbSet<TblTripType> TblTripTypes { get; set; }

    public virtual DbSet<TblType> TblTypes { get; set; }

    public virtual DbSet<TblTypeClick> TblTypeClicks { get; set; }

    public virtual DbSet<TblUser> TblUsers { get; set; }

    public virtual DbSet<TblVisitsIn> TblVisitsIns { get; set; }

    public virtual DbSet<TblWarning> TblWarnings { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Server= DESKTOP-6MDHJKF;Database=Trip4U;Trusted_Connection=True;Encrypt=false");

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.json", false).Build();
        String connStr = config.GetConnectionString("DefaultConnectionString");
        optionsBuilder.UseSqlServer(connStr);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TblAction>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.TripId }).HasName("PK__tblActio__25DF12A78D491497");

            entity.ToTable("tblAction");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.Comment)
                .HasColumnType("ntext")
                .HasColumnName("comment");
            entity.Property(e => e.Rating).HasColumnName("rating");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblActions)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblAction__tripI__4BAC3F29");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblActions)
                .HasForeignKey(d => d.UserName)
                .HasConstraintName("FK__tblAction__userN__4CA06362");
        });

        modelBuilder.Entity<TblContain>(entity =>
        {
            entity.HasKey(e => new { e.PlaceId, e.WarningId }).HasName("PK__tblConta__F369BCB1D1047A1D");

            entity.ToTable("tblContains");

            entity.Property(e => e.PlaceId).HasColumnName("placeID");
            entity.Property(e => e.WarningId).HasColumnName("warningID");
            entity.Property(e => e.ReceiveDate)
                .HasColumnType("date")
                .HasColumnName("receiveDate");

            entity.HasOne(d => d.Place).WithMany(p => p.TblContains)
                .HasForeignKey(d => d.PlaceId)
                .HasConstraintName("FK__tblContai__place__4D94879B");

            entity.HasOne(d => d.Warning).WithMany(p => p.TblContains)
                .HasForeignKey(d => d.WarningId)
                .HasConstraintName("FK__tblContai__warni__4E88ABD4");
        });

        modelBuilder.Entity<TblEatsIn>(entity =>
        {
            entity.HasKey(e => new { e.RestaurantId, e.TripId }).HasName("PK__tblEatsI__4ADBE1AA50BA85E9");

            entity.ToTable("tblEatsIn");

            entity.Property(e => e.RestaurantId).HasColumnName("restaurantID");
            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.RestPlaceInTrip).HasColumnName("restPlaceInTrip");

            entity.HasOne(d => d.Restaurant).WithMany(p => p.TblEatsIns)
                .HasForeignKey(d => d.RestaurantId)
                .HasConstraintName("FK__tblEatsIn__resta__4F7CD00D");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblEatsIns)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblEatsIn__tripI__5070F446");
        });

        modelBuilder.Entity<TblFollow>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.FollowingUserName }).HasName("PK__tblFollo__5B3358D8935B42F2");

            entity.ToTable("tblFollow");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.FollowingUserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("followingUserName");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.FollowingUserNameNavigation).WithMany(p => p.TblFollows)
                .HasForeignKey(d => d.FollowingUserName)
                .HasConstraintName("FK__tblFollow__follo__5165187F");
        });

        modelBuilder.Entity<TblGroup>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PK__tblGroup__88C102ADE3B2F5DC");

            entity.ToTable("tblGroup");

            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.ChangeDate)
                .HasColumnType("date")
                .HasColumnName("changeDate");
            entity.Property(e => e.GroupDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("date")
                .HasColumnName("groupDate");
            entity.Property(e => e.GroupName)
                .HasMaxLength(20)
                .HasColumnName("groupName");
            entity.Property(e => e.LastUserChange)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("lastUserChange");
            entity.Property(e => e.Manager)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("manager");

            entity.HasOne(d => d.ManagerNavigation).WithMany(p => p.TblGroups)
                .HasForeignKey(d => d.Manager)
                .HasConstraintName("FK__tblGroup__manage__52593CB8");
        });

        modelBuilder.Entity<TblInterested>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.PropertyId }).HasName("PK__tblInter__AF1C4198249F2359");

            entity.ToTable("tblInterested");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.PropertyId).HasColumnName("propertyID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Property).WithMany(p => p.TblInteresteds)
                .HasForeignKey(d => d.PropertyId)
                .HasConstraintName("FK__tblIntere__prope__534D60F1");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblInteresteds)
                .HasForeignKey(d => d.UserName)
                .HasConstraintName("FK__tblIntere__userN__5441852A");
        });

        modelBuilder.Entity<TblLike>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.TypeId }).HasName("PK__tblLike__D9D8264C52DBC7F6");

            entity.ToTable("tblLike");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Type).WithMany(p => p.TblLikes)
                .HasForeignKey(d => d.TypeId)
                .HasConstraintName("FK__tblLike__typeID__5535A963");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblLikes)
                .HasForeignKey(d => d.UserName)
                .HasConstraintName("FK__tblLike__userNam__5629CD9C");
        });

        modelBuilder.Entity<TblPartOfGroup>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.GroupId }).HasName("PK__tblPartO__AE50E977B07F5D6C");

            entity.ToTable("tblPartOfGroup");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Group).WithMany(p => p.TblPartOfGroups)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK__tblPartOf__group__571DF1D5");
        });

        modelBuilder.Entity<TblPlace>(entity =>
        {
            entity.HasKey(e => e.PlaceId).HasName("PK__tblPlace__E1216A567A3E6C36");

            entity.ToTable("tblPlace");

            entity.Property(e => e.PlaceId).HasColumnName("placeID");
            entity.Property(e => e.ChildCost).HasColumnName("childCost");
            entity.Property(e => e.PlaceCost).HasColumnName("placeCost");
            entity.Property(e => e.PlaceDescription)
                .HasMaxLength(200)
                .HasColumnName("placeDescription");
            entity.Property(e => e.PlaceMap)
                .IsUnicode(false)
                .HasColumnName("placeMap");
            entity.Property(e => e.PlaceName)
                .HasMaxLength(40)
                .HasColumnName("placeName");
            entity.Property(e => e.PlacePic)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("placePic");
            entity.Property(e => e.RecommendedTime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("recommendedTime");
        });

        modelBuilder.Entity<TblProperty>(entity =>
        {
            entity.HasKey(e => e.PropertyId).HasName("PK__tblPrope__9C0B8C5DE3D212A5");

            entity.ToTable("tblProperty");

            entity.Property(e => e.PropertyId).HasColumnName("propertyID");
            entity.Property(e => e.PropDescription)
                .HasMaxLength(40)
                .HasColumnName("propDescription");
        });

        modelBuilder.Entity<TblPropsClick>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.PropertyId }).HasName("PK__tblProps__AF1C41984500BC61");

            entity.ToTable("tblPropsClick");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.PropertyId).HasColumnName("propertyID");
            entity.Property(e => e.Click).HasColumnName("click");

            entity.HasOne(d => d.Property).WithMany(p => p.TblPropsClicks)
                .HasForeignKey(d => d.PropertyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblPropsC__prope__6FE99F9F");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblPropsClicks)
                .HasForeignKey(d => d.UserName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblPropsC__userN__70DDC3D8");
        });

        modelBuilder.Entity<TblRestaurant>(entity =>
        {
            entity.HasKey(e => e.RestaurantId).HasName("PK__tblResta__09D80A50F2EEFFBD");

            entity.ToTable("tblRestaurant");

            entity.Property(e => e.RestaurantId).HasColumnName("restaurantID");
            entity.Property(e => e.AvgCost).HasColumnName("avgCost");
            entity.Property(e => e.IsKosher).HasColumnName("isKosher");
            entity.Property(e => e.RestDescription)
                .HasMaxLength(200)
                .HasColumnName("restDescription");
            entity.Property(e => e.RestMap)
                .IsUnicode(false)
                .HasColumnName("restMap");
            entity.Property(e => e.RestName)
                .HasMaxLength(40)
                .HasColumnName("restName");
            entity.Property(e => e.RestPic)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("restPic");
            entity.Property(e => e.RestRating).HasColumnName("restRating");
            entity.Property(e => e.RestUrl)
                .IsUnicode(false)
                .HasColumnName("restURL");
        });

        modelBuilder.Entity<TblSavedBy>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.TripId }).HasName("PK__tblSaved__25DF12A726396ED7");

            entity.ToTable("tblSavedBy");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblSavedBies)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblSavedB__tripI__5812160E");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblSavedBies)
                .HasForeignKey(d => d.UserName)
                .HasConstraintName("FK__tblSavedB__userN__59063A47");
        });

        modelBuilder.Entity<TblTag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__tblTag__50FC0177B4A510C6");

            entity.ToTable("tblTag");

            entity.Property(e => e.TagId).HasColumnName("tagID");
            entity.Property(e => e.TagName)
                .HasMaxLength(20)
                .HasColumnName("tagName");
        });

        modelBuilder.Entity<TblTagClick>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.TagId }).HasName("PK__tblTagCl__03D3394A1892612F");

            entity.ToTable("tblTagClick");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.TagId).HasColumnName("tagID");
            entity.Property(e => e.Click).HasColumnName("click");

            entity.HasOne(d => d.Tag).WithMany(p => p.TblTagClicks)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblTagCli__tagID__778AC167");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblTagClicks)
                .HasForeignKey(d => d.UserName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblTagCli__userN__787EE5A0");
        });

        modelBuilder.Entity<TblTrip>(entity =>
        {
            entity.HasKey(e => e.TripId).HasName("PK__tblTrip__303EBFA5BE0890F7");

            entity.ToTable("tblTrip");

            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.Area)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("area");
            entity.Property(e => e.FavoriteSum).HasColumnName("favoriteSum");
            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.IsPublish).HasColumnName("isPublish");
            entity.Property(e => e.IsTop3).HasColumnName("isTop3");
            entity.Property(e => e.Pic1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pic1");
            entity.Property(e => e.Pic2)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pic2");
            entity.Property(e => e.PublishDate)
                .HasColumnType("date")
                .HasColumnName("publishDate");
            entity.Property(e => e.Season)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("season");
            entity.Property(e => e.Tips)
                .HasColumnType("ntext")
                .HasColumnName("tips");
            entity.Property(e => e.TripDate)
                .HasColumnType("date")
                .HasColumnName("tripDate");
            entity.Property(e => e.TripDescription)
                .HasColumnType("ntext")
                .HasColumnName("tripDescription");
            entity.Property(e => e.TripMainPic)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("tripMainPic");
            entity.Property(e => e.TripTitle)
                .HasMaxLength(40)
                .HasColumnName("tripTitle");
            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
        });

        modelBuilder.Entity<TblTripProperty>(entity =>
        {
            entity.HasKey(e => new { e.TripId, e.PropertyId }).HasName("PK__tblTripP__F9FE07602AE66F81");

            entity.ToTable("tblTripProperty");

            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.PropertyId).HasColumnName("propertyID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Property).WithMany(p => p.TblTripProperties)
                .HasForeignKey(d => d.PropertyId)
                .HasConstraintName("FK__tblTripPr__prope__59FA5E80");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblTripProperties)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblTripPr__tripI__5AEE82B9");
        });

        modelBuilder.Entity<TblTripTag>(entity =>
        {
            entity.HasKey(e => new { e.TagId, e.TripId }).HasName("PK__tblTripT__13FFEA8D9E2CDD19");

            entity.ToTable("tblTripTag");

            entity.Property(e => e.TagId).HasColumnName("tagID");
            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Tag).WithMany(p => p.TblTripTags)
                .HasForeignKey(d => d.TagId)
                .HasConstraintName("FK__tblTripTa__tagID__5BE2A6F2");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblTripTags)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblTripTa__tripI__5CD6CB2B");
        });

        modelBuilder.Entity<TblTripType>(entity =>
        {
            entity.HasKey(e => new { e.TypeId, e.TripId }).HasName("PK__tblTripT__B34E1AE0B1A17C7E");

            entity.ToTable("tblTripType");

            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.Dummy).HasColumnName("dummy");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblTripTypes)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblTripTy__tripI__5DCAEF64");

            entity.HasOne(d => d.Type).WithMany(p => p.TblTripTypes)
                .HasForeignKey(d => d.TypeId)
                .HasConstraintName("FK__tblTripTy__typeI__5EBF139D");
        });

        modelBuilder.Entity<TblType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__tblType__F04DF11A4D05732B");

            entity.ToTable("tblType");

            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.TypeName)
                .HasMaxLength(20)
                .HasColumnName("typeName");
        });

        modelBuilder.Entity<TblTypeClick>(entity =>
        {
            entity.HasKey(e => new { e.UserName, e.TypeId }).HasName("PK__tblTypeC__D9D8264CE91DE1D8");

            entity.ToTable("tblTypeClick");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.Click).HasColumnName("click");

            entity.HasOne(d => d.Type).WithMany(p => p.TblTypeClicks)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblTypeCl__typeI__73BA3083");

            entity.HasOne(d => d.UserNameNavigation).WithMany(p => p.TblTypeClicks)
                .HasForeignKey(d => d.UserName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblTypeCl__userN__74AE54BC");
        });

        modelBuilder.Entity<TblUser>(entity =>
        {
            entity.HasKey(e => e.UserName).HasName("PK__tblUser__66DCF95D59D57A18");

            entity.ToTable("tblUser");

            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("userName");
            entity.Property(e => e.Bio)
                .HasColumnType("ntext")
                .HasColumnName("bio");
            entity.Property(e => e.BirthDate)
                .HasColumnType("date")
                .HasColumnName("birthDate");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(15)
                .HasColumnName("firstName");
            entity.Property(e => e.InstagramUrl)
                .IsUnicode(false)
                .HasColumnName("instagramURL");
            entity.Property(e => e.IsInfluencer).HasColumnName("isInfluencer");
            entity.Property(e => e.Password)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.UserPic)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userPic");
        });

        modelBuilder.Entity<TblVisitsIn>(entity =>
        {
            entity.HasKey(e => new { e.PlaceId, e.TripId }).HasName("PK__tblVisit__A22281ACDEC7CFAD");

            entity.ToTable("tblVisitsIn");

            entity.Property(e => e.PlaceId).HasColumnName("placeID");
            entity.Property(e => e.TripId).HasColumnName("tripID");
            entity.Property(e => e.PlacePlaceInTrip).HasColumnName("placePlaceInTrip");

            entity.HasOne(d => d.Place).WithMany(p => p.TblVisitsIns)
                .HasForeignKey(d => d.PlaceId)
                .HasConstraintName("FK__tblVisits__place__5FB337D6");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblVisitsIns)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("FK__tblVisits__tripI__60A75C0F");
        });

        modelBuilder.Entity<TblWarning>(entity =>
        {
            entity.HasKey(e => e.WarningId).HasName("PK__tblWarni__248D6E70C4E87044");

            entity.ToTable("tblWarning");

            entity.Property(e => e.WarningId).HasColumnName("warningID");
            entity.Property(e => e.WarnDescription)
                .HasMaxLength(70)
                .HasColumnName("warnDescription");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
