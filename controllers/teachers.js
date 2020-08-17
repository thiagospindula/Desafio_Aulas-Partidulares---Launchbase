const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')

exports.index = function(req, res) {
  return res.render("teachers/index", { teachers: data.teachers })
}

exports.create = function(req, res){
  return res.render("teachers/create")
}

exports.post = function(req, res) {
  const keys = Object.keys(req.body)

  for(key of keys) {
    if (req.body[key] == "") {
      return res.send('Por favor, preencha todos os campos')
    }
  }
  let { avatar_url, name, birth, schooling, support, occupation_area, } = req.body


  birth = Date.parse(birth)
  const created_at = Date.now()
  const id = Number(data.teachers.length + 1)


  data.teachers.push({
    id,
    avatar_url, 
    name, 
    birth, 
    schooling, 
    support,
    occupation_area,
    created_at
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (error) {
    if (error) return res.send("Erro de arquivo")

    return res.redirect("/teachers")
  })
  //return res.send(req.body)
}

exports.show = function(req, res) {
  const { id } = req.params

  const foundTeacher = data.teachers.find(function(teacher) {
    return teacher.id == id
  })

  if (!foundTeacher) return res.send("Professor não encontrado")

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    occupation_area: foundTeacher.occupation_area.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
  }

  return res.render("teachers/show", { teacher })
}

exports.edit = function(req, res) {
  
  const { id } = req.params

  const foundTeacher = data.teachers.find(function(teacher) {
    return teacher.id == id
  })

  if (!foundTeacher) return res.send("Professor não encontrado")

  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth).iso,
    //schooling: foundTeacher.schooling,
    schooling: foundTeacher.schooling,
    
  }

  return res.render('teachers/edit', { teacher })
}

exports.put = function(req, res) {
  const { id } = req.body
  let index = 0

  const foundTeacher = data.teachers.find(function(teacher, foundIndex) {
    if (id == teacher.id) {
      index = foundIndex
      return true
    }
   
  })

  if (!foundTeacher) return res.send("Professor não encontrado")

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.teachers[index] = teacher

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Erro de arquivo")

    return res.redirect(`/teachers/${id}`)
  })
}

exports.delete = function(req,res) {
  const { id } = req.body;

  const filteredTeachers = data.teachers.filter(function(teacher) {
    return teacher.id != id
  })

  data.teachers = filteredTeachers;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if (err) return res.send("Erro de arquivo")

    return res.redirect("/teachers");
  })
}