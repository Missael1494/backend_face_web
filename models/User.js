import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
    },
    confirm: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    imageprofile: {
        type: String,
        default: "",
    },
    friendrequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    
    
},
{
    timestamps: true,
}
)

userSchema.pre('save', async function(next) { //se ejecuta antes de ir a la base de datos para hashear el password
    //await usuario.save => en Usuario.js en await usuario.save() 
        if(!this.isModified("password")){
            next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); //genera el hash y se almacena en el password
    })

userSchema.methods.comprobarPassword = async function
(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);  //comnparar los passwords
}

const User = mongoose.model("User", userSchema);
export default User;