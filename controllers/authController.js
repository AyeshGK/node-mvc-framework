const usersDB = {
    users: require('../models/users.json'),
    setUser: function (data) { this.users = data },
}


const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const handleNewUser = async (req, res) => {
    const { username, pwd } = req.body;
    if ((message = validate(username, pwd))) {
        return res.status(400).json({ 'message': message });
    }

    // check for duplicates
    const duplicate = usersDB.users.find(person => person.username === username)
    if (duplicate) {
        return res.status(409).json({
            'message': 'username already exits user another'
        })
    }

    try {
        const hashedpwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            "username": username,
            "password": hashedpwd,
            "roles": { "User": "_u111" }
        };

        usersDB.setUser([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users),
        );
        console.log(usersDB.users);
        res.status(201).json({ 'message': `new user ${username} created ...!` });
    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }
}

const handleLogin = async (req, res) => {
    const { username, pwd } = req.body;
    if ((message = validate(username, pwd))) {
        return res.status(400).json({ 'message': message });
    }

    let foundUser = usersDB.users.find(person => person.username === username);
    if (!foundUser) {
        return res.status(401).json({
            'message': 'cannot find user'
        })
    }
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);

        const access_token = getAccessToken(username, roles);
        const refresh_token = getRefreshToken(username);

        // save the refresh token to the current user
        const otherUsers = usersDB.users.filter(person => person.username !== username);
        foundUser['refresh_token'] = refresh_token;
        usersDB.setUser([...otherUsers, foundUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        /* set cookie in the browser */
        res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({
            access_token
        });

        // res.status(200).json({
        //     'message':`succesfully user ${username} logged in...!`,
        // })
    } else {
        res.status(401).json({
            'message': 'password is not match...!'
        })
    }
}

const getAccessToken = (username, roles) => {
    return jwt.sign(
        {
            "UserInfo": {
                "username": username,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
}

const getRefreshToken = (username) => {
    return jwt.sign(
        { "username": username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
};

/* handle refresh token when get request for the new access token */
const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);

    const refresh_token = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refresh_token === refresh_token);

    if (!foundUser) return res.sendStatus(403);/* frobidden */

    jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(decoded);
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403)/* frobidden */
            const roles = Object.values(foundUser.values);
            const access_token = getAccessToken(decoded.username, roles);
            res.json({
                access_token
            })
        }
    )
}

const handleLogout = async (req, res) => {
    /* client side or frontend need to delete the access_token */

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);/* not content to delete */

    const refresh_token = cookies.jwt;

    /* is user in db */
    const foundUser = usersDB.users.find(person => person.refresh_token === refresh_token);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(403);
    }


    /* delete the refresh token in database */
    const otherUsers = usersDB.users.filter(person => person.refresh_token !== refresh_token);
    const currentUser = { ...foundUser, refresh_token: '' };
    usersDB.setUser([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })//secure:true  - use this at prodoction level for https://
    res.sendStatus(204);
}


const validate = (username, pwd) => {
    if (!username) {
        // return res.status(400).json({'message':'username is required...!'});
        return 'username is required...!';
    } else if (!pwd) {
        // return res.status(400).json({'message':'password is required...!'});
        return 'password is required...!';
    }
    return false;
}

module.exports = {
    handleNewUser,
    handleLogin,
    handleRefreshToken,
    handleLogout
};

