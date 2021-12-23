const data = {
    clients :require('../models/clients.json'),
    setClients:(clients)=>this.clients=clients,
};

const getAllClients = (req,res)=>{
    res.json(data.clients);
}

const createNewClient =(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;

    if(!id || !name){
        return res.status(400).json({
            status:400,
            message:"input data invalid",
        })
    }

    const newClient ={
        id:id,
        name:name
    }
    
    data.setClients([...data.clients,newClient])
    
    res.status(201).json({
        message:"success",
        data:data.clients
    });
}

const updateClients = (req,res)=>{
    const id = req.body.id; 
    if(!id){
        return res.status(400).json({
            messgage:"invalid inputs"
        })
    }

    let found = false;
    
    const updatedClients = data.clients.map(client=>{
        if(client.id===id){
            found = true;
            return {
                id:client.id,
                name:req.body.name
            }
        }
        return client;
    })

    if(!found){
        return res.status(400).json({
            status:400,
            message:"client not exits"
        })
    }

    data.setClients(updatedClients);

    res.status(200).json({
        message:"success",
        data:updatedClients
    })
}

const deleteClient = (req,res)=>{
    const client = data.clients.find(client =>client.id === req.body.id);

    if(!client){
        return res.status(400).json({
            message:"client not exits"
        })
    }
    
    const filtered = data.clients.filter(client =>client.id !== req.body.id)
    data.setClients(filtered)

    res.status(200).json({
        messgage:"successfully deleted",
        data:client
    })
}

const getAClient = (req,res)=>{
    res.json({
        "id":req.params.id
    })
}

module.exports = {
    getAllClients,
    getAClient,
    createNewClient,
    updateClients,
    deleteClient
}


