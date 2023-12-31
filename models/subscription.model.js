import mongoose from "mongoose";

const Schema=mongoose.Schema;

const subscriptionShema=new Schema({
follower:{//channel
    type:Schema.Types.ObjectId,
    ref:'User',
},
following:{//subscriber
        type:Schema.Types.ObjectId,
        ref:'User',
}
})

const Subscription=mongoose.model("Subscription",subscriptionShema);

export {Subscription};