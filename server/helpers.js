//helper functions for Server

export const validateString = (str) => {
    if(! str || typeof str !== 'string' || str.length < 0){
        throw "Input must be a non-empty string.";
    }
    return str.trim();
}

//function to validate user inputed appropriate post type for blogs
export const validatePostType = (str) => {
    const PostType = {
        COMMENT: 'comment',
        REVIEW: 'review',
        PROGRESS: 'progress'
    };
    str = validateString(str);
    switch (str){
        case 'COMMENT':
            return PostType.COMMENT;
        case 'REVIEW':
            return PostType.REVIEW;
        case 'PROGRESS':
            return PostType.PROGRESS;
        default:
            throw new Error ('Enter a valid post type.');
    }
}