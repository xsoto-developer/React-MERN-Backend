const { response } = require('express');
const Evento = require('../models/Evento');
const { body } = require('express-validator');

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    return res.status(201).json({
        ok: true,
        msg: eventos
    })
}

const crearEvento = async (req, res = response) => {

    // const { } = req.body;
    const evento = new Evento(req.body);
    // evento.findOne()
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        //  Verificar que tenga el evento
        console.log(eventoGuardado);
        return res.status(201).json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                ok: false,
                msg: 'Error al  guardar el evento'
            }
        )

    }
}

const actualizarEventos = async (req, res = response) => {
    const eventoId = req.params.id
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento inexistente'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No  tene privilegios para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });
        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error comuniquese con administrador'
        })
    }

}

const eliminarEventos = async (req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento inexistente'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No  tene privilegios para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);
        return res.json({
            ok: true,
            eliminado: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error comuniquese con administrador'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEventos,
    eliminarEventos
}       