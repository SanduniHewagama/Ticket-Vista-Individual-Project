import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });


// Inngest Function to save user data to a database
// ...existing code...
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk'},
    { event: 'clerk/user.created' },
    async ({ event })=>{
        try {
            const { id, first_name, last_name, email_addresses, image_url} = event.data
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: first_name + ' ' + last_name,
                image: image_url
            }
            await User.create(userData)
        } catch (error) {
            console.error("Error in syncUserCreation:", error)
        }
    }
)

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk'},
    { event: 'clerk/user.deleted' },
    async ({ event })=>{
        try {
            const {id} = event.data
            await User.findByIdAndDelete(id)       
        } catch (error) {
            console.error("Error in syncUserDeletion:", error)
        }
    }
)

const syncUserUpdation = inngest.createFunction(
    { id: 'sync-user-from-clerk-updation'},
    { event: 'clerk/user.updated' },
    async ({ event })=>{
        try {
            const {id, first_name, last_name, email_addresses, image_url} = event.data
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: first_name + ' ' + last_name,
                image: image_url
            }
            await User.findOneAndUpdate({ _id: id }, userData)
        } catch (error) {
            console.error("Error in syncUserUpdation:", error)
        }
    }
)
// ...existing code...

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];