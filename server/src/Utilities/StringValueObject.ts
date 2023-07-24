// Abstract class that provides a simple foundation for creating value objects that wrap a single string value
export abstract class StringValueObject {
	private readonly _value: string;
	
	constructor(readonly value: string) {
		// Ensure that the value is not empty or null
		if (!value || value.trim() === '') {
			throw new Error('Value must not be empty.');
		}

		this._value = value.trim();
	}

	// Get the string value
	getValue(): string {
	return this._value;
	}

	// Get the string value
	toString(): string {
		return this._value;
	}
}