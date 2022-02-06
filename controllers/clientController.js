// const data = {
//     clients :require('../models/clients.json'),
//     setClients:(clients)=>this.clients=clients,
// };

const Client = require('../models/Client');

// Client = require('../models/clients.json');

const getAllClients = async (req, res) => {
    // Client.find({},(err,clients)=>{
    //     if(err) return res.status(500).json({"message":"Internal Server Error"})
    //     res.json(clients);
    // })

    const clients = await Client.find();
    if (!clients) return res.status(204).json({ 'message': 'No employees found.' })

    res.status(200).json({
        message: "success",
        data: clients
    });
}

const createNewClient = async (req, res) => {

    console.log(req.body);
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({
            message: "input data invalid",
        })
    }



    // const newClient ={
    //     id:id,
    //     name:name
    // }

    // data.setClients([...data.clients,newClient])
    try {

        const duplicate = await Client.findOne({ _id: req.body.id }).exec();

        if (duplicate) {
            return res.status(409).json({
                'message': 'id already exits'
            })
        }

        const newClient = await Client.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,

        })
        console.log(newClient);
        return res.status(201).json({ 'message': `new client ${newClient.firstname + ' ' + newClient.lastname} created ...!` })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        })
    }

    // res.status(201).json({
    //     message:"success",
    //     data:data.clients
    // });
}

const updateClients = async (req, res) => {

    console.log(req.body)

    if (!req?.body?.id) {
        return res.status(400).json({
            messgage: "id required"
        })
    }



    // let found = false;

    // const updatedClients = data.clients.map(client=>{
    //     if(client.id===id){
    //         found = true;
    //         return {
    //             id:client.id,
    //             name:req.body.name
    //         }
    //     }
    //     return client;
    // })



    try {
        const client = await Client.findOne({ _id: req.body.id }).exec();
        console.log(client);
        if (!client) {
            return res.status(204).json({
                message: "client not exits"
            })
        }

        if (req.body?.firstname) client.firstname = req.body.firstname;
        if (req.body?.lastname) client.lastname = req.body.lastname;

        console.log("updated", client);

        const result = await client.save();

        return res.status(200).json({
            data: result,
            message: "successfully updated"
        })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

    // data.setClients(updatedClients);

    // res.status(200).json({
    //     message:"success",
    //     data:updatedClients
    // })
}

const deleteClient = async (req, res) => {
    // const client = data.clients.find(client =>client.id === req.body.id);
    if (!req?.body?.id) return res.status(400).json({ 'message': 'id is required' });

    const client = await Client.findOne({ _id: req.body.id }).exec();

    if (!client) {
        return res.status(204).json({
            message: "client not exits"
        })
    }

    // const filtered = data.clients.filter(client =>client.id !== req.body.id)
    // data.setClients(filtered)

    // await Client.deleteOne();
    const result = await client.deleteOne({ _id: req.body.id });
    console.log(result);

    res.status(200).json({
        messgage: "successfully deleted",
        data: result
    })
}

const getAClient = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'id is required' });

    const client = await Client.findOne({ _id: req.params.id }).exec();

    if (!client) return res.status(204).json({ 'message': `client not exits with id {${req.params.id}}` });

    res.json({
        data: client
    })
}

module.exports = {
    getAllClients,
    getAClient,
    createNewClient,
    updateClients,
    deleteClient
}


