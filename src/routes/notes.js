const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const {isAuthenticated} = require('../helpers/auth')

//Formulario nueva nota
router.get('/notes/add', isAuthenticated, (req,res) => {
    res.render('notes/new-note')
});

//Proceso de guardar la nota o devolver errores en caso de no ser correctamente añadia por ausencia de la misma
router.post('/notes/new-note', isAuthenticated, async (req,res) => {
const {title,description}= req.body;
const errors = [];
if(!title){
    errors.push({text:'Please Write a Title'});
}
if(!description){
    errors.push({text:'Please Write a description'});
}
if (errors.length > 0) {
    res.render('notes/new-note', {
        errors,
        title,
        description
    });
} else {
    const newNote = new Note({ title, description});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully!!')
    res.redirect('/notes')
}
});
 
// proceso para mostrar todas las notas del usuario
router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {

                title: documento.title,
                description: documento.description,
                id:documento.id
            }
          })
        }
        res.render('notes/all-notes', {
        notes: contexto.notes }) 
      })
  })

//Proceso de seleccionar para editar una nota y como te reedirige para poder modificarla

  router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {

        const note = await Note.findById(req.params.id)
        .then(data =>{
            return {
                title:data.title,
                description:data.description,
                id:data.id
            }
        })
        res.render('notes/edit-note',{note})
    });

    //Proceso de enviar la modificacion y devolvernos a el renderizado de todas las notas con la modificacion ya hecha
    router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) =>{
            const {title,description} = req.body;
             await Note.findByIdAndUpdate(req.params.id,{title, description});
            req.flash('success_msg', 'Note Updated Successfully')
             res.redirect(('/notes'))
        });

    //Borrado de todas las notas    
    router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
        await Note.findByIdAndDelete(req.params.id)
        req.flash('success_msg', 'Note Delete Successfully')
        res.redirect(('/notes'))
    })

module.exports = router;