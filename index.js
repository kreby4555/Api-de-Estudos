const express = require('express')
const serve = express()
serve.use(express.json())
const uuid = require('uuid')
const port = 3000

const users = []

const checkId = (request, response, next) => {
    const {id} = request.params
    const index = users.findIndex(user => user.id === id)

    if(index < 0) {
        return response.status(404).json({message: 'User Not Found'})
    }

    request.userId = id
    request.userIndex = index
    next()
}

const url = (req, res, next) => {
    const { url, method } = req
    console.log(`URL: ${url}, Method: ${method}`)

    next()
}

serve.get('/users', url, (request, response) => {
    return response.json(users)
})

serve.post('/users', url, (request, response) => {
    try{
    const { name, age, email, password } = request.body

    const o = { id: uuid.v4(), name, age, email, password }

    if(o.age < 18) throw new Error("Menor de Idade, Seja de Maior Para Cadastrar um Novo Usuário")

    users.push(o)

    return response.status(201).json(users)
    }catch(err) {
        return response.json({erro: err.message})
    }
})

serve.put('/users/:id', url, checkId, (request, response) => {
    try{
    const id = request.userId
    const index = request.userIndex
    const {name, age, email, password} = request.body

    const upDateUSer = {id, name, age, email, password}

    if(upDateUSer.age < 18) throw new Error('A idade tem que ser maior que 18!')

    users[index] = upDateUSer

    return response.status(201).json(upDateUSer)
    }catch(err) {
        return response.json({erro: err.message})
    }
})

serve.delete('/users/:id', checkId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})




serve.listen(port, () => {
    console.log(`Server On na Port: ${port}`)
})

