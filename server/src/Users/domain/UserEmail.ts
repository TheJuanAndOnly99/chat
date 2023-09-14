import { StringValueObject } from "../../utilities/StringValueObject";


export class UserEmail extends StringValueObject {
	constructor(value: string) {
		super(value);

		this.ensureEmailIsValid(value);
	}

  // Uses Regex to check if the email is valid by checking if it matches the email pattern
	private ensureEmailIsValid(value: string) {
		const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

		if (!emailPattern.test(value)) {
			throw new UserEmailIsNotValid(value);
		}
	}
}

export class UserEmailIsNotValid extends Error {
	constructor(email: string) {
		super(`The email <${email}> is not a valid email`);
	}
}