import jwt from "jsonwebtoken";

// SCENARIO: User wants to like a post: 
// Click like button -> Auth Middleware (NEXT) -> call likePost controller

const auth = async (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];

        // if token length is lower than 500, its our own. Otherwise, its a token from Google
        const isCustomAuth = token.length < 500;

        let decodedData;

        // check if its a custom token or from Google
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);

            // .sub = Google's id to differentiate users
            req.userId = decodedData?.sub;
        }

        // let next action proceed
        next();

    } catch (error) {
        console.log(error);
    }
}

export default auth;