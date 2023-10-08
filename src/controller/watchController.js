const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/SQLManager");
const sql = require('mssql');
const auth = require("../middleware/auth");

let getAllBrands = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM HANG");
    const brands = result.recordset;
    res.status(200).json({ success: true, brands });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });

  }
};
let addBrand = async (req, res) => {
  const { MaHang, TenHang, MoTa } = req.body;

  try {
    // Kiểm tra xem thương hiệu đã tồn tại hay chưa
    const existingBrand = await pool.request()
      .input("MaHang", sql.NVarChar, MaHang)
      .query("SELECT TOP 1 1 FROM HANG WHERE MaHang = @MaHang");

    if (existingBrand.recordset.length > 0) {
      return res.status(400).json({ success: false, message: "MaHang already exists." });
    }

    // Thực hiện thêm mới thương hiệu vào database
    const insertQuery = `
      INSERT INTO HANG (MaHang, TenHang, MoTa)
      VALUES (@MaHang, @TenHang, @MoTa)
    `;

    await pool.request()
      .input("MaHang", sql.NVarChar, MaHang)
      .input("TenHang", sql.NVarChar, TenHang)
      .input("MoTa", sql.NVarChar, MoTa)
      .query(insertQuery);

    res.status(201).json({ success: true, message: "Brand added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while adding the brand" });
  }
};
let updateBrand = async (req, res) => {
  const { brandId } = req.params;
  const { TenHang, MoTa } = req.body;

  try {
    // Kiểm tra xem thương hiệu có tồn tại không
    const brandResult = await pool.request()
      .input("MaHang", sql.NVarChar, brandId)
      .query("SELECT TOP 1 1 FROM HANG WHERE MaHang = @MaHang");

    if (brandResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Brand not found." });
    }

    // Cập nhật thông tin của thương hiệu trong database
    const updateQuery = `
      UPDATE HANG
      SET TenHang = @TenHang, MoTa = @MoTa
      WHERE MaHang = @MaHang
    `;

    await pool.request()
      .input("TenHang", sql.NVarChar, TenHang)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("MaHang", sql.NVarChar, brandId)
      .query(updateQuery);

    res.status(200).json({ success: true, message: "Brand updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while updating the brand" });
  }
};
let deleteBrand = async (req, res) => {
  const { brandId } = req.params;
  try {
    // Check if there are associated watches for the brand
    
    const watchResult = await pool.query(`SELECT TOP 1 1 FROM DONGHO WHERE MaHang = '${brandId}' `);
    if (watchResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete the brand. It has associated watches." });
    }
    

    // Delete the brand with the given ID from the database
    await pool.query(`DELETE FROM HANG WHERE MaHang =  '${brandId}'`);
    
    res.status(200).json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while deleting the brand" });
  }
};

