const pool = require("../config/SQLManager");
const sql = require("mssql");

class WatchDAO {

    async getAllWatch() {
        try {
            const result = await pool.query(`SELECT GIW.* ,Hang.TenHang, Hang.Mota ,Loai.TenLoai, Loai.MoTa
                FROM GetInfoWatches GIW
                Join Hang On GIW.MaHang = Hang.MaHang
                Join Loai On GIW.MaLoai = Loai.MaLoai`);
            const watches = result.recordset;

            return watches;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addWatchInfo(req) {
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateWatchInfo(req) {
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async checkLinkWatchVSOrderDetail(reqParams) {
        const { MaDH } = reqParams;
        try {
            const checkReservationQuery = `
                SELECT COUNT(*) AS TotalReservations
                FROM CTPHIEUDAT
                WHERE MaDH = @MaDH
            `;
            const reservationResult = await pool.request()
                .input("MaDH", sql.NVarChar, MaDH)
                .query(checkReservationQuery);
            const totalReservations = reservationResult.recordset[0].TotalReservations;

            return totalReservations;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deletePriceInTHAYDOIGIA(reqParams) {
        const { MaDH } = reqParams;
        try {
            const deletePriceQuery = `
                DELETE FROM THAYDOIGIA
                WHERE MaDH = @MaDH
            `;
            await pool.request()
                .input("MaDH", sql.NVarChar, MaDH)
                .query(deletePriceQuery);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteWatchInfo(reqParams) {
        const { MaDH } = reqParams;
        try {
            const deleteWatchQuery = `
            DELETE FROM DONGHO
            WHERE MaDH = @MaDH
        `;
            await pool.request()
                .input("MaDH", sql.NVarChar, MaDH)
                .query(deleteWatchQuery);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getPriceChangeHistory(reqParams) {
        const { MaDH } = reqParams;
        try {
            const result = await pool.request().input('MaDH', sql.NVarChar(10), MaDH).query(`
                SELECT *
                FROM THAYDOIGIA
                WHERE MaDH = @MaDH
                Order By THAYDOIGIA.TGThayDoi DESC
            `);

            return result.recordset;;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addPriceChange(userId, reqBody) {
        const { MaDH, TGThayDoi, Gia } = reqBody;
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async editPriceChange(userId, reqBody) {
        const { MaDH, TGThayDoi, Gia } = reqBody;
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deletePriceChange(userId, reqBody) {

        const { MaDH, MaNV, TGThayDoi } = reqBody;
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getBestSellingWatches() {
        try {
            const result = await pool.query("EXEC GetBestSellingWatches");
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllNewWatches() {
        try {
            const result = await pool.request().execute("dbo.GetNewWatches");
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getHighestDiscountWatches() {
        try {
            const result = await pool.query(
                "SELECT * FROM GetWatchesWithHighestDiscount ORDER BY PhanTramGiam DESC;"
            );
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getWatchesByOrderId(reqParams) {
        const { MaDH } = reqParams;
        try {
            const result = await pool.request()
                .input('MaDH', sql.NVarChar(10), MaDH)
                .query(`SELECT GIW.* ,Hang.TenHang, Hang.Mota ,Loai.TenLoai, Loai.MoTa
              FROM GetInfoWatches GIW
              Join Hang On GIW.MaHang = Hang.MaHang
              Join Loai On GIW.MaLoai = Loai.MaLoai
                WHERE GIW.MaDH = @MaDH`);

            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async searchWatch(processedQuery) {
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

            return [watches, brands, types];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getWatchesByBrandAndTypes(reqQuery) {
        const { brands, types } = reqQuery;
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

            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getRandomWatchesByBrand(reqParams) {
        const { brandId } = reqParams;
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
            
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}


module.exports = WatchDAO;