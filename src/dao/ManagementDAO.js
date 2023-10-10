const pool = require('../config/SQLManager');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const Management = require('../models/Management');

class ManagementDAO {
    async getBookingOrders() {
        try {
            const query = 'SELECT * FROM PHIEUDAT ORDER BY NGAYDAT DESC';
            const result = await pool.request().query(query);
            const bookingOrders = result.recordset;
            return bookingOrders;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getBookingOrderDetails(maPD) {
        try {
            const query = `
                SELECT PD.*, CT.*, DH.HinhAnh, DH.TenDH, HD.MaHD as MaHD, 
                NV.Ho + ' ' + NV.Ten as TenNVGiao, 
                NV_Duyet.Ho + ' ' + NV_Duyet.Ten as TenNVDuyet
                FROM PHIEUDAT AS PD
                INNER JOIN CTPHIEUDAT AS CT ON PD.MaPD = CT.MaPD
                INNER JOIN DONGHO AS DH ON CT.MaDH = DH.MaDH
                LEFT JOIN HOADON AS HD ON PD.MaPD = HD.MaPD
                LEFT JOIN NHANVIEN AS NV ON PD.MaNVGiao = NV.MaNV
                LEFT JOIN NHANVIEN AS NV_Duyet ON PD.MaNVDuyet = NV_Duyet.MaNV
                WHERE PD.MaPD = @maPD;
            `;

            const result = await pool.request().input('maPD', sql.Int, maPD).query(query);
            const rows = result.recordset;

            // Check if any data was found for the given booking order code
            if (rows.length === 0) {
                return null; // Return null if booking order is not found
            }

            const bookingOrderData = {
                MaPD: rows[0].MaPD,
                NgayDat: rows[0].NgayDat,
                HoNN: rows[0].HoNN,
                TenNN: rows[0].TenNN,
                DiaChiNN: rows[0].DiaChiNN,
                SDT: rows[0].SDT,
                MaGiaoDich: rows[0].MaGiaoDich,
                NgayGiao: rows[0].NgayGiao,
                TrangThai: rows[0].TrangThai,
                MaKH: rows[0].MaKH,
                MaNVDuyet: rows[0].MaNVDuyet,
                TenNVDuyet: rows[0].TenNVDuyet, // Name of the staff who approved the order
                MaNVGiao: rows[0].MaNVGiao,
                TenNVGiao: rows[0].TenNVGiao, // Name of the delivery staff
                ChiTietDat: [],
                MaHD: rows[0].MaHD || null,
            };

            // Iterate through the rows and populate the ChiTietDat array
            rows.forEach((row) => {
                const chiTietDat = {
                    MaCT: row.MaCT,
                    SoLuong: row.SoLuong,
                    DonGia: row.DonGia,
                    SoLuongTra: row.SoLuongTra,
                    MaPT: row.MaPT,
                    TenDH: row.TenDH,
                    HinhAnh: row.HinhAnh,
                };
                bookingOrderData.ChiTietDat.push(chiTietDat);
            });

            return bookingOrderData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateOrderStatusAndAssignEmployee(maPD, userId, maNVGiao) {
        try {
            const updateOrderStatusQuery = `
              UPDATE PHIEUDAT
              SET TrangThai = 2, MaNVDuyet = @userId, MaNVGiao = @maNVGiao
              WHERE MaPD = @maPD AND TrangThai = 1;
            `;

            await pool
                .request()
                .input('userId', sql.NChar, userId)
                .input('maPD', sql.Int, maPD)
                .input('maNVGiao', sql.NChar, maNVGiao)
                .query(updateOrderStatusQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async completeOrder(maPD, maNVGiao) {
        try {
            const ngayGiao = new Date(); // Use the current date as the delivery date

            // Check if the order status is 2 (which means it's ready for completion)
            const checkOrderStatusQuery = `
              SELECT TrangThai FROM PHIEUDAT WHERE MaPD = @maPD;
            `;
            const result = await pool.request().input('maPD', sql.NVarChar, maPD).query(checkOrderStatusQuery);

            if (result.recordset.length === 0 || result.recordset[0].TrangThai !== 2) {
                throw new Error('Invalid order status for completion');
            }

            const updateOrderQuery = `
              UPDATE PHIEUDAT
              SET NgayGiao = @ngayGiao, MaNVGiao = @maNVGiao, TrangThai = 3
              WHERE MaPD = @maPD;
            `;

            await pool
                .request()
                .input('maPD', sql.NVarChar, maPD)
                .input('ngayGiao', sql.Date, ngayGiao)
                .input('maNVGiao', sql.NVarChar, maNVGiao)
                .query(updateOrderQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createInvoice(maPD, MaHoaDon, MaSoThue, HoTen, userId) {
        try {
            const checkBookingOrderQuery = `
                SELECT *
                FROM PHIEUDAT
                WHERE MaPD = @maPD AND TrangThai = 2;
            `;

            const result = await pool.request().input('maPD', sql.Int, maPD).query(checkBookingOrderQuery);
            const bookingOrder = result.recordset[0];

            if (!bookingOrder) {
                return null; // Return null if booking order is not found or cannot be invoiced
            }

            const checkInvoiceExistsQuery = `
                SELECT *
                FROM HOADON
                WHERE MaPD = @maPD OR MaHD = @maHD;
            `;

            const checkInvoiceResult = await pool
                .request()
                .input('maPD', sql.Int, maPD)
                .input('maHD', sql.NVarChar, MaHoaDon)
                .query(checkInvoiceExistsQuery);

            const existingInvoice = checkInvoiceResult.recordset[0];

            if (existingInvoice) {
                return 'duplicate'; // Return 'duplicate' if invoice already exists for the booking order or duplicate MaHoaDon
            }

            // Create the new invoice (hóa đơn) in the HOADON table
            const createInvoiceQuery = `
                INSERT INTO HOADON (MaHD, NgayTaoHD, MaSoThue, HoTen, MaNV, MaPD)
                VALUES (@maHD, GETDATE(), @MaSoThue, @HoTen, @maNV, @maPD);
            `;

            await pool
                .request()
                .input('maHD', sql.NVarChar, MaHoaDon)
                .input('MaSoThue', sql.NVarChar, MaSoThue)
                .input('HoTen', sql.NVarChar, HoTen)
                .input('maNV', sql.NVarChar, userId)
                .input('maPD', sql.Int, maPD)
                .query(createInvoiceQuery);

            // ... Your existing code to generate and save the PDF ...

            // Return 'success' to indicate that the invoice was created successfully
            return 'success';
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getInvoice(maPD) {
        try {
            const getInvoiceQuery = `
                SELECT hd.MaHD, hd.NgayTaoHD, hd.MaSoThue, hd.HoTen, nv.Ho + ' ' + nv.Ten as TenNV
                FROM HOADON hd
                JOIN NHANVIEN nv ON hd.MaNV = nv.MaNV
                WHERE hd.MaPD = @maPD;
            `;

            const result = await pool.request().input('maPD', sql.Int, maPD).query(getInvoiceQuery);
            const invoice = result.recordset[0];

            if (!invoice) {
                return null; // Return null if invoice is not found for the booking order
            }

            const getInvoiceDetailsQuery = `
                SELECT dh.TenDH, ctpd.SoLuong, ctpd.DonGia, ctpd.SoLuong * ctpd.DonGia AS TongTien
                FROM CTPHIEUDAT ctpd
                JOIN DONGHO dh ON ctpd.MaDH = dh.MaDH
                WHERE ctpd.MaPD = @maPD;
            `;
            const invoiceDetailsResult = await pool
                .request()
                .input('maPD', sql.Int, maPD)
                .query(getInvoiceDetailsQuery);
            const invoiceDetails = invoiceDetailsResult.recordset;

            const totalAmount = invoiceDetails.reduce((acc, detail) => acc + parseFloat(detail.TongTien), 0);

            const invoiceResponse = {
                ...invoice,
                MaPD: maPD,
                ChiTietPhieuDat: invoiceDetails.map((detail) => ({
                    TenDH: detail.TenDH,
                    SoLuong: detail.SoLuong,
                    DonGia: detail.DonGia,
                    Amount: detail.TongTien,
                })),
                TongTien: totalAmount,
            };

            // Return the invoice response
            return invoiceResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getRevenueReports(fromDate, toDate) {
        try {
            const result = await pool
                .request()
                .input('FromDate', sql.NVarChar(25), fromDate)
                .input('ToDate', sql.NVarChar(25), toDate)
                .execute('sp_ThongKeDonDatHang');

            const revenueReports = result.recordset;
            return revenueReports;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllDiscounts() {
        try {
            const query = `
                SELECT * FROM DOTKHUYENMAI
            `;

            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createDiscount(discountData) {
        try {
            const { TenDotKM, NgayBatDau, NgayKetThuc, MoTa, MaNV } = discountData;

            // Check if the new discount overlaps with existing discounts
            const overlapQuery = `
                SELECT COUNT(*) AS OverlapCount
                FROM DOTKHUYENMAI
                WHERE (NgayBatDau <= @NgayKetThuc) AND (NgayKetThuc >= @NgayBatDau);
            `;

            const overlapResult = await pool
                .request()
                .input('NgayBatDau', sql.Date, NgayBatDau)
                .input('NgayKetThuc', sql.Date, NgayKetThuc)
                .query(overlapQuery);

            const overlapCount = overlapResult.recordset[0].OverlapCount;

            if (overlapCount > 0) {
                throw new Error('The new discount overlaps with existing discounts');
            }

            // If no overlap, insert the new discount
            const insertQuery = `
                INSERT INTO DOTKHUYENMAI (TenDotKM, NgayBatDau, NgayKetThuc, MoTa, MaNV)
                VALUES (@TenDotKM, @NgayBatDau, @NgayKetThuc, @MoTa, @MaNV);
            `;

            await pool
                .request()
                .input('TenDotKM', sql.NVarChar, TenDotKM)
                .input('NgayBatDau', sql.Date, NgayBatDau)
                .input('NgayKetThuc', sql.Date, NgayKetThuc)
                .input('MoTa', sql.NVarChar, MoTa)
                .input('MaNV', sql.NVarChar, MaNV)
                .query(insertQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateDiscount(discountData) {
        try {
            const { MaDotKM, TenDotKM, NgayBatDau, NgayKetThuc, MoTa, MaNV } = discountData;

            // Check if the updated discount overlaps with existing discounts
            const overlapQuery = `
                SELECT COUNT(*) AS OverlapCount
                FROM DOTKHUYENMAI
                WHERE MaDotKM <> @MaDotKM
                    AND ((NgayBatDau <= @NgayKetThuc AND NgayKetThuc >= @NgayBatDau)
                        OR (NgayKetThuc >= @NgayBatDau AND NgayBatDau <= @NgayKetThuc));
            `;

            const overlapResult = await pool
                .request()
                .input('MaDotKM', sql.Int, MaDotKM)
                .input('NgayBatDau', sql.Date, NgayBatDau)
                .input('NgayKetThuc', sql.Date, NgayKetThuc)
                .query(overlapQuery);

            const overlapCount = overlapResult.recordset[0].OverlapCount;

            if (overlapCount > 0) {
                throw new Error('The updated discount overlaps with existing discounts');
            }

            // If no overlap, update the discount
            const updateQuery = `
                UPDATE DOTKHUYENMAI
                SET TenDotKM = @TenDotKM, NgayBatDau = @NgayBatDau, NgayKetThuc = @NgayKetThuc, MoTa = @MoTa, MaNV = @MaNV
                WHERE MaDotKM = @MaDotKM;
            `;

            await pool
                .request()
                .input('MaDotKM', sql.Int, MaDotKM)
                .input('TenDotKM', sql.NVarChar, TenDotKM)
                .input('NgayBatDau', sql.Date, NgayBatDau)
                .input('NgayKetThuc', sql.Date, NgayKetThuc)
                .input('MoTa', sql.NVarChar, MoTa)
                .input('MaNV', sql.NVarChar, MaNV)
                .query(updateQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteDiscount(MaDotKM) {
        try {
            const query = `
                DELETE FROM DOTKHUYENMAI
                WHERE MaDotKM = @MaDotKM;
            `;

            await pool.request().input('MaDotKM', sql.Int, MaDotKM).query(query);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getDiscountDetails(MaDotKM) {
        try {
            const query = `
                SELECT CTKHUYENMAI.*, DONGHO.TenDh
                FROM CTKHUYENMAI
                JOIN DONGHO ON CTKHUYENMAI.MaDH = DONGHO.MaDH
                WHERE MaDotKM = @MaDotKM;
            `;

            const result = await pool.request().input('MaDotKM', sql.NVarChar, MaDotKM).query(query);
            const discount = result.recordset;

            return discount;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getWatchesWithoutDiscounts(MaDotKM) {
        try {
            const query = `
                SELECT DONGHO.*
                FROM DONGHO
                LEFT JOIN (
                    SELECT DISTINCT MaDH
                    FROM CTKHUYENMAI
                    WHERE MaDotKM = @MaDotKM
                ) AS DiscountedWatches
                ON DONGHO.MaDH = DiscountedWatches.MaDH
                WHERE DiscountedWatches.MaDH IS NULL;
            `;

            const result = await pool.request().input('MaDotKM', sql.Int, MaDotKM).query(query);
            const watchesWithoutDiscounts = result.recordset;

            return watchesWithoutDiscounts;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addDiscountDetails(MaDotKM, MaDH, GiamGia) {
        try {
            // Insert discount details into the CTKHUYENMAI table
            const query = `
                INSERT INTO CTKHUYENMAI (MaDotKM, MaDH, PhanTramGiam)
                VALUES (@MaDotKM, @MaDH, @PhanTramGiam);
            `;

            await pool
                .request()
                .input('MaDotKM', sql.Int, MaDotKM)
                .input('MaDH', sql.NVarChar, MaDH)
                .input('PhanTramGiam', sql.Float, GiamGia)
                .query(query);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateDiscountPercentage(MaDotKM, MaDH, PhanTramGiam) {
        try {
            // Update discount percentage in the CTKHUYENMAI table
            const query = `
                UPDATE CTKHUYENMAI
                SET PhanTramGiam = @PhanTramGiam
                WHERE MaDotKM = @MaDotKM AND MaDH = @MaDH;
            `;

            await pool
                .request()
                .input('MaDotKM', sql.Int, MaDotKM)
                .input('MaDH', sql.NVarChar, MaDH)
                .input('PhanTramGiam', sql.Float, PhanTramGiam)
                .query(query);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteDiscountDetail(MaDotKM, MaDH) {
        try {
            // Delete discount details from the CTKHUYENMAI table
            const query = `
                DELETE FROM CTKHUYENMAI
                WHERE MaDotKM = @MaDotKM AND MaDH = @MaDH;
            `;

            await pool.request().input('MaDotKM', sql.Int, MaDotKM).input('MaDH', sql.NVarChar, MaDH).query(query);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getDeliveryStaffBookingOrders(maNVGiao) {
        try {
            // Query booking orders for the specified delivery staff
            const query = `
                SELECT *
                FROM PHIEUDAT
                WHERE MaNVGiao = @maNVGiao
                ORDER BY 
                    CASE WHEN TrangThai = 2 THEN 0 ELSE 1 END,  -- Orders with status 2 first
                    NGAYDAT DESC;  
            `;

            const result = await pool.request().input('maNVGiao', sql.NVarChar, maNVGiao).query(query);

            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllSuppliers() {
        try {
            const query = `SELECT * FROM NHACC;`;
            const result = await pool.request().query(query);

            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addSupplier(MaNCC, TenNCC, DiaChi, Email, SDT) {
        try {
            const insertQuery = `
          INSERT INTO NHACC (MaNCC, TenNCC, DiaChi, Email, SDT)
          VALUES (@MaNCC, @TenNCC, @DiaChi, @Email, @SDT);
        `;

            await pool
                .request()
                .input('MaNCC', sql.NVarChar(10), MaNCC)
                .input('TenNCC', sql.NVarChar(50), TenNCC)
                .input('DiaChi', sql.NVarChar(200), DiaChi)
                .input('Email', sql.NVarChar(50), Email)
                .input('SDT', sql.NVarChar(15), SDT)
                .query(insertQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async editSupplier(supplierId, TenNCC, DiaChi, Email, SDT) {
        try {
            const updateQuery = `
          UPDATE NHACC
          SET TenNCC = @TenNCC, DiaChi = @DiaChi, Email = @Email, SDT = @SDT
          WHERE MaNCC = @MaNCC;
        `;

            await pool
                .request()
                .input('MaNCC', sql.NVarChar(10), supplierId)
                .input('TenNCC', sql.NVarChar(50), TenNCC)
                .input('DiaChi', sql.NVarChar(200), DiaChi)
                .input('Email', sql.NVarChar(50), Email)
                .input('SDT', sql.NVarChar(15), SDT)
                .query(updateQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteSupplier(supplierId) {
        try {
            const deleteQuery = `
              DELETE FROM NHACC
              WHERE MaNCC = @MaNCC;
          `;

            await pool.request().input('MaNCC', sql.NVarChar(10), supplierId).query(deleteQuery);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = ManagementDAO;