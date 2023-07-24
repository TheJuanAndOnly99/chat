import { StringValueObject } from "../../Utilities/StringValueObject";

export class UserEmail extends StringValueObject {
	constructor(value: string) {
		super(value);

		this.ensureEmailIsValid(value);
	}

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