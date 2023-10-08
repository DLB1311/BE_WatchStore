const pool = require("../config/SQLManager");
const sql = require("mssql");
const bcrypt = require('bcrypt');
const Staff = require("../models/Staff");


class StaffDAO {

    async getAllStaff() {
        try {
          const query = `
            SELECT
            NV.*,
            Q.TenQuyen
          FROM
            NHANVIEN NV
          INNER JOIN
            QUYEN Q ON NV.MaQuyen = Q.MaQuyen
          `;
    
          const result = await pool.request().query(query);
          return result.recordset;
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async getInfoStaffByToken(userId) {
        try {
          const query = `
            SELECT *
            FROM
              NHANVIEN
            WHERE
              MaNV = @userId
          `;
    
          const result = await pool
            .request()
            .input("userId", sql.NVarChar(10), userId)
            .query(query);
            
          const staffData = result.recordset[0];
            if (staffData) {
                return new Staff(staffData);
              } else {
                return null; 
              }
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async findByEmailOrPhone(username) {
        try {
          const query = `
            SELECT *
            FROM NHANVIEN
            WHERE Email = @username OR SDT = @username;
          `;
    
          const result = await pool
            .request()
            .input("username", sql.NVarChar(50), username)
            .query(query);
            
          const staffData = result.recordset[0];
          if (staffData) {
            return new Staff(staffData);
          } else {
            return null; // Staff not found
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async comparePassword(password, hashedPassword) {
        try {
          return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
          console.error(error);
          throw error;
        }
      
    }

    async getDeliveryEmployees() {
        try {
          const query = `
            SELECT
              NV.MaNV,
              NV.Ho,
              NV.Ten,
              NV.SDT,
              NV.Email,
              COUNT(PD.MaNVGiao) AS NumberOfOrders
            FROM
              NHANVIEN NV
            LEFT JOIN
              PHIEUDAT PD ON NV.MaNV = PD.MaNVGiao AND PD.TrangThai = 2
            WHERE
              NV.MaQuyen = 'GH'
            GROUP BY
              NV.MaNV, NV.Ho, NV.Ten, NV.SDT, NV.Email
            ORDER BY
              NumberOfOrders ASC;
          `;
          const result = await pool.request().query(query);
          const deliveryEmployees = result.recordset;
          return deliveryEmployees;
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async addStaffMember(staffData) {
        try {
          // Get the list of existing staff members
          const existingStaff = await this.getAllStaffMembers();
    
          // Generate the next staff member ID
          const nextStaffId = this.generateNextStaffId(existingStaff);
    
          // Check if the phone number has more than 10 digits
         
    
          // Hash the password before inserting
          const hashedPassword = await bcrypt.hash(staffData.Password, 10);
    
          const insertQuery = `
            INSERT INTO NHANVIEN (MaNV, Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, Password, MaQuyen)
            VALUES (@MaNV, @Ho, @Ten, @GioiTinh, @NgaySinh, @DiaChi, @SDT, @Email, @Password, @MaQuyen)
          `;
    
          await pool.request()
            .input("MaNV", sql.NVarChar(10), nextStaffId)
            .input("Ho", sql.NVarChar(50), staffData.Ho)
            .input("Ten", sql.NVarChar(20), staffData.Ten)
            .input("GioiTinh", sql.Bit, staffData.GioiTinh)
            .input("NgaySinh", sql.Date, staffData.NgaySinh)
            .input("DiaChi", sql.NVarChar(200), staffData.DiaChi)
            .input("SDT", sql.NVarChar(15), staffData.SDT)
            .input("Email", sql.NVarChar(50), staffData.Email)
            .input("Password", sql.NVarChar(200), hashedPassword) // Use the hashed password
            .input("MaQuyen", sql.NVarChar(10), staffData.MaQuyen)
            .query(insertQuery);
    
          return { success: true, message: "Staff member added successfully" };
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async getAllStaffMembers() {
        try {
          const query = `
            SELECT MaNV
            FROM NHANVIEN
          `;
    
          const result = await pool.request().query(query);
          const staffList = result.recordset;
          return staffList.map(staff => staff.MaNV);
        } catch (error) {
          console.error(error);
          return [];
        }
      }
    
    generateNextStaffId(existingStaff) {
        const maxId = existingStaff.reduce((max, id) => {
          const numericId = parseInt(id.slice(2)); // Convert 'NV001' to 1
          return numericId > max ? numericId : max;
        }, 0);
    
        const nextIdNumber = maxId + 1;
        return `NV${nextIdNumber.toString().padStart(3, '0')}`;
    }

    async getAllRoleStaff() {
        try {
          const query = `
            SELECT
            *
            FROM
              QUYEN 
            WHERE
              MaQuyen <> 'KH'; 
          `;
    
          const result = await pool.request().query(query);
          const roleList = result.recordset;
    
          return roleList;
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async updateStaffMember(updatedStaff) {
        try {
          const updateQuery = `
            UPDATE NHANVIEN
            SET
                Ho = @Ho,
                Ten = @Ten,
                GioiTinh = @GioiTinh,
                NgaySinh = @NgaySinh,
                DiaChi = @DiaChi,
                SDT = @SDT,
                Email = @Email,
                MaQuyen = @MaQuyen
            WHERE MaNV = @MaNV;
          `;
    
          await pool
            .request()
            .input("Ho", sql.NVarChar(50), updatedStaff.Ho)
            .input("Ten", sql.NVarChar(20), updatedStaff.Ten)
            .input("GioiTinh", sql.Bit, updatedStaff.GioiTinh)
            .input("NgaySinh", sql.Date, updatedStaff.NgaySinh)
            .input("DiaChi", sql.NVarChar(200), updatedStaff.DiaChi)
            .input("SDT", sql.NVarChar(15), updatedStaff.SDT)
            .input("Email", sql.NVarChar(50), updatedStaff.Email)
            .input("MaQuyen", sql.NVarChar(10), updatedStaff.MaQuyen)
            .input("MaNV", sql.NVarChar(10), updatedStaff.MaNV)
            .query(updateQuery);
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async deleteStaffMember(staffId) {
        try {
          // If there are no linked records, proceed with deletion
          const deleteQuery = `
              DELETE FROM NHANVIEN
              WHERE MaNV = @staffId;
          `;
    
          await pool.request().input('staffId', sql.NVarChar(10), staffId).query(deleteQuery);
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async changeStaffPassword(userId, currentPassword, newPassword) {
        try {
          // Get the current user's information
          const userQuery = `SELECT * FROM NHANVIEN WHERE MaNV = @userId`;
          const userResult = await pool
            .request()
            .input("userId", sql.NVarChar(10), userId)
            .query(userQuery);
    
          const user = userResult.recordset[0];
    
          // Check if the entered current password matches the stored password
          if (!(await bcrypt.compare(currentPassword, user.Password))) {
            throw new Error("Incorrect password"); 
          }
    
          // Hash the new password
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
          // Update the password in the database
          const updateQuery = `
            UPDATE NHANVIEN
            SET Password = @newPassword
            WHERE MaNV = @userId;
          `;
    
          await pool
            .request()
            .input("newPassword", sql.NVarChar(200), hashedNewPassword)
            .input("userId", sql.NVarChar(10), userId)
            .query(updateQuery);
        } catch (error) {
          console.error(error);
          throw error;
        }
    }
}


module.exports = StaffDAO;
