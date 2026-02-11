import Secret from '../models/Secret.js';
import { encrypt, decrypt } from '../utils/crypto.js';

// 1. Create a Secret
// This function takes text from the user, encrypts it, and saves it to MongoDB.
export const createSecret = async (req, res, next) => {
    try {
        // Grab the data from the frontend request body
        const { text, viewLimit, expiration } = req.body;
        
        // Basic validation: Check if text exist
        if (!text) {
            res.status(400);
            throw new Error('Please provide some text to encrypt.');
        }

        // Encrypt the text
        // We use our helper function to get the encrypted string and the unique IV (Initialization Vector)
        const { encryptedData, iv } = encrypt(text);
        
        // Calculate when this secret should expire
        // Default is 1 day (1440 minutes) if the user didn't choose one
        let expiresDate = new Date();
        const minutesToAdd = parseInt(expiration) || 1440;
        expiresDate.setMinutes(expiresDate.getMinutes() + minutesToAdd);

        // Create the new document in the database
        const secret = await Secret.create({
            encryptedData: encryptedData,
            iv: iv,
            viewLimit: viewLimit || 1, // Default to 1 view if not specified
            expiresAt: expiresDate
        });

        // Send back the ID so the frontend can make a link
        res.status(201).json({
            success: true,
            data: {
                id: secret._id
            }
        });

    } catch (error) {
        // Pass any errors to our global error handler
        next(error);
    }
};

// 2. Get (Reveal) a Secret
// This function finds the secret, checks if it's safe to show, decrypts it, and possibly deletes it.
export const getSecret = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Step 1: Find the secret in the database by its ID
        const secret = await Secret.findById(id);

        // If it's not there, it might have already been viewed and deleted
        if (!secret) {
            res.status(404);
            throw new Error('Secret not found. It may have been viewed and destroyed already.');
        }

        // Step 2: Increment the view count
        // We do this first to "count" this attempt
        secret.viewCount = secret.viewCount + 1;
        await secret.save();
                
        // Step 3: Check if we passed the limit
        // For example, if limit is 5 and this is the 6th view, we should delete it and say "Not Found"
        if (secret.viewCount > secret.viewLimit) {
            await Secret.deleteOne({ _id: id });
            res.status(404);
            throw new Error('Secret is no longer available (View limit reached).');
        }

        // Step 4: Decrypt the data
        // We just pass the encrypted text. The library handles the rest.
        let decryptedText;
        try {
            decryptedText = decrypt(secret.encryptedData);
        } catch (err) {
            res.status(400);
            throw new Error('Could not decrypt data, It might be corrupted.');
        }

        // Step 5: Check if we need to delete it NOW
        // If the view count equals the limit (e.g., 1 of 1, or 5 of 5), this is the last time it can be seen.
        // We delete it immediately so no one else can see it.
        if (secret.viewCount >= secret.viewLimit) {
            await Secret.deleteOne({ _id: id });
        }

        // Step 6: Send the secret text to the user
        res.status(200).json({
            success: true,
            data: decryptedText,
        });

    } catch (error) {
        next(error);
    }
};
