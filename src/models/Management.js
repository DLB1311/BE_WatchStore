class orderStatusAndAssignEmployee {
    constructor({ MaNVDuyet, MaPD, MaNVGiao }) {
        this.MaNVDuyet = MaNVDuyet;
        this.MaPD = MaPD;
        this.MaNVGiao = MaNVGiao;
    }
}
class orderStatusDeli {
    constructor({ maNVGiao, maPD, ngayGiao }) {
        this.ngayGiao = ngayGiao;
        this.MaPD = MaPD;
        this.MaNVGiao = MaNVGiao;
    }
}

module.exports = { orderStatusAndAssignEmployee, orderStatusDeli };