let getAllTypes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM LOAI");
    const types = result.recordset;
    res.status(200).json({ success: true, types });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let addType = async (req, res) => {
  const { MaLoai, TenLoai, MoTa } = req.body;

  try {
    // Kiểm tra xem mã loại đã tồn tại chưa
    const typeResult = await pool.request()
      .input("MaLoai", sql.NVarChar, MaLoai)
      .query("SELECT TOP 1 1 FROM LOAI WHERE MaLoai = @MaLoai");

    if (typeResult.recordset.length > 0) {
      return res.status(409).json({ success: false, message: "Type with this ID already exists" });
    }

    // Thêm loại mới vào database
    const insertQuery = `
      INSERT INTO LOAI (MaLoai, TenLoai, MoTa)
      VALUES (@MaLoai, @TenLoai, @MoTa)
    `;

    await pool.request()
      .input("MaLoai", sql.NVarChar, MaLoai)
      .input("TenLoai", sql.NVarChar, TenLoai)
      .input("MoTa", sql.NVarChar, MoTa)
      .query(insertQuery);

    res.status(201).json({ success: true, message: "Type added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while adding the type" });
  }
};
let updateType = async (req, res) => {
  const { typeId } = req.params;
  const { TenLoai, MoTa } = req.body;

  try {
    // Kiểm tra xem loại có tồn tại không
    const typeResult = await pool.request()
      .input("MaLoai", sql.NVarChar, typeId)
      .query("SELECT TOP 1 1 FROM LOAI WHERE MaLoai = @MaLoai");

    if (typeResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Type not found" });
    }

    // Cập nhật thông tin của loại trong database
     const updateQuery = `
      UPDATE LOAI
      SET TenLoai = @TenLoai, MoTa = @MoTa
      WHERE MaLoai = @MaLoai
    `;

    await pool.request()
      .input("TenLoai", sql.NVarChar, TenLoai)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("MaLoai", sql.NVarChar, typeId)
      .query(updateQuery);

    res.status(200).json({ success: true, message: "Type updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while updating the type" });
  }
};
let deleteType = async (req, res) => {
  const { typeId } = req.params;
  try {
    // Check if there are associated watches for the type
    const watchResult = await pool.query(`SELECT TOP 1 1 FROM DONGHO WHERE MaLoai = '${typeId}'`);
    if (watchResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete the type. It has associated watches." });
    }

    // Delete the type with the given ID from the database
    await pool.query(`DELETE FROM LOAI WHERE MaLoai = '${typeId}'`);
    
    res.status(200).json({ success: true, message: "Type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while deleting the type" });
  }
};

