USE [master]
GO
/****** Object:  Database [BanDongHo]    Script Date: 8/15/2023 1:17:05 PM ******/
CREATE DATABASE [BanDongHo]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'BanDongHo', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\BanDongHo.mdf' , SIZE = 4096KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'BanDongHo_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\BanDongHo_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [BanDongHo] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BanDongHo].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BanDongHo] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BanDongHo] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BanDongHo] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BanDongHo] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BanDongHo] SET ARITHABORT OFF 
GO
ALTER DATABASE [BanDongHo] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [BanDongHo] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BanDongHo] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BanDongHo] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BanDongHo] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BanDongHo] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BanDongHo] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BanDongHo] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BanDongHo] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BanDongHo] SET  DISABLE_BROKER 
GO
ALTER DATABASE [BanDongHo] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BanDongHo] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BanDongHo] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BanDongHo] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BanDongHo] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BanDongHo] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BanDongHo] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BanDongHo] SET RECOVERY FULL 
GO
ALTER DATABASE [BanDongHo] SET  MULTI_USER 
GO
ALTER DATABASE [BanDongHo] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BanDongHo] SET DB_CHAINING OFF 
GO
ALTER DATABASE [BanDongHo] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [BanDongHo] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [BanDongHo] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'BanDongHo', N'ON'
GO
USE [BanDongHo]
GO
/****** Object:  Table [dbo].[CTBAOHANH]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CTBAOHANH](
	[MaNVNhan] [nvarchar](10) NOT NULL,
	[SoPhieu] [nvarchar](10) NOT NULL,
	[NgayNhan] [date] NOT NULL,
	[TinhTrangTruoc] [nvarchar](200) NOT NULL,
	[TinhTrangSau] [nvarchar](200) NULL,
	[NgayTra] [date] NULL,
	[MaNVGiao] [nvarchar](10) NULL,
 CONSTRAINT [PK__CTBAOHAN__47B990D1CD32FD39] PRIMARY KEY CLUSTERED 
(
	[MaNVNhan] ASC,
	[SoPhieu] ASC,
	[NgayNhan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CTDDH]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CTDDH](
	[MaDDH] [nvarchar](10) NOT NULL,
	[MaDH] [nvarchar](10) NOT NULL,
	[SoLuong] [int] NOT NULL,
	[DonGia] [money] NOT NULL,
 CONSTRAINT [PK__CTDDH__3FFA906253C67E39] PRIMARY KEY CLUSTERED 
(
	[MaDDH] ASC,
	[MaDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CTKHUYENMAI]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CTKHUYENMAI](
	[MaDotKM] [int] NOT NULL,
	[MaDH] [nvarchar](10) NOT NULL,
	[PhanTramGiam] [float] NOT NULL,
 CONSTRAINT [PK__CTKHUYEN__C16475A948500A89] PRIMARY KEY CLUSTERED 
(
	[MaDotKM] ASC,
	[MaDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CTPHIEUDAT]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CTPHIEUDAT](
	[MaPD] [int] NOT NULL,
	[MaDH] [nvarchar](10) NOT NULL,
	[SoLuong] [int] NOT NULL,
	[DonGia] [money] NOT NULL,
	[SoLuongTra] [int] NULL,
	[MaPT] [nvarchar](10) NULL,
 CONSTRAINT [PK__CTPHIEUD__2557BF80609D0287] PRIMARY KEY CLUSTERED 
(
	[MaPD] ASC,
	[MaDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CTPHIEUNHAP]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CTPHIEUNHAP](
	[MaPN] [nvarchar](10) NOT NULL,
	[MaDH] [nvarchar](10) NOT NULL,
	[SoLuong] [int] NOT NULL,
	[DonGia] [money] NOT NULL,
 CONSTRAINT [PK__CTPHIEUN__2557BF96636C3A23] PRIMARY KEY CLUSTERED 
(
	[MaPN] ASC,
	[MaDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CUNGCAP]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CUNGCAP](
	[MaNCC] [nvarchar](50) NOT NULL,
	[MaDH] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__CUNGCAP__386A058D40086FBE] PRIMARY KEY CLUSTERED 
(
	[MaNCC] ASC,
	[MaDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DONDATHANG]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DONDATHANG](
	[MaDDH] [nvarchar](10) NOT NULL,
	[NgayDatHang] [date] NOT NULL,
	[MaNCC] [nvarchar](50) NOT NULL,
	[MaNV] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__DONDATHA__3D88C8047A29FA95] PRIMARY KEY CLUSTERED 
(
	[MaDDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DONGHO]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DONGHO](
	[MaDH] [nvarchar](10) NOT NULL,
	[TenDH] [nvarchar](50) NOT NULL,
	[SoLuongTon] [int] NOT NULL,
	[MoTa] [text] NULL,
	[TrangThai] [int] NOT NULL,
	[HinhAnh] [nvarchar](400) NOT NULL,
	[is_new] [bit] NOT NULL CONSTRAINT [DF_DONGHO_is_new]  DEFAULT ((1)),
	[MaLoai] [nvarchar](10) NOT NULL,
	[MaHang] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__DONGHO__27258661CBC8F0E2] PRIMARY KEY CLUSTERED 
(
	[MaDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DOTKHUYENMAI]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DOTKHUYENMAI](
	[MaDotKM] [int] IDENTITY(1,1) NOT NULL,
	[TenDotKM] [nvarchar](50) NOT NULL,
	[NgayBatDau] [date] NOT NULL,
	[NgayKetThuc] [date] NOT NULL,
	[MoTa] [nvarchar](200) NULL,
	[MaNV] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__DOTKHUYE__C3162DCF981662BA] PRIMARY KEY CLUSTERED 
(
	[MaDotKM] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[HANG]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HANG](
	[MaHang] [nvarchar](10) NOT NULL,
	[TenHang] [nvarchar](50) NOT NULL,
	[MoTa] [nvarchar](500) NULL,
 CONSTRAINT [PK__HANG__19C0DB1DC4E2BA91] PRIMARY KEY CLUSTERED 
(
	[MaHang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[HOADON]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HOADON](
	[MaHD] [nvarchar](20) NOT NULL,
	[NgayTaoHD] [date] NOT NULL,
	[MaSoThue] [nvarchar](50) NOT NULL,
	[HoTen] [nvarchar](100) NOT NULL,
	[MaPD] [int] NOT NULL,
	[MaNV] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__HOADON__2725A6E045B61C9A] PRIMARY KEY CLUSTERED 
(
	[MaHD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[KHACHHANG]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KHACHHANG](
	[MaKH] [int] IDENTITY(1,1) NOT NULL,
	[Ho] [nvarchar](50) NOT NULL,
	[Ten] [nvarchar](20) NOT NULL,
	[GioiTinh] [bit] NOT NULL,
	[NgaySinh] [date] NOT NULL,
	[DiaChi] [nvarchar](200) NOT NULL,
	[SDT] [nvarchar](15) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](200) NOT NULL,
	[MaQuyen] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__KHACHHAN__2725CF1E14E25F61] PRIMARY KEY CLUSTERED 
(
	[MaKH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[LOAI]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LOAI](
	[MaLoai] [nvarchar](10) NOT NULL,
	[TenLoai] [nvarchar](50) NOT NULL,
	[MoTa] [nvarchar](500) NULL,
 CONSTRAINT [PK__LOAI__730A5759C0503FE1] PRIMARY KEY CLUSTERED 
(
	[MaLoai] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[NHACC]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NHACC](
	[MaNCC] [nvarchar](50) NOT NULL,
	[TenNCC] [nvarchar](50) NOT NULL,
	[DiaChi] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[SDT] [nvarchar](15) NOT NULL,
 CONSTRAINT [PK__NHACC__3A185DEB5AAEF620] PRIMARY KEY CLUSTERED 
(
	[MaNCC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[NHANVIEN]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NHANVIEN](
	[MaNV] [nvarchar](10) NOT NULL,
	[Ho] [nvarchar](50) NOT NULL,
	[Ten] [nvarchar](20) NOT NULL,
	[GioiTinh] [bit] NOT NULL,
	[NgaySinh] [date] NOT NULL,
	[DiaChi] [nvarchar](200) NOT NULL,
	[SDT] [nvarchar](15) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](200) NOT NULL,
	[MaQuyen] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__NHANVIEN__2725D70A5721B643] PRIMARY KEY CLUSTERED 
(
	[MaNV] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PHIEUBAOHANH]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PHIEUBAOHANH](
	[SoPhieu] [nvarchar](10) NOT NULL,
	[NgayBatDau] [date] NOT NULL,
	[SoThang] [int] NOT NULL,
	[MaNV] [nvarchar](10) NOT NULL,
	[MaDH] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__PHIEUBAO__960AAEE2AF511ADA] PRIMARY KEY CLUSTERED 
(
	[SoPhieu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PHIEUDAT]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PHIEUDAT](
	[MaPD] [int] IDENTITY(1,1) NOT NULL,
	[NgayDat] [datetime] NOT NULL,
	[HoNN] [nvarchar](50) NOT NULL,
	[TenNN] [nvarchar](20) NOT NULL,
	[DiaChiNN] [nvarchar](200) NOT NULL,
	[SDT] [nvarchar](15) NOT NULL,
	[NgayGiao] [date] NULL,
	[TrangThai] [int] NOT NULL,
	[MaKH] [int] NOT NULL,
	[MaNVDuyet] [nvarchar](10) NULL,
	[MaNVGiao] [nvarchar](10) NULL,
	[MaGiaoDich] [nvarchar](50) NULL,
 CONSTRAINT [PK__PHIEUDAT__2725E7E653328DAA] PRIMARY KEY CLUSTERED 
(
	[MaPD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PHIEUNHAP]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PHIEUNHAP](
	[MaPN] [nvarchar](10) NOT NULL,
	[NgayTaoPhieu] [date] NOT NULL,
	[MaNV] [nvarchar](10) NOT NULL,
	[MaDDH] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK__PHIEUNHA__2725E7F032975D55] PRIMARY KEY CLUSTERED 
(
	[MaPN] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PHIEUTRA]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PHIEUTRA](
	[MaPT] [nvarchar](10) NOT NULL,
	[NgayTra] [date] NOT NULL,
	[MaNV] [nvarchar](10) NOT NULL,
	[MaHD] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK__PHIEUTRA__2725E7F6C2AFC132] PRIMARY KEY CLUSTERED 
(
	[MaPT] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[QUYEN]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUYEN](
	[MaQuyen] [nvarchar](10) NOT NULL,
	[TenQuyen] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK__QUYEN__1D4B7ED4B343A29B] PRIMARY KEY CLUSTERED 
(
	[MaQuyen] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[THAYDOIGIA]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[THAYDOIGIA](
	[MaDH] [nvarchar](10) NOT NULL,
	[MaNV] [nvarchar](10) NOT NULL,
	[TGThayDoi] [datetime] NOT NULL,
	[Gia] [money] NOT NULL,
 CONSTRAINT [PK__THAYDOIG__9557DB1148E23B61] PRIMARY KEY CLUSTERED 
(
	[MaDH] ASC,
	[MaNV] ASC,
	[TGThayDoi] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  View [dbo].[CurrentWatchPrice]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[CurrentWatchPrice] AS
SELECT MaDH, TGThayDoi, Gia
FROM (
  SELECT T.MaDH, T.TGThayDoi, T.Gia,
    ROW_NUMBER() OVER (PARTITION BY T.MaDH ORDER BY T.TGThayDoi DESC) AS RowNum
  FROM THAYDOIGIA T
  WHERE T.TGThayDoi <= GETDATE()
) AS Subquery
WHERE RowNum = 1;

GO
/****** Object:  View [dbo].[GetWatchesWithHighestDiscount]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[GetWatchesWithHighestDiscount] AS
SELECT
    DONGHO.MaDH,
    DONGHO.TenDH,
    GiaSauKhuyenMai = CWP.Gia - (CWP.Gia * CTKHUYENMAI.PhanTramGiam / 100),
    CWP.Gia AS GiaGoc,
    DONGHO.HinhAnh,
    DONGHO.is_new,
    CTKHUYENMAI.PhanTramGiam
FROM (select MaDotKM from DOTKHUYENMAI where  GETDATE() BETWEEN DOTKHUYENMAI.NgayBatDau AND DOTKHUYENMAI.NgayKetThuc) as DKM
INNER JOIN
    CTKHUYENMAI ON DKM.MaDotKM = CTKHUYENMAI.MaDotKM
INNER JOIN
    Dongho ON DONGHO.MaDH = CTKHUYENMAI.MaDH and DONGHO.TrangThai = 1
INNER JOIN
    CurrentWatchPrice CWP ON DONGHO.MaDH = CWP.MaDH


GO
/****** Object:  View [dbo].[GetInfoWatches]    Script Date: 8/15/2023 1:17:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[GetInfoWatches] as
SELECT
	  D.MaDH, 
      D.TenDH,
      D.MoTa as MoTaDH,
      D.HinhAnh,
      CASE 
		WHEN GWHD.GiaSauKhuyenMai IS NULL THEN ISNULL(CWP.Gia, 0)
		ELSE GWHD.GiaSauKhuyenMai
	  END AS GiaSauKhuyenMai,
      ISNULL(CWP.Gia, 0) as GiaGoc,
      D.SoLuongTon,
      D.is_new,
	  D.TrangThai,
	  D.MaHang,
	  D.MaLoai,
	  GWHD.PhanTramGiam
FROM DONGHO D
    LEFT JOIN [dbo].[CurrentWatchPrice] CWP ON D.MaDH = CWP.MaDH
    LEFT JOIN [dbo].[GetWatchesWithHighestDiscount] GWHD ON D.MaDH = GWHD.MaDH


GO
INSERT [dbo].[CTKHUYENMAI] ([MaDotKM], [MaDH], [PhanTramGiam]) VALUES (1, N'CS123', 20)
INSERT [dbo].[CTKHUYENMAI] ([MaDotKM], [MaDH], [PhanTramGiam]) VALUES (1, N'DH001', 20)
INSERT [dbo].[CTKHUYENMAI] ([MaDotKM], [MaDH], [PhanTramGiam]) VALUES (1, N'DH002', 25)
INSERT [dbo].[CTKHUYENMAI] ([MaDotKM], [MaDH], [PhanTramGiam]) VALUES (3, N'CS123', 12)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (1, N'DH002', 1, 200000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (2, N'DH003', 2, 300000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (3, N'DH005', 1, 13000000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (12, N'DH003', 1, 700000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (12, N'DH005', 1, 13000000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (13, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (14, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (14, N'DH005', 1, 13000000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (23, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (25, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (26, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (27, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (28, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[CTPHIEUDAT] ([MaPD], [MaDH], [SoLuong], [DonGia], [SoLuongTra], [MaPT]) VALUES (29, N'DH002', 1, 600000.0000, NULL, NULL)
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'CS123', N'Casio Black', 10, N'', 0, N'1691756991291-rolex3.png', 1, N'DHN', N'tes1')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH001', N'Rolex Daytona Rainbow Black', 5, N'A luxury watches that exquisiting timepieces that effortlessly combine style, sophistication, and precision. These meticulously crafted accessories not only serve the purpose of telling time but also reflect the wearer''s refined taste and appreciation for the finer things in life.
', 1, N'Rolex-Daytona-rainbowblack.png', 1, N'DHN', N'RL')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH002', N'Rolex Yacht-Master 42 ', 4, N'The Oyster Perpetual Yacht-Master 42 in 18 ct yellow gold with a black dial and an Oysterflex bracelet', 1, N'Rolex-YachtMaster42.png', 1, N'DHN', N'RL')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH003', N'Rolex Cosmograph Daytona', 1, N'A luxury watches that exquisiting timepieces that effortlessly combine style, sophistication, and precision. These meticulously crafted accessories not only serve the purpose of telling time but also reflect the wearer''s refined taste and appreciation for the finer things in life.
', 1, N'Rolex-DaytonaCosmograph.png', 1, N'DHN', N'RL')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH004', N'Hublot Big Bang MP', 8, N' An extraordinary timepiece blending cutting-edge technology with avant-garde aesthetics, exuding power, sophistication, and unrivaled performance', 1, N'Hublot-Big-Bang-MP-09-Tourbillon-Bi-Axis.png', 1, N'DHN', N'HL')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH005', N'Hublot Big Bang Sang Bleu II', 0, N'A mesmerizing fusion of art and precision, showcasing a bold, geometric design with intricate blue accents', 1, N'Hublot-Big-Bang-Sang-Bleu-II-Titanium-White-Pavé-45-mm-soldier-shot.png', 1, N'DHN', N'HL')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH006', N'6102R CELESTIAL, MOON AGE.', 5, N'Highlighting Patek Philippe’s great tradition of astronomical watches, the Celestial devotes its dial to a rotating chart of the heavenly bodies. At any time, its owner may admire the exact configuration of the nocturnal sky in the northern hemisphere, with the apparent movement of the stars and the phases and orbit of the moon. Two skeletonized hands point to the hours and minutes of mean solar time. An Ellipse, deposited on the underside of the sapphire glass, frames the portion of the sky vis', 1, N'Patek-6102R.png', 1, N'DHN', N'PP')
INSERT [dbo].[DONGHO] ([MaDH], [TenDH], [SoLuongTon], [MoTa], [TrangThai], [HinhAnh], [is_new], [MaLoai], [MaHang]) VALUES (N'DH007', N'527/1R CHRONOGRAPH, PERPETUAL CALENDAR.', 8, N'A luxury watches that exquisiting timepieces that effortlessly combine style, sophistication, and precision. These meticulously crafted accessories not only serve the purpose of telling time but also reflect the wearer''s refined taste and appreciation for the finer things in life.
', 1, N'Patek-527-1R.png', 1, N'DHN', N'PP')
SET IDENTITY_INSERT [dbo].[DOTKHUYENMAI] ON 

INSERT [dbo].[DOTKHUYENMAI] ([MaDotKM], [TenDotKM], [NgayBatDau], [NgayKetThuc], [MoTa], [MaNV]) VALUES (1, N'Sale hè', CAST(N'2023-06-20' AS Date), CAST(N'2023-08-20' AS Date), N'Sale sập sàn', N'NV001')
INSERT [dbo].[DOTKHUYENMAI] ([MaDotKM], [TenDotKM], [NgayBatDau], [NgayKetThuc], [MoTa], [MaNV]) VALUES (2, N'Tựu trường', CAST(N'2023-08-30' AS Date), CAST(N'2023-09-30' AS Date), NULL, N'NV001')
INSERT [dbo].[DOTKHUYENMAI] ([MaDotKM], [TenDotKM], [NgayBatDau], [NgayKetThuc], [MoTa], [MaNV]) VALUES (3, N'test', CAST(N'2023-10-02' AS Date), CAST(N'2023-11-13' AS Date), N'test', N'NV001')
SET IDENTITY_INSERT [dbo].[DOTKHUYENMAI] OFF
INSERT [dbo].[HANG] ([MaHang], [TenHang], [MoTa]) VALUES (N'HL', N'Hublot', N'A visionary brand pushing the boundaries of watchmaking, fusing innovation, exquisite materials, and striking designs to create truly exceptional timepieces that redefine luxury')
INSERT [dbo].[HANG] ([MaHang], [TenHang], [MoTa]) VALUES (N'PP', N'Patek Philippe', N'An epitome of horological excellence, blending tradition and innovation to craft exquisite timepieces sought after by discerning collectors for their timeless elegance and impeccable precision')
INSERT [dbo].[HANG] ([MaHang], [TenHang], [MoTa]) VALUES (N'RL', N'Rolex', N'A symbol of timeless elegance and exceptional craftsmanship, offering unparalleled precision and reliability in every meticulously crafted timepiece')
INSERT [dbo].[HANG] ([MaHang], [TenHang], [MoTa]) VALUES (N'tes1', N'Casio', N'testqwqweqweqwe')
INSERT [dbo].[HOADON] ([MaHD], [NgayTaoHD], [MaSoThue], [HoTen], [MaPD], [MaNV]) VALUES (N'123', CAST(N'2023-08-04' AS Date), N'123', N'123', 14, N'NV001')
INSERT [dbo].[HOADON] ([MaHD], [NgayTaoHD], [MaSoThue], [HoTen], [MaPD], [MaNV]) VALUES (N'1234', CAST(N'2023-08-06' AS Date), N'072345', N'Đoàn Long Bảo', 23, N'NV001')
SET IDENTITY_INSERT [dbo].[KHACHHANG] ON 

INSERT [dbo].[KHACHHANG] ([MaKH], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (1, N'Doan', N'Bao', 1, CAST(N'2001-11-13' AS Date), N'HCM', N'0832131101', N'longbao@gmail.com', N'$2b$10$NbEsBAOIlTDd8h60rr8z1eh4GJCsxzzuUyxG6pve5NOQfgT3jxEcG', N'KH')
INSERT [dbo].[KHACHHANG] ([MaKH], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (2, N'Dang', N'Sang', 1, CAST(N'2001-08-23' AS Date), N'HCm', N'0832131102', N'dangsang@gmail.com', N'123456789', N'KH')
INSERT [dbo].[KHACHHANG] ([MaKH], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (3, N'Đoàn', N'Long Bảo', 1, CAST(N'2001-11-13' AS Date), N'CMT8', N'0832131103', N'longbao13112001@gmail.com', N'$2b$10$BJmbDYW00r28BWnEfnrg6uqz4hxDshNimx2nP3fvzHIwvc0PUgAc6', N'KH')
SET IDENTITY_INSERT [dbo].[KHACHHANG] OFF
INSERT [dbo].[LOAI] ([MaLoai], [TenLoai], [MoTa]) VALUES (N'DHN', N'Men''s watches', NULL)
INSERT [dbo].[LOAI] ([MaLoai], [TenLoai], [MoTa]) VALUES (N'DHNU', N'Women''s watches', N'')
INSERT [dbo].[NHACC] ([MaNCC], [TenNCC], [DiaChi], [Email], [SDT]) VALUES (N'NCC1', N'Đông Sơn', N'52 Phạm Ngũ Lão', N'dongson@gmail.com', N'0832131106')
INSERT [dbo].[NHANVIEN] ([MaNV], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (N'NV001', N'Đoàn', N'Long Bảo', 1, CAST(N'2001-11-13' AS Date), N'206 Đường 3/2', N'0832131101', N'longbao@gmail.com', N'$2b$10$Jt2HP0dknudhC5vUcRs1Xe/eQPkCa.zxqk9FGMSh1rbE661Xhev3i', N'NV')
INSERT [dbo].[NHANVIEN] ([MaNV], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (N'NV002', N'Đặng', N'Thanh Sang', 1, CAST(N'2001-08-23' AS Date), N'Cách mạng tháng 8', N'0845678910', N'thanhsang@gmail.com', N'$2b$10$BM9RPv5qahSUUffzOV8VvOZra1.Zi8WhPQywpVv71N4BxNCWc094W', N'GH')
INSERT [dbo].[NHANVIEN] ([MaNV], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (N'NV003', N'Nguyễn', N'Văn Tùng', 1, CAST(N'2001-08-23' AS Date), N'49 Phạm Văn Hai', N'0845678911', N'vantung@gmail.com', N'$2b$10$BM9RPv5qahSUUffzOV8VvOZra1.Zi8WhPQywpVv71N4BxNCWc094W', N'GH')
INSERT [dbo].[NHANVIEN] ([MaNV], [Ho], [Ten], [GioiTinh], [NgaySinh], [DiaChi], [SDT], [Email], [Password], [MaQuyen]) VALUES (N'NV004', N'test', N'test', 1, CAST(N'2001-12-13' AS Date), N'Hóc Môn', N'1234567891', N'abc@gmail.com', N'$2b$10$Gqa.x7Lwn8dA3/pc5ivIzef600ZquN.MGVCIlUt3EHTPN.vMcK09y', N'GH')
SET IDENTITY_INSERT [dbo].[PHIEUDAT] ON 

INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (1, CAST(N'2023-06-20 00:00:00.000' AS DateTime), N'Doan', N'Bao', N'686/17/6', N'0832131101', NULL, 0, 1, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (2, CAST(N'2023-01-12 00:00:00.000' AS DateTime), N'Thanh', N'SAng', N'HCM', N'0832131103', NULL, 0, 2, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (3, CAST(N'2023-07-22 14:08:46.150' AS DateTime), N'Đoàn', N'Bảo', N'CMT8', N'0832131103', NULL, 4, 3, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (12, CAST(N'2023-07-22 14:56:07.370' AS DateTime), N'Đoàn', N'Long Bảo', N'CMT8', N'0832131103', NULL, 0, 3, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (13, CAST(N'2023-07-24 21:24:54.977' AS DateTime), N'Trần', N'Văn Tuấn', N'34/2 Hoàng Sa', N'0832131103', NULL, 2, 3, N'NV001', N'NV002', N'14073966')
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (14, CAST(N'2023-07-30 19:51:40.813' AS DateTime), N'Đặng', N'Long Khánh', N'72 Trường Chinh Hồ Chí Minh', N'0832131103', CAST(N'2023-08-15' AS Date), 3, 3, N'NV001', N'NV002', N'14081043')
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (23, CAST(N'2023-07-31 21:18:15.630' AS DateTime), N'Đoàn', N'Long Bảo', N'686 Cách Mạng tháng 8 phường 5 Tân Bình', N'0832131103', NULL, 2, 3, N'NV001', N'NV003', N'14081088')
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (25, CAST(N'2023-08-01 21:18:15.630' AS DateTime), N'Lê', N'Long Sang', N'46 Pasteur, Quận 3', N'0832131103', NULL, 4, 3, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (26, CAST(N'2023-08-02 21:18:15.630' AS DateTime), N'Đỗ', N'Đăng Khoa', N'14 Võ Thị Sáu ', N'0832131103', NULL, 3, 3, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (27, CAST(N'2023-08-03 21:18:15.630' AS DateTime), N'Lê', N'An Khánh', N'36 Trần Hưng Đạo', N'0985789186', NULL, 2, 3, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (28, CAST(N'2023-08-04 21:18:15.630' AS DateTime), N'Đặng', N'ThanhSang', N'206 Đường 3/2 TP HCM', N'0823654345', NULL, 0, 3, NULL, NULL, NULL)
INSERT [dbo].[PHIEUDAT] ([MaPD], [NgayDat], [HoNN], [TenNN], [DiaChiNN], [SDT], [NgayGiao], [TrangThai], [MaKH], [MaNVDuyet], [MaNVGiao], [MaGiaoDich]) VALUES (29, CAST(N'2023-07-01 21:18:15.630' AS DateTime), N'Đoàn', N'Long Bảo', N'686 Cách Mạng tháng 8 phường 5 Tân Bình', N'0832131103', NULL, 1, 3, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[PHIEUDAT] OFF
INSERT [dbo].[QUYEN] ([MaQuyen], [TenQuyen]) VALUES (N'GH', N'Giao hàng')
INSERT [dbo].[QUYEN] ([MaQuyen], [TenQuyen]) VALUES (N'KH', N'Khách hàng')
INSERT [dbo].[QUYEN] ([MaQuyen], [TenQuyen]) VALUES (N'NV', N'Nhân viên')
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH001', N'NV001', CAST(N'2023-06-15 09:09:09.000' AS DateTime), 10000000.0000)
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH002', N'NV001', CAST(N'2023-04-18 00:00:00.000' AS DateTime), 4000000.0000)
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH002', N'NV001', CAST(N'2023-05-18 00:00:00.000' AS DateTime), 500000.0000)
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH002', N'NV001', CAST(N'2023-06-18 00:00:00.000' AS DateTime), 6000000.0000)
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH003', N'NV001', CAST(N'2023-07-16 00:00:00.000' AS DateTime), 700000.0000)
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH004', N'NV001', CAST(N'2023-05-05 00:00:00.000' AS DateTime), 10000000.0000)
INSERT [dbo].[THAYDOIGIA] ([MaDH], [MaNV], [TGThayDoi], [Gia]) VALUES (N'DH005', N'NV001', CAST(N'2023-05-05 00:00:00.000' AS DateTime), 20000000.0000)
SET ANSI_PADDING ON

GO
/****** Object:  Index [UK_TenHang]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[HANG] ADD  CONSTRAINT [UK_TenHang] UNIQUE NONCLUSTERED 
(
	[TenHang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [UK_MAPHIEUDAT]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[HOADON] ADD  CONSTRAINT [UK_MAPHIEUDAT] UNIQUE NONCLUSTERED 
(
	[MaPD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UC_Email]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[KHACHHANG] ADD  CONSTRAINT [UC_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UC_SDT]    Script Date: 8/15/2023 1:17:06 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UC_SDT] ON [dbo].[KHACHHANG]
(
	[SDT] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UK_TenLoai]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[LOAI] ADD  CONSTRAINT [UK_TenLoai] UNIQUE NONCLUSTERED 
(
	[TenLoai] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_NHACC]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[NHACC] ADD  CONSTRAINT [IX_NHACC] UNIQUE NONCLUSTERED 
(
	[TenNCC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_NHACC_1]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[NHACC] ADD  CONSTRAINT [IX_NHACC_1] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UNIQUE_Email]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[NHANVIEN] ADD  CONSTRAINT [UNIQUE_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_PHIEUNHAP]    Script Date: 8/15/2023 1:17:06 PM ******/
