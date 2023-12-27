import joi from "joi";

const postschema=joi.object({
    blog:joi.object({
        title:joi.string().required(),
        content:joi.string().required(),
        // image:joi.string().required(),
    })
      .required()
})
const commentschema=joi.object({
    comment:joi.object({
        body:joi.string().required(),
    }).required()
})
export {postschema,commentschema};