let getAllWatches = async (req, res) => {
  try {
    const result = await pool.query(`SELECT GIW.* ,Hang.TenHang, Hang.Mota ,Loai.TenLoai, Loai.MoTa
    FROM GetInfoWatches GIW
    Join Hang On GIW.MaHang = Hang.MaHang
    Join Loai On GIW.MaLoai = Loai.MaLoai`);
    const watches = result.recordset;
    res.status(200).json({ success: true, watches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let addWatch = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      // Xảy ra lỗi khi upload file
      return res.status(500).json({ success: false, message: "Lỗi upload file" });
    }

    const { MaDH, TenDH, SoLuongTon, MoTa, TrangThai, is_new, MaLoai, MaHang } = req.body;

    try {
      const insertQuery = `
        INSERT INTO dbo.DongHo (MaDH, TenDH, SoLuongTon, MoTa, TrangThai, is_new, MaLoai, MaHang, HinhAnh)
        VALUES (@MaDH, @TenDH, @SoLuongTon, @MoTa, @TrangThai, @is_new, @MaLoai, @MaHang, @HinhAnh)
      `;

      await pool.request()
        .input("MaDH", sql.NVarChar, MaDH)
        .input("TenDH", sql.NVarChar, TenDH)
        .input("SoLuongTon", sql.Int, SoLuongTon)
        .input("MoTa", sql.NVarChar, MoTa)
        .input("TrangThai", sql.Int, TrangThai)
        .input("is_new", sql.Bit, is_new)
        .input("MaLoai", sql.NVarChar, MaLoai)
        .input("MaHang", sql.NVarChar, MaHang)
        .input("HinhAnh", sql.NVarChar, req.file.filename)
        .query(insertQuery);

      res.status(201).json({
        success: true,
        message: "Watch added successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
};
let updateWatch = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: "Lỗi upload file" });
    }

    const { MaDH, TenDH, SoLuongTon, MoTa, TrangThai, is_new, MaLoai, MaHang } = req.body;

    try {
      let updateFields = "TenDH = @TenDH, SoLuongTon = @SoLuongTon, MoTa = @MoTa, TrangThai = @TrangThai, is_new = @is_new, MaLoai = @MaLoai, MaHang = @MaHang";
      const params = {
        TenDH,
        SoLuongTon,
        MoTa,
        TrangThai,
        is_new,
        MaLoai,
        MaHang,
        MaDH
      };

      if (req.file && req.file.filename) {
        updateFields += ", HinhAnh = @HinhAnh";
        params.HinhAnh = req.file.filename;
      }

      const query = `
        UPDATE dbo.DongHo
        SET ${updateFields}
        WHERE MaDH = @MaDH
      `;

      await pool.request()
        .input("TenDH", sql.NVarChar, params.TenDH)
        .input("SoLuongTon", sql.Int, params.SoLuongTon)
        .input("MoTa", sql.NVarChar, params.MoTa)
        .input("TrangThai", sql.Int, params.TrangThai)
        .input("is_new", sql.Bit, params.is_new)
        .input("MaLoai", sql.NVarChar, params.MaLoai)
        .input("MaHang", sql.NVarChar, params.MaHang)
        .input("MaDH", sql.NVarChar, params.MaDH)
        .input("HinhAnh", sql.NVarChar, params.HinhAnh)
        .query(query);

      res.status(200).json({
        success: true,
        message: "Watch updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
};
let deleteWatch = async (req, res) => {
  const { MaDH } = req.params;

  try {
    // Kiểm tra xem đồng hồ có liên kết với bảng CTPHIEUDAT hay không
    const checkReservationQuery = `
      SELECT COUNT(*) AS TotalReservations
      FROM CTPHIEUDAT
      WHERE MaDH = @MaDH
    `;
    const reservationResult = await pool.request()
      .input("MaDH", sql.NVarChar, MaDH)
      .query(checkReservationQuery);
    const totalReservations = reservationResult.recordset[0].TotalReservations;

    if (totalReservations > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the watch. It has reservations.",
      });
    }

    // Xóa giá của đồng hồ trong bảng THAYDOIGIA
    const deletePriceQuery = `
      DELETE FROM THAYDOIGIA
      WHERE MaDH = @MaDH
    `;
    await pool.request()
      .input("MaDH", sql.NVarChar, MaDH)
      .query(deletePriceQuery);

    // Tiến hành xóa đồng hồ
    const deleteWatchQuery = `
      DELETE FROM DONGHO
      WHERE MaDH = @MaDH
    `;
    await pool.request()
      .input("MaDH", sql.NVarChar, MaDH)
      .query(deleteWatchQuery);

    res.status(200).json({
      success: true,
      message: "Watch deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
let getWatchPriceHistory = async (req, res) => {
  const { MaDH } = req.params;

  try {
    const result = await pool.request().input('MaDH', sql.NVarChar(10), MaDH).query(`
      SELECT *
      FROM THAYDOIGIA
      WHERE MaDH = @MaDH
      Order By THAYDOIGIA.TGThayDoi DESC
    `);

    const priceHistory = result.recordset;

    res.status(200).json({ success: true, priceHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let addPriceChange = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);

  const { MaDH, TGThayDoi, Gia } = req.body;

  try {
    const insertQuery = `
      INSERT INTO THAYDOIGIA (MaDH, MaNV, TGThayDoi, Gia)
      VALUES (@MaDH, @MaNV, @TGThayDoi, @Gia)
    `;

    await pool.request()
      .input("MaDH", sql.NVarChar(10), MaDH)
      .input("MaNV", sql.NVarChar(10), userId)
      .input("TGThayDoi", sql.DateTime, TGThayDoi)
      .input("Gia", sql.Money, Gia)
      .query(insertQuery);

    res.status(201).json({
      success: true,
      message: "Price change added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
let editPriceChange = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);

  const {MaDH,TGThayDoi, Gia } = req.body;

  try {
    const updateQuery = `
      UPDATE THAYDOIGIA
      SET  Gia = @Gia
      WHERE MaDH = @MaDH and MaNV = @MaNV and TGThayDoi = @TGThayDoi
    `;

    await pool.request()
      .input("MaDH", sql.NVarChar(10), MaDH)
      .input("MaNV", sql.NVarChar(10), userId)
      .input("TGThayDoi", sql.DateTime, TGThayDoi)
      .input("Gia", sql.Money, Gia)
      .query(updateQuery);

    res.status(200).json({
      success: true,
      message: "Price change updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
let deletePriceChange = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);

  const { MaDH, MaNV, TGThayDoi } = req.body;

  try {
    const deleteQuery = `
      DELETE FROM THAYDOIGIA
      WHERE MaDH = @MaDH AND MaNV = @MaNV AND TGThayDoi = @TGThayDoi
    `;

    await pool.request()
      .input("MaDH", sql.NVarChar(10), MaDH)
      .input("MaNV", sql.NVarChar(10), MaNV)
      .input("TGThayDoi", sql.DateTime, TGThayDoi)
      .query(deleteQuery);

    res.status(200).json({
      success: true,
      message: "Price change deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


let getBestSellingWatches = async (req, res) => {
  try {
    const result = await pool.query("EXEC GetBestSellingWatches");
    const data = result.recordset;
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let getNewWatches = async (req, res) => {
  try {
    const result = await pool.request().execute("dbo.GetNewWatches");

    const data = [];
    let currentHang = null;

    result.recordset.forEach((row) => {
      if (row.MaHang !== currentHang) {
        currentHang = row.MaHang;
        data.push({
          MaHang: row.MaHang,
          TenHang: row.TenHang,
          watches: [],
        });
      }

      const watch = {
        MaDH: row.MaDH,
        TenDH: row.TenDH,
        GiaSauKhuyenMai: row.GiaSauKhuyenMai,
        GiaGoc: row.Gia,
        HinhAnh: row.HinhAnh,
        is_new: row.is_new,
        PhanTramGiam: row.PhanTramGiam,
      };

      data[data.length - 1].watches.push(watch);
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let getWatchesWithHighestDiscount = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM GetWatchesWithHighestDiscount ORDER BY PhanTramGiam DESC;"
    );
    const data = result.recordset;
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let getWatchByMaDH = async (req, res) => {
  const { MaDH } = req.params;

  try {

    const result = await pool.request()
      .input('MaDH', sql.NVarChar(10), MaDH)
      .query(`SELECT GIW.* ,Hang.TenHang, Hang.Mota ,Loai.TenLoai, Loai.MoTa
              FROM GetInfoWatches GIW
              Join Hang On GIW.MaHang = Hang.MaHang
              Join Loai On GIW.MaLoai = Loai.MaLoai
                WHERE GIW.MaDH = @MaDH`);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Watch not found" });
    }

    const data = result.recordset[0];
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let searchWatches = async (req, res) => {
  const { query: searchQuery } = req.query; 

  const trimmedQuery = searchQuery.trim();
  const processedQuery = trimmedQuery.replace(/\s+/g, ' ');

  try {
    const [watchesResult, brandsResult, typesResult] = await Promise.all([
      pool.query(
        `SELECT GIW.*, Hang.TenHang FROM GetInfoWatches GIW
        join Hang on GIW.MaHang = Hang.MaHang
      WHERE GIW.TenDH LIKE N'%${processedQuery}%'
      `
      ),
      pool.query(
        `
        SELECT * 
        FROM HANG H
        WHERE H.TenHang LIKE N'%${processedQuery}%'
      `
      ),
      pool.query(
        `
        SELECT *
        FROM LOAI L
        WHERE L.TenLoai LIKE N'%${processedQuery}%'
      `
      ),
    ]);

    const watches = watchesResult.recordset;
    const brands = brandsResult.recordset;
    const types = typesResult.recordset;

    const data = {
      hangs: {
        tenhangs: brands.map((brand) => ({
          mahang: brand.MaHang,
          tenhang: brand.TenHang,
        })),
        soketquatimthay: brands.length,
      },
      loais: {
        tenloais: types.map((type) => ({
          maloai: type.MaLoai,
          tenloai: type.TenLoai,
        })),
        soketquatimthay: types.length,
      },
      donghos: {
        watches: watches.map((watch) => ({
          MaDH: watch.MaDH,
          tendh: watch.TenDH,
          tenhang: watch.TenHang,
          hinhAnh: watch.HinhAnh,
          GiaGoc: watch.GiaGoc,
          GiaSauKhuyenMai: watch.GiaSauKhuyenMai,
          PhanTramGiam: watch.PhanTramGiam,
          is_new: watch.is_new,
        })),
        soketquatimthay: watches.length,
      },
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let getWatchesByBrandAndType = async (req, res) => {
  const { brands, types } = req.query;
  try {
    let query = `
      SELECT GIW.* ,Hang.TenHang, Hang.Mota ,Loai.TenLoai, Loai.MoTa
      FROM GetInfoWatches GIW
      JOIN Hang ON GIW.MaHang = Hang.MaHang
      JOIN Loai ON GIW.MaLoai = Loai.MaLoai`;

    let whereClause = [];
    if (brands) {
      const brandArr = brands.split(',').map((brand) => brand.trim());
      whereClause.push(`GIW.MaHang IN ('${brandArr.join("','")}')`);
    }
    if (types) {
      const typeArr = types.split(',').map((type) => type.trim());
      whereClause.push(`GIW.MaLoai IN ('${typeArr.join("','")}')`);
    }

    if (whereClause.length > 0) {
      query += ` WHERE ${whereClause.join(' AND ')}`;
    }
    
    query += ` AND GIW.TrangThai = 1`; // Đặt điều kiện ở đây
    
    const result = await pool.query(query);

    const watches = result.recordset.map((watch) => ({
      MaDH: watch.MaDH,
      tendh: watch.TenDH,
      tenhang: watch.TenHang,
      hinhAnh: watch.HinhAnh,
      GiaGoc: watch.GiaGoc,
      GiaSauKhuyenMai: watch.GiaSauKhuyenMai,
      PhanTramGiam: watch.PhanTramGiam,
      is_new: watch.is_new,
    }));

    res.status(200).json({ success: true, data: watches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let getRandomWatchesByBrand = async (req, res) => {
  const { brandId } = req.params;
  try {
    const result = await pool.request()
      .input('brandId', sql.NVarChar(10), brandId)
      .query(
        `
        SELECT TOP 5 GIW.* ,Hang.TenHang, Hang.Mota ,Loai.TenLoai, Loai.MoTa
        FROM GetInfoWatches GIW
        Join Hang On GIW.MaHang = Hang.MaHang
        Join Loai On GIW.MaLoai = Loai.MaLoai
        WHERE GIW.MaHang = '${brandId}'
        ORDER BY NEWID();
        `
      );

    const watches = result.recordset.map((watch) => ({
      MaDH: watch.MaDH,
      tendh: watch.TenDH,
      tenhang: watch.TenHang,
      hinhAnh: watch.HinhAnh,
      GiaGoc: watch.GiaGoc,
      GiaSauKhuyenMai: watch.GiaSauKhuyenMai,
      PhanTramGiam: watch.PhanTramGiam,
      is_new: watch.is_new,
    }));

    res.status(200).json({ success: true, data: watches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};



module.exports = {
  getAllBrands ,
  addBrand,
  updateBrand,
  deleteBrand,

  getAllTypes ,
  addType,
  updateType,
  deleteType,
  
  getAllWatches,
  addWatch,
  updateWatch,
  deleteWatch,
  getWatchPriceHistory,
  addPriceChange,
  editPriceChange,
  deletePriceChange,
  
  getBestSellingWatches,
  getNewWatches,
  getWatchesWithHighestDiscount,
  getWatchByMaDH,
  searchWatches,
  getWatchesByBrandAndType ,
  getRandomWatchesByBrand
};
