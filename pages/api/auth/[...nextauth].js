import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs"


//Configuración de autentificación
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        
      },

      async authorize(credentials){
        const {user, password} = credentials;

        try{
          await mongooseConnect();
          const userExist = await User.findOne({user});
          
          if(!userExist){
            return null
          }

          const encryptedPass = userExist.password
          
          
          const comparePasswords = await bcrypt.compare(password, encryptedPass + "")

          if(!comparePasswords){
            return null
          } 

          return userExist
        }catch(error){
          console.log("Error:", error)
        }
      }
    })
  ],
  session:{
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn: "/"
  },
  adapter: MongoDBAdapter(clientPromise),
}

//Función API de autentificación de NextJS
export default NextAuth(authOptions);