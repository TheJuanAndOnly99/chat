import bcrypt from "bcrypt";
import { StringValueObject } from "../../Utilities/StringValueObject";

export class UserPassword extends StringValueObject {
	constructor(value: string) {
		super(UserPassword.encrypt(value));
		this.checkPassword(value);
	}

	private static encrypt(value: string): string {
		return bcrypt.hashSync(value, 10);
	}

	public async compare(plainTextPassword: string): Promise<boolean> {
		return await bcrypt.compare(plainTextPassword, this.value);
	}

	private checkPassword(value: string) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(?!.*\s).{8,20}$/;

		if (!passwordPattern.test(value)) {
			throw new UserPasswordNotValid(value);
		}
	}
}

export class UserPasswordNotValid extends Error {
	constructor(_value: string) {
		super(`Minimum length of 8 characters. \n
    Maximum length of 20 characters. \n
    At least one uppercase letter. \n
    At least one lowercase letter. \n
    At least one digit (0-9). \n
    Allowed special characters: !@#$%^&*().`);
	}
}