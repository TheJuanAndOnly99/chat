import { StringValueObject } from "../../utilities/StringValueObject";


export class UserName extends StringValueObject {
	constructor(value: string) {
		let finalValue = value;
		if (value.length === 0) {
			finalValue = `anonymous-${Math.floor(Math.random() * 1000)
				.toString()
				.padStart(4, "0")}`;
		}
		super(finalValue);

		this.checkUserNameIsLessThan15Characters(value);
	}

	private checkUserNameIsLessThan15Characters(value: string) {
		if (value.length > 15) {
			throw new UserNameLengthExceeded(`User name <${value}> needs to be less than 15 characters long`);
		}
	}
}

export class UserNameLengthExceeded extends Error {}