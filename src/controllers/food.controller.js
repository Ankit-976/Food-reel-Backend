const foodModel = require('../models/food.model')
const likeModel = require('../models/like.model')
const saveModel = require('../models/save.model')
const storageService = require('../services/storage.service')
const { v4: uuid } = require('uuid')

async function createFood(req, res) {

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })
    
    res.status(201).json({
        message: "Food created successfully",
        food: foodItem
    })
    
}

async function getFoodItems(req, res) {

    const foodItems = await foodModel.find({})

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}

async function likeFood(req, res) {

    const { foodId, video } = req.body;
    const user = req.user;

    const isLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId,{
            $inc: { likeCount : -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId,
        video: video
    })

    await foodModel.findByIdAndUpdate(foodId,{
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message:'Food liked successfully',
        like
    })
}

async function saveFood(req, res) {

    const { foodId, video } = req.body;
    const user = req.user;

    const isSaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isSaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId,
        video: video
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })
}

async function getLikedFood(req, res) {

    const user = req.user;

    const likedFood = await likeModel.find({
        user: user._id
    })

    res.status(200).json({
        message:"Liked Food Fetched Successfully",
        likedFood
    })
  
}

async function getSavedFood(req, res) {

    const user = req.user;

    const savedFood = await saveModel.find({
        user: user._id
    })

    res.status(200).json({
        message:"Saved Food Fetched Successfully",
        savedFood
    })
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getLikedFood,
    getSavedFood
}