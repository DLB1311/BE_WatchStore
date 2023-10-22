const ReceivedNoteDAO = require('../dao/ReceivedNoteDAO');
const receivedNoteDAO = new ReceivedNoteDAO();
const auth = require("../middleware/auth");

const dotenv = require('dotenv');
dotenv.config();


const getAllNotes = async (req, res) => {
    try {
        const notes = await receivedNoteDAO.getAllNote();
        res.status(200).json({ success: true, notes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });

    }
};

const getNoteBySupplierId = async (req, res) => {
    try {
        const notes = await receivedNoteDAO.getNotesBySupplierId(req.params);
        res.status(200).json({ success: true, notes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });

    }
};

const getDetailNotesByNoteId = async (req, res) => {
    try {
        const details = await receivedNoteDAO.getDetaiNoteByNoteId(req.params);
        res.status(200).json({ success: true, details });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001  });

    }
};

const addNote = async (req, res) => {
    try {
        const staffId = auth.getUserIdFromToken(req);
    
        await receivedNoteDAO.addNote(req.params, req.body, staffId);
        await receivedNoteDAO.addDetailNoteByOrderId(req.params, req.body);
        await receivedNoteDAO.updateStockByNewNote(req.params);

        res.status(200).json({ success: true, message: process.env.RECEIVEDNOTE_SUCCESS});
    } catch (error) {
        console.error();
        res.status(500).json({ success: false, message: process.env.ERROR_E001  });
    }
};

const deleteNote = async (req, res) => {
    try {
        const wrongStockRecord = await receivedNoteDAO.checkWrongStockQuantity(req.params);
        if (wrongStockRecord.length > 0) 
            return res.status(400).json({success: false, message: process.env.DEL_RECEIVEDNOTE_ERROR});
        
        await receivedNoteDAO.updateStockByCancelNote(req.params);
        await receivedNoteDAO.deleteAllDetailNotes(req.params);
        await receivedNoteDAO.deleteNote(req.params);

        res.status(200).json({ success: true, message: process.env.DEL_RECEIVEDNOTE_ERROR1 });
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({ success: false, message: process.env.ERROR_E001  });
    }
};


module.exports = {
    getAllNotes,
    getNoteBySupplierId,
    getDetailNotesByNoteId,
    addNote,
    deleteNote,
};
