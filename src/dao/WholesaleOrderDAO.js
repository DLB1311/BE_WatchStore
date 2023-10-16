const pool = require("../config/SQLManager");
const sql = require("mssql");
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();


class WholesaleOrderDAO {
    async getAllOrder() {
        try {
            const result = await pool.query(`
                SELECT ddh.*, CASE WHEN pn.maddh IS NOT NULL THEN 1 ELSE 0 END AS received
                FROM dondathang ddh
                LEFT JOIN phieunhap pn ON ddh.maddh = pn.maddh
                ORDER BY CASE WHEN pn.maddh IS NOT NULL THEN 1 ELSE 0 END, ddh.maddh;
            `);

            return result.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async getOrdersWithoutReceive() {
        try {
            const result = await pool.query(`
                select ddh.MaDDH, ddh.NgayDatHang, ddh.MaNCC, ddh.MaNV 
                from dondathang ddh left join phieunhap pn on ddh.maddh = pn.maddh
                where pn.maddh is null
            `);

            return result.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async addOrder(supplierId , orderId , staffId){
        try {

            const insertQuery = `
            INSERT INTO DONDATHANG (MaDDH, NgayDatHang, MaNCC, MaNV)
            VALUES (@MaDDH, @NgayDatHang, @MaNCC, @MaNV)
        `;

            await pool.request()
                .input("MaDDH", sql.NVarChar, orderId)
                .input("NgayDatHang", sql.Date, new Date())
                .input("MaNCC", sql.NVarChar, supplierId)
                .input("MaNV", sql.NVarChar, staffId)
                .query(insertQuery);

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async checkReceivedNoteExisted(reqParams) {
        const { orderId } = reqParams;
        try {
            const result = await pool.query(`SELECT TOP 1 MAPN FROM PHIEUNHAP WHERE MADDH = '${orderId}' `);
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateOrder(reqParams, reqBody) {
        const { orderId } = reqParams;
        const { orderDate, supplierId, staffId } = reqBody;
        try {

            const updateQuery = `
                UPDATE DONDATHANG
                SET NgayDatHang = @NgayDatHang, MaNCC = @MaNCC, MaNV = @MaNV
                WHERE MaDDH = @MaDDH
            `;

            await pool.request()
                .input("NgayDatHang", sql.Date, new Date(orderDate))
                .input("MaNCC", sql.NVarChar, supplierId)
                .input("MaNV", sql.NVarChar, staffId)
                .input("MaDDH", sql.NVarChar, orderId)
                .query(updateQuery);

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async deleteOrder(reqParams) {
        const { orderId } = reqParams;
        try {
            await pool.query(`DELETE FROM DONDATHANG WHERE MaDDH =  '${orderId}'`);
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async getAllOrderBySupplierId(reqParams) {
        const { supplierId } = reqParams;
        try {
            const orders = await pool.request()
                .input("MaNCC", sql.NVarChar, supplierId)
                .query(`
                    SELECT ddh.*, CASE WHEN pn.maddh IS NOT NULL THEN 1 ELSE 0 END AS danhap
                    FROM DONDATHANG ddh
                    LEFT JOIN PHIEUNHAP pn ON ddh.maddh = pn.maddh
                    WHERE ddh.MaNCC = @MaNCC
                `);
    
            return orders.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getDetailOrdersByOrderId(reqParams) {
        const { orderId } = reqParams;
        try {
            const details = await pool.request()
                .input("MADDH", sql.NVarChar, orderId)
                .query("SELECT * FROM CTDDH WHERE MADDH = @MADDH");

            return details.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async addDetailOrder(reqParams, reqBody) {
        const { orderId } = reqParams;
        const { watchId, quantity, price } = reqBody;
        try {
            const insertQuery = `
            INSERT INTO CTDDH (MaDDH, MaDH, SoLuong, DonGia)
            VALUES (@MaDDH, @MaDH, @SoLuong, @DonGia)
        `;

            await pool.request()
                .input("MaDDH", sql.NVarChar, orderId)
                .input("MaDH", sql.NVarChar, watchId)
                .input("SoLuong", sql.Int, quantity)
                .input("DonGia", sql.Money, price)
                .query(insertQuery);
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    //Chỉ cho update số lượng và đơn giá
    async updateDetailOrder(reqParams, reqBody) {
        const { orderId } = reqParams;
        const { watchId, quantity, price } = reqBody;
        try {

            const updateQuery = `
                UPDATE CTDDH
                SET SoLuong = @SoLuong, DonGia = @DonGia
                WHERE MaDDH = @MaDDH AND MADH = @MADH
            `;

            await pool.request()
                .input("SoLuong", sql.Int, quantity)
                .input("DonGia", sql.Money, price)
                .input("MADH", sql.NVarChar, watchId)
                .input("MaDDH", sql.NVarChar, orderId)
                .query(updateQuery);
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async deleteDetailOrder(reqParams, reqBody) {
        const { orderId } = reqParams;
        const { watchId } = reqBody;
        try {
            await pool.query(`DELETE CTDDH WHERE MADDH = '${orderId}' AND MADH = '${watchId}'`);
        } catch (error) {
            console.log(error);
            throw error;
        }

    }
}


module.exports = WholesaleOrderDAO;