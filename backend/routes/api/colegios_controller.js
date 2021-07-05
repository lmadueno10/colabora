const express = require('express');
const router = express.Router();
const Colegios = require('../../models/Colegios');

router.get('/:id', async (req, res) => {
    try {
        const colegios = await Colegios.findOne({ codMod: req.params.id }).lean();
        if (!colegios) throw Error('No Items');
        const matr = colegios.estadistica.reduce((acc, { primaria }, index) => (acc.push({ ...primaria, anio: 2004 + index }), acc), []);
        const matrGenero = [colegios.estadistica[0].estadistica];
        const matrGrado = getMatrGrado(matr);
        const docentes = [Object.assign({}, ...matr.map(ele => ({ [`tdocente_${ele.anio}`]: ele.tdocente })))];
        const secciones = getSecciones(matr);

        res.status(200).json({
            matrGenero,
            matrGrado,
            docentes,
            secciones
        });
    } catch (err) {
        res.status(400).json({ mesg: err })
    }
});

const getMatrGrado = matr => {
    return Array.from(Array(6), (ele, i) => {
        return {
            grado: `${i + 1}º Grado`,
            ...Object.assign({}, ...matr.map(ele => ({ [`matr_${ele.anio}`]: ele[`matr0${i + 1}`] })))
        }
    });
};

const getSecciones = matr => {
    return Array.from(Array(6), (ele, i) => {
        return {
            grado: `${i + 1}º Grado`,
            ...Object.assign({}, ...matr.map(ele => ({ [`secc_${ele.anio}`]: ele[`secc0${i + 1}`] })))
        }
    });
};

module.exports = router;