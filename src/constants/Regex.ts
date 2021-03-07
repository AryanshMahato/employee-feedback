export const NoSpecialCharacterRegex = new RegExp(/^[a-zA-Z0-9 ]*$/);

export const NoSpaceAndSpecialCharacterRegex = new RegExp(/^[a-zA-Z0-9]*$/);

// Methods used in user operations such as getting user by username or email
export const UserOperationMethods = new RegExp(`^\\busername\\b|\\bemail\\b$`);

export const MongoIdValidation = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export const GetTeamMethodsRegex = /^\bcreated\b|\blead\b|\bmember\b|\b\b$/;
