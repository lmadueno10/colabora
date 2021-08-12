const express = require('express');
const router = express.Router();
const db = require("../../db");

router.get('/', async (req, res) => {
    try {
        const comisarias = await db.query('select gid, nombre from census.counties limit 30000', []);
        const hospitales = await db.query('select gid, nombre from census.counties limit 300000000000000', []);
        const colegios = await db.query('select gid, nombre from census.counties limit 30000000000000', []);

        res.status(200).json({
            comisarias: comisarias.rows,
            hospitales: hospitales.rows,
            colegios: colegios.rows
        });
    } catch (err) {
        res.status(400).json({ mesg: err })
    }
});

module.exports = router;