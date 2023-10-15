const ReceivedNoteDAO = require('../dao/ReceivedNoteDAO');
const receivedNoteDAO = new ReceivedNoteDAO();

const getAllNotes = async (req, res) => {
    try {
        const notes = await receivedNoteDAO.getAllNote();
        res.status(200).json({ success: true, notes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });

    }
};

const getNoteBySupplierId = async (req, res) => {
    try {
        const notes = await receivedNoteDAO.getNotesBySupplierId(req.params);
        res.status(200).json({ success: true, notes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });

    }
};

const getDetailNotesByNoteId = async (req, res) => {
    try {
        const details = await receivedNoteDAO.getDetaiNoteByNoteId(req.params);
        res.status(200).json({ success: true, details });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });

    }
};

const addNote = async (req, res) => {
    try {
        await receivedNoteDAO.addNote(req.params, req.body);
        await receivedNoteDAO.addDetailNoteByOrderId(req.params, req.body);
        await receivedNoteDAO.updateStockByNewNote(req.params);

        res.status(200).json({ success: true, message: "Receive note has been added successfully" });
    } catch (error) {
        console.error();
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const deleteNote = async (req, res) => {
    try {
        const wrongStockRecord = await receivedNoteDAO.checkWrongStockQuantity(req.params);
        if (wrongStockRecord.length > 0) 
            return res.status(400).json({success: false, message: "There is a stock of at least one watch that is less than its number on detail note!"});
        
        await receivedNoteDAO.updateStockByCancelNote(req.params);
        await receivedNoteDAO.deleteAllDetailNotes(req.params);
        await receivedNoteDAO.deleteNote(req.params);

        res.status(200).json({ success: true, message: "Removing received note has been done successfully!" });
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};


module.exports = {
    getAllNotes,
    getNoteBySupplierId,
    getDetailNotesByNoteId,
    addNote,
    deleteNote,
};
