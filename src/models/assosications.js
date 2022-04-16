const Block = require("./block");
const Conversation = require("./conversation");
const Message = require("./message");
const Participant = require("./participants");
const User = require("./user");

function run(){
    Message.belongsTo(User, { foreignKey: 'id' });
    User.hasMany(Message, { foreignKey: 'user_id' });
    
    User.hasMany(Block, { foreignKey: 'id' });
    Block.belongsTo(User, { foreignKey: 'block_by' });
    
    User.hasMany(Block, { foreignKey: 'id' });
    Block.belongsTo(User, { foreignKey: 'block_to' });
    
    Message.belongsTo(Conversation, { foreignKey: 'id' });
    Conversation.hasMany(Message, {foreignKey: 'conversation_id'});
    
    Conversation.belongsToMany(User, { through: Participant, foreignKey: 'conversation_id' });
    User.belongsToMany(Conversation, { through: Participant, foreignKey: 'participant_user_id' });
    
    User.hasMany(Block, { foreignKey: 'block_by' });
    User.hasMany(Block, { foreignKey: 'block_to' });
    
    Participant.hasMany(Conversation, { foreignKey: "id"});
    Conversation.hasMany(Participant, { foreignKey: "conversation_id"});


}

run();