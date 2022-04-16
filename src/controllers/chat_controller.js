
const mysql = require("mysql");
const connection = require('../config/db');

const Block = require("../models/block")
const User = require("../models/user");
const Message = require("../models/message");
const Participants = require("../models/participants");
const Conversation = require("../models/conversation");
const {Op} = require('sequelize');





const sendMessage = async (req, res, next) => {
    
    const _findUser = await User.findOne({
        where : {username : req.params.username}
    })
    
    const is_user_banned = await Block.findOne({
        where : {
            block_by : _findUser.id,
            block_to : req.session.passport.user
        }
    })
    
    
    if (!is_user_banned) {
        
        const [results, metadata] = await
        connection.query(`SELECT messages.conversation_id FROM messages INNER JOIN participants ON
        messages.conversation_id = participants.conversation_id 
        WHERE (messages.user_id = ${req.session.passport.user} AND
            participants.participant_user_id =${_findUser.id})
            or 
            (messages.user_id = ${_findUser.id} AND participants.participant_user_id =${req.session.passport.user});`);
            
            let conservation = 0;
            if (results.length > 0) {
                conservation = await Conversation.findOne({
                    where: {id : results[0].conversation_id}
                })
            } else {
                conservation = new Conversation({
                    
                })
                await conservation.save();
                
                const firstParticipants = new Participants({
                    participant_user_id : _findUser.id,
                    conversation_id :  conservation.id
                })
                await firstParticipants.save();
                
                const secondParticipants = new Participants({
                    participant_user_id : req.session.passport.user,
                    conversation_id :  conservation.id
                })
                await secondParticipants.save();
            }
            
            
            try {
                
                const newMessage = new Message ({
                    user_id : req.session.passport.user,
                    text : req.body.text,
                    conversation_id : conservation.id
                    
                })
                await newMessage.save();
                
                
                
                res.status(201).json(newMessage)
                
                
                
                
            } catch (error) {
                console.log(error);
            }
        } 
        else {
            res.status(403).json("İşlem başarısız, mesaj atmaya çalıştığınız kullanıcı tarafından engellisiniz")
        }
        
    }
    
    const messages = async (req, res, next) => {
        
        const conversations = await Conversation.findAll({
            where: {
                isDeleted: 0
            },
            include: {
                model: User,
                where: {
                    id: req.user.id
                }
            },
        });


        let active_conversation_ids = [];
        conversations.forEach(element => {
            active_conversation_ids.push(element.dataValues.id);
        });
        
        console.log(active_conversation_ids);
        const active_conversations = await Conversation.findAll({
            where: {
                id: {
                    [Op.in]: active_conversation_ids
                },
                isDeleted: 0
            },
            include: {
                model: User,
                
            },include: {
                model: Message
            },
            order: [
                ['updatedAt', 'DESC'],
            ],
        });
        res.json(active_conversations)
    }
    
    const messages_with = async (req, res, next) => {
        
        
        const _findUser = await User.findOne({
            where: {
                username: req.params.username,
                isDeleted: 0
            }
        });
        
        const [results, metadata] = await connection.query(`SELECT messages.conversation_id FROM messages INNER JOIN participants ON messages.conversation_id = participants.conversation_id WHERE (messages.user_id = ${req.session.passport.user} AND participants.participant_user_id = ${_findUser.id}) 
        or (messages.user_id = ${_findUser.id} AND participants.participant_user_id = ${req.session.passport.user});`);
        
        if (results.length > 0){
            conversation = await Message.findAll({
                where: {
                    conversation_id: results[0].conversation_id
                }
            });
            res.status(200).json(conversation)
            
        } else{
            res.status(200).json("Kullanıcı ile aranızda bir konuşma yok.")
        }
    }
    const delete_message = async (req, res, next) => {
        
        const _findMessage = await Message.findOne({
            where: {
                id : req.params.id
            }
        });
        
        
        
        

        if (_findMessage) {

            const  _conversation_id = _findMessage.dataValues.conversation_id;

            await Message.destroy({
                where: {
                    id : req.params.id
                }
            })
            const checkMessages = await Message.findOne({
                where: {
                    conversation_id : _conversation_id
                }
            });
            if (!checkMessages) {
                
                Participants.destroy({
                    where : {
                        conversation_id : _conversation_id
                    }
                })
                Conversation.destroy({
                    where : {
                        id : _conversation_id
                    }
                })
            } else {
                
            }

            res.status(200).send();
            
        } else {
            res.status(404).send("İşlem başarısız, mesaj bulunamadı");
        }
        
        
        
        
        
        
    }
    const block = async (req, res, next) => {
        
        const _findUser = await User.findOne({
            where : {username : req.params.username}
        })
        const is_block_avaiable = await Block.findAll({
            where : {
                [Op.or]:
                [
                    {
                        block_by: req.session.passport.user ,
                        block_to: _findUser.id 
                    },
                    {
                        block_by: _findUser.id,
                        block_to: req.session.passport.user
                    }
                ]
            }
        })
        
        if (is_block_avaiable.length > 0) {
            
            res.status(200).json({
                messages : "Kullanıcı zaten banlı"
            })
        } else {
            const new_block =  new Block({
                block_by: req.session.passport.user ,
                block_to: _findUser.id
            })
            await new_block.save();
            res.status(200).json({
                messages : "Kullanıcı banlandı"
            })
        }
        
        
        
    }
    const blockList = async (req, res, next) => {
        
        const block_list = await Block.findAll({
            where : {
                
                isActive : true,
                block_by : req.session.passport.user,
            },
            include : {
                model : User,
            }
        }) 
        res.status(200).json(block_list);
        
        
    }
    const unblock = async (req, res, next) => {
        
        const _findUser = await User.findOne({
            where : {username : req.params.username}
        })
        const block = await Block.findOne({
            where : {
                block_by : req.session.passport.user,
                block_to : _findUser.id
            }
        })
        
        if (block) {
            
            await Block.destroy({where : {
                block_by : req.session.passport.user,
                block_to : _findUser.id
            }})
            res.status(200).json({
                messages : "Ban kaldırıldı.",
                
            })
            
        } else {
            res.status(200).json({
                messages : "İşlem başarısız"
            })
        }
        
        
        
    }
    module.exports = {
        sendMessage,
        messages,
        messages_with,
        delete_message,
        block,
        blockList,
        unblock
        
    }
    