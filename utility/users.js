const users = []

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user)

    return user
}

//Get current user by ID
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

//Clear user when he leaves the chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        const test =  users.splice(index, 1)
        console.log(test)
        console.log(test[0])
        return test[0]
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}