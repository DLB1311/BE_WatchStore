const pool = require("../config/SQLManager");
const sql = require("mssql");

class TypeDAO{
    async getAllWatchTypes() {
        try {
            const result = await pool.query("SELECT * FROM LOAI");
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async checkExistWatchType(reqBody) {
        const { MaLoai } = reqBody;
        try {
            const typeResult = await pool.request()
                .input("MaLoai", sql.NVarChar, MaLoai)
                .query("SELECT TOP 1 1 FROM LOAI WHERE MaLoai = @MaLoai");

            return typeResult.recordset.length;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addWatchType(reqBody) {
        const { MaLoai, TenLoai, MoTa } = reqBody;
        try {
            const insertQuery = `
                INSERT INTO LOAI (MaLoai, TenLoai, MoTa)
                VALUES (@MaLoai, @TenLoai, @MoTa)
            `;

            await pool.request()
                .input("MaLoai", sql.NVarChar, MaLoai)
                .input("TenLoai", sql.NVarChar, TenLoai)
                .input("MoTa", sql.NVarChar, MoTa)
                .query(insertQuery);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateWatchType(reqParams, reqBody) {
        const { typeId } = reqParams;
        const { TenLoai, MoTa } = reqBody;
        try {
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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async checkLinkWatchVSType(reqParams) {
        const { typeId } = reqParams;
        try {
            const watchResult = await pool.query(`SELECT TOP 1 1 FROM DONGHO WHERE MaLoai = '${typeId}'`);
            return watchResult.recordset.length;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteWatchType(reqParams) {
        const { typeId } = reqParams;
        try {
            await pool.query(`DELETE FROM LOAI WHERE MaLoai = '${typeId}'`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}


module.exports = TypeDAO;