ALTER TABLE [dbo].[PHIEUNHAP] ADD  CONSTRAINT [IX_PHIEUNHAP] UNIQUE NONCLUSTERED 
(
	[MaDDH] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UK_TENQUYEN]    Script Date: 8/15/2023 1:17:06 PM ******/
CREATE NONCLUSTERED INDEX [UK_TENQUYEN] ON [dbo].[QUYEN]
(
	[TenQuyen] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CTBAOHANH]  WITH CHECK ADD  CONSTRAINT [FK_CTBAOHANH_NHANVIEN1] FOREIGN KEY([MaNVNhan])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
GO
ALTER TABLE [dbo].[CTBAOHANH] CHECK CONSTRAINT [FK_CTBAOHANH_NHANVIEN1]
GO
ALTER TABLE [dbo].[CTBAOHANH]  WITH CHECK ADD  CONSTRAINT [FK_CTBAOHANH_NHANVIEN2] FOREIGN KEY([MaNVGiao])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
GO
ALTER TABLE [dbo].[CTBAOHANH] CHECK CONSTRAINT [FK_CTBAOHANH_NHANVIEN2]
GO
ALTER TABLE [dbo].[CTBAOHANH]  WITH CHECK ADD  CONSTRAINT [FK_CTBAOHANH_PHIEUBAOHANH] FOREIGN KEY([SoPhieu])
REFERENCES [dbo].[PHIEUBAOHANH] ([SoPhieu])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTBAOHANH] CHECK CONSTRAINT [FK_CTBAOHANH_PHIEUBAOHANH]
GO
ALTER TABLE [dbo].[CTDDH]  WITH CHECK ADD  CONSTRAINT [FK_CTDDH_DONDATHANG] FOREIGN KEY([MaDDH])
REFERENCES [dbo].[DONDATHANG] ([MaDDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTDDH] CHECK CONSTRAINT [FK_CTDDH_DONDATHANG]
GO
ALTER TABLE [dbo].[CTDDH]  WITH CHECK ADD  CONSTRAINT [FK_CTDDH_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTDDH] CHECK CONSTRAINT [FK_CTDDH_DONGHO]
GO
ALTER TABLE [dbo].[CTKHUYENMAI]  WITH CHECK ADD  CONSTRAINT [FK_CTKHUYENMAI_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTKHUYENMAI] CHECK CONSTRAINT [FK_CTKHUYENMAI_DONGHO]
GO
ALTER TABLE [dbo].[CTKHUYENMAI]  WITH CHECK ADD  CONSTRAINT [FK_CTKHUYENMAI_DOTKHUYENMAI] FOREIGN KEY([MaDotKM])
REFERENCES [dbo].[DOTKHUYENMAI] ([MaDotKM])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTKHUYENMAI] CHECK CONSTRAINT [FK_CTKHUYENMAI_DOTKHUYENMAI]
GO
ALTER TABLE [dbo].[CTPHIEUDAT]  WITH CHECK ADD  CONSTRAINT [FK_CTPHIEUDAT_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTPHIEUDAT] CHECK CONSTRAINT [FK_CTPHIEUDAT_DONGHO]
GO
ALTER TABLE [dbo].[CTPHIEUDAT]  WITH CHECK ADD  CONSTRAINT [FK_CTPHIEUDAT_PHIEUDAT] FOREIGN KEY([MaPD])
REFERENCES [dbo].[PHIEUDAT] ([MaPD])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTPHIEUDAT] CHECK CONSTRAINT [FK_CTPHIEUDAT_PHIEUDAT]
GO
ALTER TABLE [dbo].[CTPHIEUDAT]  WITH CHECK ADD  CONSTRAINT [FK_CTPHIEUDAT_PHIEUTRA] FOREIGN KEY([MaPT])
REFERENCES [dbo].[PHIEUTRA] ([MaPT])
GO
ALTER TABLE [dbo].[CTPHIEUDAT] CHECK CONSTRAINT [FK_CTPHIEUDAT_PHIEUTRA]
GO
ALTER TABLE [dbo].[CTPHIEUNHAP]  WITH CHECK ADD  CONSTRAINT [FK_CTPHIEUNHAP_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTPHIEUNHAP] CHECK CONSTRAINT [FK_CTPHIEUNHAP_DONGHO]
GO
ALTER TABLE [dbo].[CTPHIEUNHAP]  WITH CHECK ADD  CONSTRAINT [FK_CTPHIEUNHAP_PHIEUNHAP] FOREIGN KEY([MaPN])
REFERENCES [dbo].[PHIEUNHAP] ([MaPN])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CTPHIEUNHAP] CHECK CONSTRAINT [FK_CTPHIEUNHAP_PHIEUNHAP]
GO
ALTER TABLE [dbo].[CUNGCAP]  WITH CHECK ADD  CONSTRAINT [FK_CUNGCAP_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CUNGCAP] CHECK CONSTRAINT [FK_CUNGCAP_DONGHO]
GO
ALTER TABLE [dbo].[CUNGCAP]  WITH CHECK ADD  CONSTRAINT [FK_CUNGCAP_NHACC] FOREIGN KEY([MaNCC])
REFERENCES [dbo].[NHACC] ([MaNCC])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CUNGCAP] CHECK CONSTRAINT [FK_CUNGCAP_NHACC]
GO
ALTER TABLE [dbo].[DONDATHANG]  WITH CHECK ADD  CONSTRAINT [FK_DONDATHANG_NHACC] FOREIGN KEY([MaNCC])
REFERENCES [dbo].[NHACC] ([MaNCC])
GO
ALTER TABLE [dbo].[DONDATHANG] CHECK CONSTRAINT [FK_DONDATHANG_NHACC]
GO
ALTER TABLE [dbo].[DONDATHANG]  WITH CHECK ADD  CONSTRAINT [FK_DONDATHANG_NHANVIEN] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[DONDATHANG] CHECK CONSTRAINT [FK_DONDATHANG_NHANVIEN]
GO
ALTER TABLE [dbo].[DONDATHANG]  WITH NOCHECK ADD  CONSTRAINT [FK_DONDATHANG_PHIEUNHAP] FOREIGN KEY([MaDDH])
REFERENCES [dbo].[PHIEUNHAP] ([MaDDH])
GO
ALTER TABLE [dbo].[DONDATHANG] NOCHECK CONSTRAINT [FK_DONDATHANG_PHIEUNHAP]
GO
ALTER TABLE [dbo].[DONGHO]  WITH CHECK ADD  CONSTRAINT [FK_DONGHO_HANG] FOREIGN KEY([MaHang])
REFERENCES [dbo].[HANG] ([MaHang])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[DONGHO] CHECK CONSTRAINT [FK_DONGHO_HANG]
GO
ALTER TABLE [dbo].[DONGHO]  WITH CHECK ADD  CONSTRAINT [FK_DONGHO_LOAI] FOREIGN KEY([MaLoai])
REFERENCES [dbo].[LOAI] ([MaLoai])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[DONGHO] CHECK CONSTRAINT [FK_DONGHO_LOAI]
GO
ALTER TABLE [dbo].[DOTKHUYENMAI]  WITH CHECK ADD  CONSTRAINT [FK_DOTKHUYENMAI_NHANVIEN] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[DOTKHUYENMAI] CHECK CONSTRAINT [FK_DOTKHUYENMAI_NHANVIEN]
GO
ALTER TABLE [dbo].[HOADON]  WITH CHECK ADD  CONSTRAINT [FK_HOADON_NHANVIEN] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
GO
ALTER TABLE [dbo].[HOADON] CHECK CONSTRAINT [FK_HOADON_NHANVIEN]
GO
ALTER TABLE [dbo].[KHACHHANG]  WITH CHECK ADD  CONSTRAINT [FK_KHACHHANG_QUYEN] FOREIGN KEY([MaQuyen])
REFERENCES [dbo].[QUYEN] ([MaQuyen])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[KHACHHANG] CHECK CONSTRAINT [FK_KHACHHANG_QUYEN]
GO
ALTER TABLE [dbo].[NHANVIEN]  WITH CHECK ADD  CONSTRAINT [FK_NHANVIEN_QUYEN] FOREIGN KEY([MaQuyen])
REFERENCES [dbo].[QUYEN] ([MaQuyen])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[NHANVIEN] CHECK CONSTRAINT [FK_NHANVIEN_QUYEN]
GO
ALTER TABLE [dbo].[PHIEUBAOHANH]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUBAOHANH_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[PHIEUBAOHANH] CHECK CONSTRAINT [FK_PHIEUBAOHANH_DONGHO]
GO
ALTER TABLE [dbo].[PHIEUBAOHANH]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUBAOHANH_NHANVIEN1] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[PHIEUBAOHANH] CHECK CONSTRAINT [FK_PHIEUBAOHANH_NHANVIEN1]
GO
ALTER TABLE [dbo].[PHIEUDAT]  WITH NOCHECK ADD  CONSTRAINT [FK_PHIEUDAT_HOADON] FOREIGN KEY([MaPD])
REFERENCES [dbo].[HOADON] ([MaPD])
NOT FOR REPLICATION 
GO
ALTER TABLE [dbo].[PHIEUDAT] NOCHECK CONSTRAINT [FK_PHIEUDAT_HOADON]
GO
ALTER TABLE [dbo].[PHIEUDAT]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUDAT_KHACHHANG] FOREIGN KEY([MaKH])
REFERENCES [dbo].[KHACHHANG] ([MaKH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[PHIEUDAT] CHECK CONSTRAINT [FK_PHIEUDAT_KHACHHANG]
GO
ALTER TABLE [dbo].[PHIEUDAT]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUDAT_NHANVIEN1] FOREIGN KEY([MaNVDuyet])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
GO
ALTER TABLE [dbo].[PHIEUDAT] CHECK CONSTRAINT [FK_PHIEUDAT_NHANVIEN1]
GO
ALTER TABLE [dbo].[PHIEUDAT]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUDAT_NHANVIEN2] FOREIGN KEY([MaNVGiao])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
GO
ALTER TABLE [dbo].[PHIEUDAT] CHECK CONSTRAINT [FK_PHIEUDAT_NHANVIEN2]
GO
ALTER TABLE [dbo].[PHIEUNHAP]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUNHAP_NHANVIEN] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[PHIEUNHAP] CHECK CONSTRAINT [FK_PHIEUNHAP_NHANVIEN]
GO
ALTER TABLE [dbo].[PHIEUTRA]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUTRA_HOADON] FOREIGN KEY([MaHD])
REFERENCES [dbo].[HOADON] ([MaHD])
GO
ALTER TABLE [dbo].[PHIEUTRA] CHECK CONSTRAINT [FK_PHIEUTRA_HOADON]
GO
ALTER TABLE [dbo].[PHIEUTRA]  WITH CHECK ADD  CONSTRAINT [FK_PHIEUTRA_NHANVIEN] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[PHIEUTRA] CHECK CONSTRAINT [FK_PHIEUTRA_NHANVIEN]
GO
ALTER TABLE [dbo].[THAYDOIGIA]  WITH CHECK ADD  CONSTRAINT [FK_THAYDOIGIA_DONGHO] FOREIGN KEY([MaDH])
REFERENCES [dbo].[DONGHO] ([MaDH])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[THAYDOIGIA] CHECK CONSTRAINT [FK_THAYDOIGIA_DONGHO]
GO
ALTER TABLE [dbo].[THAYDOIGIA]  WITH CHECK ADD  CONSTRAINT [FK_THAYDOIGIA_NHANVIEN] FOREIGN KEY([MaNV])
REFERENCES [dbo].[NHANVIEN] ([MaNV])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[THAYDOIGIA] CHECK CONSTRAINT [FK_THAYDOIGIA_NHANVIEN]
GO
ALTER TABLE [dbo].[CTDDH]  WITH CHECK ADD  CONSTRAINT [DonGiaKhongAm] CHECK  (([DonGia]>(0)))
GO
ALTER TABLE [dbo].[CTDDH] CHECK CONSTRAINT [DonGiaKhongAm]
GO
ALTER TABLE [dbo].[CTDDH]  WITH CHECK ADD  CONSTRAINT [SoLuongLonHon0] CHECK  (([SoLuong]>(0)))
GO
ALTER TABLE [dbo].[CTDDH] CHECK CONSTRAINT [SoLuongLonHon0]
GO
ALTER TABLE [dbo].[CTKHUYENMAI]  WITH CHECK ADD  CONSTRAINT [PTGLonHon0] CHECK  (([PhanTramGiam]>(0)))
GO
ALTER TABLE [dbo].[CTKHUYENMAI] CHECK CONSTRAINT [PTGLonHon0]
GO
ALTER TABLE [dbo].[CTPHIEUNHAP]  WITH CHECK ADD  CONSTRAINT [CTPN_DONGIAKHONGAM] CHECK  (([DonGia]>(0)))
GO
ALTER TABLE [dbo].[CTPHIEUNHAP] CHECK CONSTRAINT [CTPN_DONGIAKHONGAM]
GO
ALTER TABLE [dbo].[CTPHIEUNHAP]  WITH CHECK ADD  CONSTRAINT [CTPN_SLLonHon0] CHECK  (([SoLuong]>(0)))
GO
ALTER TABLE [dbo].[CTPHIEUNHAP] CHECK CONSTRAINT [CTPN_SLLonHon0]
GO
ALTER TABLE [dbo].[DONGHO]  WITH CHECK ADD  CONSTRAINT [SoLuongTonKhongAm] CHECK  (([SoLuongTon]>=(0)))
GO
ALTER TABLE [dbo].[DONGHO] CHECK CONSTRAINT [SoLuongTonKhongAm]
GO
ALTER TABLE [dbo].[DOTKHUYENMAI]  WITH CHECK ADD  CONSTRAINT [NgayKTSauNgayBD] CHECK  (([NgayKetThuc]>[NgayBatDau]))
GO
ALTER TABLE [dbo].[DOTKHUYENMAI] CHECK CONSTRAINT [NgayKTSauNgayBD]
GO
ALTER TABLE [dbo].[PHIEUDAT]  WITH CHECK ADD  CONSTRAINT [PD_NgayGiaoSauNgayDat] CHECK  (([NgayGiao] IS NULL OR [NgayGiao]>[NgayDat]))
GO
ALTER TABLE [dbo].[PHIEUDAT] CHECK CONSTRAINT [PD_NgayGiaoSauNgayDat]
GO
ALTER TABLE [dbo].[THAYDOIGIA]  WITH CHECK ADD  CONSTRAINT [GiaLonHonKhong] CHECK  (([Gia]>(0)))
GO
ALTER TABLE [dbo].[THAYDOIGIA] CHECK CONSTRAINT [GiaLonHonKhong]
GO
/****** Object:  StoredProcedure [dbo].[GetBestSellingWatches]    Script Date: 8/15/2023 1:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetBestSellingWatches]
AS
BEGIN
    SELECT
        GIW.MaDH,
        GIW.TenDH,
        GIW.GiaSauKhuyenMai,
        GIW.GiaGoc,
        GIW.HinhAnh,
        GIW.is_new,
        Orders.TotalOrders,
        Orders.TotalQuantity,
        GIW.PhanTramGiam
    FROM
        (
            SELECT
                CTPHIEUDAT.MaDH,
                COUNT(DISTINCT PHIEUDAT.MaPD) AS TotalOrders,
                SUM(CTPHIEUDAT.SoLuong) AS TotalQuantity
            FROM
                PHIEUDAT
            INNER JOIN
                CTPHIEUDAT ON PHIEUDAT.MaPD = CTPHIEUDAT.MaPD
            WHERE
                PHIEUDAT.TrangThai <> 4
                AND PHIEUDAT.NgayDat >= DATEADD(DAY, -30, GETDATE())
            GROUP BY
                CTPHIEUDAT.MaDH
        ) AS Orders
    INNER JOIN
        GetInfoWatches GIW ON Orders.MaDH = GIW.MaDH
    WHERE
        GIW.TrangThai = 1
    ORDER BY
        Orders.TotalOrders DESC,
        Orders.TotalQuantity DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[GetNewWatches]    Script Date: 8/15/2023 1:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetNewWatches]
AS
BEGIN
    SELECT
        GIW.MaHang,
        Hang.TenHang,
        GIW.MaDH,
        GIW.TenDH,
        GIW.GiaSauKhuyenMai,
        GIW.GiaGoc AS Gia,
        GIW.HinhAnh,
        GIW.is_new,
        GIW.PhanTramGiam
    FROM GetInfoWatches GIW 
	join Hang on GIW.MaHang = Hang.MaHang
    WHERE GIW.is_new = 1 AND GIW.TrangThai = 1
    ORDER BY GIW.MaHang, GIW.MaDH;
END
GO
/****** Object:  StoredProcedure [dbo].[GetWatchByMaDH]    Script Date: 8/15/2023 1:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetWatchByMaDH]
    @MaDH NCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        *
    FROM
        GetInfoWatches GIW
    WHERE
        GIW.MaDH = @MaDH;
END

GO
/****** Object:  StoredProcedure [dbo].[sp_ThongKeDonDatHang]    Script Date: 8/15/2023 1:17:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_ThongKeDonDatHang]
@FromDate NVARCHAR(25)=NULL,
@ToDate NVARCHAR(25)=NULL
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @CreateFromDate DATETIME =NULL
	DECLARE @CreateToDate DATETIME =NULL
	IF @FromDate IS NOT NULL SET @CreateFromDate =CONVERT(DATETIME,@FromDate,103)
	IF @ToDate IS NOT NULL SET @CreateToDate =DATEADD(DAY,1,CONVERT(DATETIME,@ToDate,103))

	SELECT CONVERT(VARCHAR, NgayDat,103) as Ngay , COUNT(DISTINCT PD.MaPD) as TongDon , SUM((CTPD.SoLuong-ISNULL(CTPD.SoLuongTra,0)) * CTPD.DonGia) as TongTien
	FROM (
		SELECT MaPD , NgayDat
			FROM PHIEUDAT
			WHERE TrangThai <> 0 AND TrangThai <> 4
			AND ( NgayDat >=  @CreateFromDate)
			AND (NgayDat <  @CreateToDate)
	) as PD
	LEFT JOIN CTPHIEUDAT CTPD on PD.MaPD = CTPD.MaPD
	GROUP BY CONVERT(varchar, NgayDat,103)
	ORDER BY CONVERT(varchar, NgayDat,103)
END
GO
USE [master]
GO
ALTER DATABASE [BanDongHo] SET  READ_WRITE 
GO
