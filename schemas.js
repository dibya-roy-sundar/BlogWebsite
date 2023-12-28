import joi from "joi";

const postschema=joi.object({
    blog:joi.object({
        title:joi.string().required(),
        content:joi.string().required(),
        // image:joi.string().required(),
    }).required()
})
const commentschema=joi.object({
    comment:joi.object({
        content:joi.string().required(),
    }) 
    .required()
})
export {postschema,commentschema};











// const user = await User.aggregate([
//     {
//       $match: {
//         _id: new mongoose.Types.ObjectId(req.params.id),
//       }
//     },
//     {
//         $lookup:{
//             from:"profiles",
//             localField:"profile",
//             foreignField:"_id",
//             as:"profile"
//         }
//     },
//     {
//         $addFields:{
//             profile:{
//                 $arrayElemAt: ["$profile",0]
//             }
//         }

//     },
//     {
//       $lookup: {
//         from: "posts",
//         localField: "_id",
//         foreignField: "author",
//         as: "publishedposts",
//         pipeline:[
//             {
//                 $lookup:{
//                     from:"users",
//                     localField:"author",
//                     foreignField:"_id",
//                     as:"author"
//                     }

//             },
//             {
//                 $addFields:{
//                     author:{
//                         $arrayElemAt: ["$author",0]
//                     }
//                 }
        
//             },
//         ]
//       },
//     },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "_id",
//         foreignField: "following",
//         as: "followers",
//       },
//     },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "_id",
//         foreignField: "follower",
//         as: "followings",
//       },
//     },
//     {
//       $addFields: {
//         followersCount: {
//           $size: "$followers",
//         },
//         followingsCount: {
//           $size: "$followings",
//         },
//         isFollower: {
//           $cond: {
//             if: { $in: [req.user._id, "$followers.follower"] },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         username: 1,
//         profile: 1,
//         publishedposts: 1,
//         followersCount: 1,
//         followingsCount: 1,
//         isFollower: 1,
//         createdAt: 1,
//       },
//     },
//   ]);
//   const joineddate = storeJoinedDate(user.createdAt);

//   const posts = user.publishedposts;
// //   console.log(user._id);
