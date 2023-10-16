const pool = require("../config/SQLManager");
const sql = require("mssql");
const auth = require("../middleware/auth");

class ReceivedNoteDAO {
    async getAllNote() {
        try {
            const notes = await pool.query("SELECT * FROM PHIEUNHAP");

            return notes.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getNotesBySupplierId(reqParams) {
        const { supplierId } = reqParams;
        try {
            const notes = await pool.query(`
                select *
                from phieunhap
                where maddh in (select maddh from dondathang where mancc = '${supplierId}')
            `);

            return notes.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async addNote(reqParams,reqBody,staffId) {
        const { orderId } = reqParams;
        const { noteId } = reqBody;
        try {
        console.log(noteId+" "+staffId +" "+ orderId);
            const insertQuery = `
                INSERT INTO PHIEUNHAP (MaPN, NgayTaoPhieu, MaNV, MaDDH)
                VALUES (@MaPN, @NgayTaoPhieu, @MaNV, @MaDDH)
            `;
        
            await pool.request()
                .input("MaPN", sql.NVarChar, noteId)
                .input("NgayTaoPhieu", sql.Date, new Date())
                .input("MaNV", sql.NVarChar, staffId)
                .input("MaDDH", sql.NVarChar, orderId)
                .query(insertQuery);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async checkWrongStockQuantity(reqParams) {
        const {noteId} = reqParams;
        try {
            const queryCheck = `
                SELECT dh.madh, dh.soluongton, CTPHIEUNHAP.soluong
                FROM dongho dh
                JOIN CTPHIEUNHAP ON dh.madh = CTPHIEUNHAP.madh
                WHERE dh.madh IN (SELECT madh FROM ctphieunhap a WHERE mapn = '${noteId}')
                and soluongton < soluong
            `;
            const stockCheck = await pool.request().query(queryCheck);

            return stockCheck.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async updateStockByNewNote(reqParams) {
        const { orderId } = reqParams;
        try {
            const orderInfos =
                await pool.request().query(`
                    select dongho.MaDH, SoLuong, SoLuongTon from 
                    ctddh join dongho on ctddh.madh = dongho.madh where maddh = '${orderId}'
                `);
                console.log(orderInfos);

            for (const record of orderInfos.recordset) {
                await pool.request()
                .input("SoLuong", sql.Int, record.SoLuong + record.SoLuongTon)
                .input("MaDH", sql.NVarChar, record.MaDH)
                .query(`UPDATE dongho SET soluongton = @SoLuong WHERE madh = @MaDH`);
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateStockByCancelNote(reqParams) {
        const { noteId } = reqParams;
        try {
            const orderInfos =
                await pool.request()
                .input("MaPN", sql.NVarChar, noteId)
                .query(`
                    select dongho.MaDH, SoLuong, SoLuongTon from 
                    ctphieunhap join dongho on ctphieunhap.madh = dongho.madh where mapn = @MaPN
                `);

            for (const record of orderInfos.recordset) {
                await pool.request()
                .input("SoLuong", sql.Int, record.SoLuongTon - record.SoLuong)
                .input("MaDH", sql.NVarChar, record.MaDH)
                .query(`UPDATE dongho SET soluongton = @SoLuong WHERE madh = @MaDH`);
            };
        } catch (error) {
            throw error;
        }
    }

    // async updateNote(reqParams, reqBody) {
    //     const { noteId } = reqParams;
    //     const { receiveDate, orderId, staffId } = reqBody;
    //     try {

    //         const updateQuery = `
    //             UPDATE DONDATHANG
    //             SET NgayTaoPhieu = @NgayTaoPhieu, MaDDH = @MaDDH, MaNV = @MaNV
    //             WHERE MaPN = @MaPN
    //         `;

    //         await pool.request()
    //             .input("NgayTaoPhieu", sql.NVarChar, receiveDate)
    //             .input("MaDDH", sql.NVarChar, orderId)
    //             .input("MaNV", sql.NVarChar, staffId)
    //             .input("MaPN", sql.NVarChar, noteId)
    //             .query(updateQuery);

    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }

    async deleteNote(reqParams) {
        const { noteId } = reqParams;
        try {
            await pool.query(`DELETE FROM PHIEUNHAP WHERE MaPN =  '${noteId}'`);
        } catch (error) {
            throw error;
        }
    }

    async getDetaiNoteByNoteId(reqParams) {
        const { noteId } = reqParams;
        try {
            const details = await pool.request()
                .query(`SELECT * FROM CTPHIEUNHAP WHERE MaPN = '${noteId}'`);

            return details.recordset;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async addDetailNoteByOrderId(reqParams, reqBody) {
        const { orderId } = reqParams;
        const { noteId } = reqBody;
        try {
            const detailOrderInfos = await pool.query(`
                select MaDH, SoLuong, DonGia from ctddh where maddh = '${orderId}'
            `);

            for (const detail of detailOrderInfos.recordset) {
                const {
                    MaDH: watchId,
                    SoLuong: quantity,
                    DonGia: price,
                } = detail;

                const insertQuery = `
                    INSERT INTO CTPHIEUNHAP (MaPN, MaDH, SoLuong, DonGia)
                    VALUES (@MaPN, @MaDH, @SoLuong, @DonGia)
                `;

                await pool.request()
                    .input("MaPN", sql.NVarChar, noteId)
                    .input("MaDH", sql.NVarChar, watchId)
                    .input("SoLuong", sql.Int, quantity)
                    .input("DonGia", sql.Money, price)
                    .query(insertQuery);
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteAllDetailNotes(reqParams) {
        const {noteId} = reqParams;
        try {
            await pool.query(`DELETE CTPHIEUNHAP WHERE MAPN = '${noteId}'`);
        } catch (error) {
            throw error;
        }
    }
}


module.exports = ReceivedNoteDAO;