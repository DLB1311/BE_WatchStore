const pool = require("../config/SQLManager");
const sql = require("mssql");

class BrandDAO{
    async getAllBrands() {
        try {
            const result = await pool.query("SELECT * FROM HANG");
            const brands = result.recordset;

            return brands;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async checkExistBrand(reqBody) {
        const { MaHang } = reqBody;
        try {
            const existingBrand = await pool.request()
                .input("MaHang", sql.NVarChar, MaHang)
                .query("SELECT TOP 1 1 FROM HANG WHERE MaHang = @MaHang");

            return existingBrand.recordset.length;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addBrand(reqBody) {
        const { MaHang, TenHang, MoTa } = reqBody;
        try {
            const insertQuery = `
            INSERT INTO HANG (MaHang, TenHang, MoTa)
            VALUES (@MaHang, @TenHang, @MoTa)
        `;

            await pool.request()
                .input("MaHang", sql.NVarChar, MaHang)
                .input("TenHang", sql.NVarChar, TenHang)
                .input("MoTa", sql.NVarChar, MoTa)
                .query(insertQuery);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateBrand(reqParams, reqBody) {
        const { brandId } = reqParams;
        const { TenHang, MoTa } = reqBody;

        try {
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async checkLinkWatchVSBrand(reqParams) {
        const { brandId } = reqParams;
        try {
            const watchResult = await pool.query(`SELECT TOP 1 1 FROM DONGHO WHERE MaHang = '${brandId}' `);
            return watchResult.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteBrand(reqParams) {
        const { brandId } = reqParams;
        try {
            await pool.query(`DELETE FROM HANG WHERE MaHang =  '${brandId}'`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}


module.exports = BrandDAO;