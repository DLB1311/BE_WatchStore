const upload = require("../middleware/multer");
// const jwt = require("jsonwebtoken");
// const pool = require("../config/SQLManager");
// const sql = require('mssql');
const auth = require("../middleware/auth");

const WatchDAO = require("../dao/WatchDAO");
const watchDAO = new WatchDAO();

const BrandDAO = require("../dao/BrandDAO");
const brandDAO = new BrandDAO();

const TypeDAO = require("../dao/TypeDAO");
const typeDAO = new TypeDAO();

let getAllBrands = async (req, res) => {
  try {
    const brands = await brandDAO.getAllBrands();
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
    const existingBrandCount = await brandDAO.checkExistBrand(req.body);

    if (existingBrandCount > 0) {
      return res.status(400).json({ success: false, message: "MaHang already exists." });
    }

    // Thực hiện thêm mới thương hiệu vào database
    await brandDAO.addBrand(req.body);

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
    const existingBrandCount = await brandDAO.checkExistBrand(req.body);

    if (existingBrandCount === 0) {
      return res.status(404).json({ success: false, message: "Brand not found." });
    }

    // Cập nhật thông tin của thương hiệu trong database
    await brandDAO.updateBrand(req.params, req.body);

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
    const watchResult = brandDAO.checkLinkWatchVSBrand(req.params);
    if (watchResult.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete the brand. It has associated watches." });
    }
    

    // Delete the brand with the given ID from the database
    await brandDAO.deleteBrand(req.params);
    
    res.status(200).json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while deleting the brand" });
  }
};

let getAllTypes = async (req, res) => {
  try {
    const types = await typeDAO.getAllWatchTypes();
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
    const typeResultLength = await typeDAO.checkExistWatchType(req.body);
    if (typeResultLength > 0) {
      return res.status(409).json({ success: false, message: "Type with this ID already exists" });
    }

    // Thêm loại mới vào database
    await typeDAO.addWatchType(req.body);

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
    const typeResultLength = await typeDAO.checkExistWatchType(req.body);
    if (typeResultLength === 0) {
      return res.status(404).json({ success: false, message: "Type not found" });
    }

    // Cập nhật thông tin của loại trong database
     await typeDAO.updateWatchType(req.params, req.body);

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
    const watchResultLength = await typeDAO.checkLinkWatchVSType(req.params);
    if (watchResultLength > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete the type. It has associated watches." });
    }

    // Delete the type with the given ID from the database
    await typeDAO.deleteWatchType(req.params);
    
    res.status(200).json({ success: true, message: "Type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while deleting the type" });
  }
};

let getAllWatches = async (req, res) => {
  try {
    const watches = await watchDAO.getAllWatch();
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
      await watchDAO.addWatchInfo(req);

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
      
      await watchDAO.updateWatchInfo(req);

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
    const totalReservations = await watchDAO.checkLinkWatchVSOrderDetail(req.params);

    if (totalReservations > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the watch. It has reservations.",
      });
    }

    // Xóa giá của đồng hồ trong bảng THAYDOIGIA
    await watchDAO.deletePriceInTHAYDOIGIA(req.params);

    // Tiến hành xóa đồng hồ
    await watchDAO.deleteWatchInfo(req.params);

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

    const priceHistory = await watchDAO.getPriceChangeHistory(req.params);

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
    await watchDAO.addPriceChange(userId, req.body);

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
    
    await watchDAO.editPriceChange(userId, req.body);

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
    await watchDAO.deletePriceChange(userId, req.body);

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
    const data = await watchDAO.getBestSellingWatches();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let getNewWatches = async (req, res) => {
  try {
    const result = await watchDAO.getAllNewWatches();

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
    const data = await watchDAO.getHighestDiscountWatches();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let getWatchByMaDH = async (req, res) => {
  const { MaDH } = req.params;

  try {

    const result = await watchDAO.getWatchesByOrderId(req.params);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Watch not found" });
    }

    const data = result[0];
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
    
    const [watches, brands, types] = await watchDAO.searchWatch(processedQuery);

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
    const result = await watchDAO.getWatchesByBrandAndTypes(req.query);

    const watches = result.map((watch) => ({
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
    const result = await watchDAO.getRandomWatchesByBrand(req.params);

    const watches = result.map((watch) => ({
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
